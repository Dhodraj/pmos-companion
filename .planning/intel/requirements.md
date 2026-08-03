# Requirements

Extracted from `product/00-PRD.md` (manifest precedence 0, the only PRD in the ingest set).
The PRD declares itself the single source of truth and states it supersedes the product
definition, build spec and complete-features spec where they conflict.

Requirements are grouped by the PRD's own FR families. Each group carries every constituent
FR verbatim as acceptance criteria, with the PRD's phase (MVP · v1 · v2 · Later) and priority
(P0 must-have · P1 high · P2 differentiator · P3 future) preserved.

Non-functional (NFR-*) and regulatory (REG-*) requirements are recorded in
`constraints.md` because they are constraint-shaped and gate every requirement below.

---

## REQ-cycle-engine
- source: product/00-PRD.md §9.1 (FR-100 family)
- description: Irregular-native cycle engine that treats an irregular cycle as signal rather than error.
- acceptance:
  - FR-101 (MVP, P0) Estimate cycle windows probabilistically with confidence bands. The system SHALL NOT display a single predicted due-date.
  - FR-102 (MVP, P0) Present elapsed time as a day count relative to her own historical range. Copy SHALL NOT contain "late", "overdue", "missed", or pregnancy-scare language.
  - FR-103 (MVP, P0) Support named cycle states: regular, irregular, oligomenorrhea, amenorrhea, medically regulated, post-pill recovery. Each is valid, never an error.
  - FR-104 (MVP, P0) Distinguish period, spotting, withdrawal bleed and breakthrough bleeding, with flow intensity, clots and pain association.
  - FR-105 (MVP, P0) Maintain a rolling cycle-interval distribution and a bleeds-per-year counter.
  - FR-106 (MVP, P0) Raise a calm escalation at gaps over 90 days or fewer than 4 bleeds a year, with endometrial-protection education and a one-tap gynaecology export. SHALL NOT suggest any specific medication.
  - FR-107 (MVP, P1) Estimate cycle phase probabilistically with visible uncertainty. SHALL NOT present hard ovulation prediction.
  - FR-108 (v1, P1) Track medication-induced bleeds separately so interval arithmetic stays correct.
  - FR-109 (v1, P1) Surface cycle-variance reduction as the progress metric, not regularity against a population norm.
- scope: cycle engine, bleeding taxonomy, interval sentinel, phase estimation

## REQ-daily-checkin
- source: product/00-PRD.md §9.2 (FR-200 family)
- description: A 30-second unified daily check-in that never punishes lapses.
- acceptance:
  - FR-201 (MVP, P0) Complete a full check-in in 30 seconds median, covering bleeding, sleep timing, movement, mood, energy, skin, cravings, pain and medications.
  - FR-202 (MVP, P0) Cap the symptom set at roughly 15 curated dimensions. SHALL NOT exceed 20 without an explicit scope decision.
  - FR-203 (MVP, P1) Provide one-tap severity entry and a "same as yesterday" shortcut.
  - FR-204 (MVP, P0) Provide pause mode as a first-class state. Returning SHALL NOT show guilt copy, broken streaks or backfill prompts.
  - FR-205 (v1, P1) Detect obsessive tracking patterns and reduce prompting in response.
  - FR-206 (v1, P1) Provide a home-screen widget for five-second logging.
  - FR-207 (v1, P1) Provide the illustrated nine-area mFG hirsutism scale as a self-completed questionnaire, never automated.
  - FR-208 (v2, P2) Support voice-note journaling with on-device transcription into the symptom log. Voice is an input method, never a mood biomarker.
- scope: daily check-in, symptom set, pause mode, voice input
- note: FR-208's phase is contested by hackathon/proposal.md, which places voice entry in Phase 1. See INGEST-CONFLICTS.md WARN-02.

