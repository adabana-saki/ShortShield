# Contributing to ShortShield

Thank you for your interest in contributing to ShortShield! This document provides guidelines and information for contributors.

[日本語](CONTRIBUTING.ja.md)

## Code of Conduct

Please read and follow our Code of Conduct. We expect all contributors to be respectful and constructive.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/adalab/shortshield/issues)
2. If not, create a new issue using the Bug Report template
3. Include:
   - Browser and version
   - Extension version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Features

1. Check existing [Issues](https://github.com/adalab/shortshield/issues) for similar suggestions
2. Create a new issue using the Feature Request template
3. Describe:
   - The problem you're trying to solve
   - Your proposed solution
   - Alternative solutions you've considered

### Contributing Code

#### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/shortshield.git
   cd shortshield
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Workflow

1. Make your changes
2. Ensure code quality:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test:unit
   ```
3. Test manually in browser
4. Commit your changes (see Commit Guidelines below)
5. Push to your fork
6. Open a Pull Request

#### Commit Guidelines

We use conventional commits. Format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(content): add TikTok blocking support
fix(popup): resolve toggle state not persisting
docs(readme): update installation instructions
```

#### Pull Request Guidelines

1. Use the Pull Request template
2. Reference any related issues
3. Include screenshots for UI changes
4. Ensure all checks pass
5. Request review from maintainers

### Code Style

- TypeScript strict mode
- ESLint and Prettier for formatting
- Follow existing patterns in the codebase

### Testing

- Write tests for new features
- Maintain test coverage above 80%
- Run tests before submitting:
  ```bash
  pnpm test:unit
  pnpm test:e2e
  ```

### Documentation

- Update README if adding features
- Add JSDoc comments for public APIs
- Update translations if adding strings

## Security

- Never commit sensitive data
- Validate all user inputs
- Follow secure coding practices
- Report security issues privately (see SECURITY.md)

## Questions?

- Open a Discussion for general questions
- Join our community chat (coming soon)
- Check existing issues and discussions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
