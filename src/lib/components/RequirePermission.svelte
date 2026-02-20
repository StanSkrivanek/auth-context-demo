<!-- src/lib/components/RequirePermission.svelte -->
<script lang="ts">
	import { getAuthContext } from '$lib/auth/auth-context.svelte';
	import type { Permission } from '$lib/auth/types';

	interface Props {
		/** Single permission or array for multi-permission checks */
		permission: Permission | Permission[];
		/** 'all' (default): every permission required. 'any': at least one. */
		mode?: 'any' | 'all';
		/** Rendered when access is denied. Omit to render nothing. */
		fallback?: import('svelte').Snippet;
		children: import('svelte').Snippet;
	}

	let { permission, mode = 'all', fallback, children }: Props = $props();

	const auth = getAuthContext();

	const hasAccess = $derived.by(() => {
		const perms = Array.isArray(permission) ? permission : [permission];
		return mode === 'any' ? auth.hasAnyPermission(perms) : auth.hasAllPermissions(perms);
	});
</script>

{#if hasAccess}
	{@render children()}
{:else if fallback}
	{@render fallback()}
{/if}
