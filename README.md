# SvelteKit Auth + Context Demo

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Svelte](https://img.shields.io/badge/Svelte-5-orange.svg)
![SvelteKit](https://img.shields.io/badge/SvelteKit-2-red.svg)

A fully working authentication system using **only SvelteKit's built-in tools** — no external auth library required. This demo showcases best practices for session management, role-based permissions, and reactive auth state distribution using Svelte 5's new context API.

> **Companion Article:** This demo accompanies the article [**"Production Authentication with Context"**](https://thehackpilechronicles.com) on _The Hackpile Chronicles_, where the patterns and architecture are explained in depth.

## Features

- **Server-side session management** with httpOnly cookies (XSS-proof)
- **Route guards** in `hooks.server.ts` — unauthorized users never see protected pages
- **Role-based permissions** resolved server-side, never computed client-side
- **Context-based auth distribution** — zero prop drilling, auth state available everywhere
- **Svelte 5 runes** — `$derived` ensures auth state stays in sync with server after invalidation
- **Permission checks** with O(1) Set-based lookups for render-loop performance
- **Component-level guards** — `<RequirePermission>` wrapper for conditional rendering

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/auth-context-demo.git
cd auth-context-demo

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Demo Credentials

| Email             | Password    | Role   | Permissions                              |
| ----------------- | ----------- | ------ | ---------------------------------------- |
| alice@example.com | password123 | Admin  | All permissions including `admin:system` |
| bob@example.com   | password123 | Editor | Can read/write posts and comments        |

## Architecture

### Server-side Session Flow

1. **Login** → POST to `/api/auth/login` → Server validates credentials → Sets httpOnly cookie
2. **Every request** → `hooks.server.ts` validates cookie → Loads user + permissions → Stores in `event.locals`
3. **Layout load** → `+layout.server.ts` returns `event.locals.user` and `event.locals.permissions`
4. **Client hydration** → `+layout.svelte` calls `createAuthContext(data)` → Makes auth available everywhere

### Permission System

```typescript
// Roles are just named bundles of permissions (server-side only)
const roles = {
  admin: ['admin:system', 'manage:users', 'read:posts', 'write:posts', ...],
  editor: ['read:posts', 'write:posts', 'read:comments', 'write:comments']
}

// User gets permissions through their role assignments
// Never send role names to the client — only resolved permissions
```

### Why `$derived` instead of `$state`?

```typescript
// ❌ WRONG — captures snapshot at creation time
const user = $state(data.user);

// ✅ CORRECT — re-evaluates when data changes
const user = $derived(getData().user);
```

After calling `invalidate('auth:session')`, the layout's load function re-runs and provides new props. `$derived` automatically picks up the changes, while `$state` would silently hold stale data.

## Project Structure

```
src/
├── hooks.server.ts                  # Session validation + route guards
├── routes/
│   ├── +layout.server.ts            # Load user + permissions from locals
│   ├── +layout.svelte               # Create auth context once at root
│   ├── +page.svelte                 # Public landing page
│   ├── login/                       # Login form + POST handler
│   ├── dashboard/                   # Protected route (any authenticated user)
│   ├── admin/                       # Admin-only route (requires admin:system)
│   └── api/auth/                    # Login/logout endpoints
└── lib/
    ├── auth/
    │   ├── auth-context.svelte.ts   # Context creation + getters
    │   └── types.ts                 # User, Permission, AuthState types
    ├── components/
    │   ├── Navigation.svelte        # Shows auth-aware nav links
    │   └── RequirePermission.svelte # Conditional rendering wrapper
    └── server/
        └── db.ts                    # In-memory "database" (demo only)
```

## Key Files Explained

### `src/lib/auth/auth-context.svelte.ts`

Creates and exports the auth context:

```typescript
// Call ONCE in root +layout.svelte
const auth = createAuthContext(() => data);

// Use anywhere in any component
const auth = getAuthContext();
if (auth.hasPermission('admin:system')) {
	/* ... */
}
```

### `src/hooks.server.ts`

Server-side session validation and route protection:

```typescript
export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session');
	// Validate token, load user + permissions
	event.locals.user = user;
	event.locals.permissions = permissions;

	// Block access to protected routes
	if (requiresAuth && !user) redirect(303, '/login');
	if (requiresAdmin && !permissions.includes('admin:system')) {
		redirect(303, '/dashboard');
	}

	return resolve(event);
};
```

### `src/lib/components/RequirePermission.svelte`

Declarative permission-based rendering:

```svelte
<RequirePermission permission="admin:system">
	<a href="/admin">Admin Panel</a>
</RequirePermission>
```

Children only render if the user has the required permission.

## Security Notes

**This is a learning demo, NOT production-ready code.**

- Passwords are stored in **plaintext** — use bcrypt/argon2 in production
- In-memory "database" resets on restart — use PostgreSQL/etc. in production
- No CSRF protection — add CSRF tokens for state-changing operations
- No rate limiting — add rate limiters to prevent brute-force attacks
- No password reset — implement email-based password recovery
- No email verification flow — validate email addresses before granting full access

For production-ready authentication, consider [Better Auth](https://www.better-auth.com), [Lucia](https://lucia-auth.com/),or any other robust authentication solution.

## Testing

```bash
# Run type checking
pnpm check

# Run linting
pnpm lint

# Format code
pnpm format
```

## Building for Production

```bash
pnpm build
pnpm preview
```

## Learn More

- [SvelteKit Hooks](https://kit.svelte.dev/docs/hooks) — Server-side request interception
- [SvelteKit Load Functions](https://kit.svelte.dev/docs/load) — Server vs. universal data loading
- [Svelte Context](https://svelte.dev/docs/svelte/context) — Component tree-scoped state
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/what-are-runes) — New reactivity primitives

## License

MIT — see [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

Built using [SvelteKit](https://kit.svelte.dev/) and [Svelte 5](https://svelte.dev/)
