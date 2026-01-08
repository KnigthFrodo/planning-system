# Claude Code Planning System

A plugin for Claude Code that ensures sub-agents actually complete their work through mechanical enforcement.

## The Problem

When Claude Code spawns sub-agents to implement features, they sometimes take shortcuts:
- "I decided the tests weren't necessary"
- "The build step seemed redundant"
- "I'll let you handle the commit"

These shortcuts lead to incomplete work, failed builds, and frustrated developers.

## The Solution

This plugin uses **hooks** to mechanically verify work before allowing completion. Sub-agents cannot claim "done" until:
- Tests actually pass
- Build actually succeeds
- Changes are actually committed

No more trusting claims - only verified results.

## Installation

### Prerequisites

Before installing, ensure you have:

| Tool | Purpose | Install |
|------|---------|---------|
| [Bun](https://bun.sh) | Runs verification scripts | `curl -fsSL https://bun.sh/install \| bash` |
| [Beads CLI](https://github.com/bpowers/beads) | Tracks epics/tasks | `cargo install beads` |
| Git | Version control | [git-scm.com](https://git-scm.com) |
| GitHub CLI | PR creation | `brew install gh` or [cli.github.com](https://cli.github.com) |

### Install the Plugin

```bash
claude plugin install planning-system
```

### Setup in Your Project

```bash
cd your-project
bd init  # Initialize Beads for task tracking
```

## Usage

### The Workflow

```
/plan-new        Create a plan document collaboratively
     │
     ▼
/plan-optimize   Break the plan into executable features
     │
     ▼
/plan-orchestrate   Execute features with verified sub-agents
     │
     ▼
   Pull Request   Ready for review
```

### Step 1: Plan Your Feature

```
/plan-new
```

Enter planning mode to collaboratively design your feature. Claude will:
- Ask clarifying questions
- Help you think through edge cases
- Create a structured plan document at `dev/plans/<feature>/plan.md`
- Create a Beads epic to track the work

### Step 2: Optimize for Execution

```
/plan-optimize dev/plans/my-feature/plan.md
```

Transform your plan into sub-agent-ready prompts:
- Decomposes the plan into sequential features
- Creates individual prompt files for each feature
- Generates a manifest tracking dependencies and status
- Creates Beads tasks linked to the epic

**Output structure:**
```
dev/plans/my-feature/
├── plan.md              # Your original plan
├── manifest.jsonl       # Feature tracking
├── context.md           # Shared context for sub-agents
├── constraints.md       # Rules all features must follow
└── prompts/
    ├── 01-setup.md      # Feature 1 prompt
    ├── 02-core.md       # Feature 2 prompt
    └── 03-tests.md      # Feature 3 prompt
```

### Step 3: Execute with Verification

```
/plan-orchestrate dev/plans/my-feature/
```

Execute each feature sequentially with mechanical verification:

1. **Spawns sub-agent** with feature prompt
2. **Waits for completion** claim
3. **Mechanically verifies**:
   - Verification command passes
   - Tests pass (`bun test`)
   - Build succeeds (`bun run build`)
   - Changes committed with feature ID
4. **Blocks or proceeds** based on actual results
5. **Creates PR** when all features complete

### Parallel Execution (Advanced)

For independent plans that can run simultaneously:

```
/plan-parallel dev/plans/feature-a dev/plans/feature-b
```

Uses git worktrees to execute multiple plans in parallel sessions.

## How Verification Works

### Hooks

The plugin registers hooks for `Stop` and `SubagentStop` events:

```json
{
  "hooks": {
    "Stop": [{ "command": "bun run verification/verify-stop.ts" }],
    "SubagentStop": [{ "command": "bun run verification/verify-subagent.ts" }]
  }
}
```

### Quality Gates

Before a feature is marked complete, ALL must pass:

| Gate | Check |
|------|-------|
| Verification command | Feature-specific check exits 0 |
| Tests | `bun test` passes |
| Build | `bun run build` succeeds |
| Commit | Changes committed with feature ID |
| Clean | No uncommitted changes |

### Exit Codes

| Code | Meaning | Result |
|------|---------|--------|
| 0 | All gates pass | Completion allowed |
| 1 | Error occurred | Error reported |
| 2 | Gate failed | **Blocked** - must fix and retry |

## Configuration

### Project Files

These files are created in your project during planning:

| File | Purpose |
|------|---------|
| `dev/plans/<name>/.beads` | Beads epic ID |
| `dev/plans/<name>/.devops` | Azure DevOps Story ID (optional) |
| `dev/plans/<name>/.planconfig` | PR creation overrides (optional) |

### Azure DevOps Integration

To sync with Azure DevOps boards, create `.devops`:

```
STORY_ID=12345
ORG=myorg
PROJECT=MyProject
```

## Crash Recovery

The system is fully idempotent. If interrupted:

```bash
/plan-orchestrate dev/plans/my-feature/  # Just re-run
```

State reconciliation will:
- Skip completed features
- Reset interrupted features
- Continue from where it left off

## License

MIT
