---
phase: 06
slug: camera-vitals-fingertip-ppg
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-08-03
---

# Phase 06 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Extracted from
> `06-RESEARCH.md`'s Validation Architecture section (this gsd-core version does not emit this
> file automatically — see STATE.md for the note).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None detected anywhere in the repo. Vitest for the TS DSP/UI layer; XCTest for the iOS native plugin; JUnit/AndroidX Test for the Android native plugin — the default choice for the already-locked stack |
| **Config file** | none yet — Wave 0 |
| **Quick run command** | `npx vitest run src/features/camera-vitals` |
| **Full suite command** | `npx vitest run` (TS) + platform-native test runners (Xcode/Gradle) run separately |
| **Estimated runtime** | ~30 seconds (TS) + native runner time, variable |

---

## Sampling Rate

- **After every task commit:** the synthetic-signal unit tests (fast, well under 30s)
- **After every plan wave:** full TS suite plus at least one native instrumented test run on a connected device or emulator
- **Before `/gsd:verify-work`:** full suite green, device-fleet manual QA checklist signed off, **and** the PPG-07 CI release-gate script passing
- **Max feedback latency:** ~30 seconds (TS layer)

---

## Per-Task Verification Map

| Req ID | Behavior | Test Type | Automated Command | File Exists |
|--------|----------|-----------|-------------------|-------------|
| PPG-01 | Pipeline recovers a known BPM from a synthetic clean signal, AND reports low confidence on pure noise | unit | `npx vitest run pipeline/pipeline.synthetic.test.ts` | ❌ Wave 0 |
| PPG-02 | AE/AWB/focus lock APIs return success; visual QA confirms no exposure hunting on a real device | native instrumented + manual QA | Xcode/Gradle test runner + device-fleet checklist | ❌ Wave 0 |
| PPG-03 | Waveform component redraws as new sample data arrives | component test | `npx vitest run capture-screen.test.tsx` | ❌ Wave 0 |
| PPG-04 | Result type never exposes a bare BPM number; only the discriminated union | unit + type-level | `npx vitest run types.test.ts` (plus the TS compiler itself) | ❌ Wave 0 |
| PPG-05 | Each synthetic bad-signal fixture (saturated, high-motion, weak-AC/DC) triggers its specific rejection reason | unit | `npx vitest run pipeline/quality-gate.test.ts` | ❌ Wave 0 |
| PPG-06 | Feature entry point does not render when capability check reports unsupported | unit + manual device matrix | `npx vitest run capability.test.ts` + fleet checklist | ❌ Wave 0 |
| PPG-07 | A non-empty clinical rebuttal/second-opinion document exists in the repo before the camera-vitals feature flag can be enabled in a release build | CI release-gate check, not a code test | A script asserting the doc path exists and is non-empty, wired into the release pipeline | ❌ Wave 0 — first-class deliverable, not an afterthought |

*Status: ⬜ pending for all rows — no code exists yet at plan time.*

---

## Wave 0 Requirements

- [ ] Vitest install + config
- [ ] Synthetic PPG test fixtures: a clean sine wave at a known BPM, a pure-noise signal, one fixture per PPG-05 rejection reason
- [ ] `scipy.signal.butter` reference-coefficient cross-check script, run once offline to validate the Butterworth implementation
- [ ] Native test scaffolding (XCTest target, AndroidX Test target)
- [ ] The PPG-07 CI release-gate script itself
- [ ] A concrete, named 2–3 device test fleet

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| No exposure hunting on a real device | PPG-02 | Requires physical camera hardware | Visual QA checklist across the named device fleet |
| Device-capability matrix | PPG-06 | Camera/torch behaviour varies by real hardware | Run the capability check on each fleet device, confirm feature absence where expected |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
