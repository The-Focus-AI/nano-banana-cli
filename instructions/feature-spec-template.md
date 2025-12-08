---
name: feature-name
status: open|blocked|inprogress|completed|stale
completed: YYYY-MM-DD-HH-MM
updated: YYY-MM-DD-HH-MM
depends:
  - base-feature
---

# Overview

 Simple, 1-2 sentence description of what this feature enables.

# Specification

<!-- Structured human language that's both readable and parseable -->

# Knowledge Required

<!-- use the tech-research agent to create reports as needed -->

- [reports/2025-12-02-mise-best-practices.md]
- [reports/2025-12-02-typescript-projects-with-bun.md]

# Context Requirements

- [ ] Understanding of [domain concept]
- [ ] Access to [data/system]
- [ ] Integration with [existing feature]

### Success Metrics
- **Functional Correctness**: [How to measure]
  - Tests pass: `[test command]`
  - Coverage: `>= X%`
- **Spec Adherence**: [How to verify]
  - Requirements met: `X/Y`
  - Properties validated: `[test command]`
- **Quality Gates**: [Standards to meet]
  - No security issues
  - Performance within bounds

### Validation Commands

```bash
bun test src/model-management.test.ts    # 35 tests covering all specifications
mise run test                           # All tests pass
mise run typecheck                      # TypeScript validates

# CLI testing
mise run models                         # List all available models
mise run models --free                  # Show only free tier models
mise run models --foundation            # Show foundation models (exclude reasoning)
mise run models --fast                  # Show fastest models
mise run models --capable               # Show most capable models
```
