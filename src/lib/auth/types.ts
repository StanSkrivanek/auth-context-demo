// src/lib/auth/types.ts

/**
 * Core user identity — who they are.
 * Deliberately contains NO permissions (different lifecycle, see below).
 */
export interface User {
	id: string;
	email: string;
	name: string;
	avatarUrl: string | null;
	emailVerified: boolean;
	createdAt: Date;
}

/**
 * Fine-grained capability strings.
 * Roles are just named bundles of these — keep roles server-side only.
 */
export type Permission =
	| 'read:posts'
	| 'write:posts'
	| 'delete:posts'
	| 'read:comments'
	| 'write:comments'
	| 'delete:comments'
	| 'manage:users'
	| 'manage:roles'
	| 'admin:system';

/**
 * Discriminated union — TypeScript cannot access state.user without
 * first checking status === 'authenticated'. No more forgotten null checks.
 *
 * Note: no 'loading' status. With SvelteKit SSR the server resolves auth
 * before the component tree renders, so auth is never in a loading state.
 */
export type AuthState =
	| { status: 'unauthenticated' }
	| { status: 'authenticated'; user: User; permissions: readonly Permission[] };

/**
 * Everything components receive from getAuthContext().
 * Readonly prevents accidental mutation — context distributes, it doesn't own.
 */
export type AuthContext = Readonly<{
	state: AuthState;
	user: User | null;
	permissions: readonly Permission[];
	isAuthenticated: boolean;
	hasPermission: (permission: Permission) => boolean;
	hasAnyPermission: (permissions: readonly Permission[]) => boolean;
	hasAllPermissions: (permissions: readonly Permission[]) => boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	refresh: () => Promise<void>;
}>;
