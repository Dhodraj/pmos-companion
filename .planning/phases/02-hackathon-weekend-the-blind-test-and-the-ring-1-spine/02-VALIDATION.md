---
phase: 02
slug: hackathon-weekend-the-blind-test-and-the-ring-1-spine
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-08-03
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Extracted from
> `02-RESEARCH.md`'s Validation Architecture section (this gsd-core version does not emit this
> file automatically — see STATE.md for the note).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None detected — greenfield build. Recommended: Vitest (pairs natively with Vite). The team's own proposal already commits to this kind of testing: "Unit tests on the correlation engine against synthetic series with known correlations and known noise" [CITED: hackathon/proposal.md:213] |
| **Config file** | none yet — create `vitest.config.ts` in Wave 0 |
| **Quick run command** | `npx vitest run src/core/engine` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** `npx vitest run <affected-file>` (seconds, keeps the fast loop the build plan demands)
- **After every plan wave** (i.e. at each gate — H4/H10/H16/H22/H28): `npx vitest run` (full suite)
- **Before `/gsd:verify-work`:** full suite green before H28 freeze, mirroring the build plan's own gate structure
- **Max feedback latency:** ~30 seconds

---

## Per-Task Verification Map

| Req ID | Behavior | Test Type | Automated Command | File Exists |
|--------|----------|-----------|-------------------|-------------|
| HACK-03 | Engine recovers a known planted lag within ±1 day on synthetic data with a known answer | unit | `npx vitest run src/core/engine/crossCorrelation.test.ts` | ❌ Wave 0 |
| HACK-03 | Engine reports `no_pattern` on a synthetically independent (null) pair | unit | `npx vitest run src/core/engine/fdr.test.ts` | ❌ Wave 0 |
| NOF1-03 (referenced by HACK-03/04) | Below-floor observation counts return `insufficient_data`, never a computed CI | unit | `npx vitest run src/core/engine/bootstrapCI.test.ts` | ❌ Wave 0 |
| HACK-04 | Check-in write reaches Dexie and is read back by a live query | integration | `npx vitest run src/core/db.integration.test.ts` (fake-indexeddb) | ❌ Wave 0 |
| HACK-05 | Export payload renders a well-formed PDF within budget | integration | `npx vitest run src/app/export.test.ts` | ❌ Wave 0 |
| HACK-07 | Crisis-flag response never calls Gemini or the Worker | unit | `npx vitest run src/ui/safety.test.ts` (assert no network call) | ❌ Wave 0 |
| HACK-08 | Voice path writes the same shape as tap path | unit | `npx vitest run src/app/checkin.test.ts` | ❌ Wave 0 |
| HACK-11 | Full spine renders correctly with all network calls mocked/blocked | manual + smoke | Manual: airplane mode on demo phone. Automated: `npx vitest run` with `fetch` stubbed to reject | ❌ Wave 0 (smoke); manual is irreducible |

*Status: ⬜ pending for all rows — no code exists yet at plan time.*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — no test framework installed yet
- [ ] `src/core/engine/*.test.ts` — the highest-value tests in this phase; write alongside the engine, not after
- [ ] A minimal IndexedDB shim (`fake-indexeddb`) for tests outside a real browser
- [ ] `src/ui/safety.test.ts` fixture asserting zero network calls on the crisis path (CON-CLIN-05)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Whole spine works with radio off | HACK-11 | Requires a physical device with airplane mode | Follow build-plan.md's H22 clean-install procedure; record a screen video |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
