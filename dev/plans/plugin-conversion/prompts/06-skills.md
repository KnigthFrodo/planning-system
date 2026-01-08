# Feature: F006 - Move and update skills directory

## Context

See `context.md` for project background and architecture.

## Prior Work

Features completed before this one:
- **F001**: Created plugin.json listing skills in `skills/`
- **F002**: Created paths.ts helper
- **F003**: Moved verification scripts to `verification/`
- **F004**: Moved hooks configuration
- **F005**: Moved commands with updated paths

## Objective

Move the entire skills directory from `.claude/skills/` to root `skills/` and update all internal path references.

> **Scope Constraint**: It is unacceptable to implement features beyond this task's scope. Complete ONLY this feature.

## Relevant Decisions

From `decisions.md`:
- **D02**: Move verification/ to plugin root — Verification is now at root level, not under skills
- **D03**: Use `${CLAUDE_PLUGIN_ROOT}` for all paths — Internal skill references need updating

## Edge Cases

From `edge-cases.md`:
- **EC04**: Windows path separators → Ensure paths work on Windows

## Files to Create/Modify

| File | Purpose |
|------|---------|
| `skills/planning/SKILL.md` | MOVE and update path references |
| `skills/planning/workflows/*.md` | MOVE and update verification script paths |
| `skills/planning/templates/*.md` | MOVE (likely no path changes needed) |
| `skills/planning/reference/*.md` | MOVE (likely no path changes needed) |

## Implementation Details

### Directory Structure After Move

```
skills/
└── planning/
    ├── SKILL.md
    ├── workflows/
    │   ├── 1-planning.md
    │   ├── 2-optimization.md
    │   ├── 3-orchestration.md
    │   └── 4-parallel.md
    ├── templates/
    │   ├── manifest.md
    │   └── prompt.md
    └── reference/
        └── *.md
```

### Path Transformations in Skills

| Original Pattern | New Pattern |
|------------------|-------------|
| `.claude/skills/planning/verification/` | `${CLAUDE_PLUGIN_ROOT}/verification/` |
| `.claude/skills/planning/templates/` | `${CLAUDE_PLUGIN_ROOT}/skills/planning/templates/` |
| `.claude/skills/planning/workflows/` | `${CLAUDE_PLUGIN_ROOT}/skills/planning/workflows/` |

### Key Files to Update

1. **SKILL.md**: Update any verification script references
2. **workflows/3-orchestration.md**: References verification scripts heavily
3. **workflows/2-optimization.md**: May reference templates

### Note on Verification Directory

The verification scripts were already moved in F003. The old `.claude/skills/planning/verification/` directory will be removed during cleanup (F008 or manual cleanup after all features complete).

## Acceptance Criteria

- [ ] `skills/planning/SKILL.md` exists
- [ ] `skills/planning/workflows/` contains all workflow files
- [ ] `skills/planning/templates/` contains all template files
- [ ] No references to `.claude/skills/planning/verification/`
- [ ] All verification references point to `${CLAUDE_PLUGIN_ROOT}/verification/`

## Verification

```bash
test -d skills/planning && test -f skills/planning/SKILL.md
```

Run this command. Only claim completion if it succeeds.

## Commit

```bash
git add skills/
git commit -m "feat(skills): move skills directory to plugin root

Implements: F006
Decisions: D02, D03
Edge cases: EC04"
```

## Next

After verification passes, this feature is complete. The orchestrator will proceed to F007: Update documentation.
