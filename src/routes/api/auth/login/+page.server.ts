// src/routes/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db, toPublicUser } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, url }) => {
	// Already logged in — send to dashboard or the intended destination
	if (locals.user) {
		redirect(303, url.searchParams.get('returnUrl') ?? '/dashboard');
	}
	return { returnUrl: url.searchParams.get('returnUrl') };
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();
		const password = String(form.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}

		const dbUser = db.users.findByEmail(email);

		if (!dbUser || !db.users.verifyPassword(dbUser, password)) {
			return fail(401, { error: 'Invalid email or password', email });
		}

		const session = db.sessions.create(dbUser.id, 1);

		cookies.set('session', session.token, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24
		});

		// Send to where they were trying to go, or default to dashboard
		const returnUrl = url.searchParams.get('returnUrl') ?? '/dashboard';
		redirect(303, returnUrl.startsWith('/') ? returnUrl : '/dashboard');
	}
};