## REQ-camera-vitals
- source: product/00-PRD.md §9.3 (FR-300 family)
- description: Phone-camera physiological capture, all foreground and user-initiated per ADR-002.
- acceptance:
  - FR-301 (MVP, P0) Fingertip PPG heart rate: rear camera with torch, 30 seconds. Red-channel spatial mean, detrend with smoothness priors at lambda 10, fourth-order Butterworth 0.7 to 3.5 Hz, peak detection cross-checked against FFT. Target accuracy MAPE at or below 5%.
  - FR-302 (MVP, P0) Lock auto-exposure, auto-white-balance and focus before capture begins.
  - FR-303 (MVP, P1) Render a live pulse waveform during capture.
  - FR-304 (MVP, P0) Display heart rate as a range with confidence, never a single precise digit.
  - FR-305 (MVP, P0) Reject captures failing saturation, motion or AC/DC ratio checks. Rejection SHALL be presented as normal, with guidance on what to change, and SHALL NOT break streaks.
  - FR-306 (v1, P1) Contactless respiratory rate: front camera, chest and shoulder region, optical flow bandpassed 0.1 to 0.7 Hz. Target MAE at or below 2 breaths per minute.
  - FR-307 (v1, P1) Onboarding SHALL instruct the user to prop the phone for respiratory capture.
  - FR-308 (v1, P1) Expose HRV from fingertip PPG only as a personal-baseline z-score, never as an absolute value, and never from face rPPG.
  - FR-309 (v1, P1) Capture at the highest available frame rate, preferring 60 or 120fps, with peak interpolation for HRV.
  - FR-310 (v2, P2) Face rPPG using MediaPipe regions and POS or CHROM projection, labelled experimental. SHALL NOT be the value symptoms are correlated against.
  - FR-311 (MVP, P0) Gate camera features on device capability at install, with a fully functional non-camera path.
  - FR-312 (v2, P1) Handle expected failure rates gracefully. Between 25% and 45% of face rPPG attempts will fail for Monk Skin Tone 5 to 8 users under warm indoor lighting.
- scope: fingertip PPG, respiratory rate, HRV, face rPPG, capability gating
- note: CONTESTED. hackathon/proposal.md records that camera heart rate was cut after clinical review, and hackathon/build-plan.md contains no camera vitals in any ring. See INGEST-CONFLICTS.md WARN-01. Do not route this requirement without resolving that.

## REQ-nof1-engine
- source: product/00-PRD.md §9.4 (FR-400 family)
- description: The n-of-1 personalisation engine — per-user baselines, lagged association discovery, confidence gating, and Experiment Mode verdicts.
- acceptance:
  - FR-401 (MVP, P0) Compute per-user baselines for every metric, segmented by cycle phase. SHALL NOT compare against population norms.
  - FR-402 (MVP, P0) Discover lagged associations across 1 to 14 day windows: sleep to skin, supplement to mood, food to cycle.
  - FR-403 (MVP, P0) Apply a confidence floor. Suppress any pattern below threshold and display "still learning". SHALL NOT surface a pattern from insufficient observations.
  - FR-404 (MVP, P0) State observation count and signal strength in plain language on every reveal, for example "12 observations, weak signal".
  - FR-405 (MVP, P0) Deliver at least one pattern reveal per active user per week once sufficient data exists.
  - FR-406 (v1, P0) Provide Experiment Mode: pre-declared outcome, baseline period, 8 to 12 week window, washout, and a verdict. "No detectable change" is a valid first-class outcome.
  - FR-407 (v1, P1) Ship experiment templates for myo-inositol, sleep window, spearmint, yoga, low-glycaemic eating and metformin adherence.
  - FR-408 (v1, P1) Use pre-intervention weeks automatically as the baseline, with no manual setup.
  - FR-409 (v1, P1) Warn when multiple interventions change within one window.
  - FR-410 (v1, P1) Surface a fused insight only when two or more independent signal types agree, with thresholds tuned for the phone-only signal set.
  - FR-411 (Later, P2) Provide aggregate-only, opt-in, k-anonymised cohort priors.
- scope: correlation engine, baselines, confidence gate, Experiment Mode, cohort priors
- note: This is the component build-plan.md designates as the single component that must be working at the demo (see constraints.md CON-SEQ-01).

## REQ-doctor-advocacy
- source: product/00-PRD.md §9.5 (FR-500 family)
- description: Doctor-facing exports and advocacy tooling that convert eighteen months of lived experience into evidence a clinician accepts in seven minutes.
- acceptance:
  - FR-501 (MVP, P0) Provide a one-tap gynaecology export: 18-month cycle history, interval statistics and bleeding log, as PDF.
  - FR-502 (MVP, P0) Provide a doctor one-pager: symptom timeline, cycle history, medication log and guideline-cited test requests.
  - FR-503 (MVP, P0) Name the tests she can request: fasting insulin, free testosterone, DHEAS, 75g OGTT, AMH.
  - FR-504 (MVP, P0) Label all app-derived physiological values in exports explicitly as wellness trends, not clinical measurements.
  - FR-505 (v1, P0) Include trend charts only in exports, never raw photographs.
  - FR-506 (v1, P1) Provide specialist-specific templates for gynaecology, endocrinology, dermatology and psychiatry.
  - FR-507 (v1, P1) Provide evidence-pack mode for undiagnosed users: symptom evidence, diagnostic criteria explainer and question scripts. Rename from the earlier label, per section 5.3.
  - FR-508 (v1, P0) Provide guideline-backed question scripts for asking a clinician directly.
  - FR-509 (v1, P1) Provide localised referral pathways so "see a doctor" names a clinic she can reach, by city and budget.
