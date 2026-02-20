<!-- src/routes/admin/+page.svelte -->
<script lang="ts">
	import { getAuthContext } from '$lib/auth/auth-context.svelte';
	import { Settings, Shield } from 'lucide-svelte';

	interface UserRow {
		id: string;
		email: string;
		name: string;
		role: string;
	}

	interface Props {
		data: {
			adminUser: import('$lib/auth/types').User;
			allUsers: UserRow[];
			systemInfo: { nodeVersion: string; environment: string; sessionCount: number };
		};
	}

	let { data }: Props = $props();

	const auth = getAuthContext();
</script>

<svelte:head>
	<title>Admin Panel</title>
</svelte:head>

<div class="admin">
	<header class="page-header">
		<div>
			<h1>
				<Settings size={28} strokeWidth={2} />
				Admin Panel
			</h1>
			<p>Restricted to users with <code>admin:system</code> permission.</p>
		</div>
		<div class="admin-badge">Admin</div>
	</header>

	<!-- Security model explanation -->
	<div class="security-callout">
		<h3>
			<Shield size={20} />
			How this page is protected
		</h3>
		<ol>
			<li>
				<strong>hooks.server.ts</strong> validated the session cookie and checked
				<code>admin:system</code> permission before any HTML was sent. No valid cookie → 303 redirect
				to login. Wrong role → 303 redirect to dashboard.
			</li>
			<li>
				<strong>+page.server.ts load()</strong> re-checks <code>locals.permissions</code>
				as defence-in-depth. If locals are ever misconfigured, this throws a 403 before the component
				renders.
			</li>
			<li>
				<strong>Context (this component)</strong> can call
				<code>auth.hasPermission('admin:system')</code> for UI affordances only — it does NOT enforce
				access. The server already did that.
			</li>
		</ol>
	</div>

	<!-- System info -->
	<section class="section">
		<h2>System Info</h2>
		<dl class="info-grid">
			<div class="info-row">
				<dt>Environment</dt>
				<dd><code>{data.systemInfo.environment}</code></dd>
			</div>
			<div class="info-row">
				<dt>Node.js</dt>
				<dd><code>{data.systemInfo.nodeVersion}</code></dd>
			</div>
			<div class="info-row">
				<dt>Active sessions</dt>
				<dd>{data.systemInfo.sessionCount}</dd>
			</div>
			<div class="info-row">
				<dt>Current admin</dt>
				<dd>{data.adminUser.name} ({data.adminUser.email})</dd>
			</div>
		</dl>
	</section>

	<!-- User table -->
	<section class="section">
		<h2>All Users</h2>
		<div class="user-table">
			<div class="table-header">
				<span>Name</span>
				<span>Email</span>
				<span>Role</span>
				<span>Actions</span>
			</div>
			{#each data.allUsers as user}
				<div class="table-row">
					<span>{user.name}</span>
					<span class="email-cell"><code>{user.email}</code></span>
					<span>
						<span class="role-badge" class:admin={user.role === 'Admin'}>
							{user.role}
						</span>
					</span>
					<span>
						<!-- UI guard: only show delete for users with manage:users -->
						<!-- Server endpoint would also check before executing -->
						{#if auth.hasPermission('manage:users') && user.id !== data.adminUser.id}
							<button class="action-btn-sm" disabled>Remove (demo)</button>
						{/if}
					</span>
				</div>
			{/each}
		</div>
		<p class="table-note">
			The "Remove" button is gated with <code>RequirePermission</code>-style check on the client and
			would hit a server endpoint that re-checks
			<code>locals.permissions.includes('manage:users')</code> before executing.
		</p>
	</section>
</div>

<style>
	.admin {
		max-width: 860px;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1.5rem;
	}
	.page-header h1 {
		font-size: 1.75rem;
		font-weight: 700;
		margin: 0 0 0.25rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.page-header p {
		color: #475569;
		margin: 0;
		font-size: 0.9rem;
	}
	.page-header p code {
		background: #f1f5f9;
		padding: 0.1rem 0.35rem;
		border-radius: 0.25rem;
	}

	.admin-badge {
		background: black;
		color: white;
		padding: 0.3rem 0.9rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.security-callout {
		background: #f0fdf4;
		border: 1px solid #bbf7df;
		border-radius: 0.75rem;
		padding: 1.25rem;
		margin-bottom: 1.5rem;
	}
	.security-callout h3 {
		font-size: 0.95rem;
		font-weight: 600;
		margin: 0 0 0.75rem;
		color: #12462f;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.security-callout ol {
		padding-left: 1.25rem;
		margin: 0;
	}
	.security-callout li {
		font-size: 0.875rem;
		color: #166534;
		margin-bottom: 0.4rem;
	}
	.security-callout code {
		background: #c7ffd3;
		padding: 0.1rem 0.35rem;
		border-radius: 0.25rem;
		font-size: 0.8rem;
	}

	.section {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 0.75rem;
		padding: 1.25rem;
		margin-bottom: 1rem;
	}
	.section h2 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 1rem;
	}

	.info-grid {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.info-row {
		display: flex;
		gap: 1rem;
		font-size: 0.875rem;
	}
	.info-row dt {
		width: 130px;
		color: #64748b;
		flex-shrink: 0;
	}
	.info-row dd {
		margin: 0;
	}
	.info-row code {
		background: #f1f5f9;
		padding: 0.1rem 0.35rem;
		border-radius: 0.25rem;
	}

	.user-table {
		border: 1px solid #e2e8f0;
		border-radius: 0.5rem;
		overflow: hidden;
		font-size: 0.875rem;
	}
	.table-header,
	.table-row {
		display: grid;
		grid-template-columns: 1.5fr 2fr 1fr 1fr;
		padding: 0.6rem 1rem;
		gap: 0.5rem;
		align-items: center;
	}
	.table-header {
		background: #f8fafc;
		font-weight: 600;
		font-size: 0.78rem;
		color: #64748b;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.table-row {
		border-top: 1px solid #f1f5f9;
	}
	.table-row:hover {
		background: #fafafa;
	}

	.email-cell code {
		font-size: 0.8rem;
	}

	.role-badge {
		background: #f1f5f9;
		color: #475569;
		padding: 0.15rem 0.6rem;
		border-radius: 1rem;
		font-size: 0.75rem;
		font-weight: 500;
	}
	.role-badge.admin {
		background: #fff5f5;
		color: orangered;
	}

	.action-btn-sm {
		padding: 0.25rem 0.6rem;
		background: #fff5f5;
		border: 1px solid orangered;
		border-radius: 0.375rem;
		font-size: 0.75rem;
		color: orangered;
		cursor: pointer;
	}
	.action-btn-sm:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.table-note {
		font-size: 0.78rem;
		color: #94a3b8;
		margin: 0.75rem 0 0;
		padding-top: 0.75rem;
		border-top: 1px solid #f1f5f9;
	}
	.table-note code {
		background: #f1f5f9;
		padding: 0.1rem 0.3rem;
		border-radius: 0.2rem;
	}
</style>
