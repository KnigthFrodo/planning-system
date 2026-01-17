---
description: Analyze conversation for patterns and corrections to persist as learned preferences
argument-hint: "[on|off|status|<transcript-path>]"
---

# Reflect Command

Analyze conversations to extract learnings that become persistent preferences for future sessions.

## Usage

| Command | Purpose |
|---------|---------|
| `/reflect` | Analyze current conversation (requires transcript) |
| `/reflect on` | Enable automatic reflection at session end |
| `/reflect off` | Disable automatic reflection |
| `/reflect status` | Show reflection state and statistics |

## Execution

Run the reflect script with any provided arguments:

```bash
bun run ${CLAUDE_PLUGIN_ROOT}/verification/reflect.ts $ARGUMENTS
```

For manual analysis without arguments, set `CLAUDE_TRANSCRIPT` environment variable to the conversation content.

## How It Works

1. **Detection**: AI analyzes conversation for corrections and successful patterns
2. **Classification**: Learnings categorized as high/medium/low confidence
3. **Approval**: User reviews proposed changes before applying
4. **Persistence**: Learnings appended to `.claude/learnings.md` (or target skill file)
5. **Loading**: Claude Code automatically loads `.claude/*.md` at session start

This is why "correct once, never again" works - corrections become persistent rules.

## Confidence Levels

| Level | Signals | Examples |
|-------|---------|----------|
| High | Explicit corrections, imperative language | "Never use var", "Always use async/await" |
| Medium | Approved approaches, successful patterns | User said "looks good" after a change |
| Low | Implicit preferences, observations | Inferred style preferences |

## Automatic Mode

When enabled (`/reflect on`), the Stop hook runs reflection automatically:
- Only applies **high-confidence** learnings
- Still prompts for user approval
- Skips silently if no high-confidence learnings detected

## Reference

For detailed documentation on reflection patterns, see:
`${CLAUDE_PLUGIN_ROOT}/skills/planning/reference/reflect-patterns.md`