- scope: doctor export, one-pager, specialist templates, referral pathways

## REQ-mental-health-safety
- source: product/00-PRD.md §9.6 (FR-600 family)
- description: Mental-health screening and crisis routing. The PRD states this module carries zero tolerance — one mishandled crisis ends the product.
- acceptance:
  - FR-601 (MVP, P0) Run PHQ-4 and GAD-2 check-ins on a defined cadence.
  - FR-602 (MVP, P0) Pre-script and human-review the crisis flow. Generated text SHALL NOT appear on any crisis path under any circumstance.
  - FR-603 (MVP, P0) Crisis resources, Tele-MANAS 14416, SHALL NEVER be paywalled, login-gated or rate-limited.
  - FR-604 (MVP, P0) Gate food-tracking depth behind an eating-disorder screen. On a positive screen, suppress depth and surface support.
  - FR-605 (v1, P0) Provide full PHQ-9 and GAD-7 on guideline cadence, using formally validated Hindi and Tamil translations.
  - FR-606 (v1, P1) Suppress action-heavy prompts on low mental-health days.
  - FR-607 (v1, P1) Frame CBT and ACT micro-skills explicitly as skills practice, not therapy.
  - FR-608 (v1, P1) Provide a one-tap self-reported stress rating, replacing the removed facial inference feature.
  - FR-609 (MVP, P0) Escalate immediately on chest pain, fainting, drowsy driving, severe bleeding and suicidality, with localised guidance.
- scope: PHQ-4, GAD-2, PHQ-9, GAD-7, crisis routing, Tele-MANAS, ED screen, red-flag escalation

## REQ-coaching-treatment
- source: product/00-PRD.md §9.7 (FR-700 family)
- description: Evidence-graded coaching levers and prescribed-treatment companionship, with zero commerce.
- acceptance:
  - FR-701 (MVP, P0) Deliver one or two evidence-graded, phase-aware micro-actions daily from a curated set.
  - FR-702 (MVP, P0) Display a visible evidence grade and date on every health claim.
  - FR-703 (MVP, P1) Use additive, cuisine-native food language. SHALL NOT include calorie counting or macro targets by default.
  - FR-704 (MVP, P1) Track movement as weekly minutes, 150 to 300 plus two strength sessions, counting 10-minute entries. SHALL NOT display calories burned.
  - FR-705 (MVP, P0) Place weight entry behind an opt-in permission prompt, per the 2023 Guideline. SHALL NOT make it a default or headline metric.
  - FR-706 (v1, P0) Derive personalised coaching from her own n-of-1 patterns.
  - FR-707 (v1, P0) Provide OSA screen-and-refer with an urgent drowsy-driving flag. SHALL use unlicensed symptom questions unless ESS or STOP-BANG is properly licensed, per REG-004.
  - FR-708 (v1, P0) Provide an evidence-graded supplement library covering purpose, studied dose, certainty grade, and Indian availability and price. Zero commerce, zero affiliate links.
  - FR-709 (v1, P1) Provide a prescribed-treatment companion: education, adherence and side-effect logging, prescriber question lists. SHALL NOT advise starting, stopping or dosing any prescription.
  - FR-710 (v1, P0) Provide GLP-1 safety education covering restored ovulation and contraception, neutral and non-promotional.
  - FR-711 (v1, P1) Provide a yoga and breathwork library as a logged intervention with honest evidence framing.
- scope: micro-action coach, evidence grades, movement, weight opt-in, OSA screen-and-refer, supplement library, metformin/GLP-1 companion

## REQ-labs-screening
- source: product/00-PRD.md §9.8 (FR-800 family)
- description: Guideline screening ledger and lab vault, with hard graceful-degradation to zero labs.
- acceptance:
  - FR-801 (v1, P0) Provide a guideline screening ledger: blood pressure annually, lipids at diagnosis, glycaemic status every one to three years, OGTT pre-pregnancy, tracked as due, done and trended.
  - FR-802 (v1, P1) Provide a lab vault for fasting glucose, insulin, HOMA-IR, LH to FSH ratio, androgens, lipids, thyroid, vitamin D and HbA1c, with dates.
  - FR-803 (v2, P1) Extract values from a photographed printed lab report on device, presented for user confirmation. SHALL NOT auto-save unconfirmed values.
  - FR-804 (v1, P0) No feature SHALL be gated behind a laboratory value. Every downstream capability degrades gracefully to zero labs.
  - FR-805 (v1, P1) Provide OGTT reminders, preparation guidance and a result-logging template. This is the guideline-recommended path and our substitute for CGM.
  - FR-806 (v1, P1) Provide vitamin D test-then-correct guidance: push the test, never the supplement, with the clinician setting dose.
  - FR-807 (v1, P0) Label blood-pressure entries as measured at a clinic or pharmacy, since we do not measure blood pressure.
