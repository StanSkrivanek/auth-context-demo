// src/routes/logout/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const token = cookies.get('session');
		if (token) {
			db.sessions.deleteByToken(token);
			cookies.delete('session', { path: '/' });
		}
		redirect(303, '/');
	}
};
