// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, depends }) => {
	// Tell SvelteKit this load depends on the 'auth:session' key.
	// After login/logout we call invalidate('auth:session') instead of
	// invalidateAll() — only this layout re-runs, not every page load function.
	depends('auth:session');

	return {
		user: locals.user,
		permissions: locals.permissions
	};
};
