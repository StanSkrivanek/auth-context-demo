<!-- src/lib/components/Navigation.svelte -->
<script lang="ts">
	import { getAuthContext } from '$lib/auth/auth-context.svelte';
	import { page } from '$app/stores';

	const auth = getAuthContext();

	const navLinks = [
		{ href: '/', label: 'Home', public: true },
		{ href: '/dashboard', label: 'Dashboard', public: false }
	];
</script>

<nav class="nav">
	<div class="nav-inner">
		<a href="/" class="nav-brand">🔐 Auth Demo</a>

		<div class="nav-links">
			{#each navLinks as link}
				{#if link.public || auth.isAuthenticated}
					<a href={link.href} class="nav-link" class:active={$page.url.pathname === link.href}>
						{link.label}
					</a>
				{/if}
			{/each}

			{#if auth.hasPermission('admin:system')}
				<a
					href="/admin"
					class="nav-link admin-link"
					class:active={$page.url.pathname.startsWith('/admin')}
				>
					⚙️ Admin
				</a>
			{/if}
		</div>

		<div class="nav-user">
			{#if auth.isAuthenticated}
				<div class="user-info">
					<div class="user-avatar">
						{auth.user?.name.charAt(0).toUpperCase()}
					</div>
					<div class="user-details">
						<span class="user-name">{auth.user?.name}</span>
						<span class="user-email">{auth.user?.email}</span>
					</div>
				</div>
				<form method="POST" action="/logout">
					<button type="submit" class="logout-btn">Sign out</button>
				</form>
			{:else}
				<a href="/login" class="login-btn">Sign in</a>
			{/if}
		</div>
	</div>
</nav>

<style>
	.nav {
		background: white;
		border-bottom: 1px solid #e2e8f0;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.nav-inner {
		max-width: 900px;
		margin: 0 auto;
		padding: 0 1.5rem;
		height: 3.5rem;
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.nav-brand {
		font-weight: 700;
		font-size: 1rem;
		text-decoration: none;
		color: #1e293b;
		flex-shrink: 0;
	}

	.nav-links {
		display: flex;
		gap: 0.25rem;
		flex: 1;
	}

	.nav-link {
		padding: 0.35rem 0.75rem;
		border-radius: 0.375rem;
		text-decoration: none;
		font-size: 0.875rem;
		color: #475569;
		transition:
			background 0.15s,
			color 0.15s;
	}
	.nav-link:hover {
		background: #f1f5f9;
		color: #1e293b;
	}
	.nav-link.active {
		background: #ede9fe;
		color: #6366f1;
		font-weight: 500;
	}

	.admin-link {
		color: #7c3aed !important;
	}
	.admin-link.active {
		background: #f3e8ff !important;
	}

	.nav-user {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-left: auto;
		flex-shrink: 0;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.user-avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		background: #6366f1;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 0.875rem;
		flex-shrink: 0;
	}

	.user-details {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}
	.user-name {
		font-size: 0.8rem;
		font-weight: 600;
		color: #1e293b;
	}
	.user-email {
		font-size: 0.7rem;
		color: #94a3b8;
	}

	.logout-btn {
		background: none;
		border: 1px solid #e2e8f0;
		border-radius: 0.375rem;
		padding: 0.3rem 0.7rem;
		font-size: 0.8rem;
		color: #475569;
		cursor: pointer;
	}
	.logout-btn:hover {
		background: #f8fafc;
		border-color: #cbd5e1;
	}

	.login-btn {
		background: #6366f1;
		color: white;
		text-decoration: none;
		padding: 0.4rem 0.9rem;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
	}
	.login-btn:hover {
		background: #4f46e5;
	}
</style>
