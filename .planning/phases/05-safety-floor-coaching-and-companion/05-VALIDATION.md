---
phase: 05
slug: safety-floor-coaching-and-companion
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-08-03
---

# Phase 05 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Extracted from
> `05-RESEARCH.md`'s Validation Architecture section (this gsd-core version does not emit this
> file automatically — see STATE.md for the note).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None detected. Vitest 4.1+ with `@cloudflare/vitest-pool-workers` for Worker-side logic, plus Vitest + a DOM testing library for React components |
| **Config file** | none — see Wave 0 |
| **Quick run command** | `npx vitest run --project workers` (Worker-side) / `npx vitest run --project client` (UI) |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** `npx vitest run` scoped to the changed area
- **After every plan wave:** full `npx vitest run`
- **Before `/gsd:verify-work`:** full suite green, plus the COMP-02 adversarial regression suite green, plus the REG-03 sign-off artifact present
- **Max feedback latency:** ~30 seconds

---

## Per-Task Verification Map

| Req ID | Behavior | Test Type | Automated Command | File Exists |
|--------|----------|-----------|-------------------|-------------|
| SAFE-01 | PHQ-2/GAD-2 scoring and cadence trigger | unit | `vitest run tests/screening/scoring.test.ts` | ❌ Wave 0 |
| SAFE-02 | Crisis screen renders exact fixed text; never imports Worker/Gemini client | unit + import-graph audit | `vitest run tests/crisis/fixed-copy.test.ts` (snapshot) + import-graph lint confirming zero import edge to any Worker/Gemini module | ❌ Wave 0 |
| SAFE-03 | Crisis resource path renders with no auth/rate-limit gate | integration | `vitest run tests/crisis/no-gate.test.ts` (logged-out state) + deploy-config check | ❌ Wave 0 |
| SAFE-04 | ED-screen-positive suppresses food-tracking depth | unit | `vitest run tests/coaching/ed-gate.test.ts` | ❌ Wave 0 |
| SAFE-05 | Safety-net item positive → crisis screen + count-only D1 event + 24h nudge scheduled | unit + integration | `vitest run tests/screening/escalation.test.ts` | ❌ Wave 0 |
| COACH-01 | 1-2 micro-actions/day selected from curated set | unit | `vitest run tests/coaching/daily-selection.test.ts` | ❌ Wave 0 |
| COACH-02 | Every micro-action card has non-null evidence grade + review date | unit (schema/content audit) | `vitest run tests/content/evidence-grade-schema.test.ts` | ❌ Wave 0 |
| COACH-03 | Food-log data model has no calorie/macro field | static audit | `vitest run tests/coaching/no-calorie-field.test.ts` | ❌ Wave 0 |
| COACH-04 | Movement summary never includes a calories-burned field | unit | `vitest run tests/coaching/movement-summary.test.ts` | ❌ Wave 0 |
| COACH-05 | Weight field hidden unless opt-in permission granted | unit + UI | `vitest run tests/coaching/weight-optin.test.ts` | ❌ Wave 0 |
| COMP-01 | Companion answer includes ≥1 resolvable citation | integration | `vitest run tests/companion/citation.test.ts` | ❌ Wave 0 |
| COMP-02 | Adversarial rephrasing regression suite — 100% hard-routed away from the model | integration (regression suite, grown on every guardrail change) | `vitest run tests/companion/guardrail-adversarial.test.ts` | ❌ Wave 0 — the single most safety-critical test in this phase |
| COMP-03 | Below-similarity-threshold query routes to fixed fallback text | unit | `vitest run tests/companion/out-of-scope.test.ts` | ❌ Wave 0 |
| SKIN-01 | No beauty/symmetry/comparison/collage component exists anywhere in the codebase | static audit (absence test) | `rg -i "symmetry\|attractiveness.{0,10}score\|before.{0,3}after" src/` returning zero matches, wired into CI | ❌ Wave 0 |
| REG-03 | Signed, dated clinician + mental-health-professional sign-off artifact exists before release tag | manual-only (process gate) | Checked-in sign-off record (`SIGNOFF.md`) verified present by a release-checklist step | N/A — process artifact |

*Status: ⬜ pending for all rows — no code exists yet at plan time.*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` with a Workers project (`@cloudflare/vitest-pool-workers`) and a client/DOM project — install `npm install -D vitest @cloudflare/vitest-pool-workers`
- [ ] `tests/companion/guardrail-adversarial.test.ts` — seed with rephrasings already identified in research ("hypothetically...", "guess my risk...")
- [ ] `tests/crisis/fixed-copy.test.ts` and an import-graph check — this phase's highest-stakes property, no existing infrastructure covers it
- [ ] Curated evidence-graded content dataset (COACH-02) needs its schema defined before a schema-audit test can run against it

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Clinician + mental-health-professional sign-off | REG-03 | Governance decision, not a testable code property | Real human review against `SIGNOFF.md`, before any release tag |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
