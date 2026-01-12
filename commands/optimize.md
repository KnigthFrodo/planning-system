---
description: Decompose a plan into features and Beads tasks
argument-hint: "<epic-id>"
---

# Optimize Plan

Transform a plan epic into executable features with Beads tasks.

## Before Starting

Read `${CLAUDE_PLUGIN_ROOT}/skills/planning/SKILL.md` for system overview.

## Input

- Epic ID: $ARGUMENTS (e.g., `my-feature-abc`)
- Plan content: Retrieved from epic description

## Workflow

1. **Load epic**: Fetch epic with `bd show <epic-id>`, read plan from description

2. **Create plan directory**:
   - Generate kebab-case name from epic title
   - Create `dev/plans/<name>/`

3. **Load workflow details**: Read `${CLAUDE_PLUGIN_ROOT}/skills/planning/workflows/2-optimization.md`

4. **Follow the workflow**:
   - Analyze plan and decompose into features
   - Create supporting files (context.md, constraints.md, etc.)
   - Create Beads tasks with full prompts in description
   - Set up feature dependencies
   - Update epic with README content

5. **Verify output**: All files created, Beads tasks exist with prompts

## Constraints

- One feature per Beads task
- Each task description contains full executable prompt
- Include supporting files path at top of each prompt
- Use `bd dep add` to establish feature dependencies

## Output

**Files in `dev/plans/<name>/`:**
- `context.md` - Project background
- `constraints.md` - Global rules
- `decisions.md` - Architectural decisions
- `edge-cases.md` - Edge case catalog
- `testing-strategy.md` - Testing approach

**Beads:**
- Tasks under epic with full prompts in descriptions
- Dependencies between tasks
- Epic description updated with README content

## Next

User runs `bd ready` to find available work, then executes tasks one at a time.
