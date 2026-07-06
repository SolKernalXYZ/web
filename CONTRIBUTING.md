# Contributing to SolKernal

Thank you for your interest in contributing to SolKernal! We welcome contributions from the community.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or pnpm
- Git
- A Solana wallet (Phantom recommended)

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/web.git
   cd web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Initialize database**
   ```bash
   npx prisma migrate dev
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📝 Development Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates

Example: `feature/skill-search` or `fix/wallet-connection`

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Write clear, concise commit messages
   - Keep commits atomic and focused

3. **Test your changes**
   ```bash
   npm run lint        # Run ESLint
   npm run build       # Test production build
   npm run dev         # Test in development
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add skill search functionality"
   ```

   **Commit Message Convention:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template with details

## 🎯 Code Guidelines

### TypeScript

- Use TypeScript for all new code
- Prefer type inference where possible
- Avoid `any` types - use proper typing
- Use interfaces for object shapes

### React/Next.js

- Use Server Components by default
- Only use Client Components when needed (`'use client'`)
- Follow Next.js App Router conventions
- Keep components small and focused

### Styling

- Use Tailwind CSS for styling
- Follow the existing design system
- Ensure responsive design (mobile, tablet, desktop)
- Test dark mode compatibility

### Performance

- Optimize images (use Next.js Image component)
- Minimize client-side JavaScript
- Use proper loading states
- Implement error boundaries

### Accessibility

- Use semantic HTML
- Include proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers when possible

## 🧪 Testing

Before submitting a PR, ensure:

- [ ] Code builds successfully (`npm run build`)
- [ ] ESLint passes (`npm run lint`)
- [ ] All pages load without errors
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Wallet connection works (if applicable)
- [ ] Database migrations run successfully (if applicable)

## 📦 Pull Request Guidelines

### PR Title

- Use descriptive titles
- Follow commit convention: `feat:`, `fix:`, `docs:`, etc.
- Keep under 70 characters

### PR Description

Include:
- **Summary:** What does this PR do?
- **Changes:** List of changes made
- **Testing:** How was this tested?
- **Screenshots:** If UI changes, include before/after
- **Breaking Changes:** Any breaking changes?
- **Related Issues:** Link related issues

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited in the release notes

## 🐛 Bug Reports

Found a bug? Please open an issue with:

- Clear, descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs (if applicable)
- Environment (OS, browser, Node version)

## 💡 Feature Requests

Have an idea? Open an issue with:

- Clear description of the feature
- Use case / problem it solves
- Proposed implementation (if you have ideas)
- Any examples from other projects

## 🔒 Security

Found a security vulnerability? Please email **hello@solkernal.xyz** instead of opening a public issue.

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards

- Be respectful and considerate
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## 💬 Getting Help

- **Discord:** [discord.gg/solkernal](https://discord.gg/solkernal)
- **Twitter:** [@SolKernal_](https://x.com/SolKernal_)
- **Email:** hello@solkernal.xyz
- **Discussions:** Use GitHub Discussions for questions

## 🎉 Recognition

All contributors will be recognized in:
- Release notes
- Contributors page (coming soon)
- Special shoutouts on Twitter/Discord

Thank you for contributing to SolKernal! 🚀
