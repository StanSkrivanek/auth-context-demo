<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { getAuthContext } from '$lib/auth/auth-context.svelte';
	import { Cookie, Lock, Radio, UserCog } from 'lucide-svelte';

	const auth = getAuthContext();
</script>

<svelte:head>
	<title>Auth Demo</title>
</svelte:head>

<div class="landing">
	<h1>SvelteKit Auth + Context Demo</h1>

	<p class="subtitle">
		A fully working authentication system using only SvelteKit's built-in tools — no external auth
		library.
	</p>

	{#if auth.isAuthenticated}
		<div class="welcome-back">
			<p>Welcome back, <strong>{auth.user?.name}</strong>!</p>
			<div class="cta-group">
				<a href="/dashboard" class="btn-primary">Go to Dashboard →</a>
				{#if auth.hasPermission('admin:system')}
					<a href="/admin" class="btn-secondary">Admin Panel →</a>
				{/if}
			</div>
		</div>
	{:else}
		<div class="cta-group">
			<a href="/login" class="btn-primary">Sign In →</a>
		</div>
		<p class="hint">
			Try <code>alice@example.com</code> (admin) or
			<code>bob@example.com</code> (editor) — password <code>password123</code>
		</p>
	{/if}

	<div class="feature-grid">
		<div class="feature">
			<div class="feature-icon">
				<Lock size={24} strokeWidth={1.5} />
			</div>
			<h3>Server-side route guards</h3>
			<p>Hook validates the session cookie before a single byte of HTML is sent.</p>
		</div>
		<div class="feature">
			<div class="feature-icon">
				<UserCog size={24} strokeWidth={1.5} />
			</div>
			<h3>Role-based permissions</h3>
			<p>Roles are resolved server-side from a role table, never computed client-side.</p>
		</div>
		<div class="feature">
			<div class="feature-icon">
				<Radio size={24} strokeWidth={1.5} />
			</div>
			<h3>Context distribution</h3>
			<p>Auth state flows to every component via context — zero prop drilling.</p>
		</div>
		<div class="feature">
			<div class="feature-icon">
				<Cookie size={24} strokeWidth={1.5} />
			</div>
			<h3>httpOnly cookies</h3>
			<p>Session token is invisible to JavaScript. XSS attacks cannot steal it.</p>
		</div>
	</div>
</div>

<style>
	.landing {
		max-width: 720px;
		margin: 0 auto;
	}
	h1 {
		font-size: 2rem;
		font-weight: 800;
		margin: 0 0 0.75rem;
	}
	.subtitle {
		font-size: 1.1rem;
		color: #475569;
		margin: 0 0 2rem;
	}

	.welcome-back p {
		font-size: 1.05rem;
		margin: 0 0 1rem;
	}

	.cta-group {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}

	.btn-primary {
		background: orangered;
		color: white;
		text-decoration: none;
		padding: 0.65rem 1.25rem;
		border-radius: 0.5rem;
		font-weight: 600;
		font-size: 0.95rem;
		transition: all 0.15s;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}
	.btn-primary:hover {
		background: black;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.btn-secondary {
		background: white;
		color: orangered;
		text-decoration: none;
		padding: 0.65rem 1.25rem;
		border-radius: 0.5rem;
		font-weight: 600;
		font-size: 0.95rem;
		border: 1px solid #e2e8f0;
		transition: all 0.15s;
	}
	.btn-secondary:hover {
		background: #f8fafc;
		border-color: orangered;
	}

	.hint {
		font-size: 0.875rem;
		color: #64748b;
	}
	.hint code {
		background: #f1f5f9;
		padding: 0.1rem 0.35rem;
		border-radius: 0.25rem;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
		margin-top: 2.5rem;
	}

	.feature {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 0.75rem;
		padding: 1.25rem;
		transition: all 0.2s;
	}

	.feature:hover {
		border-color: #cbd5e1;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}

	.feature-icon {
		color: orangered;
		display: inline-flex;
	}
	.feature h3 {
		font-size: 0.95rem;
		font-weight: 600;
		margin: 0.5rem 0 0.35rem;
	}
	.feature p {
		font-size: 0.875rem;
		color: #475569;
		margin: 0;
	}
</style>
