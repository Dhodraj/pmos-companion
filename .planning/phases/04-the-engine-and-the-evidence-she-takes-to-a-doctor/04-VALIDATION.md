---
phase: 04
slug: the-engine-and-the-evidence-she-takes-to-a-doctor
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-08-03
---

# Phase 04 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Extracted from
> `04-RESEARCH.md`'s Validation Architecture section (this gsd-core version does not emit this
> file automatically — see STATE.md for the note).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None detected. **Vitest 4.1.10 recommended** — Vite-native, Jest-compatible, pairs with the existing Vite+TS+React stack [VERIFIED: npm registry] |
| **Config file** | none — Wave 0 gap |
| **Quick run command** | `npx vitest run src/engine` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate

- **After every task commit:** `npx vitest run <changed-file-glob>`
- **After every plan wave:** `npx vitest run` (full suite)
- **Before `/gsd:verify-work`:** full suite green
- **Max feedback latency:** ~20 seconds

---

## Per-Task Verification Map

| Req ID | Behavior | Test Type | Automated Command | File Exists |
|--------|----------|-----------|-------------------|-------------|
| NOF1-01 | Per-phase baseline uses only this user's own phase-tagged data, never population norms | unit | `npx vitest run src/engine/__tests__/baseline.test.ts` | ❌ Wave 0 |
| NOF1-02 | A planted lag is recovered within tolerance; a deliberately null pair is correctly suppressed | unit | `npx vitest run src/engine/__tests__/lag-correlation.test.ts` | ❌ Wave 0 |
| NOF1-03 | n below the floor (or FDR-unadjusted-significant) yields `status: "still-learning"`, never a surfaced pattern | unit | `npx vitest run src/engine/__tests__/confidence-gate.test.ts` | ❌ Wave 0 |
| NOF1-04 | A surfaced finding always carries `observations` + `strength`; phrased or template-fallback sentence always echoes both | unit | `npx vitest run src/engine/__tests__/phrasing.test.ts` | ❌ Wave 0 |
| NOF1-05 | ≥1 reveal per active user per week once sufficient data exists | manual/monitoring | N/A — cross-references PRD's NFR-904 | manual-only, justified: population-level cadence observable only over real usage time |
| DOC-01 | PDF generation completes in ≤10s for an 18-month synthetic dataset | perf/smoke | `npx vitest run src/export/__tests__/pdf-perf.test.ts` (assert elapsed < 10000ms) | ❌ Wave 0 |
| DOC-02 | Compiled export payload contains symptom timeline, cycle history, medication log, guideline-cited tests | unit | `npx vitest run src/export/__tests__/compile-export-payload.test.ts` | ❌ Wave 0 |
| DOC-03 | Exactly "fasting insulin, free testosterone, DHEAS, 75g OGTT, AMH" appear verbatim when guideline conditions trigger [VERIFIED: REQUIREMENTS.md:133-134] | unit | `npx vitest run src/export/__tests__/named-tests.test.ts` | ❌ Wave 0 |
| DOC-04 | Every app-derived value's render includes the wellness-trend disclaimer | unit | `npx vitest run src/export/__tests__/wellness-trend-labels.test.ts` | ❌ Wave 0 |

*Status: ⬜ pending for all rows — no code exists yet at plan time.*

---

## Wave 0 Requirements

- [ ] Install Vitest + `happy-dom` + `@testing-library/react`
- [ ] `vitest.config.ts` — none exists
- [ ] `src/engine/__tests__/fixtures/` — synthetic planted-lag + null-pair series; reuse/extend Phase 2's HACK-02 generator rather than writing a second one
- [ ] `src/export/__tests__/fixtures/` — an 18-month synthetic export dataset for the PDF performance test

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| ≥1 reveal per active user per week | NOF1-05 | Population-level cadence property, not a single deterministic run | Monitor NFR-904's suppression-rate metric post-release |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 20s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
