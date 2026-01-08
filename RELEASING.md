# Releasing

This document describes how to release a new version of planning-system.

## Prerequisites

### MARKETPLACE_PAT Secret

The release workflow submits a PR to the marketplace repository. This requires a Fine-Grained Personal Access Token (PAT) with write access to the marketplace repo.

#### Creating the Token

1. Go to https://github.com/settings/tokens?type=beta (Fine-grained tokens)
2. Click **Generate new token**
3. Configure the token:
   - **Token name**: `planning-system-marketplace`
   - **Expiration**: 90 days (or your preference)
   - **Description**: `Auto-update marketplace on release`
4. Under **Resource owner**, select the owner of the marketplace repo
5. Under **Repository access**, select **Only select repositories**
   - Choose `NotMyself/claude-dotnet-marketplace`
6. Under **Repository permissions**, set:
   - **Contents**: Read and write
   - **Pull requests**: Read and write
   - **Metadata**: Read (auto-granted)
7. Click **Generate token** and copy it immediately

#### Adding the Secret

1. Go to your repository Settings > Secrets and variables > Actions
2. Click **New repository secret**
3. Name: `MARKETPLACE_PAT`
4. Value: Paste the token
5. Click **Add secret**

If you don't configure this secret, releases will still succeed but the marketplace PR step will be skipped with a warning.

## Preparing a Release

### 1. Bump Version

Use the version bump script to update all package files:

```bash
bun run scripts/bump-version.ts <version>
```

Examples:
```bash
# Standard release
bun run scripts/bump-version.ts 1.2.0

# With 'v' prefix (automatically stripped)
bun run scripts/bump-version.ts v1.2.0

# Prerelease version
bun run scripts/bump-version.ts 2.0.0-beta.1

# Preview changes without modifying files
bun run scripts/bump-version.ts 1.2.0 --dry-run
```

This updates:
- `package.json`
- `.claude-plugin/plugin.json`

### 2. Commit Version Bump

```bash
git add package.json .claude-plugin/plugin.json
git commit -m "chore(release): bump version to X.Y.Z"
```

### 3. Push Changes

```bash
git push origin main
```

## Triggering a Release

Create and push a version tag:

```bash
git tag vX.Y.Z
git push origin vX.Y.Z
```

Examples:
```bash
# Standard release
git tag v1.2.0
git push origin v1.2.0

# Prerelease
git tag v2.0.0-beta.1
git push origin v2.0.0-beta.1
```

## What Happens During Release

The GitHub Actions workflow (`.github/workflows/release.yml`) performs these steps:

1. **Checkout** - Clones the repository with full history for changelog generation
2. **Setup Bun** - Installs Bun runtime
3. **Extract Version** - Parses version from tag (strips 'v' prefix)
4. **Validate Version** - Ensures tag matches `package.json` and `plugin.json`
5. **Install Dependencies** - Runs `bun install`
6. **Run Tests** - Runs `bun test`
7. **Build** - Runs `bun run build`
8. **Generate Changelog** - Creates changelog from commits since last tag
9. **Create GitHub Release** - Publishes release with changelog
10. **Update Marketplace** - Submits PR to marketplace repository (if MARKETPLACE_PAT is configured)

## Prerelease Versions

Tags containing a hyphen (e.g., `v2.0.0-beta.1`, `v1.0.0-rc.1`) are automatically marked as prereleases in GitHub Releases.

## Troubleshooting

### Version Mismatch Error

**Error**: `Version validation failed`

**Cause**: The tag version doesn't match the version in `package.json` or `.claude-plugin/plugin.json`.

**Solution**: Ensure you bumped the version and committed before creating the tag:
```bash
bun run scripts/bump-version.ts X.Y.Z
git add package.json .claude-plugin/plugin.json
git commit -m "chore(release): bump version to X.Y.Z"
git push origin main
git tag vX.Y.Z
git push origin vX.Y.Z
```

### Test Failures

**Error**: Tests fail during the release workflow.

**Solution**: Fix the tests locally before attempting a release:
```bash
bun test
```

### Marketplace PR Not Created

**Warning**: `Marketplace update did not complete successfully`

**Cause**: The `MARKETPLACE_PAT` secret is not configured or has insufficient permissions.

**Solution**:
1. Verify the secret exists in repository settings
2. Ensure the PAT is a Fine-Grained token with:
   - Repository access to `NotMyself/claude-dotnet-marketplace`
   - **Contents**: Read and write permission
   - **Pull requests**: Read and write permission
3. Check that the PAT hasn't expired

The release still succeeds - you can manually update the marketplace if needed.

### Deleting a Tag

If you need to recreate a tag:

```bash
# Delete local tag
git tag -d vX.Y.Z

# Delete remote tag
git push origin :refs/tags/vX.Y.Z

# Create and push new tag
git tag vX.Y.Z
git push origin vX.Y.Z
```

**Note**: Avoid deleting tags for already-published releases as this can cause confusion.
