# Decision Log

Architectural decisions made during planning.

## D01: Keep Beads as Required Dependency

**Decision**: Beads (bd CLI) remains a required dependency, not optional.

**Rationale**: Beads provides crash recovery, state management, and epic/task tracking that are core to the system's reliability. Making it optional would require extensive fallback code and reduce system reliability.

**Impact**: Plugin manifest must declare Beads dependency. Installation fails gracefully with clear error if Beads not installed.

---

## D02: Move verification/ to Plugin Root

**Decision**: Verification scripts move from `.claude/skills/planning/verification/` to root `verification/`.

**Rationale**:
- Cleaner structure at plugin root
- Avoids deep nesting (4 levels → 1 level)
- Easier path references from hooks
- Consistent with other plugin components (commands, hooks)

**Impact**: All verification script paths in hooks and workflows must be updated.

---

## D03: Use `${CLAUDE_PLUGIN_ROOT}` for All Paths

**Decision**: Every path reference in commands, hooks, and workflows uses `${CLAUDE_PLUGIN_ROOT}`.

**Rationale**:
- Standard Claude Code plugin path variable
- Works in both installed mode (plugin install) and development mode (plugin install .)
- Future-proof for plugin store distribution

**Impact**: All markdown files with path references need updating. Search for `.claude/` pattern.

---

## D04: Create paths.ts Helper for Scripts

**Decision**: TypeScript verification scripts use a `paths.ts` helper for path resolution.

**Rationale**:
- Verification scripts run via Bun, not Claude's template expansion
- `${CLAUDE_PLUGIN_ROOT}` won't expand in TypeScript
- Need fallback for development mode when env var isn't set
- Centralizes path logic in one place

**Impact**: All verification scripts import from `./lib/paths` instead of using string paths.

---

## D05: Single Plugin vs Multiple Skills

**Decision**: Keep as a single integrated plugin, not split into multiple skills.

**Rationale**:
- Components are tightly integrated (commands → skills → verification → hooks)
- Splitting would create dependency management complexity
- Users want the whole system, not pieces
- Easier to version and distribute as one unit

**Impact**: One plugin.json, one installation command, one version number.
