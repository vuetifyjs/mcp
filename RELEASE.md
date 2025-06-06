# Release Process

This document describes the release process for @vuetify/mcp.

## Release Process

The project uses [release-it](https://github.com/release-it/release-it) with conventional commits to automate version determination and changelog generation.

### Release Commands

```bash
# Automatic release (determines version bump from conventional commits)
pnpm release

# Then push the changes and tag to trigger CI
git push --follow-tags

# Dry run to see what version would be bumped
pnpm release:dry
```

### Automatic Version Detection

The release process automatically determines the version bump based on your conventional commits since the last release:

- **patch** (0.1.1 → 0.1.2): `fix:` and `perf:` commits
- **minor** (0.1.1 → 0.2.0): `feat:` commits
- **major** (0.1.1 → 1.0.0): commits with `BREAKING CHANGE:` in footer or `!` after type (e.g., `feat!: breaking change`)

### What happens during release

1. **Local (pnpm release)**:
   - Analyzes commits to determine version bump
   - Updates package.json version
   - Updates CHANGELOG.md with new entries
   - Creates git commit and tag

2. **After git push --follow-tags**:
   - CI workflow triggers on the new tag
   - Project is built
   - Package is published to npm
   - GitHub release is created automatically

### Commit Convention

Use conventional commits for automatic changelog generation:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Test updates
- `chore:` Build process or auxiliary tool changes

Example: `feat: add support for Vuetify 3.5`
