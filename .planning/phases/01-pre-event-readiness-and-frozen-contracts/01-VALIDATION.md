---
phase: 01
slug: pre-event-readiness-and-frozen-contracts
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-08-03
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Extracted from
> `01-RESEARCH.md`'s Validation Architecture section (this gsd-core version does not emit this
> file automatically — see STATE.md for the note).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None installed yet in either repository. Recommended: `vitest` **4.1.10** [VERIFIED: `npm view vitest version`] — zero extra config cost since Vite is already the locked bundler |
| **Config file** | none — see Wave 0 Requirements |
| **Quick run command** | `npx vitest run --dir src/types` (once scaffolded) |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds (small phase, few files) |

---

## Sampling Rate

- **After every task commit:** `tsc --noEmit` on every commit touching `src/types/`
- **After every plan wave:** full `vitest run` plus the DOCFIX grep guard
- **Before `/gsd:verify-work`:** grep guard green, `tsc --noEmit` green, generator determinism test green
- **Max feedback latency:** ~10 seconds

---

## Per-Task Verification Map

| Req ID | Behavior | Test Type | Automated Command | File Exists |
|--------|----------|-----------|-------------------|-------------|
| HACK-01 | Three types compile; every `Finding` variant is exhaustively handled in at least one sample `switch` | typecheck + unit | `tsc --noEmit && npx vitest run src/types` | ❌ Wave 0 |
| HACK-02 | Generator is deterministic (same seed ⇒ identical output) | unit | `npx vitest run tools/generate-history.test.ts` | ❌ Wave 0 |
| HACK-02 | Generator output schema is identical regardless of which candidate pair/lag is passed (no leakage) | unit | `npx vitest run tools/generate-history.test.ts` | ❌ Wave 0 |
| DOCFIX-01/02/03 | None of the retired phrases reappear anywhere in either repo | smoke / CI grep guard | `! grep -rniE "against 6%\|camera heart rate was cut\|day 47 of your usual\|building my case" --include=*.md .` | ❌ Wave 0 |
| HACK-12 | Manual-only — organizational confirmations | manual-only | — (checklist, not automatable) | n/a |

*Status: ⬜ pending for all rows — no code exists yet at plan time.*

---

## Wave 0 Requirements

- [ ] `package.json` / Vite+TS scaffold in `health-team-311-war-room` — nothing exists yet
- [ ] `src/types/*.ts` — the three frozen files themselves
- [ ] `tools/generate-history.test.ts` — determinism + schema-non-leakage tests
- [ ] A one-line CI/local grep guard script for the three retired DOCFIX phrases, run across both repositories
- [ ] `vitest` install and minimal config

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Organizational confirmations (start time, pre-work permission, repo visibility) | HACK-12 | Answers live outside the codebase, with external parties | Track via 01-02's checklist tasks |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
