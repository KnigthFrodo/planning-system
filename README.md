# Claude Code Planning System

A reliable planning and execution system for Claude Code that emphasizes mechanical enforcement over instruction compliance.

## Problem Solved

Claude Code sub-agents sometimes skip steps (tests, builds, commits) with responses like "I decided that was a lot of work." This system uses hooks and verification scripts to mechanically block shortcuts.

## Installation

### As Plugin (Recommended)

```bash
claude plugin install github.com/bpowers/planning-system
```

### For Development

```bash
git clone https://github.com/bpowers/planning-system
cd planning-system
claude plugin install .
```

## Prerequisites

- [Bun](https://bun.sh) - JavaScript runtime for verification scripts
- [Beads CLI](https://github.com/beads/beads) (`bd`) - State management for epics/tasks
- [Git](https://git-scm.com) - Version control
- [GitHub CLI](https://cli.github.com) (`gh`) or [Azure CLI](https://docs.microsoft.com/cli/azure/) (`az`) - For PR creation

## Quick Start

1. Install the plugin (see Installation above)
2. Initialize Beads in your project: `bd init`
3. Run `/plan-new` to start planning a feature
4. Run `/plan-optimize <plan.md>` to decompose into features
5. Run `/plan-orchestrate <plan-dir>` to execute with sub-agents

## Commands

| Command | Purpose |
|---------|---------|
| `/plan-new` | Enter planning mode, create plan document |
| `/plan-optimize <plan.md>` | Decompose plan into feature prompts |
| `/plan-orchestrate <plan-dir>` | Execute features with sub-agents |
| `/plan-parallel <dir1> <dir2>` | Execute multiple plans in parallel |

## Architecture

```
/plan-new --> plan.md --> /plan-optimize --> manifest + prompts --> /plan-orchestrate --> PR
                              |                                              |
                              v                                              v
                         Beads Epic                                    Beads Tasks
```

## Key Features

- **Mechanical Enforcement**: Hooks block completion if quality gates not met
- **Sub-Agent Verification**: Claims are verified before acceptance
- **Crash Recovery**: Safe to re-run orchestration at any point
- **Dual-Repo Support**: GitHub and Azure DevOps PR creation
- **DevOps Sync**: Rich information to Azure DevOps boards
- **Beads Integration**: Epic/task state management

## Plugin Structure

```
planning-system/
├── .claude-plugin/
│   └── plugin.json      # Plugin manifest
├── commands/            # Slash commands
├── hooks/
│   └── hooks.json       # Hook configuration
├── skills/planning/     # Skill definition and workflows
├── verification/        # TypeScript enforcement scripts
└── package.json         # NPM package
```

## Configuration Files

| File | Purpose |
|------|---------|
| `.beads` | Beads epic ID (created by /plan-new) |
| `.devops` | Azure DevOps Story config (optional) |
| `.planconfig` | PR creation overrides (optional) |

## How It Works

1. **Hooks** intercept Stop and SubagentStop events
2. **Verification scripts** check actual state (tests, commits, builds)
3. **Exit code 2** blocks completion and feeds stderr back to Claude
4. **State reconciliation** ensures idempotent orchestration

## License

MIT
