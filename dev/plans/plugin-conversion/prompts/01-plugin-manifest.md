# Feature: F001 - Create plugin manifest and package.json

## Context

See `context.md` for project background and architecture.

## Prior Work

This is the first feature - no prior work.

## Objective

Create the foundational plugin configuration files that define the planning-system as an installable Claude Code plugin.

> **Scope Constraint**: It is unacceptable to implement features beyond this task's scope. Complete ONLY this feature.

## Relevant Decisions

From `decisions.md`:
- **D01**: Keep Beads as required dependency — Plugin manifest must declare Beads (bd) as required
- **D02**: Move verification/ to plugin root — Plugin structure has verification at root level
- **D05**: Single plugin vs multiple skills — Keep as single plugin with tightly integrated components

## Edge Cases

From `edge-cases.md`:
- **EC02**: Bun not available on user system → Plugin manifest declares dependency with clear error message
- **EC03**: Beads (bd) not available → Plugin manifest declares dependency with clear error message

## Files to Create/Modify

| File | Purpose |
|------|---------|
| `.claude-plugin/plugin.json` | CREATE - Plugin manifest with metadata, commands, hooks, dependencies |
| `package.json` | CREATE - Root package.json for npm/plugin distribution |

## Implementation Details

### plugin.json Structure

```json
{
  "name": "planning-system",
  "version": "1.0.0",
  "description": "Planning and execution system for Claude Code with mechanical enforcement",
  "author": "Your Name",
  "repository": "https://github.com/yourname/planning-system",
  "commands": [
    {"name": "plan-new", "file": "commands/plan-new.md"},
    {"name": "plan-optimize", "file": "commands/plan-optimize.md"},
    {"name": "plan-orchestrate", "file": "commands/plan-orchestrate.md"},
    {"name": "plan-parallel", "file": "commands/plan-parallel.md"}
  ],
  "hooks": {
    "file": "hooks/hooks.json"
  },
  "skills": [
    {"name": "planning", "path": "skills/planning"}
  ],
  "dependencies": {
    "runtime": ["bun"],
    "cli": ["bd", "git"]
  }
}
```

### package.json Structure

Standard npm package.json with:
- Name: `@yourname/planning-system`
- Type: `module`
- Scripts for verification (`build`, `test`)
- DevDependencies for TypeScript and Bun types

## Acceptance Criteria

- [ ] `.claude-plugin/plugin.json` exists with valid JSON
- [ ] plugin.json contains all 4 commands
- [ ] plugin.json declares bun and bd as dependencies
- [ ] `package.json` exists at root
- [ ] package.json has valid structure

## Verification

```bash
test -f .claude-plugin/plugin.json && test -f package.json && cat .claude-plugin/plugin.json | jq . > /dev/null
```

Run this command. Only claim completion if it succeeds.

## Commit

```bash
git add .claude-plugin/plugin.json package.json
git commit -m "feat(plugin): create plugin manifest and package.json

Implements: F001
Decisions: D01, D02, D05"
```

## Next

After verification passes, this feature is complete. The orchestrator will proceed to F002: Create path resolution helper.
