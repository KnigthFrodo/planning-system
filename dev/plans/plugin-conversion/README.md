# Plugin Conversion Plan

Convert the planning system from a `.claude/` directory structure to a standalone, installable Claude Code plugin.

## Quick Reference

| Command | Purpose |
|---------|---------|
| `/plan-orchestrate dev/plans/plugin-conversion` | Execute this plan |

## Features

| ID | Title | Status | Depends On |
|----|-------|--------|------------|
| F001 | Create plugin manifest and package.json | pending | - |
| F002 | Create path resolution helper | pending | F001 |
| F003 | Move and update verification scripts | pending | F002 |
| F004 | Move and update hooks configuration | pending | F003 |
| F005 | Move and update commands | pending | F004 |
| F006 | Move and update skills directory | pending | F005 |
| F007 | Update documentation | pending | F006 |
| F008 | Plugin installation and integration testing | pending | F007 |

## Execution Order

Features are designed for sequential execution due to dependencies:

```
F001 → F002 → F003 → F004 → F005 → F006 → F007 → F008
```

## Files

- `manifest.jsonl` - Feature definitions with Beads task IDs
- `prompts/*.md` - Individual feature prompts
- `context.md` - Project background
- `constraints.md` - Global rules
- `decisions.md` - Architectural decisions
- `edge-cases.md` - Known edge cases
- `testing-strategy.md` - Testing approach

## Beads Integration

Epic: `planning-system-irl`

All features are tracked as Beads tasks under this epic.

## Next Steps

1. Run `/plan-orchestrate dev/plans/plugin-conversion`
2. Sub-agents will execute each feature in order
3. Verification scripts ensure quality gates
4. Final PR created after F008 completes
