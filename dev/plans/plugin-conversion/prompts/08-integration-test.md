# Feature: F008 - Plugin installation and integration testing

## Context

See `context.md` for project background and architecture.

## Prior Work

Features completed before this one:
- **F001-F007**: All plugin components and documentation are complete

## Objective

Install the plugin locally and verify all commands, hooks, and paths work correctly in both installed and development modes.

> **Scope Constraint**: It is unacceptable to implement features beyond this task's scope. Complete ONLY this feature.

## Relevant Decisions

From `decisions.md`:
- All decisions should be validated through testing

## Edge Cases

From `edge-cases.md`:
- **EC01**: `${CLAUDE_PLUGIN_ROOT}` not expanding → Verify hooks work
- **EC02**: Bun not available → Error message should be clear
- **EC03**: Beads not available → Error message should be clear
- **EC04**: Windows path separators → Test on Windows if possible
- **EC05**: Plugin installed vs cloned locally → Test both modes

## Files to Create/Modify

| File | Purpose |
|------|---------|
| (none) | This is a testing/validation feature |

## Implementation Details

### Test Sequence

1. **Plugin Installation Test**
   ```bash
   # From plugin root
   claude plugin install .
   ```
   - Verify no errors during installation

2. **Command Registration Test**
   ```bash
   claude /help
   ```
   - Verify `plan-new`, `plan-optimize`, `plan-orchestrate`, `plan-parallel` appear

3. **Command Execution Test**
   ```bash
   # Test that commands can read skill files
   claude /plan-new --dry-run  # If dry-run supported
   ```
   - Or manually invoke and verify SKILL.md is readable

4. **Hook Registration Test**
   - Verify hooks appear in Claude's hook list (if inspectable)
   - Or trigger a Stop event and verify script runs

5. **Path Resolution Test**
   ```bash
   # Verify paths.ts works
   bun run verification/lib/paths.ts
   ```

6. **Cleanup Old Structure**
   After all tests pass, remove the old `.claude/` structure:
   ```bash
   rm -rf .claude/commands .claude/skills .claude/hooks.json
   ```
   Keep any other `.claude/` files that aren't part of the plugin.

### Expected Outcomes

| Test | Expected Result |
|------|-----------------|
| Plugin install | Succeeds without errors |
| /help output | Shows all 4 plan-* commands |
| /plan-new | Can read SKILL.md from plugin root |
| Hook trigger | verify-stop.ts executes |
| paths.ts | Returns valid plugin root path |

## Acceptance Criteria

- [ ] `claude plugin install .` succeeds
- [ ] All 4 commands appear in `/help`
- [ ] `/plan-new` can access skill files
- [ ] Hooks are registered (verify-stop.ts, verify-subagent.ts)
- [ ] Old `.claude/` plugin files removed
- [ ] Plugin works in fresh clone (development mode)

## Verification

```bash
claude plugin install . && claude /help | grep -q plan-new
```

Run this command. Only claim completion if it succeeds.

## Commit

```bash
git add -A
git commit -m "feat(plugin): complete plugin conversion and cleanup

Implements: F008
Validates: EC01, EC02, EC03, EC04, EC05

BREAKING CHANGE: Plugin now installs from root, not .claude/"
```

## Next

After verification passes, the plugin conversion is complete. Create a PR with:
- Summary of changes
- Installation instructions
- Migration guide for existing users
