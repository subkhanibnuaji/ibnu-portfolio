# Contributing to Ibnu Portfolio

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js 20+
- npm or pnpm
- Git

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/subkhanibnuaji/ibnu-portfolio.git
   cd ibnu-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required values in `.env.local`

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run type-check` | Run TypeScript checks |
| `npm run analyze` | Analyze bundle size |
| `npm run security:audit` | Run security audit |

## Code Style

- We use **ESLint** and **Prettier** for code formatting
- Run `npm run lint:fix` before committing
- Follow the existing code patterns

### Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Utilities**: camelCase (`myUtility.ts`)
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase with prefix (`IUser`, `TResponse`)

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```
feat(auth): add Google OAuth login
fix(api): handle rate limit errors
docs(readme): update installation steps
```

## Pull Request Process

1. **Create a branch**
   ```bash
   git checkout -b feat/my-feature
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests if applicable
   - Update documentation

3. **Test your changes**
   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add my feature"
   git push origin feat/my-feature
   ```

5. **Open a Pull Request**
   - Use the PR template
   - Link related issues
   - Request review

## Security

- **Never commit secrets** or API keys
- Use environment variables
- Report vulnerabilities via [security issue template](/.github/ISSUE_TEMPLATE/security_vulnerability.yml)
- See [SECURITY.md](/SECURITY.md) for security policy

## Project Structure

```
ibnu-portfolio/
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── components/   # React components
│   ├── lib/          # Utilities and helpers
│   ├── hooks/        # Custom React hooks
│   ├── styles/       # Global styles
│   └── types/        # TypeScript types
├── public/           # Static assets
├── prisma/           # Database schema
└── .github/          # GitHub configs
```

## Getting Help

- Check existing [issues](https://github.com/subkhanibnuaji/ibnu-portfolio/issues)
- Read the [documentation](/docs)
- Open a new issue if needed

## License

By contributing, you agree that your contributions will be licensed under the project's license.

---

Thank you for contributing! 🎉
