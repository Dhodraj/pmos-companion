# Roadmap: PMOS Companion (working name)

## Overview

The project has one thing at its centre: an n-of-1 correlation engine that recovers a lagged
relationship it was never told about and correctly reports nothing on a null pair. Both controls
must pass; one without the other is a failure. Everything is built outward from that.

The sequence starts with the immovable date. Phase 1 closes the pre-event unknowns and freezes the
three interface contracts by Friday 7 August evening. Phase 2 is the 8–9 August hackathon weekend,
built in rings and cut from the outside in, with the blind test as its centrepiece. Phases 3 to 6
then take the weekend prototype to the PRD MVP (Aug–Oct 2026): an irregular-native foundation she
can live in, the engine and doctor exports at product grade, the safety and coaching floor, and
finally fingertip PPG camera vitals — which ship at P0 with a clinical objection still unanswered
and a release gate on answering it.

**Three phase axes are in play and must not be conflated (INFO-05).** The PRD release plan is
authoritative for the product. The build-plan rings 1–5 and cut list are authoritative for the
8–9 August weekend and nothing else. The proposal's module phases 1–3 are the proposal's own
narrative. This roadmap is a fourth thing — the delivery sequence — and it maps onto the first two
without merging them. **Camera vitals are P0 on the PRD release axis and are NOT in the weekend
rings.**

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Pre-event readiness and frozen contracts** - Close the unknowns, freeze the three types, generate the sealed blind-test dataset, correct the public claims
- [ ] **Phase 2: Hackathon weekend — the blind test and the ring 1 spine** - 8–9 August: prove the engine on a dataset its author did not see, built outward in rings and cut from the outside in
- [ ] **Phase 3: Irregular-native foundation** - A cycle view and check-in she can live in, on a consented, 18+, on-device data plane
- [ ] **Phase 4: The engine and the evidence she takes to a doctor** - Product-grade n-of-1 patterns with a confidence floor, and exports a clinician accepts in seven minutes
- [ ] **Phase 5: Safety floor, coaching and companion** - Crisis-safe screening with zero generated text, evidence-graded micro-actions, and a cited retrieval companion
- [ ] **Phase 6: Camera vitals — fingertip PPG** - Objective physiological signal from a ₹10,000 phone, gated on answering the clinical objection

## Phase Details

### Phase 1: Pre-event readiness and frozen contracts
**Goal**: Every question that could stop the weekend is answered before it starts, the three
interface contracts are frozen, the blind-test dataset exists with its parameters sealed, and no
false or borrowed claim survives into the pitch.
**Depends on**: Nothing (first phase)
**Requirements**: HACK-01, HACK-02, HACK-12, DOCFIX-01, DOCFIX-02, DOCFIX-03
**Success Criteria** (what must be TRUE):
  1. Belson can write every screen against `src/types/` without waiting on Dhodraj, because the log
     entry, the finding and the export payload are frozen — and the finding type can express
     *not enough data* as a value, not as a special case.
  2. Satheesh holds a sealed parameter file, and Dhodraj holds fourteen months of history he did
     not choose the contents of.
  3. The team knows the hackathon start time, what pre-event code is permitted, and whether the
     repo is public; all four machines build Android; the demo phone is chosen and wiped.
  4. No document in the repo states an unamended sleep-apnoea headline comparison, claims camera
     heart rate was cut, or uses the "Day 47" framing or the "Building My Case" label.
**Plans**: 7 plans across 3 waves

Plans:
- [ ] 01-01-PLAN.md — Tracer: scaffold to phone, contract path proven (wave 1, Rahul + Dhodraj)
- [ ] 01-02-PLAN.md — Pre-event unknowns: organizers, repo, invites, scopes (wave 1, Dhodraj + Rahul)
- [ ] 01-03-PLAN.md — DOCFIX sweep across both repositories, with a guard (wave 1, Satheesh)
- [ ] 01-04-PLAN.md — Contract dry-run: five screens against the type sketches (wave 1, Belson)
- [ ] 01-05-PLAN.md — Freeze the three interface contracts (wave 2, Dhodraj + Satheesh)
- [ ] 01-06-PLAN.md — Belson builds the insight card against the frozen barrel alone (wave 3, Belson)
- [ ] 01-07-PLAN.md — Blind-test generator and sealed parameters (wave 3, Dhodraj + Satheesh)

### Phase 2: Hackathon weekend — the blind test and the ring 1 spine
**Goal**: At the 8–9 August demo the engine recovers a planted lagged relationship it was never
told about and correctly reports nothing on the null pair, with a working check-in, insight card
and doctor export on a real phone around it.
**Depends on**: Phase 1
**Requirements**: HACK-03, HACK-04, HACK-05, HACK-06, HACK-07, HACK-08, HACK-09, HACK-10, HACK-11
**Success Criteria** (what must be TRUE):
  1. The engine reports the planted lag within a day either side, **and** reports nothing on the
     deliberately null pair. The person who wrote the engine did not know what was in the data.
  2. A judge logs a check-in on the demo phone, and that entry reaches a real row the engine reads
     back; a finding renders as an insight card; a doctor export is produced.
  3. The APK installs clean on a wiped phone and the whole path works with the radio off; a
     screen recording of a working run exists, so the fallback demo — engine, recovered lag, empty
     null pair, export as a static file — is always available.
  4. Every cut was called in the fixed order (lab capture, voice to tap, safety UI, cycle view to a
     list) by the named owner at the named gate, and the ring 1 spine survived all of them.