- scope: screening ledger, lab vault, lab OCR, OGTT, vitamin D, blood pressure logging
- note: FR-803's phase (v2) is contested by hackathon/proposal.md, which places lab report capture in Phase 1, and by build-plan.md, which makes it ring 5 and the first item on the cut list. See INGEST-CONFLICTS.md INFO-05.

## REQ-skin-visual
- source: product/00-PRD.md §9.9 (FR-900 family)
- description: Self-relative skin and visual tracking with hard anti-beauty guardrails.
- acceptance:
  - FR-901 (v1, P1) Provide guided selfie capture with a fixed face outline and a lighting check that refuses poor shots.
  - FR-902 (v1, P1) Provide a self-relative time-lapse the user interprets herself. This is the retention feature and requires no model.
  - FR-903 (MVP, P0) The system SHALL NOT display beauty, attractiveness or symmetry scores, SHALL NOT enable cross-user comparison, and SHALL NOT produce before-and-after collages.
  - FR-904 (v1, P0) Require separate unbundled consent for skin images, with one-tap deletion and no training use without explicit opt-in.
  - FR-905 (v2, P0) Run skin scoring on device. Images SHALL NOT leave the device in production.
  - FR-906 (v2, P2) Provide a coarse four-level acne category only if fine-tuned on a purpose dataset. Lesion counts SHALL NOT be displayed, since detection mAP of roughly 0.54 makes them unreliable.
- scope: guided selfie, time-lapse, anti-beauty guardrails, skin consent, on-device scoring

## REQ-sleep
- source: product/00-PRD.md §9.10 (FR-1000 family)
- description: Sleep regularity tracking and on-device sleep-audio analysis.
- acceptance:
  - FR-1001 (v1, P1) Track sleep regularity by bed and wake consistency, using timing rather than duration alone.
  - FR-1002 (v2, P2) Derive a sleep window and restlessness index from the accelerometer. This runs in the background and reports gross timing, not sleep stages.
  - FR-1003 (v2, P2) Detect snoring from on-device audio during a user-started session. Raw audio SHALL be analysed on device and discarded, never uploaded.
  - FR-1004 (v2, P2) Require explicit user initiation for sleep sessions, display the platform recording indicator, and handle OEM-truncated nights gracefully.
- scope: sleep regularity, actigraphy, snore detection

## REQ-ai-companion
- source: product/00-PRD.md §9.11 (FR-1100 family)
- description: Retrieval-grounded companion that answers from a curated guideline corpus and never diagnoses.
- acceptance:
  - FR-1101 (MVP, P1) Answer questions from a curated guideline corpus using retrieval, with visible source citations.
  - FR-1102 (MVP, P0) The companion SHALL NOT diagnose, estimate condition likelihood, or recommend or adjust any dose.
  - FR-1103 (v2, P1) Run an on-device model where hardware supports it, with cloud retrieval as fallback. Model location SHALL be disclosed to the user.
  - FR-1104 (MVP, P0) Route out-of-scope questions to "discuss with your doctor" rather than answering them.
- scope: RAG companion, citations, on-device LLM, out-of-scope routing

## REQ-privacy-platform
- source: product/00-PRD.md §9.12 (FR-1200 family)
- description: Purpose-bound consent, on-device raw media processing, and full export/deletion rights.
- acceptance:
  - FR-1201 (MVP, P0) Collect purpose-bound granular consent per data class. Consent SHALL NOT be inherited from mycyclesafe.
  - FR-1202 (MVP, P0) Provide one-tap full export and full deletion.
  - FR-1203 (MVP, P0) The system SHALL NOT integrate ad-tech SDKs or third-party analytics on health events, and SHALL NOT sell data.
  - FR-1204 (MVP, P0) Provide a consented cycle-history import from mycyclesafe to remove cold-start.
  - FR-1205 (v1, P1) Provide a user-configurable biometric application lock.
  - FR-1206 (v2, P2) Write back to Health Connect and HealthKit so her data remains portable.
  - FR-1207 (MVP, P0) Raw video, audio and images SHALL NOT be uploaded under any configuration.
  - FR-1208 (v2, P2) Provide a local-first mode with full offline operation and no account.
