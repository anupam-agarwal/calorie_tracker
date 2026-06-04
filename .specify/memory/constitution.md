<!-- 
Sync Impact Report v1.0.0:
- New constitution initialized from template
- 4 Core Principles added: Code Quality, Testing Standards, UX Consistency, Performance
- 2 Additional Sections: Quality Standards, Development Workflow
- Version: 0.0.0 → 1.0.0 (MINOR: Initial principle definitions)
- Ratification Date: 2026-06-04
- Templates requiring review: plan-template.md, spec-template.md, tasks-template.md
-->

# Calorie Tracker Constitution

## Core Principles

### Code Quality (NON-NEGOTIABLE)

All code must prioritize maintainability, readability, and adherence to language-specific best practices.

**Rules**:
- Every module must have a single, clear responsibility
- All public APIs and complex logic require inline documentation
- Naming conventions must be consistent and self-documenting (avoid abbreviations unless domain-standard)
- Code complexity must be justified; excessive nesting/branching requires refactoring
- All legacy code flagged for refactoring during feature work; tech debt must be tracked in commit messages

**Rationale**: Readable, well-structured code reduces bugs, accelerates onboarding, and lowers maintenance burden.

### Testing Standards (NON-NEGOTIABLE)

Test-first development is mandatory; all features and fixes require automated validation before merge.

**Rules**:
- Unit tests: Minimum 80% coverage for business logic; TDD cycle enforced (Red → Green → Refactor)
- Integration tests: Required for new feature contracts, API changes, and cross-module data flows
- End-to-end tests: Mandatory for user-facing workflows; regression suite must pass on every PR
- Type checking: Strict mode enabled; no `any` types without documented exception
- Test naming: Must describe behavior, not implementation; `test_should_*` format preferred

**Rationale**: Automated tests catch regressions early, provide living documentation, and enable safe refactoring.

### User Experience Consistency (NON-NEGOTIABLE)

All interfaces—CLI, API, UI—must follow established patterns to minimize cognitive load and maximize usability.

**Rules**:
- UI/API responses must follow a consistent schema (e.g., standardized error structures, field naming)
- All text-facing features must support localization placeholders; messages must be human-readable and actionable
- CLI commands must follow Unix conventions: clear flags, help text, sensible exit codes
- Accessibility baseline: WCAG 2.1 AA compliance for any visual interface
- Breaking changes require deprecation warnings in ≥1 release before removal

**Rationale**: Consistency reduces user friction, minimizes support burden, and builds confidence in the product.

### Performance Requirements (NON-NEGOTIABLE)

All code must meet defined performance targets; degradation must be tracked and justified.

**Rules**:
- Core operations must complete within SLA (e.g., API responses <200ms, UI renders <16ms for 60fps)
- Memory usage must not grow unbounded; leak detection required in CI for long-running services
- Database queries must be indexed and optimized; N+1 queries forbidden
- Bundle size and load time must be monitored; increases >10% require justification
- Performance regression tests required for critical paths

**Rationale**: Poor performance degrades user trust and increases operational costs; measurable targets enforce accountability.

## Quality Standards

All pull requests must pass the following gates before merge:

- **Automated Tests**: 100% pass rate on unit, integration, and e2e suites
- **Code Review**: At least one approver; review must verify principle compliance
- **Linting & Formatting**: Zero warnings; auto-formatters must be applied
- **Type Safety**: No type errors; linting rules fully satisfied
- **Performance**: No regression detected; new features profiled against SLA

## Development Workflow

1. **Pre-Implementation**: Clarify requirements; identify testing strategy and performance targets upfront
2. **Red-Green-Refactor**: Write failing tests → implement → pass tests → clean up code
3. **Code Review**: Submit PR with clear description of changes and principle alignment; address feedback iteratively
4. **Merge & Monitor**: Merge to main after approval; monitor metrics for 24 hours; revert if regression detected

## Governance

This constitution supersedes all other practices and is binding on all contributors.

**Amendment Process**:
- Amendments require documented rationale and approval from project leadership
- All PRs must verify compliance with current principles
- Principle violations may block merge; exceptions require explicit written justification
- Quarterly review of metrics to assess principle effectiveness

**Compliance Verification**:
- CI/CD pipeline enforces automated checks (tests, linting, type safety)
- Code review process validates adherence to manual principles (naming, documentation, design)
- Regular audits identify drift; backlog items created for non-compliant code

**Version**: 1.0.0 | **Ratified**: 2026-06-04 | **Last Amended**: 2026-06-04
