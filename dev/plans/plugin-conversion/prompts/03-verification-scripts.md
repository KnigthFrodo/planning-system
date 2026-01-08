# Feature: F003 - Move and update verification scripts

## Context

See `context.md` for project background and architecture.

## Prior Work

Features completed before this one:
- **F001**: Created plugin manifest and package.json
- **F002**: Created paths.ts helper for plugin root resolution

## Objective

Move all verification scripts from `.claude/skills/planning/verification/` to the root `verification/` directory and update imports to use the new paths.ts helper.

> **Scope Constraint**: It is unacceptable to implement features beyond this task's scope. Complete ONLY this feature.

## Relevant Decisions

From `decisions.md`:
- **D02**: Move verification/ to plugin root — Cleaner structure, easier path references
- **D04**: Create paths.ts helper for scripts — Already created in F002

## Edge Cases

From `edge-cases.md`:
- **EC04**: Windows path separators → Use `path.join()` from paths.ts helper
- **EC05**: Plugin installed vs cloned locally → paths.ts already handles this

## Files to Create/Modify

| File | Purpose |
|------|---------|
| `verification/verify-stop.ts` | MOVE from `.claude/skills/planning/verification/` |
| `verification/verify-subagent.ts` | MOVE from `.claude/skills/planning/verification/` |
| `verification/verify-feature.ts` | MOVE from `.claude/skills/planning/verification/` |
| `verification/reconcile-state.ts` | MOVE from `.claude/skills/planning/verification/` |
| `verification/create-pr.ts` | MOVE from `.claude/skills/planning/verification/` |
| `verification/sync-devops.ts` | MOVE from `.claude/skills/planning/verification/` |
| `verification/package.json` | MOVE and update paths |
| `verification/tsconfig.json` | MOVE if exists |

## Implementation Details

1. **Copy all files** from `.claude/skills/planning/verification/` to `verification/`
2. **Update imports** in each script to use the paths.ts helper:

```typescript
// Before (hardcoded paths)
const skillPath = ".claude/skills/planning/workflows/1-planning.md";

// After (using helper)
import { resolvePluginPath } from "./lib/paths";
const skillPath = resolvePluginPath("skills", "planning", "workflows", "1-planning.md");
```

3. **Update package.json** if it has path references
4. **Preserve** the existing lib/ directory structure (paths.ts is already there from F002)

## Acceptance Criteria

- [ ] All verification scripts moved to `verification/`
- [ ] Scripts use `resolvePluginPath()` for any skill/template paths
- [ ] package.json exists in verification/
- [ ] TypeScript compiles: `bun run --cwd verification tsc --noEmit`
- [ ] Original `.claude/skills/planning/verification/` can be removed (but don't remove yet)

## Verification

```bash
bun run --cwd verification tsc --noEmit
```

Run this command. Only claim completion if it succeeds.

## Commit

```bash
git add verification/
git commit -m "feat(verification): move scripts to plugin root

Implements: F003
Decisions: D02, D04
Edge cases: EC04, EC05"
```

## Next

After verification passes, this feature is complete. The orchestrator will proceed to F004: Move and update hooks configuration.
