// src/lib/server/db.ts
import { randomBytes } from 'node:crypto';
import type { Permission, User } from '$lib/auth/types';

// ─── Internal shapes ─────────────────────────────────────────────────────────

interface DBUser {
	id: string;
	email: string;
	name: string;
	avatarUrl: string | null;
	emailVerified: boolean;
	createdAt: Date;
	/** ⚠️ Demo only — never store plaintext passwords */
	password: string;
}

interface DBRole {
	id: string;
	name: string;
	permissions: Permission[];
}

interface DBUserRole {
	userId: string;
	roleId: string;
}

interface DBSession {
	token: string;
	userId: string;
	expiresAt: Date;
}

// ─── Seed data ───────────────────────────────────────────────────────────────

const users: DBUser[] = [
	{
		id: 'user_alice',
		email: 'alice@example.com',
		name: 'Alice Admin',
		avatarUrl: null,
		emailVerified: true,
		createdAt: new Date('2024-01-01'),
		password: 'password123'
	},
	{
		id: 'user_bob',
		email: 'bob@example.com',
		name: 'Bob Editor',
		avatarUrl: null,
		emailVerified: true,
		createdAt: new Date('2024-02-01'),
		password: 'password123'
	}
];

const roles: DBRole[] = [
	{
		id: 'role_admin',
		name: 'Admin',
		permissions: [
			'admin:system',
			'manage:users',
			'manage:roles',
			'read:posts',
			'write:posts',
			'delete:posts',
			'read:comments',
			'write:comments',
			'delete:comments'
		]
	},
	{
		id: 'role_editor',
		name: 'Editor',
		permissions: ['read:posts', 'write:posts', 'read:comments', 'write:comments']
	}
];

const userRoles: DBUserRole[] = [
	{ userId: 'user_alice', roleId: 'role_admin' },
	{ userId: 'user_bob', roleId: 'role_editor' }
];

// Sessions created at runtime — start empty
const sessions: DBSession[] = [];

// ─── Public API ──────────────────────────────────────────────────────────────

export const db = {
	users: {
		findByEmail(email: string): DBUser | null {
			return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
		},
		findById(id: string): DBUser | null {
			return users.find((u) => u.id === id) ?? null;
		},
		/** ⚠️ Demo only — use bcrypt.compare() in production */
		verifyPassword(user: DBUser, password: string): boolean {
			return user.password === password;
		}
	},

	sessions: {
		create(userId: string, ttlDays = 1): DBSession {
			const session: DBSession = {
				token: randomBytes(32).toString('hex'),
				userId,
				expiresAt: new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000)
			};
			sessions.push(session);
			return session;
		},
		findByToken(token: string): DBSession | null {
			const s = sessions.find((s) => s.token === token);
			if (!s || s.expiresAt < new Date()) return null;
			return s;
		},
		deleteByToken(token: string): void {
			const i = sessions.findIndex((s) => s.token === token);
			if (i !== -1) sessions.splice(i, 1);
		}
	},

	permissions: {
		/** Resolves all permissions for a user by collecting from their roles. */
		forUser(userId: string): Permission[] {
			const roleIds = userRoles.filter((ur) => ur.userId === userId).map((ur) => ur.roleId);

			const perms = new Set<Permission>();
			for (const roleId of roleIds) {
				const role = roles.find((r) => r.id === roleId);
				if (role) role.permissions.forEach((p) => perms.add(p));
			}
			return Array.from(perms);
		}
	}
};

/** Maps a DBUser to the public User shape, stripping the password field. */
export function toPublicUser(u: ReturnType<typeof db.users.findById>): User {
	if (!u) throw new Error('toPublicUser: null input');
	return {
		id: u.id,
		email: u.email,
		name: u.name,
		avatarUrl: u.avatarUrl,
		emailVerified: u.emailVerified,
		createdAt: u.createdAt
	};
}
