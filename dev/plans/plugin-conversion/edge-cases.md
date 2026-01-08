# Edge Cases

Known edge cases and their handling strategies.

## EC01: `${CLAUDE_PLUGIN_ROOT}` Not Expanding in Hooks

**Case**: The `${CLAUDE_PLUGIN_ROOT}` variable might not expand in hook commands.

**Detection**: Hook fails to find verification script.

**Handling**:
- Verification scripts use `paths.ts` helper with `process.env.CLAUDE_PLUGIN_ROOT`
- Helper falls back to relative path calculation for development mode
- Test hooks early in integration testing (F008)

**Related Features**: F002, F004, F008

---

## EC02: Bun Not Available on User System

**Case**: User tries to install plugin but Bun is not installed.

**Detection**: Hook commands fail with "bun: command not found".

**Handling**:
- Plugin manifest declares Bun as dependency
- Clear error message with installation URL: https://bun.sh
- README documents prerequisite

**Related Features**: F001, F007

---

## EC03: Beads (bd) Not Available

**Case**: User tries to use planning commands but Beads CLI is not installed.

**Detection**: Commands fail with "bd: command not found".

**Handling**:
- Plugin manifest declares Beads as dependency
- Clear error message with installation instructions
- README documents prerequisite

**Related Features**: F001, F007

---

## EC04: Windows Path Separators

**Case**: Paths use `/` but Windows expects `\`.

**Detection**: File not found errors on Windows.

**Handling**:
- Use `path.join()` in all TypeScript code
- Test on Windows during integration testing
- `${CLAUDE_PLUGIN_ROOT}` should handle separator automatically

**Related Features**: F002, F003, F006

---

## EC05: Plugin Installed vs Cloned Locally

**Case**: Plugin behaves differently when installed from registry vs cloned and installed locally.

**Detection**: Paths resolve differently, CLAUDE_PLUGIN_ROOT may or may not be set.

**Handling**:
- `paths.ts` helper detects environment:
  - If `CLAUDE_PLUGIN_ROOT` set → use it
  - If not set → calculate from script location
- Test both modes in F008

**Related Features**: F002, F007, F008
