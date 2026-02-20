// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			/**
			 * The authenticated user, or null if no valid session.
			 * Set by hooks.server.ts before any load function runs.
			 */
			user: User | null;

			/**
			 * Permissions resolved from the user's roles.
			 * readonly — permissions come from the server, not the client.
			 */
			permissions: readonly Permission[];
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
