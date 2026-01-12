# Planning Phase Workflow

Detailed instructions for the `plan:new` command.

## Step 1: Gather Requirements

Discuss with the user to understand:

- **Problem**: What they want to solve
- **Behavior**: Desired functionality
- **Constraints**: Technical or business limitations
- **Integration**: How it connects to existing code

### Research Approach

Research the codebase yourself to answer technical questions. Use:

- `Read` tool to examine existing patterns
- `Glob` to find related files
- `Grep` to search for usage patterns
- `WebSearch` for external library documentation

When multiple valid approaches exist, present options with pros/cons. Only ask the user questions requiring their decision.

## Step 2: Design the Approach

1. **Explore codebase** - Identify patterns to follow
2. **List files** - What needs creation/modification
3. **Consider edge cases** - What could go wrong
4. **Draft approach** - Technical implementation strategy

## Step 3: Write the Plan

Write the plan to Claude Code's system-managed plan file. Include:

- Summary of the feature
- Requirements from discussion
- Implementation approach
- Files to create/modify
- Edge cases and handling
- Testing strategy
- Decisions made and rationale

**Exclude**: Time estimates, effort sizing, approval workflows.

## Step 4: Create Beads Epic

Create a Beads epic with the **full plan content** in the description:

```bash
bd create --type=epic \
  --title="<Short descriptive title>" \
  --description="<Full plan content from step 3>" \
  --silent
```

The epic description serves as the source of truth for the plan. This enables:
- Collaboration (others can see the plan via `bd show <epic-id>`)
- Persistence (survives session resets)
- Decomposition (`plan:optimize` reads plan from epic)

## Step 5: DevOps Story (Optional)

Ask: "Do you have an Azure DevOps Story ID for this work? (Enter to skip)"

If provided, link the story to the epic using `bd update` or note the association.

## Pre-Exit Checklist

Before calling ExitPlanMode, verify:

- [ ] All technical questions resolved
- [ ] User approved all design decisions
- [ ] Plan written to Claude Code plan file
- [ ] Beads epic created with full plan in description
- [ ] DevOps story linked (if provided)

## Exit

Call ExitPlanMode. **STOP** - do not implement anything.

## Next Step

User runs `plan:optimize <epic-id>` to decompose into features.
