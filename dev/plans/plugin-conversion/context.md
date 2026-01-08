# Project Context

## Background

The planning system is a comprehensive feature planning, optimization, and execution framework for Claude Code. It uses mechanical enforcement through hooks and verification scripts to ensure sub-agents complete all required steps without taking shortcuts.

## Current State

The system currently lives within a `.claude/` directory structure in projects that use it:

```
.claude/
├── commands/           # Slash commands
├── skills/planning/    # Skill definition and workflows
│   └── verification/   # TypeScript verification scripts
└── hooks.json          # Hook configuration
```

## Target State

Convert to a standalone, installable Claude Code plugin:

```
planning-system/        # Plugin root
├── .claude-plugin/
│   └── plugin.json     # Plugin manifest
├── commands/           # Slash commands
├── skills/planning/    # Skill definition
├── verification/       # Scripts at root level
├── hooks/
│   └── hooks.json      # Hook configuration
└── package.json        # NPM package
```

## Architecture Vision

1. **Installable**: Users run `claude plugin install github.com/author/planning-system`
2. **Self-contained**: All paths resolve relative to plugin root via `${CLAUDE_PLUGIN_ROOT}`
3. **Development-friendly**: Works when cloned locally without installation
4. **Mechanically enforced**: Hooks still verify completion before allowing stop

## Key Dependencies

- **Bun**: Runtime for verification scripts
- **Beads CLI (bd)**: State management for epics/tasks
- **Git**: Version control and PR creation
- **GitHub CLI (gh)**: Optional, for PR creation
