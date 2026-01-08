# Feature: F005 - Move and update commands

## Context

See `context.md` for project background and architecture.

## Prior Work

Features completed before this one:
- **F001**: Created plugin.json listing commands in `commands/`
- **F002**: Created paths.ts helper
- **F003**: Moved verification scripts
- **F004**: Moved hooks configuration

## Objective

Move all command files from `.claude/commands/` to `commands/` and update all path references to use `${CLAUDE_PLUGIN_ROOT}`.

> **Scope Constraint**: It is unacceptable to implement features beyond this task's scope. Complete ONLY this feature.

## Relevant Decisions

From `decisions.md`:
- **D03**: Use `${CLAUDE_PLUGIN_ROOT}` for all paths — Commands reference skills, workflows, and verification scripts

## Edge Cases

From `edge-cases.md`:
- **EC01**: `${CLAUDE_PLUGIN_ROOT}` not expanding → Test early with simple command

## Files to Create/Modify

| File | Purpose |
|------|---------|
| `commands/plan-new.md` | MOVE and update ~5 path references |
| `commands/plan-optimize.md` | MOVE and update ~3 path references |
| `commands/plan-orchestrate.md` | MOVE and update ~7 path references |
| `commands/plan-parallel.md` | MOVE and update ~3 path references |

## Implementation Details

### Path Transformations

| Original Pattern | New Pattern |
|------------------|-------------|
| `.claude/skills/planning/SKILL.md` | `${CLAUDE_PLUGIN_ROOT}/skills/planning/SKILL.md` |
| `.claude/skills/planning/workflows/` | `${CLAUDE_PLUGIN_ROOT}/skills/planning/workflows/` |
| `.claude/skills/planning/templates/` | `${CLAUDE_PLUGIN_ROOT}/skills/planning/templates/` |
| `.claude/skills/planning/verification/` | `${CLAUDE_PLUGIN_ROOT}/verification/` |

### Example Transformation

```markdown
<!-- Before -->
Read `.claude/skills/planning/SKILL.md` for system overview.

<!-- After -->
Read `${CLAUDE_PLUGIN_ROOT}/skills/planning/SKILL.md` for system overview.
```

### Commands to Update

1. **plan-new.md**: References to SKILL.md, workflows/1-planning.md
2. **plan-optimize.md**: References to SKILL.md, workflows/2-optimization.md, templates/
3. **plan-orchestrate.md**: References to SKILL.md, workflows/3-orchestration.md, verification scripts
4. **plan-parallel.md**: References to SKILL.md, workflows/4-parallel.md

## Acceptance Criteria

- [ ] All 4 command files exist in `commands/`
- [ ] No paths start with `.claude/`
- [ ] All skill/workflow/template paths use `${CLAUDE_PLUGIN_ROOT}`
- [ ] Verification script paths point to `${CLAUDE_PLUGIN_ROOT}/verification/`

## Verification

```bash
test -d commands && ls commands/*.md | wc -l | grep -q 4
```

Run this command. Only claim completion if it succeeds.

## Commit

```bash
git add commands/
git commit -m "feat(commands): move commands with plugin paths

Implements: F005
Decisions: D03
Edge cases: EC01"
```

## Next

After verification passes, this feature is complete. The orchestrator will proceed to F006: Move and update skills directory.
