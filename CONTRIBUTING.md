# Contributing to Auth Context Demo

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful and constructive in all interactions. We aim to maintain a welcoming and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:

- A clear, descriptive title
- Steps to reproduce the problem
- Expected behavior vs. actual behavior
- Your environment (OS, Node version, browser)
- Screenshots or error messages if applicable

### Suggesting Enhancements

Enhancement suggestions are welcome! Please open an issue with:

- A clear description of the feature
- Use cases and benefits
- Any implementation ideas you have

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the code style guidelines below
3. **Test your changes** thoroughly
4. **Update documentation** if needed (README, code comments, etc.)
5. **Commit with clear messages** describing what and why
6. **Open a pull request** with a description of your changes

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/auth-context-demo.git
cd auth-context-demo

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run checks before committing
pnpm check
pnpm lint
```

## Code Style Guidelines

### General

- Use TypeScript for all new code
- Follow the existing code structure and patterns
- Keep functions small and focused
- Add comments for complex logic

### Svelte Components

- Use Svelte 5 runes (`$state`, `$derived`, `$effect`)
- Follow the component structure: `<script>`, `<svelte:head>`, markup, `<style>`
- Use semantic HTML elements
- Keep components focused on a single responsibility

### TypeScript

- Define proper types for all function parameters and return values
- Use interfaces for object shapes
- Avoid `any` types unless absolutely necessary
- Export types from `types.ts` files

### Naming Conventions

- Components: PascalCase (`RequirePermission.svelte`)
- Functions: camelCase (`hasPermission`, `createAuthContext`)
- Constants: UPPER_SNAKE_CASE (`AUTH_KEY`, `PROTECTED`)
- Types: PascalCase (`User`, `Permission`, `AuthState`)

### Formatting

This project uses Prettier and ESLint. Before committing:

```bash
# Format code
pnpm format

# Check for linting errors
pnpm lint
```

## Project Structure Conventions

- **`src/routes/`** - SvelteKit route pages and layouts
- **`src/lib/`** - Reusable code (components, utilities, types)
- **`src/lib/server/`** - Server-only code (marked by SvelteKit)
- **`src/lib/auth/`** - Authentication-related code and types

## Commit Message Guidelines

Write clear, descriptive commit messages:

```
feat: add password strength indicator
fix: resolve session expiry race condition
docs: update README with deployment instructions
refactor: simplify permission check logic
test: add tests for auth context
```

Prefixes:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring without behavior change
- `test:` - Adding or updating tests
- `chore:` - Build process, dependencies, etc.

## Testing

Currently, this project doesn't have automated tests (it's a demo). If you'd like to add testing infrastructure or write tests, that would be a valuable contribution!

## Security

This is a **demo project** and should not be used in production as-is. If you discover security vulnerabilities in the approach or implementation, please open an issue to discuss them.

## Questions?

If you have questions about contributing, feel free to open an issue with the `question` label.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