**Plans**: TBD
**UI hint**: yes

### Phase 3: Irregular-native foundation
**Goal**: She can log her life in thirty seconds a day and see her irregular cycle described as
signal rather than error, on a data plane that is consented per class, 18+ gated, and never leaves
her phone.
**Depends on**: Phase 2
**Requirements**: CYCL-01, CYCL-02, CYCL-03, CYCL-04, CYCL-05, CYCL-06, CYCL-07, CHK-01, CHK-02,
CHK-03, CHK-04, CHK-05, PRIV-01, PRIV-02, PRIV-03, PRIV-04, PRIV-05, REG-01, REG-02, NOTF-01,
NOTF-02, NOTF-03
**Success Criteria** (what must be TRUE):
  1. A woman on a 52-day cycle opens the app and sees her day count sitting inside her own
     historical range with a confidence band — no due-date, no "late", no pregnancy prompt.
  2. She completes a check-in in thirty seconds, by tap or by voice in English with the audio never
     leaving the phone, and can pause for three weeks and come back to no guilt copy, no broken
     streak and no backfill prompt.
  3. At a 90-day gap the app asks whether pregnancy is possible, whether she is on hormonal
     medication and whether she is already under treatment, then explains endometrial protection
     and offers a one-tap gynaecology export — suggesting no medication.
  4. She grants or revokes consent per data class independently, exports everything in one tap,
     deletes everything in one tap, and no under-18 account exists to profile.
**Plans**: 8 plans

Plans:
- [ ] 03-01-PLAN.md — Tracer: age gate to cycle view through the encrypted store (wave 1)
- [ ] 03-02-PLAN.md — Schema v2, validators, and the rule-based cycle intelligence (wave 2)
- [ ] 03-04-PLAN.md — CI, privacy guards, bundle budget, on-device keystore smoke (wave 2)
- [ ] 03-03-PLAN.md — The 30-second check-in, cycle view, pause mode, disclaimer (wave 3)
- [ ] 03-06-PLAN.md — Notification content gate, daily cap, quiet hours (wave 3)
- [ ] 03-05-PLAN.md — On-device voice check-in via a native recognizer patch (wave 4)
- [ ] 03-07-PLAN.md — 90-day sentinel, escalation flow, gynaecology export (wave 4)
- [ ] 03-08-PLAN.md — Consent surface, one-tap export and delete, mycyclesafe import (wave 4)
**UI hint**: yes

### Phase 4: The engine and the evidence she takes to a doctor
**Goal**: The app tells her something true about her own body that nobody has told her, states how
sure it is, admits when it does not know, and turns eighteen months of that into a document a
clinician reads in seven minutes.
**Depends on**: Phase 3
**Requirements**: NOF1-01, NOF1-02, NOF1-03, NOF1-04, NOF1-05, DOC-01, DOC-02, DOC-03, DOC-04
**Success Criteria** (what must be TRUE):
  1. She sees a lagged finding from her own data — "your skin flares two to three days after nights
     under six hours" — carried against her own phase-segmented baseline, never a population norm.
  2. Every reveal states its observation count and signal strength in plain language, and anything
     below the confidence floor shows "still learning" instead of a pattern.
  3. She can ask "how do you know that?" and get an answer, because the finding came from lagged
     cross-correlation with bootstrap intervals and FDR correction, not a black box.
  4. She taps once and gets a PDF in under ten seconds with eighteen months of cycle history,
     interval statistics, a symptom timeline, her medication log and the named tests she can
     request — with every app-derived value labelled a wellness trend, not a clinical measurement.
**Plans**: 5 plans

Plans:
- [ ] 04-01-PLAN.md — Tracer: one true lagged finding from her own data, IndexedDB to screen, on device
- [ ] 04-02-PLAN.md — Product-grade engine: per-phase baselines, full pairwise sweep, declared FDR family, weekly cadence
- [ ] 04-03-PLAN.md — The doctor export: 18 months compiled and rendered on device to a PDF in under ten seconds
- [ ] 04-04-PLAN.md — Guarded Gemini phrasing, the AI-phrasing consent class, and "how do you know that?"
- [ ] 04-05-PLAN.md — Clinician-acceptability review of the export copy and the explanation, in seven minutes
**UI hint**: yes

