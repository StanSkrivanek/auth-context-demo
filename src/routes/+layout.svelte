<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { createAuthContext } from '$lib/auth/auth-context.svelte';
	import type { Permission, User } from '$lib/auth/types';
	import Navigation from '$lib/components/Navigation.svelte';

	interface Props {
		data: { user: User | null; permissions: readonly Permission[] };
		children: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	// One call here — auth is available to every component in the tree
	createAuthContext(() => data);
</script>

<div class="app">
	<Navigation />
	<main class="main-content">
		{@render children()}
	</main>
</div>

<style>
	:global(*, *::before, *::after) {
		box-sizing: border-box;
	}
	:global(body) {
		margin: 0;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		line-height: 1.5;
		background: #f8fafc;
		color: #1e293b;
	}

	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.main-content {
		flex: 1;
		max-width: 900px;
		width: 100%;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}
</style>
