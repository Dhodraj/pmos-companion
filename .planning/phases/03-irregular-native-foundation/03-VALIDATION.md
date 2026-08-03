---
phase: 03
slug: irregular-native-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-08-03
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Extracted from
> `03-RESEARCH.md`'s Validation Architecture section (this gsd-core version does not emit this
> file automatically — see STATE.md for the note).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None detected — greenfield. Recommend Vitest 4.x (Vite-native, near-zero config) |
| **Config file** | none — Wave 0 gap |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run --coverage` |
| **Estimated runtime** | ~45 seconds (largest requirement set of the six phases) |

---

## Sampling Rate

- **After every task commit:** `npx vitest run` (targeted to the changed area)
- **After every plan wave:** `npx vitest run --coverage`
- **Before `/gsd:verify-work`:** full suite green, plus the manual radio-off voice verification and the QA/dignity copy review recorded as completed
- **Max feedback latency:** ~45 seconds

---

## Per-Task Verification Map

| Req ID | Behavior | Test Type | Automated Command | File Exists |
|--------|----------|-----------|-------------------|-------------|
| CYCL-01 | Probabilistic window + confidence band | unit | `npx vitest run tests/cycle/classifier.test.ts -t "confidence band"` | ❌ Wave 0 |
| CYCL-02 | Zero banned words ("late","overdue","missed","due date") in rendered copy | unit (string-lint) | `npx vitest run tests/cycle/copy-lint.test.ts` | ❌ Wave 0 |
| CYCL-03 | Six states, each valid for its threshold fixture | unit | `npx vitest run tests/cycle/classifier.test.ts -t "cycle state"` | ❌ Wave 0 |
| CYCL-04 | Bleed taxonomy schema accepts all four types + flow/clots/pain | unit (zod parse fixtures) | `npx vitest run tests/db/bleed-schema.test.ts` | ❌ Wave 0 |
| CYCL-05 | Interval distribution + bleeds/year over fixture data | unit | `npx vitest run tests/cycle/stats.test.ts` | ❌ Wave 0 |
| CYCL-06 | 90-day sentinel triggers; questions asked; snooze scheduled | integration (fake-indexeddb) | `npx vitest run tests/cycle/sentinel.test.ts` | ❌ Wave 0 |
| CYCL-06 | Escalation copy reads as caring, not alarming | manual — QA/dignity review (Satheeshkumar) | n/a | n/a |
| CYCL-07 | Phase estimation over fixture luteal-length history | unit | `npx vitest run tests/cycle/phase.test.ts` | ❌ Wave 0 |
| CHK-01 | 30s median completion | manual/instrumented on-device timing | n/a — human-timed | n/a |
| CHK-02 | Symptom dimension count ≤20, target ~15 | unit (constant assertion) | `npx vitest run tests/db/symptom-dimensions.test.ts` | ❌ Wave 0 |
| CHK-03 | "Same as yesterday" pre-fill matches prior record | integration | `npx vitest run tests/checkin/prefill.test.ts` | ❌ Wave 0 |
| CHK-04 | Return-from-pause shows no guilt copy/streak/backfill | integration | `npx vitest run tests/checkin/pause-mode.test.ts` | ❌ Wave 0 |
| CHK-05 | Availability check fails closed to tap-only when on-device unavailable | unit (mocked plugin) | `npx vitest run tests/voice/availability-gate.test.ts` | ❌ Wave 0 |
| CHK-05 | Audio never leaves phone, on real devices | manual-only — radio-off protocol | n/a — requires physical device | n/a |
| PRIV-01 | Six consent rows exist post-onboarding, independently toggleable | unit | `npx vitest run tests/consent/seed.test.ts` | ❌ Wave 0 |
| PRIV-02 | Export contains all tables; delete empties all tables | integration | `npx vitest run tests/db/export-delete.test.ts` | ❌ Wave 0 |
| PRIV-03 | No analytics/ad-tech import in bundle | static/CI check | `npx madge --circular src` (repurposed) / grep-based CI assertion | ❌ Wave 0 |
| PRIV-04 | mycyclesafe import requires its own consent row before any write | integration | `npx vitest run tests/consent/mycyclesafe-import.test.ts` | ❌ Wave 0 |
| PRIV-05 | Encrypted-field round-trip (encrypt/decrypt) | unit | `npx vitest run tests/db/encryption.test.ts` | ❌ Wave 0 |
| REG-01 | Under-18 DOB rejected; no rows ever written for rejected registrant | unit + integration | `npx vitest run tests/onboarding/age-gate.test.ts` | ❌ Wave 0 |
| REG-02 | Disclaimer renders on relevant screens | unit (render smoke test) | `npx vitest run tests/components/disclaimer.test.tsx` | ❌ Wave 0 |
| NOTF-01 | Notification builder rejects content with no bound insight/action | unit | `npx vitest run tests/notifications/content-gate.test.ts` | ❌ Wave 0 |
| NOTF-02 | Daily cap + quiet-hours window enforced | unit | `npx vitest run tests/notifications/scheduler.test.ts` | ❌ Wave 0 |
| NOTF-03 | No streak-counter field exists in schema | static (schema shape assertion) | `npx vitest run tests/db/schema-shape.test.ts` | ❌ Wave 0 |

*Status: ⬜ pending for all rows — no code exists yet at plan time.*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — no test framework configured yet
- [ ] `tests/setup.ts` — wire `fake-indexeddb` as the global `indexedDB` for Dexie tests
- [ ] `tests/db/*` fixtures — seed data for interval/threshold classifier tests (35-day and 90-day boundary cases)
- [ ] Framework install: `npm install -D vitest fake-indexeddb @testing-library/react @testing-library/jest-dom jsdom`
- [ ] A recorded, repeatable radio-off manual test procedure for CHK-05 (extend Phase 2's screen-recording practice)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 30-second check-in completion | CHK-01 | Human-timed UX property | Time five real completions, take the median |
| 90-day-gap escalation copy tone | CYCL-06 | Requires human judgement of tone | Satheeshkumar reviews as if newly diagnosed and frightened |
| Audio never leaves phone | CHK-05 | Requires a physical device | Radio-off protocol, reuse Phase 2's recording practice |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 45s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
