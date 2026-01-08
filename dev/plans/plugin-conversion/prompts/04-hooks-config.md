# Feature: F004 - Move and update hooks configuration

## Context

See `context.md` for project background and architecture.

## Prior Work

Features completed before this one:
- **F001**: Created plugin.json referencing `hooks/hooks.json`
- **F002**: Created paths.ts helper
- **F003**: Moved verification scripts to `verification/`

## Objective

Move the hooks configuration from `.claude/hooks.json` to `hooks/hooks.json` and update all paths to use `${CLAUDE_PLUGIN_ROOT}` for plugin compatibility.

> **Scope Constraint**: It is unacceptable to implement features beyond this task's scope. Complete ONLY this feature.

## Relevant Decisions

From `decisions.md`:
- **D03**: Use `${CLAUDE_PLUGIN_ROOT}` for all paths — Standard plugin path variable for hooks

## Edge Cases

From `edge-cases.md`:
- **EC01**: `${CLAUDE_PLUGIN_ROOT}` not expanding in hooks → Test early; verification scripts have fallback

## Files to Create/Modify

| File | Purpose |
|------|---------|
| `hooks/hooks.json` | CREATE - Moved and updated hooks configuration |

## Implementation Details

Transform the hooks configuration to use plugin-relative paths:

```json
{
  "hooks": [
    {
      "event": "Stop",
      "command": "bun run ${CLAUDE_PLUGIN_ROOT}/verification/verify-stop.ts",
      "description": "Verify tests pass and changes committed before stopping"
    },
    {
      "event": "SubagentStop",
      "command": "bun run ${CLAUDE_PLUGIN_ROOT}/verification/verify-subagent.ts",
      "description": "Audit sub-agent claims before acceptance"
    }
  ]
}
```

### Path Transformations

| Original Path | New Path |
|---------------|----------|
| `.claude/skills/planning/verification/verify-stop.ts` | `${CLAUDE_PLUGIN_ROOT}/verification/verify-stop.ts` |
| `.claude/skills/planning/verification/verify-subagent.ts` | `${CLAUDE_PLUGIN_ROOT}/verification/verify-subagent.ts` |

## Acceptance Criteria

- [ ] `hooks/hooks.json` exists
- [ ] hooks.json is valid JSON
- [ ] All paths use `${CLAUDE_PLUGIN_ROOT}` prefix
- [ ] Stop hook points to verification/verify-stop.ts
- [ ] SubagentStop hook points to verification/verify-subagent.ts

## Verification

```bash
test -f hooks/hooks.json && cat hooks/hooks.json | jq . > /dev/null
```

Run this command. Only claim completion if it succeeds.

## Commit

```bash
git add hooks/
git commit -m "feat(hooks): move hooks config with plugin paths

Implements: F004
Decisions: D03
Edge cases: EC01"
```

## Next

After verification passes, this feature is complete. The orchestrator will proceed to F005: Move and update commands.
