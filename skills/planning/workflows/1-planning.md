# Planning Phase Workflow

Detailed instructions for the `plan:new` command.

## Step 0: Detect Planning Mode

Before gathering requirements, determine the planning mode:

1. **Check for `--master` flag**: If present → use [Master Planning Workflow](#master-planning-workflow)
2. **Check for feature-id argument**: If `$ARGUMENTS` is a valid Beads feature ID → use [Feature Planning Workflow](#feature-planning-workflow)
3. **Otherwise**: Continue with Standard Planning Workflow below

---

# Standard Planning Workflow

Use this workflow when `plan:new` is called with no arguments.

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

---

# Master Planning Workflow

Use this workflow when `plan:new --master` is called. Creates an epic with features (not tasks) for large initiatives.

## Step 1: Gather High-Level Requirements

Discuss with the user to understand the **initiative scope**:

- **Vision**: What is the end goal of this initiative?
- **Scope**: What major areas of work are involved?
- **Success criteria**: How will we know when it's complete?
- **Constraints**: Timeline, technical, or business limitations

Focus on the big picture. Don't dive into implementation details yet.

## Step 2: Decompose into Features

Break the initiative into **3-7 high-level features**:

- Each feature should represent a coherent slice of functionality
- Features should be roughly estimable in scope
- Features may have dependencies on each other
- Each feature will be planned in detail separately

### Feature Template

For each feature, capture:
- **Title**: Short, descriptive name
- **Description**: 2-3 sentences explaining purpose and scope
- **Dependencies**: Which features must complete first

## Step 3: Write the Master Plan

Write the plan to Claude Code's system-managed plan file. Include:

- Initiative summary
- Success criteria
- Feature breakdown table:
  ```markdown
  | ID | Feature | Description | Depends On |
  |----|---------|-------------|------------|
  | F001 | ... | ... | - |
  | F002 | ... | ... | F001 |
  ```
- High-level decisions and rationale
- Open questions for detailed planning

## Step 4: Create Beads Epic with Features

1. **Create epic**:
   ```bash
   bd create --type=epic \
     --title="<Initiative Name>" \
     --description="<master plan content>" \
     --silent
   ```

2. **Create features under epic**:
   ```bash
   bd create --type=feature \
     --parent=<epic-id> \
     --title="F001: <Feature Name>" \
     --description="<brief feature description - detailed plan comes later>" \
     --silent
   ```

3. **Set up feature dependencies**:
   ```bash
   bd dep add <feature-F002-id> <feature-F001-id>
   ```

Store feature IDs for reference.

## Step 5: DevOps Story (Optional)

Same as standard workflow.

## Pre-Exit Checklist

Before calling ExitPlanMode, verify:

- [ ] All features identified and agreed upon
- [ ] Feature dependencies mapped
- [ ] Plan written to Claude Code plan file
- [ ] Beads epic created with master plan in description
- [ ] All features created under epic with brief descriptions
- [ ] Dependencies established between features

## Exit

Call ExitPlanMode. **STOP** - do not implement anything.

## Next Step

User runs `plan:new <feature-id>` to plan each feature in detail.

---

# Feature Planning Workflow

Use this workflow when `plan:new <feature-id>` is called. Plans a specific feature in detail, optionally creating research tasks first.

## Step 1: Load Feature Context

1. **Fetch the feature**:
   ```bash
   bd show <feature-id>
   ```

2. **Fetch parent epic** (if exists):
   ```bash
   bd show <parent-epic-id>
   ```
   Read the master plan from epic description.

3. **Understand the context**:
   - What is this feature's role in the larger initiative?
   - What features must complete before this one?
   - What features depend on this one?

## Step 2: Offer Research Tasks (Optional)

Ask the user:
> "Would you like to create research tasks before detailed planning? This helps explore implementation options, evaluate libraries, or investigate existing code patterns."

If **yes**:

1. **Identify research areas** with the user:
   - Library/framework evaluation
   - Existing code pattern discovery
   - API design exploration
   - Performance considerations

2. **Create research tasks under the feature**:
   ```bash
   bd create --type=task \
     --parent=<feature-id> \
     --title="Research: <topic>" \
     --description="Explore <topic> to inform feature planning. Document findings and recommendations." \
     --silent
   ```

3. **Pause planning**:
   - Exit plan mode
   - User completes research tasks
   - User returns with `plan:new <feature-id>` to continue

If **no** or research is complete, continue to detailed planning.

## Step 3: Gather Detailed Requirements

Same as standard workflow Step 1, but within the feature's scope:

- **Behavior**: Specific functionality this feature provides
- **Integration**: How it connects to other features and existing code
- **Edge cases**: What could go wrong
- **Acceptance criteria**: How we'll verify it works

## Step 4: Design the Approach

Same as standard workflow Step 2, scoped to this feature.

## Step 5: Write the Detailed Plan

Write the plan to Claude Code's system-managed plan file. Include:

- Feature summary (reference parent epic)
- Detailed requirements
- Implementation approach
- Files to create/modify
- Edge cases and handling
- Testing strategy
- Decisions made and rationale

## Step 6: Update Feature with Detailed Plan

Update the feature's description with the detailed plan:

```bash
bd update <feature-id> --description="<full detailed plan content>"
```

The feature description now serves as the source of truth for this feature's plan.

## Step 7: DevOps Story (Optional)

Same as standard workflow.

## Pre-Exit Checklist

Before calling ExitPlanMode, verify:

- [ ] Research completed (if requested)
- [ ] All technical questions resolved for this feature
- [ ] User approved all design decisions
- [ ] Plan written to Claude Code plan file
- [ ] Feature description updated with detailed plan
- [ ] Research tasks closed (if any were created)

## Exit

Call ExitPlanMode. **STOP** - do not implement anything.

## Next Step

User runs `plan:optimize <feature-id>` to create tasks under this feature.
