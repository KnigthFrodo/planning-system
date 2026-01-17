---
description: Decompose a plan into features and Beads tasks
argument-hint: "<epic-id|feature-id>"
---

# Optimize Plan

Transform a plan (epic or feature) into executable work items with Beads.

## Before Starting

Read `${CLAUDE_PLUGIN_ROOT}/skills/planning/SKILL.md` for system overview.

## Input

- Item ID: $ARGUMENTS (e.g., `my-feature-abc`)
- Plan content: Retrieved from item description

## Modes

This command is **type-aware** and behaves differently based on the input:

### Epic Optimization
When `$ARGUMENTS` is an **epic**:
- Creates tasks directly under the epic
- Generates supporting files in `dev/plans/<name>/`
- Each task contains full executable prompt

### Feature Optimization
When `$ARGUMENTS` is a **feature**:
- Creates tasks under the feature (not the parent epic)
- Reuses supporting files from parent epic if available
- Each task references the feature context

## Workflow

1. **Load item and detect type**: Fetch with `bd show <id>`, determine if epic or feature

2. **Load workflow details**: Read `${CLAUDE_PLUGIN_ROOT}/skills/planning/workflows/2-optimization.md`

3. **Follow the type-appropriate workflow**:
   - **If epic**: Create plan directory, supporting files, decompose into tasks
   - **If feature**: Reuse or create supporting files, decompose into tasks under feature

4. **Create Beads tasks with prompts**:
   - Full executable prompt in each task description
   - Dependencies between tasks via `bd dep add`

5. **Update item with execution guide**: Append README content to description

6. **Verify output**: All files created, Beads tasks exist with prompts

## Constraints

- One objective per Beads task
- Each task description contains full executable prompt
- Include supporting files path at top of each prompt
- Use `bd dep add` to establish task dependencies

## Output

**Files in `dev/plans/<name>/`:**
- `context.md` - Project background
- `constraints.md` - Global rules
- `decisions.md` - Architectural decisions
- `edge-cases.md` - Edge case catalog
- `testing-strategy.md` - Testing approach

**Beads:**
- Tasks under epic or feature with full prompts in descriptions
- Dependencies between tasks
- Item description updated with execution guide

## Next

User runs `bd ready` to find available work, then executes tasks one at a time.
