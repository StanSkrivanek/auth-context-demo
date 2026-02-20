<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';

	interface Props {
		data: { returnUrl: string | null };
		form?: { error?: string; email?: string };
	}

	let { data, form }: Props = $props();
	let isSubmitting = $state(false);
</script>

<svelte:head>
	<title>Sign in</title>
</svelte:head>

<div class="login-page">
	<div class="login-card">
		<div class="login-header">
			<div class="login-icon">🔐</div>
			<h1>Sign in</h1>
			<p>Enter your credentials to continue</p>
		</div>

		{#if form?.error}
			<div class="error-alert" role="alert">{form.error}</div>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					await update();
					isSubmitting = false;
				};
			}}
		>
			<input type="hidden" name="returnUrl" value={data.returnUrl ?? ''} />

			<div class="field">
				<label for="email">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					value={form?.email ?? ''}
					placeholder="you@example.com"
					autocomplete="email"
					required
					disabled={isSubmitting}
				/>
			</div>

			<div class="field">
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					placeholder="••••••••"
					autocomplete="current-password"
					required
					disabled={isSubmitting}
				/>
			</div>

			<button type="submit" class="submit-btn" disabled={isSubmitting}>
				{#if isSubmitting}
					<span class="spinner"></span> Signing in…
				{:else}
					Sign in
				{/if}
			</button>
		</form>

		<div class="demo-accounts">
			<p class="demo-title">Demo accounts (password: <code>password123</code>):</p>
			<div class="demo-list">
				<div class="demo-item">
					<code>alice@example.com</code>
					<span class="badge admin">Admin</span>
				</div>
				<div class="demo-item">
					<code>bob@example.com</code>
					<span class="badge editor">Editor</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.login-page {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: calc(100vh - 4rem);
		padding: 2rem;
	}

	.login-card {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 0.75rem;
		padding: 2rem;
		width: 100%;
		max-width: 400px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
	}

	.login-header {
		text-align: center;
		margin-bottom: 1.75rem;
	}
	.login-icon {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
	}
	.login-header h1 {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0 0 0.25rem;
	}
	.login-header p {
		color: #64748b;
		margin: 0;
		font-size: 0.9rem;
	}

	.error-alert {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #dc2626;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		margin-bottom: 1.25rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
	label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #374151;
	}

	input[type='email'],
	input[type='password'] {
		padding: 0.625rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.9rem;
		width: 100%;
	}

	input:focus {
		outline: 2px solid #6366f1;
		outline-offset: 1px;
		border-color: #6366f1;
	}
	input:disabled {
		opacity: 0.6;
	}

	.submit-btn {
		padding: 0.7rem;
		background: #6366f1;
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}
	.submit-btn:hover:not(:disabled) {
		background: #4f46e5;
	}
	.submit-btn:disabled {
		opacity: 0.65;
		cursor: not-allowed;
	}

	.spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.35);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.demo-accounts {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid #e2e8f0;
	}

	.demo-title {
		font-size: 0.78rem;
		color: #64748b;
		margin: 0 0 0.6rem;
	}

	.demo-list {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.demo-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.8rem;
	}

	code {
		background: #f1f5f9;
		padding: 0.1rem 0.35rem;
		border-radius: 0.25rem;
	}

	.badge {
		font-size: 0.65rem;
		font-weight: 700;
		padding: 0.1rem 0.5rem;
		border-radius: 1rem;
		text-transform: uppercase;
	}
	.badge.admin {
		background: #e0e7ff;
		color: #4338ca;
	}
	.badge.editor {
		background: #dcfce7;
		color: #166534;
	}
</style>
