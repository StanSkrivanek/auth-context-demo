// src/routes/api/auth/login/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../api/auth/login/$types';
import { db, toPublicUser } from '$lib/server/db';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json().catch(() => null);

	if (!body?.email || !body?.password) {
		return json({ message: 'Email and password are required' }, { status: 400 });
	}

	const dbUser = db.users.findByEmail(String(body.email));

	if (!dbUser || !db.users.verifyPassword(dbUser, String(body.password))) {
		// Generic message — prevents user enumeration
		return json({ message: 'Invalid email or password' }, { status: 401 });
	}

	const session = db.sessions.create(dbUser.id, 1);

	cookies.set('session', session.token, {
		path: '/',
		httpOnly: true, // JS cannot read this
		secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
		sameSite: 'lax', // CSRF mitigation
		maxAge: 60 * 60 * 24 // 1 day
	});

	return json({ ok: true, user: toPublicUser(dbUser) });
};
