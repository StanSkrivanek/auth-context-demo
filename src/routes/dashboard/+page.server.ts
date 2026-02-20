// src/routes/dashboard/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// The hook already redirected unauthenticated users, but a per-page
	// check is good defence-in-depth and makes intent explicit.
	if (!locals.user) {
		redirect(303, '/login');
	}

	// In production: query DB for this user's data
	return {
		stats: {
			posts: 12,
			comments: 47,
			views: 1_823
		},
		recentActivity: [
			{ id: 1, action: 'Published post', time: '2 hours ago' },
			{ id: 2, action: 'Added comment', time: '5 hours ago' },
			{ id: 3, action: 'Updated settings', time: 'Yesterday' }
		]
	};
};
