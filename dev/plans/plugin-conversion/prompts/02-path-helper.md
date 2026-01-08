# Feature: F002 - Create path resolution helper

## Context

See `context.md` for project background and architecture.

## Prior Work

Features completed before this one:
- **F001**: Created plugin.json and package.json establishing plugin structure

## Objective

Create a path resolution helper that enables verification scripts to work in both installed plugin mode (using `CLAUDE_PLUGIN_ROOT`) and development mode (using local paths).

> **Scope Constraint**: It is unacceptable to implement features beyond this task's scope. Complete ONLY this feature.

## Relevant Decisions

From `decisions.md`:
- **D03**: Use `${CLAUDE_PLUGIN_ROOT}` for all paths — Standard plugin path variable
- **D04**: Create paths.ts helper for scripts — Verification scripts need fallback for development mode

## Edge Cases

From `edge-cases.md`:
- **EC01**: `${CLAUDE_PLUGIN_ROOT}` not expanding in hooks → paths.ts provides fallback
- **EC04**: Windows path separators → Use `path.join()` consistently
- **EC05**: Plugin installed vs cloned locally → Helper detects environment and resolves correctly

## Files to Create/Modify

| File | Purpose |
|------|---------|
| `verification/lib/paths.ts` | CREATE - Plugin root resolution helper |
| `verification/lib/index.ts` | CREATE - Re-export helpers |

## Implementation Details

```typescript
// verification/lib/paths.ts
import { dirname, join } from "path";

/**
 * Get the plugin root directory.
 * Uses CLAUDE_PLUGIN_ROOT env var when installed as plugin,
 * falls back to parent of verification/ for development mode.
 */
export function getPluginRoot(): string {
  if (process.env.CLAUDE_PLUGIN_ROOT) {
    return process.env.CLAUDE_PLUGIN_ROOT;
  }
  // Development mode: assume we're in verification/lib/
  // Go up two levels to reach plugin root
  return dirname(dirname(import.meta.dir));
}

/**
 * Resolve a path relative to plugin root.
 * Handles both installed and development modes.
 */
export function resolvePluginPath(...segments: string[]): string {
  return join(getPluginRoot(), ...segments);
}

/**
 * Get path to verification scripts directory.
 */
export function getVerificationDir(): string {
  return resolvePluginPath("verification");
}

/**
 * Get path to skills directory.
 */
export function getSkillsDir(): string {
  return resolvePluginPath("skills");
}
```

```typescript
// verification/lib/index.ts
export * from "./paths";
```

## Acceptance Criteria

- [ ] `verification/lib/paths.ts` exists
- [ ] `getPluginRoot()` uses env var when available
- [ ] `getPluginRoot()` falls back correctly in dev mode
- [ ] `resolvePluginPath()` uses `path.join()` for cross-platform compatibility
- [ ] File runs without errors: `bun run verification/lib/paths.ts`

## Verification

```bash
bun run verification/lib/paths.ts
```

Run this command. Only claim completion if it succeeds.

## Commit

```bash
git add verification/lib/
git commit -m "feat(verification): add path resolution helper

Implements: F002
Decisions: D03, D04
Edge cases: EC01, EC04, EC05"
```

## Next

After verification passes, this feature is complete. The orchestrator will proceed to F003: Move and update verification scripts.
