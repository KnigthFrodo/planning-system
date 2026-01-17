# Reflect Patterns Reference

This document details how the reflection system learns from conversations and persists preferences.

## Learning Flow

```
Conversation → Reflect Agent → Learnings → User Approval → Skill File → Git Commit
                  ↑                              ↓
           (AI analysis)                  (Persistence)
                                               ↓
                                    Session Start ← Skill Loading
```

## Confidence Level Signals

### High Confidence (Explicit Corrections)

Strong signals that indicate definite preferences:

| Pattern | Example |
|---------|---------|
| "Never" / "Don't ever" | "Never use var in JavaScript" |
| "Always" / "Make sure to" | "Always use async/await over .then()" |
| "Stop doing" | "Stop adding semicolons in Go code" |
| Direct corrections | "That's wrong, use PascalCase for components" |

### Medium Confidence (Success Patterns)

Moderate signals from approved approaches:

| Pattern | Example |
|---------|---------|
| Explicit approval | "Yes, that looks good" |
| Problem solved | User confirms issue resolved |
| Satisfaction expression | "Perfect, that's what I wanted" |

### Low Confidence (Observations)

Weak signals that may indicate preferences:

| Pattern | Example |
|---------|---------|
| Implicit style | User's code style in messages |
| Unconfirmed patterns | Approach not rejected but not confirmed |
| Inferred preference | Context suggests preference |

## Learned Preferences Format

Appended to skill files as markdown:

```markdown
## Learned Preferences

### High Confidence
- **[2026-01-16]** Always use PascalCase for React components
  - _Evidence: "Use PascalCase for React components"_

### Medium Confidence
- **[2026-01-16]** Prefer async/await over .then() chains
  - _Evidence: "looks good" (after showing async/await code)_

### Low Confidence
- **[2026-01-15]** Consider using TypeScript strict mode
  - _Evidence: User's code appeared to use strict typing_
```

## State File Format

`.reflect-state.json` (gitignored):

```json
{
  "enabled": false,
  "lastReflection": "2026-01-16T15:30:00Z",
  "totalLearnings": 12
}
```

| Field | Description |
|-------|-------------|
| `enabled` | Automatic reflection toggle |
| `lastReflection` | ISO timestamp of last reflection |
| `totalLearnings` | Running total of learnings applied |

## File Locations

| File | Purpose |
|------|---------|
| `verification/reflect.ts` | Main CLI script |
| `verification/reflect-hook.ts` | Stop hook for automatic mode |
| `verification/lib/reflect-config.ts` | Toggle state management |
| `verification/lib/reflect-utils.ts` | Skill file and git helpers |
| `verification/lib/reflect-agent.ts` | AI conversation analysis |
| `.reflect-state.json` | Toggle state (gitignored) |
| `.claude/learnings.md` | Default skill file for learnings |

## Troubleshooting

### No learnings detected

- Conversation may lack explicit corrections or success patterns
- Try being more explicit: "Never do X" or "Always use Y"

### Reflection skipped

- Check `ANTHROPIC_API_KEY` is set
- Verify conversation transcript is available
- Run `/reflect status` to check toggle state

### Learnings not taking effect

- Verify `.claude/learnings.md` exists and contains the rules
- Check Claude Code loads the file at session start
- Confirm the skill file is in `.claude/` directory

### Automatic mode not triggering

- Run `/reflect status` to verify enabled
- Automatic mode only applies high-confidence learnings
- If no high-confidence learnings, hook exits silently

### Git commit failed

- Check git is available in PATH
- Verify current directory is a git repository
- Changes are still applied locally even if commit fails