- scope: consent architecture, export and deletion, ad-tech exclusion, mycyclesafe import, biometric lock, local-first mode
- note: FR-1204 is a valid requirement (the import path must exist and must re-collect consent), but the assumption that imported histories arrive at meaningful volume is unverified — mycyclesafe.ai has ~2 registered users and no account system. Do not treat cold-start removal as a delivered outcome. See INGEST-CONFLICTS.md INFO-01.

## REQ-notifications
- source: product/00-PRD.md §9.13 (FR-1300 family)
- description: Insight-bearing notifications only, with no punitive gamification.
- acceptance:
  - FR-1301 (MVP, P0) Every notification SHALL carry a personal insight or a due action. Generic engagement prompts SHALL NOT be sent.
  - FR-1302 (MVP, P0) Send at most one or two notifications a day, with user-controlled quiet hours.
  - FR-1303 (MVP, P0) The system SHALL NOT use guilt-based streaks or punitive gamification.
  - FR-1304 (v1, P1) Write re-engagement copy that expects lapses.
- scope: notifications, quiet hours, streaks, re-engagement

---

## Goals and success metrics

- source: product/00-PRD.md §3
- goals: G1 make her irregular cycle legible, never framed as failure. G2 tell her something true about her own body that nobody has told her. G3 convert eighteen months of lived experience into evidence a doctor accepts in seven minutes. G4 deliver objective physiological signal with no purchased hardware. G5 cause no harm: no shame, no false precision, no missed crisis.
- non-goals: diagnosing PMOS; replacing a clinician; fertility and conception as a primary use case; weight loss as an outcome; selling supplements.
- metrics (MVP / v1 / v2): D7 retention >40% / >50% / >55%. D90 retention not measured / >25% / >35%. Weekly active loggers >60% of MAU / >70% / >75%. Pattern reveals viewed >1 per user per week / >1.5 / not set. Doctor exports not measured / >1 per user per quarter / >2. Experiment completion not measured / >30% of started / >40%. Fingertip PPG success rate >85% / >88% / >90%. Camera check-in adoption not measured / >15% of DAU / >20%. Crisis-path integrity 100% scripted throughout. NPS in beta >50 / >60 / >65.
- counter-metrics (a rise means failure): uninstalls within 48 hours of a pattern reveal; reported distress following a skin capture; streak-related complaints; any crisis path served by generated text.

## Release plan

- source: product/00-PRD.md §12
- MVP (Aug–Oct 2026): cycle engine and check-in; n-of-1 engine v0; fingertip PPG (critical path); doctor exports and crisis floor.
- v1 (Oct 2026–Mar 2027): Experiment Mode (critical path); skin trend, labs, screening ledger; respiratory rate and HRV; Hindi and Tamil.
- v2 (Mar–Jul 2027): on-device LLM companion; sleep actigraphy and snore detection; lab OCR and face rPPG beta.
- Later (Aug 2027 onward): cohort priors; clinician portal.
- MVP definition of done: irregular-native cycle engine with interval sentinel; 30-second check-in with pause mode; n-of-1 pattern reveal with confidence gating; fingertip PPG heart rate with quality gate; gynaecology export, doctor one-pager and test-request helper; crisis-safe mental-health floor; dignity defaults (weight opt-in, 18+ gate, anti-beauty guardrails); mycyclesafe bridge with granular consent; evidence-graded education with the retrieval companion.
- note: this product release plan is a different axis from the hackathon ring/cut sequencing in build-plan.md. See INGEST-CONFLICTS.md INFO-05.

## Users

- source: product/00-PRD.md §4
- primary: Indian women aged 18 to 35 with PMOS, diagnosed or suspecting it, phone-first, poorly served by generic apps and dismissive care.
- secondary: her clinician, who receives exports but never uses the product directly in v1.
- personas: Priya, 26, Bengaluru (diagnosed two years ago, cycles 30 to 60 days, told to lose weight, takes inositol without knowing whether it helps — needs "does this actually work for me?"). Ananya, 21, Coimbatore (undiagnosed; acne, hair loss, irregular cycles; told it is normal for her age; deleted Flo after repeated pregnancy scares — needs evidence to be taken seriously). Meera, 34, tier-2 city (diagnosed eight years ago; fatigue, poor sleep, snoring; never screened for sleep apnoea or lipids; four uncoordinated doctors — needs nothing to fall through).
- excluded: users under 18, at launch, per REG-001. See constraints.md CON-REG-01.
