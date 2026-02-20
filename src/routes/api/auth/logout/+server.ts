// src/routes/api/auth/logout/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';

export const POST: RequestHandler = async ({ cookies }) => {
	const token = cookies.get('session');
	if (token) {
		db.sessions.deleteByToken(token);
		cookies.delete('session', { path: '/' });
	}
	return json({ ok: true });
};
