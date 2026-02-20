<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
	import { getAuthContext } from '$lib/auth/auth-context.svelte';
	import RequirePermission from '$lib/components/RequirePermission.svelte';

	interface Props {
		data: {
			stats: { posts: number; comments: number; views: number };
			recentActivity: Array<{ id: number; action: string; time: string }>;
		};
	}

	let { data }: Props = $props();

	const auth = getAuthContext();
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<div class="dashboard">
	<header class="page-header">
		<div>
			<h1>Dashboard</h1>
			<p>Welcome back, <strong>{auth.user?.name}</strong></p>
		</div>
		<div class="user-badge">
			<span class="permissions-count">
				{auth.permissions.length} permission{auth.permissions.length === 1 ? '' : 's'}
			</span>
		</div>
	</header>

	<!-- Stats -->
	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-icon">📝</div>
			<div class="stat-value">{data.stats.posts}</div>
			<div class="stat-label">Posts</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon">💬</div>
			<div class="stat-value">{data.stats.comments}</div>
			<div class="stat-label">Comments</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon">👁️</div>
			<div class="stat-value">{data.stats.views.toLocaleString()}</div>
			<div class="stat-label">Views</div>
		</div>

		<!-- This card only shows for users with delete:posts -->
		<RequirePermission permission="delete:posts">
			<div class="stat-card stat-card--accent">
				<div class="stat-icon">🗑️</div>
				<div class="stat-value">3</div>
				<div class="stat-label">Pending deletions</div>
			</div>
		</RequirePermission>
	</div>

	<!-- Permission-gated sections -->
	<div class="content-grid">
		<section class="section">
			<h2>Recent Activity</h2>
			<ul class="activity-list">
				{#each data.recentActivity as item}
					<li class="activity-item">
						<span class="activity-action">{item.action}</span>
						<span class="activity-time">{item.time}</span>
					</li>
				{/each}
			</ul>
		</section>

		<div class="side-sections">
			<!-- Write access section -->
			<RequirePermission permission="write:posts">
				<section class="section">
					<h2>Quick Actions</h2>
					<div class="action-buttons">
						<button class="action-btn">✏️ New Post</button>
						<button class="action-btn">💬 Add Comment</button>
					</div>
				</section>
			</RequirePermission>

			<!-- Admin shortcut — only for admin:system holders -->
			{#snippet adminHint()}
				<section class="section section--muted">
					<p>Need more tools? Ask an admin to grant you additional permissions.</p>
				</section>
			{/snippet}

			<RequirePermission permission="admin:system" fallback={adminHint}>
				<section class="section section--admin">
					<h2>⚙️ Admin Shortcut</h2>
					<p>You have <code>admin:system</code> — full control available.</p>
					<a href="/admin" class="action-btn action-btn--admin">Go to Admin Panel →</a>
				</section>
			</RequirePermission>
		</div>
	</div>

	<!-- Full permissions list — useful for understanding the system -->
	<section class="section permissions-section">
		<h2>Your Permissions</h2>
		<p class="section-note">
			These were resolved server-side from your roles and forwarded to context. Components read them
			— the server enforces them.
		</p>
		<div class="permission-list">
			{#each auth.permissions as perm}
				<span class="perm-chip">{perm}</span>
			{/each}
		</div>
	</section>
</div>

<style>
	.dashboard {
		max-width: 860px;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 2rem;
	}
	.page-header h1 {
		font-size: 1.75rem;
		font-weight: 700;
		margin: 0 0 0.25rem;
	}
	.page-header p {
		color: #475569;
		margin: 0;
	}

	.user-badge {
		display: flex;
		align-items: center;
	}
	.permissions-count {
		background: #ede9fe;
		color: #6366f1;
		padding: 0.3rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		font-weight: 600;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 0.75rem;
		padding: 1.25rem;
		text-align: center;
	}
	.stat-card--accent {
		border-color: #c4b5fd;
		background: #faf5ff;
	}

	.stat-icon {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
	}
	.stat-value {
		font-size: 1.75rem;
		font-weight: 700;
		color: #1e293b;
	}
	.stat-label {
		font-size: 0.8rem;
		color: #64748b;
		margin-top: 0.25rem;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	@media (max-width: 640px) {
		.content-grid {
			grid-template-columns: 1fr;
		}
	}

	.section {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 0.75rem;
		padding: 1.25rem;
	}
	.section h2 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 1rem;
	}
	.section--muted {
		background: #f8fafc;
	}
	.section--admin {
		border-color: #c4b5fd;
		background: #faf5ff;
	}

	.side-sections {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.activity-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.activity-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.6rem 0;
		border-bottom: 1px solid #f1f5f9;
		font-size: 0.875rem;
	}
	.activity-item:last-child {
		border-bottom: none;
	}
	.activity-action {
		color: #1e293b;
	}
	.activity-time {
		color: #94a3b8;
		font-size: 0.8rem;
	}

	.action-buttons {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.action-btn {
		padding: 0.5rem 1rem;
		background: #f1f5f9;
		border: 1px solid #e2e8f0;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		cursor: pointer;
		text-align: left;
		text-decoration: none;
		color: #1e293b;
		display: block;
	}
	.action-btn:hover {
		background: #e2e8f0;
	}
	.action-btn--admin {
		background: #ede9fe;
		border-color: #c4b5fd;
		color: #6d28d9;
	}

	.permissions-section {
		margin-top: 0;
	}
	.section-note {
		font-size: 0.8rem;
		color: #64748b;
		margin: -0.5rem 0 0.75rem;
	}
	.permission-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
	.perm-chip {
		background: #f1f5f9;
		border: 1px solid #e2e8f0;
		padding: 0.2rem 0.6rem;
		border-radius: 1rem;
		font-size: 0.75rem;
		font-family: monospace;
		color: #475569;
	}
</style>
