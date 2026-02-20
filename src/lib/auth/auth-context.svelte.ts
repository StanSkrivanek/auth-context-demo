// src/lib/auth/auth-context.svelte.ts
import { getContext, hasContext, setContext } from 'svelte';
import { goto, invalidate } from '$app/navigation';
import type { AuthContext, AuthState, Permission, User } from './types';

const AUTH_KEY = Symbol('auth');

/**
 * Creates the auth context from server-validated data.
 * Call ONCE in the root +layout.svelte.
 *
 * @param serverUser        - User from layout.server.ts load (already validated)
 * @param serverPermissions - Permissions resolved server-side from roles
 */
export function createAuthContext(
	serverUser: User | null,
	serverPermissions: readonly Permission[]
): AuthContext {
	/**
	 * Use $derived.by, NOT $state.
	 *
	 * $state would capture a snapshot of serverUser at creation time.
	 * After invalidate('auth:session') re-runs the layout load and
	 * provides new props, $derived automatically re-evaluates.
	 * $state would silently drift from the server truth.
	 */
	const state = $derived.by<AuthState>(() => {
		if (serverUser) {
			return { status: 'authenticated', user: serverUser, permissions: serverPermissions };
		}
		return { status: 'unauthenticated' };
	});

	const isAuthenticated = $derived(serverUser !== null);

	// O(1) Set-based lookup for hasPermission calls in render loops
	const permSet = $derived(new Set(serverPermissions));

	function hasPermission(p: Permission): boolean {
		return permSet.has(p);
	}

	function hasAnyPermission(ps: readonly Permission[]): boolean {
		return ps.some((p) => permSet.has(p));
	}

	function hasAllPermissions(ps: readonly Permission[]): boolean {
		return ps.every((p) => permSet.has(p));
	}

	async function login(email: string, password: string): Promise<void> {
		const res = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});
		if (!res.ok) {
			const body = await res.json().catch(() => ({}));
			throw new Error(body.message ?? 'Login failed');
		}
		// Re-run only the layout load (not every page's load function)
		await invalidate('auth:session');
		await goto('/dashboard');
	}

	async function logout(): Promise<void> {
		await fetch('/api/auth/logout', { method: 'POST' });
		await invalidate('auth:session');
		await goto('/');
	}

	async function refresh(): Promise<void> {
		await invalidate('auth:session');
	}

	/**
	 * Getters — not direct properties.
	 *
	 * If we assigned `user: serverUser` at context creation time, every
	 * consumer would hold a stale snapshot. Getters evaluate the current
	 * reactive value on every read.
	 */
	const ctx: AuthContext = {
		get state() {
			return state;
		},
		get user() {
			return serverUser;
		},
		get permissions() {
			return serverPermissions;
		},
		get isAuthenticated() {
			return isAuthenticated;
		},
		hasPermission,
		hasAnyPermission,
		hasAllPermissions,
		login,
		logout,
		refresh
	};

	return setContext(AUTH_KEY, ctx);
}

/**
 * Retrieves the auth context from any descendant component.
 * Throws if called outside the auth context tree.
 */
export function getAuthContext(): AuthContext {
	if (!hasContext(AUTH_KEY)) {
		throw new Error(
			'getAuthContext() called outside the auth context tree. ' +
				'Ensure your root +layout.svelte calls createAuthContext().'
		);
	}
	return getContext<AuthContext>(AUTH_KEY);
}

export const hasAuthContext = () => hasContext(AUTH_KEY);
