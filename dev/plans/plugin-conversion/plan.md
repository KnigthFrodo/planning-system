# Convert Planning System to Installable Plugin

## Summary

Convert the planning system from a `.claude/` directory structure to a standalone, installable Claude Code plugin named `planning-system`. The plugin will be publishable to GitHub marketplace and installable via `claude plugin install`.

## Requirements

- [ ] Create `.claude-plugin/plugin.json` manifest with proper metadata
- [ ] Move commands/, skills/, hooks/ to plugin root level
- [ ] Move verification scripts to root `verification/` directory
- [ ] Update all hardcoded paths to use `${CLAUDE_PLUGIN_ROOT}`
- [ ] Support both installed and development modes
- [ ] Update documentation for plugin installation
- [ ] Maintain Beads as required dependency

## Implementation Approach

### Directory Restructure

Transform from `.claude/` nested structure to plugin root structure:

```
planning-system/              (plugin root)
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest
├── commands/                  # Slash commands (moved from .claude/)
│   ├── plan-new.md
│   ├── plan-optimize.md
│   ├── plan-orchestrate.md
│   └── plan-parallel.md
├── skills/                    # Skills (moved from .claude/)
│   └── planning/
│       ├── SKILL.md
│       ├── workflows/
│       ├── templates/
│       └── reference/
├── hooks/                     # Hooks (moved from .claude/)
│   └── hooks.json
├── verification/              # Scripts (moved from skills/planning/)
│   ├── package.json
│   ├── *.ts
│   └── lib/
├── README.md
└── CLAUDE.md
```

### Path Resolution Strategy

All intra-plugin paths must use `${CLAUDE_PLUGIN_ROOT}` which Claude Code expands to the plugin's install location. For verification scripts, add a helper that falls back for development mode:

```typescript
// verification/lib/paths.ts
export function getPluginRoot(): string {
  return process.env.CLAUDE_PLUGIN_ROOT || dirname(import.meta.dir);
}
```

## Files to Modify

| File | Changes |
|------|---------|
| `.claude-plugin/plugin.json` | CREATE - Plugin manifest with metadata, dependencies, commands list |
| `hooks/hooks.json` | MOVE + UPDATE - Change paths from `.claude/skills/planning/verification` to `${CLAUDE_PLUGIN_ROOT}/verification` |
| `commands/plan-new.md` | MOVE + UPDATE - 5 path references to use `${CLAUDE_PLUGIN_ROOT}` |
| `commands/plan-optimize.md` | MOVE + UPDATE - 3 path references |
| `commands/plan-orchestrate.md` | MOVE + UPDATE - 7 path references including verification scripts |
| `commands/plan-parallel.md` | MOVE + UPDATE - 3 path references |
| `skills/planning/SKILL.md` | MOVE + UPDATE - Path references in documentation |
| `skills/planning/workflows/*.md` | MOVE + UPDATE - Template and script path references |
| `verification/*.ts` | MOVE - From `.claude/skills/planning/verification/` |
| `verification/lib/paths.ts` | CREATE - Plugin root resolution helper |
| `package.json` | CREATE - Root package.json for npm/plugin distribution |
| `README.md` | UPDATE - Installation instructions for plugin |
| `CLAUDE.md` | UPDATE - Plugin-specific guidance |

## Edge Cases

| ID | Case | Handling |
|----|------|----------|
| EC01 | `${CLAUDE_PLUGIN_ROOT}` not expanding in hooks | Test early; verification scripts have fallback via paths.ts helper |
| EC02 | Bun not available on user system | Plugin manifest declares dependency; clear error with install URL |
| EC03 | Beads (bd) not available | Plugin manifest declares dependency; clear error with install URL |
| EC04 | Windows path separators | Use `path.join()` consistently in all scripts |
| EC05 | Plugin installed vs cloned locally | paths.ts helper detects environment and resolves correctly |

## Testing Strategy

Verification approach:

1. **Plugin Installation Test**
   - Install via `claude plugin install .` from local clone
   - Verify all commands appear in `/help`
   - Verify hooks are registered

2. **Command Execution Test**
   - Run `/plan-new` and verify it reads skill/workflow files correctly
   - Run `/plan-optimize` and verify template loading
   - Run `/plan-orchestrate` and verify verification script execution

3. **Hook Execution Test**
   - Trigger Stop event and verify `verify-stop.ts` runs
   - Trigger SubagentStop and verify `verify-subagent.ts` runs
   - Verify exit code 2 blocks completion

4. **Development Mode Test**
   - Clone repo fresh and install locally
   - Verify all paths resolve without `CLAUDE_PLUGIN_ROOT` set

Verification command: `claude plugin install . && claude /plan-new`

## Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| D01 | Keep Beads as required dependency | Provides crash recovery, state management, and epic/task tracking - core to the system's reliability |
| D02 | Move verification/ to plugin root | Cleaner structure; avoids deep nesting; easier path references |
| D03 | Use `${CLAUDE_PLUGIN_ROOT}` for all paths | Standard plugin path variable; works in both installed and development modes |
| D04 | Create paths.ts helper for scripts | Verification scripts run via Bun, need fallback for development mode when env var isn't set |
| D05 | Single plugin vs multiple skills | Keep as single plugin - tightly integrated components that depend on each other |

## Open Questions

*None - all questions resolved.*
