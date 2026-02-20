// src/routes/admin/+page.server.ts
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, url }) => {
	// Layer 1: Must be authenticated
	if (!locals.user) {
		redirect(303, `/login?returnUrl=${encodeURIComponent(url.pathname)}`);
	}

	// Layer 2: Must have admin:system permission
	// The hook also guards this route, but this load function check makes
	// the requirement explicit and self-documenting.
	if (!locals.permissions.includes('admin:system')) {
		error(403, 'You need the admin:system permission to access this page.');
	}

	// Admin-only data
	const allUsers = [
		// In production: db.users.findAll()
		{ id: 'user_alice', email: 'alice@example.com', name: 'Alice Admin', role: 'Admin' },
		{ id: 'user_bob', email: 'bob@example.com', name: 'Bob Editor', role: 'Editor' }
	];

	return {
		adminUser: locals.user,
		allUsers,
		systemInfo: {
			nodeVersion: process.version,
			environment: process.env.NODE_ENV ?? 'development',
			sessionCount: 1 // Would be db.sessions.count() in production
		}
	};
};
