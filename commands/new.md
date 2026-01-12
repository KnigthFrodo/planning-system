---
description: Enter planning mode to discuss and create a new feature plan
---

# New Feature Plan

Enter planning mode to collaboratively design a new feature.

## Before Starting

Read `${CLAUDE_PLUGIN_ROOT}/skills/planning/SKILL.md` for system overview.

## Workflow

1. **Enter planning mode** using EnterPlanMode tool

2. **Load workflow details**: Read `${CLAUDE_PLUGIN_ROOT}/skills/planning/workflows/1-planning.md`

3. **Follow the workflow** - gather requirements, design approach, resolve questions

4. **Write the plan** to Claude Code's plan file (system-managed location)

5. **Create Beads epic** with full plan content in description:
   ```bash
   bd create --type=epic --title="<title>" --description="<full plan content>" --silent
   ```
   Note: Store the entire plan in the epic description for persistence and collaboration.

6. **Capture DevOps Story ID** (optional) - ask user, link to epic if provided

7. **Exit planning mode** using ExitPlanMode tool

## Constraints

- Use Claude Code's plan file location (do not create dev/plans/ directory)
- No implementation - planning only
- All technical questions resolved before exit
- Beads epic created with full plan content before exit

## Output

- Claude Code plan file - The plan document (system-managed)
- Beads epic - Contains full plan in description, serves as source of truth

## Next

User runs `plan:optimize <epic-id>` with the Beads epic ID
