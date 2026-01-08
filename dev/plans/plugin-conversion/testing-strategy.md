# Testing Strategy

## Overview

Testing focuses on verifying the plugin works correctly in both installed and development modes, with emphasis on path resolution and hook execution.

## Test Levels

### 1. Unit Tests (Per Feature)

Each feature has a verification command that runs automatically:

| Feature | Verification Command |
|---------|---------------------|
| F001 | `test -f .claude-plugin/plugin.json && cat .claude-plugin/plugin.json \| jq .` |
| F002 | `bun run verification/lib/paths.ts` |
| F003 | `bun run --cwd verification tsc --noEmit` |
| F004 | `test -f hooks/hooks.json && cat hooks/hooks.json \| jq .` |
| F005 | `test -d commands && ls commands/*.md \| wc -l \| grep -q 4` |
| F006 | `test -d skills/planning && test -f skills/planning/SKILL.md` |
| F007 | `grep -q 'claude plugin install' README.md` |
| F008 | `claude plugin install . && claude /help \| grep -q plan-new` |

### 2. Integration Tests (F008)

Full integration testing covers:

1. **Plugin Installation Test**
   - Install via `claude plugin install .`
   - Verify no errors during installation
   - Verify plugin appears in installed list

2. **Command Registration Test**
   - Run `claude /help`
   - Verify all 4 plan-* commands appear
   - Verify descriptions are correct

3. **Command Execution Test**
   - Run `/plan-new` and verify it can read SKILL.md
   - Run `/plan-optimize` and verify template loading
   - Verify paths resolve correctly

4. **Hook Execution Test**
   - Trigger Stop event
   - Verify `verify-stop.ts` runs
   - Verify exit code 2 blocks completion when tests fail

5. **Development Mode Test**
   - Clone fresh repo
   - Install locally without publishing
   - Verify all paths resolve without `CLAUDE_PLUGIN_ROOT` set

### 3. Manual Testing Checklist

- [ ] Install plugin from local clone
- [ ] Verify `/plan-new` creates plan structure
- [ ] Verify `/plan-optimize` generates manifest
- [ ] Verify `/plan-orchestrate` executes features
- [ ] Verify hooks block completion when tests fail
- [ ] Uninstall and reinstall cleanly

## Test Environments

| Environment | CLAUDE_PLUGIN_ROOT | Test Focus |
|-------------|-------------------|------------|
| Installed (registry) | Set by Claude | Path variable expansion |
| Installed (local) | Set by Claude | Same as registry |
| Development (cloned) | Not set | Fallback path resolution |

## Acceptance Criteria for Release

1. All feature verification commands pass
2. Plugin installs without errors
3. All 4 commands work correctly
4. Hooks trigger and can block completion
5. Works on Windows (path separators)
6. Works in development mode (no env var)
