# Feature: F007 - Update documentation

## Context

See `context.md` for project background and architecture.

## Prior Work

Features completed before this one:
- **F001-F006**: All plugin components are now in place at plugin root level

## Objective

Update README.md and CLAUDE.md to reflect the new plugin structure and provide installation instructions for both installed and development modes.

> **Scope Constraint**: It is unacceptable to implement features beyond this task's scope. Complete ONLY this feature.

## Relevant Decisions

From `decisions.md`:
- **D01**: Keep Beads as required dependency — Document Beads requirement
- **D05**: Single plugin vs multiple skills — Document as single integrated plugin

## Edge Cases

From `edge-cases.md`:
- **EC02**: Bun not available → Document installation requirements
- **EC03**: Beads not available → Document installation requirements
- **EC05**: Plugin installed vs cloned locally → Document both modes

## Files to Create/Modify

| File | Purpose |
|------|---------|
| `README.md` | UPDATE with plugin installation instructions |
| `CLAUDE.md` | UPDATE with plugin-specific guidance |

## Implementation Details

### README.md Updates

Add sections for:

1. **Installation**
```markdown
## Installation

### As Plugin (Recommended)
\`\`\`bash
claude plugin install github.com/yourname/planning-system
\`\`\`

### For Development
\`\`\`bash
git clone https://github.com/yourname/planning-system
cd planning-system
claude plugin install .
\`\`\`
```

2. **Prerequisites**
```markdown
## Prerequisites

- [Bun](https://bun.sh) - JavaScript runtime
- [Beads CLI](https://github.com/steveyegge/beads) - State management
- [Git](https://git-scm.com) - Version control
```

3. **Quick Start**
```markdown
## Quick Start

1. Install the plugin
2. Run `/plan-new` to start planning
3. Run `/plan-optimize <plan.md>` to decompose into features
4. Run `/plan-orchestrate <plan-dir>` to execute
```

### CLAUDE.md Updates

Update to reflect:
- Plugin commands instead of skill commands
- New directory structure
- Plugin root paths

## Acceptance Criteria

- [ ] README.md contains `claude plugin install` instructions
- [ ] README.md documents Bun and Beads prerequisites
- [ ] README.md has quick start guide
- [ ] CLAUDE.md references plugin structure
- [ ] No references to old `.claude/` paths in documentation

## Verification

```bash
grep -q 'claude plugin install' README.md
```

Run this command. Only claim completion if it succeeds.

## Commit

```bash
git add README.md CLAUDE.md
git commit -m "docs: update documentation for plugin installation

Implements: F007
Decisions: D01, D05
Edge cases: EC02, EC03, EC05"
```

## Next

After verification passes, this feature is complete. The orchestrator will proceed to F008: Plugin installation and integration testing.
