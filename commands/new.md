---
description: Enter planning mode to discuss and create a new feature plan
argument-hint: "[feature-id]"
flags:
  - name: master
    description: Create master plan with epic and features (high-level decomposition)
---

# New Feature Plan

Enter planning mode to collaboratively design a new feature.

## Before Starting

Read `${CLAUDE_PLUGIN_ROOT}/skills/planning/SKILL.md` for system overview.

## Modes

This command supports three planning modes:

### 1. Standard Mode (no arguments)
```bash
plan:new
```
Creates a standalone epic with a detailed plan. Use for single features or small initiatives.

### 2. Master Mode (`--master` flag)
```bash
plan:new --master
```
Creates an epic containing **features** (not tasks). Use for large initiatives requiring high-level decomposition. Features are placeholders for detailed planning later.

### 3. Feature Mode (`<feature-id>` argument)
```bash
plan:new <feature-id>
```
Plans a specific existing feature in detail. Offers to create research tasks first for exploring implementation options. Use after master planning to detail individual features.

## Workflow

1. **Detect planning mode**:
   - If `--master` flag present → Master Planning Mode
   - If `$ARGUMENTS` contains a feature-id → Feature Planning Mode
   - Otherwise → Standard Planning Mode

2. **Enter planning mode** using EnterPlanMode tool

3. **Load workflow details**: Read `${CLAUDE_PLUGIN_ROOT}/skills/planning/workflows/1-planning.md`

4. **Follow the appropriate workflow** based on mode detected in step 1

5. **Create or update Beads items**:
   - **Standard mode**: Create epic with full plan in description
   - **Master mode**: Create epic with features as children
   - **Feature mode**: Update feature description with detailed plan

6. **Capture DevOps Story ID** (optional) - ask user, link to epic if provided

7. **Exit planning mode** using ExitPlanMode tool

## Constraints

- Use Claude Code's plan file location (do not create dev/plans/ directory)
- No implementation - planning only
- All technical questions resolved before exit
- Beads items created/updated before exit

## Output

### Standard Mode
- Claude Code plan file - The plan document (system-managed)
- Beads epic - Contains full plan in description

### Master Mode
- Claude Code plan file - High-level decomposition
- Beads epic - Contains master plan
- Beads features - Children of epic with brief descriptions

### Feature Mode
- Claude Code plan file - Detailed feature plan
- Updated Beads feature - Description contains detailed plan
- Optional research tasks - Created under feature if user requested

## Next

- **After standard mode**: `plan:optimize <epic-id>` to create tasks
- **After master mode**: `plan:new <feature-id>` to plan each feature
- **After feature mode**: `plan:optimize <feature-id>` to create tasks
