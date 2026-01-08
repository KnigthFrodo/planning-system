# Global Constraints

These constraints apply to ALL features in this plan.

## Execution Rules

- **One feature per session**: Complete exactly one feature before stopping
- **Run verification before claiming complete**: Every feature has a verification command
- **Commit after each feature**: Each feature ends with a git commit
- **Reference decision IDs in commits**: Link commits to architectural decisions

## Path Rules

- **Use `${CLAUDE_PLUGIN_ROOT}`**: All paths in commands and hooks must use this variable
- **Use `path.join()` in scripts**: Never concatenate paths with `/` or `\`
- **Test on Windows**: Paths must work on Windows

## Code Quality

- **No hardcoded paths**: Everything relative to plugin root
- **Preserve existing functionality**: Plugin must work exactly as before
- **Clear error messages**: When dependencies missing, tell user how to install

## Scope Control

- **Do not add features**: Only convert existing functionality
- **Do not refactor**: Move files, don't improve them
- **Do not optimize**: Conversion first, optimization never (unless explicitly requested)

## Dependency Management

- **Beads is required**: Do not make it optional
- **Bun is required**: Do not add Node.js fallback
- **Git is required**: Do not support other VCS
