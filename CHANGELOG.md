# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2026-01-17

### Added
- **Master planning workflow enforcement** - Gate 0 blocks completion when proper planning workflow hasn't been followed
  - Cannot implement Features directly (must run `plan:optimize` first)
  - Cannot implement Epics directly (must run `plan:new` then `plan:optimize`)
  - Tasks under Features require parent Feature to be planned and optimized
  - Bypasses bugs and research tasks (titles starting with "Research:")
- **Nested epic/feature plans** - Support for `plan:new <feature-id>` to plan individual features under a master epic
- **Reflect mechanism** - Automatic conversation reflection on stop hook
  - Analyzes conversation transcripts for insights
  - Configurable toggle for enabling/disabling

### Changed
- Updated documentation for master planning workflow in CLAUDE.md and README.md
- Quality gates now numbered 0-7 with workflow compliance as Gate 0

### Fixed
- Use CLAUDE_PROJECT_DIR instead of CLAUDE_PROJECT_ROOT in hooks
- Read transcript from hook stdin instead of env var for reflect

## [0.1.0] - 2026-01-08

### Added
- Initial release of planning-system skill
- Planning, optimization, and orchestration workflows
- Beads integration for state management
- Verification system with hooks
- GitHub Actions release workflow for automated releases
- Version validation and bump scripts
