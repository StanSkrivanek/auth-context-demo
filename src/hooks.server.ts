// src/hooks.server.ts
import { redirect, type Handle } from '@sveltejs/kit';
import { db, toPublicUser } from '$lib/server/db';

/** Routes that require a valid session. */
const PROTECTED = ['/dashboard', '/settings', '/profile'];

/** Routes that additionally require admin:system permission. */
const ADMIN_ONLY = ['/admin'];

/** Routes that logged-in users should not see (redirect to dashboard). */
const GUEST_ONLY = ['/login', '/register'];

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	// ── 1. Read session cookie ─────────────────────────────────────────────────
	const token = event.cookies.get('session');

	if (!token) {
		event.locals.user = null;
		event.locals.permissions = [];
		return applyRouteRules(event, resolve, pathname, null, []);
	}

	// ── 2. Validate session ────────────────────────────────────────────────────
	const session = db.sessions.findByToken(token);

	if (!session) {
		// Expired or invalid — clear the stale cookie
		event.cookies.delete('session', { path: '/' });
		event.locals.user = null;
		event.locals.permissions = [];
		return applyRouteRules(event, resolve, pathname, null, []);
	}

	// ── 3. Load user + permissions ─────────────────────────────────────────────
	const dbUser = db.users.findById(session.userId);

	if (!dbUser) {
		event.cookies.delete('session', { path: '/' });
		event.locals.user = null;
		event.locals.permissions = [];
		return applyRouteRules(event, resolve, pathname, null, []);
	}

	const user = toPublicUser(dbUser);
	const permissions = db.permissions.forUser(dbUser.id);

	event.locals.user = user;
	event.locals.permissions = permissions;

	return applyRouteRules(event, resolve, pathname, user, permissions);
};

async function applyRouteRules(
	event: Parameters<Handle>[0]['event'],
	resolve: Parameters<Handle>[0]['resolve'],
	pathname: string,
	user: import('$lib/auth/types').User | null,
	permissions: readonly import('$lib/auth/types').Permission[]
) {
	const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
	const isAdminOnly = ADMIN_ONLY.some((p) => pathname.startsWith(p));
	const isGuestOnly = GUEST_ONLY.some((p) => pathname.startsWith(p));

	if ((isProtected || isAdminOnly) && !user) {
		const returnUrl = encodeURIComponent(pathname + event.url.search);
		redirect(303, `/login?returnUrl=${returnUrl}`);
	}

	if (isAdminOnly && user && !permissions.includes('admin:system')) {
		// Authenticated but lacks permission — send to dashboard with a note
		redirect(303, '/dashboard?notice=no-admin-access');
	}

	if (isGuestOnly && user) {
		redirect(303, '/dashboard');
	}

	return resolve(event);
}