### Phase 5: Safety floor, coaching and companion
**Goal**: Nothing falls through — screening runs on cadence, a crisis is met with fixed
clinician-reviewed text and a phone number that always works, and everything the app tells her to
do or believe carries a visible evidence grade.
**Depends on**: Phase 4
**Requirements**: SAFE-01, SAFE-02, SAFE-03, SAFE-04, SAFE-05, COACH-01, COACH-02, COACH-03,
COACH-04, COACH-05, COMP-01, COMP-02, COMP-03, SKIN-01, REG-03
**Success Criteria** (what must be TRUE):
  1. A positive suicidality response produces Tele-MANAS 14416 immediately, in text no model
     generated, with no paywall, no login and no rate limit — then prompts her to contact a trusted
     person and checks in after 24 hours.
  2. She gets one or two micro-actions a day, each showing an evidence grade and a review date, and
     the app never counts a calorie, never shows calories burned, and never asks her weight unless
     she opted in.
  3. She asks the companion a question and gets an answer with a visible citation from the
     guideline corpus — and asking it to diagnose her, score her risk or change her dose gets her
     routed to her doctor instead.
  4. A qualified clinician has signed off the health content and a mental-health professional has
     signed off the crisis content, before any of it reaches a user.
**Plans**: 6 plans
Plans:
- [ ] 05-01-PLAN.md — Crisis path tracer: red-flag trigger to Tele-MANAS 14416, count-only D1 event, 24h nudge
- [ ] 05-02-PLAN.md — Screening: PHQ-2/GAD-2 plus the safety-net item SAFE-05 escalates on
- [ ] 05-03-PLAN.md — Evidence-graded micro-actions and the graded-claim contract
- [ ] 05-04-PLAN.md — Dignity guardrails: ED gate, food, movement, weight opt-in, no appearance scores
- [ ] 05-05-PLAN.md — Companion: cited RAG answers behind a three-layer structural refusal boundary
- [ ] 05-06-PLAN.md — Release gate: crisis-path availability proof and REG-03 clinical sign-off
**UI hint**: yes

### Phase 6: Camera vitals — fingertip PPG
**Goal**: She gets an objective physiological signal from the phone she already owns, presented as
a range she can trust, with failure treated as the normal case — and it does not reach users until
the recorded clinical objection has been answered in writing.
**Depends on**: Phase 5
**Requirements**: PPG-01, PPG-02, PPG-03, PPG-04, PPG-05, PPG-06, PPG-07
**Success Criteria** (what must be TRUE):
  1. She holds a finger over the rear camera with the torch on for thirty seconds, watches the
     pulse waveform draw itself, and gets a heart-rate range with a confidence — never a single
     precise digit — within three seconds of the capture ending.
  2. A capture that fails saturation, motion or AC/DC checks tells her what to change and breaks
     nothing; on a phone whose camera cannot do this at all, the feature never appears and every
     other feature still works.
  3. A written clinical rebuttal or a second clinical opinion answering "what would a resting heart
     rate tell a woman with PMOS?" exists in the repo before a single user sees this feature.
**Plans**: 9 plans
**UI hint**: yes

Plans:
- [ ] 06-01-PLAN.md — Tracer: fingertip to a heart-rate range end to end on one Android phone, frozen native and result contracts, test harness and fixtures (Rahul)
- [ ] 06-02-PLAN.md — PPG-07: draft the written clinical position, send it to a named clinician, and wire the CI release gate with the flag off (Satheesh, Rahul)
- [ ] 06-03-PLAN.md — Bridge-payload contract, smoothness-priors detrending, and the scipy-validated Butterworth bandpass (Dhodraj)
- [ ] 06-04-PLAN.md — iOS capture path at parity, fail-closed runtime capability probe, and the named device fleet matrix (Rahul)
- [ ] 06-05-PLAN.md — Capture session, live pulse waveform, guidance copy and the non-visual capture path (Belson)
- [ ] 06-06-PLAN.md — Peak detection cross-checked against FFT, confidence and range, quality gate, and the assembled capture analysis (Dhodraj)
- [ ] 06-07-PLAN.md — Failure states with reason-specific guidance, the range-with-confidence result screen, and the capability-gated entry point (Belson)
- [ ] 06-08-PLAN.md — Encrypted phase-tagged persistence, the n-of-1 engine input adapter, and the log-leak check (Dhodraj)
- [ ] 06-09-PLAN.md — Anxiety-safety copy review, the reviewed clinical position, and the one-way release decision (Satheesh)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Pre-event readiness and frozen contracts | 0/7 | Planned | - |
| 2. Hackathon weekend — blind test and ring 1 spine | 0/TBD | Not started | - |
| 3. Irregular-native foundation | 0/8 | Planned | - |
| 4. The engine and the evidence she takes to a doctor | 0/TBD | Not started | - |
| 5. Safety floor, coaching and companion | 0/6 | Planned | - |
| 6. Camera vitals — fingertip PPG | 0/9 | Planned | - |

## Coverage

- v1 requirements: 68
- Mapped to phases: 68
- Orphans: 0 ✓
- Duplicates: 0 ✓

Deferred scope (PRD v1 / v2 / Later, and the seven unrouted proposal modules) is tracked in
REQUIREMENTS.md and is deliberately not in this roadmap.

---
*Roadmap created: 2026-08-03*
