# Optimization Phase Workflow

Detailed instructions for the `plan:optimize` command.

## Step 1: Load Epic

1. Fetch epic: `bd show <epic-id>`
2. Read plan content from epic description
3. Verify epic is open or in_progress

## Step 2: Create Plan Directory

1. Generate kebab-case name from epic title:
   - "User Authentication" → `user-authentication`
   - "API Rate Limiting" → `api-rate-limiting`

2. Create directory: `dev/plans/<name>/`

## Step 3: Analyze Plan

Extract from the plan:

- Requirements list
- Implementation approach sections
- Files to modify
- Edge cases
- Testing strategy
- Decisions made

## Step 4: Create Supporting Files

Generate these files in `dev/plans/<name>/`:

**context.md** - Project rationale, architecture vision (from plan summary)

**constraints.md** - Global rules:
```markdown
# Global Constraints

- Complete one feature at a time
- Run verification before claiming complete
- Commit after each feature
- Reference feature IDs in commits
```

**decisions.md** - Decision log from plan (ID, decision, rationale)

**edge-cases.md** - Edge cases from plan (ID, case, handling, related features)

**testing-strategy.md** - Testing approach from plan

## Step 5: Decompose into Features

Break the plan into discrete, testable features following progressive disclosure:

**Layer 1 - Foundation**: Types, configuration, constants (no dependencies)
**Layer 2 - Infrastructure**: Core utilities, helpers
**Layer 3 - Core Logic**: Business logic, main functionality
**Layer 4 - Integration**: Wiring, composition
**Layer 5 - Validation**: Tests, E2E verification

Each feature should:

- Have ONE clear objective
- Be completable in a single session
- Have concrete acceptance criteria
- Have a verification command

## Step 6: Create Beads Tasks with Prompts

For each feature, create a task under the epic with the **full prompt in the description**:

```bash
bd create --type=task \
  --parent=<epic-id> \
  --title="F001: <feature-title>" \
  --description="<full-prompt-content>" \
  --silent
```

### Prompt Content Template

Each task description should contain:

```markdown
# Feature: F001 - <Title>

**Supporting files:** `dev/plans/<name>/`

## Context
See `context.md` for project background and architecture.

## Prior Work
Features completed before this one:
- <F00X>: <What it established>

## Objective
<Single, clear statement of what this feature accomplishes>

> **Scope Constraint**: It is unacceptable to implement features beyond this task's scope. Complete ONLY this feature.

## Relevant Decisions
From `decisions.md`:
- **D0X**: <Decision> — <Why it matters here>

## Edge Cases
From `edge-cases.md`:
- **EC0X**: <Case> → <Required handling>

## Files to Create/Modify
| File | Purpose |
|------|---------|
| `path/to/file.ts` | What to create or change |

## Implementation Details
<Specific guidance, patterns to follow, interfaces to implement>

## Acceptance Criteria
- [ ] <Testable requirement 1>
- [ ] <Testable requirement 2>
- [ ] Edge case <EC0X> handled
- [ ] Tests pass: `<test command>`

## Verification
```bash
<verification-command>
```
Run this command. Only claim completion if it succeeds.

## Commit
```bash
git add <files>
git commit -m "feat(<scope>): <description>

Implements: F001"
```
```

Store task IDs for dependency setup.

## Step 7: Set Up Dependencies

Use `bd dep add` to establish dependencies between features:

```bash
# F002 depends on F001 (F001 must complete before F002)
bd dep add <task-id-F002> <task-id-F001>
```

This ensures `bd ready` only shows tasks with no blockers.

## Step 8: Update Epic with README

Update the epic description to append README content:

```bash
bd update <epic-id> --description="<original-plan>

---

## Execution Guide

### Features
| ID | Title | Depends On |
|----|-------|------------|
| F001 | ... | - |
| F002 | ... | F001 |
| F003 | ... | F001, F002 |

### Workflow
\`\`\`bash
bd ready                                    # Find available work
bd show <task-id>                           # Review task (prompt in description)
bd update <task-id> --status=in_progress    # Claim work
# ... do the work ...
bd close <task-id>                          # Complete
\`\`\`

### Supporting Files
Location: \`dev/plans/<name>/\`
- context.md - Project background
- constraints.md - Global rules
- decisions.md - Architectural decisions
- edge-cases.md - Edge case catalog
- testing-strategy.md - Testing approach
"
```

## Step 9: Validate Output

Verify all created:

- [ ] `dev/plans/<name>/` directory exists
- [ ] context.md, constraints.md, decisions.md, edge-cases.md, testing-strategy.md exist
- [ ] Beads tasks created under epic
- [ ] Each task has full prompt in description
- [ ] Dependencies established with `bd dep add`
- [ ] Epic description updated with README content

## Step 10: DevOps Task Creation (Optional)

If DevOps integration is needed:

```bash
bun run --cwd ${CLAUDE_PLUGIN_ROOT}/verification sync-devops.ts <epic-id> --create-tasks
```

## Complete

The plan is now optimized. User can begin execution with `bd ready`.
