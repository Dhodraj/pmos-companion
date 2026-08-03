# Constraints

Composition of this file:
- SPEC sources — `product/04-data-model.md` (prec 1), `product/03-complete-features-spec.md` §0 (prec 2), `product/02-build-spec.md` (prec 3).
- PRD-sourced non-functional and regulatory requirements from `product/00-PRD.md` §10 and §11 (prec 0). These are constraint-shaped and gate every requirement in `requirements.md`.
- Manifest-designated constraints carried from DOC sources: clinician-review outcomes in `hackathon/proposal.md` (prec 4) and ring/gate/cut sequencing in `hackathon/build-plan.md` (prec 5).

Each entry is typed `api-contract | schema | nfr | protocol`.

---

# Sequencing constraints

## CON-SEQ-01: The correlation engine is the single component that must be working at the demo
- source: hackathon/build-plan.md §1
- type: protocol
- content: "The correlation engine runs, recovers a real lagged relationship it was never told about, and correctly reports nothing on a pair where nothing exists." If that is true at the demo, there is a project. If it is not, the other six components are a period tracker with a nice export. Every other sequencing decision in the build plan exists to protect this. The negative control matters more than the positive one: any engine can find a pattern, ours has to be able to say there isn't one. This is a sequencing constraint, not a preference.

## CON-SEQ-02: Ring ordering, built outward from the engine
- source: hackathon/build-plan.md §6, §10
- type: protocol
- content: Ring 1 is the spine — check-in, engine, insight card, export. Then ring 2 doctor export, ring 3 cycle view, ring 4 safety layer, ring 5 lab report capture. Rings 2 to 4 are abandoned if the H10 blind test is red. The spine is never cut; if those four are gone there is nothing to present.

## CON-SEQ-03: Cut list, in fixed order, outside in
- source: hackathon/build-plan.md §10
- type: protocol
- content: Cut order is: (1) lab capture, (2) voice entry drops to tap, (3) safety layer UI comes off while the logic stays and gets one slide, (4) cycle view degrades to a plain list. Dhodraj calls each cut; not a vote. Lab report capture has no owner on purpose — it happens only if the hour-22 checkpoint passes early, and it is the first thing cut.

## CON-SEQ-04: The blind test protocol
- source: hackathon/build-plan.md §1, §9
- type: protocol
- content: Fourteen months of history are generated for a demo user. Dhodraj writes the generator but does not choose what goes in it. Satheesh picks the planted pair from a list of six candidates, rolls for the lag and the strength, runs the generator with a random seed, and hands Dhodraj the dataset alone. Parameters stay sealed in a file only Satheesh has until after the engine has reported. The claim this protects: the person who wrote the engine did not know what was in the data. Without the split the positive control proves nothing.

## CON-SEQ-05: Five gates with named owners
- source: hackathon/build-plan.md §9
- type: protocol
- content: H4 the write path — a check-in writes a real row and the engine reads it back; if not, all hands land on the write path. H10 the blind test — green (lag recovered within a day either side, null pair returns nothing) everyone stays on track; amber (lag found but null pair also fires) Dhodraj raises the confidence floor alone, retest at H13; red (nothing found or wrong thing found) all hands to the engine, rings 2 to 4 abandoned, demo becomes engine + check-in + export. H16 end to end — a finding renders on a real screen from a real check-in, else the cycle view is cut on the spot. H22 clean install — current APK on a wiped phone, whole path works including with the radio off, else the last good APK becomes the demo build. H28 freeze — cut list applied, no exceptions, Rahul enforces this one not Dhodraj. Each gate is decided within ten minutes.

## CON-SEQ-06: No new complex logic after H20; freeze at H28
- source: hackathon/build-plan.md §4
- type: protocol
- content: Work is ordered by how much thinking it takes. H0 to H16 everything genuinely hard — the engine is finished inside this window or not at all. H16 to H22 assembly only. H22 onward mechanical only. Hard rule: no new complex logic after H20; if it is not working by then it gets cut instead of debugged. Rahul calls it. Satheesh reviews every one of Dhodraj's commits after H20.

## CON-SEQ-07: Interface contracts frozen Friday 7 August
- source: hackathon/build-plan.md §5
- type: api-contract
- content: Everything in `src/types/` is frozen Friday evening; nobody changes it during the build without Dhodraj agreeing out loud. Three frozen types: (1) the log entry — what a check-in writes and what the engine reads, Dhodraj owns it, needed at hour zero; (2) the finding — the two variables, the lag in days, the direction, the strength, the observation count, and a confidence band that can fall below the floor; it has the most dependents so it is written first, and both the insight card and the export render from it; (3) the export payload — everything the doctor summary renders from. A finding must be able to say *not enough data* as a value of the type, not as an `if` statement written at three in the morning.

## CON-SEQ-08: Directory ownership and role boundaries
- source: hackathon/build-plan.md §2, §3, §11
- type: protocol
- content: `src/core/` and `worker/` are Dhodraj's; `src/app/` and `src/ui/` are Belson's; `ops/` and everything CI is Rahul's. Dhodraj never debugs the build and never writes UI, enforced by Rahul. Dhodraj commits every hour minimum. Satheesh pairs on the engine from hour two so two people can explain it. No new dependencies after H10 without Dhodraj agreeing. One phone is the demo phone, tested from hour two, not an emulator.

## CON-SEQ-09: Fallback demo
- source: hackathon/build-plan.md §10, §14
- type: protocol
- content: Minimum presentable: the engine running on the seeded dataset, showing the recovered lag and the correctly empty null pair, alongside the doctor export as a static file. No app, no phone, no live entry. Rahul's H22 screen recording exists so this version is always available. Definition of done: it runs on the demo phone from a clean install, works with the radio off if it is meant to, and someone other than the author has used it without being told how.

---

# Regulatory constraints

## CON-REG-01: 18+ age gate, no processing of under-18 data
- source: product/00-PRD.md §11.1 (REG-001); corroborated by product/03-complete-features-spec.md §9.1 and hackathon/proposal.md
- type: nfr
- content: The system SHALL enforce an 18+ age gate and SHALL NOT process data for users under 18. India's DPDP Act classifies anyone under 18 as a child; processing requires verifiable parental consent (verifying both the child's age and the parent's identity) and the Act expressly prohibits tracking, behavioural monitoring, targeted advertising and profiling of children. The Rule 11 healthcare exemption covers a clinical establishment, mental health establishment or healthcare professional restricted to providing health services; it cannot be claimed while also claiming non-clinical status for CDSCO, because the two positions are mutually exclusive. The deeper obstacle: the n-of-1 engine performs profiling — lagged correlation over longitudinal behavioural data is precisely the prohibited activity, so no consent checkbox resolves it. This is a real and stated product loss (PMOS commonly presents in adolescence; adolescent OSA prevalence runs at 29%). Adolescent support becomes a funded roadmap item requiring verifiable-parental-consent infrastructure. Compliance deadline: 18 months from the November 2025 notification.

## CON-REG-02: Screen-and-refer only, not a medical device
- source: product/00-PRD.md §11.2 (REG-002, REG-003); product/03-complete-features-spec.md §9.4, §9.5
- type: nfr
- content: REG-002 — the system SHALL operate as screen-and-refer. It SHALL NOT diagnose, produce condition-likelihood scores, or recommend or adjust doses. REG-003 — the system SHALL NOT measure or display blood pressure, blood oxygen, blood glucose or body temperature from device sensors. App Store Review Guideline 1.4.1 forbids apps that claim to measure blood pressure, body temperature, blood glucose or blood oxygen using only the sensors on the device; renaming an output to "BP trend" or "cardiovascular load" does not avoid classification. CDSCO final MDSW guidance applies risk-based Class A to D, with wellness software held to a lower standard than diagnostic software; Class A non-sterile non-measuring devices are exempt from full licensing under G.S.R. 777(E), though registration and post-market surveillance still apply and ISO 13485 is a practical prerequisite for market access. Budget for registration and post-market surveillance rather than assuming zero regulatory overhead.

## CON-REG-03: Data protection under DPDP
- source: product/00-PRD.md §11.3 (REG-005, REG-006, REG-007)
- type: nfr
- content: REG-005 collect DPDP-compliant purpose-bound consent, with no inheritance from mycyclesafe. REG-006 honour granular deletion and export rights within 72 hours. REG-007 sell no data, integrate no ad-tech SDKs, run no third-party health analytics.

## CON-REG-04: Clinical instrument licensing
- source: product/00-PRD.md §11.4 (REG-004); product/03-complete-features-spec.md §9.2, §9.3
- type: nfr
- content: REG-004 — the system SHALL NOT reproduce or score a copyrighted instrument without a valid licence. PHQ-9, GAD-7 and PHQ-4 are free (Pfizer released them in 2010 with no copyright restriction; commercial use and translation permitted) — use freely, but confirm which Hindi and Tamil translations are formally validated. Epworth Sleepiness Scale requires a paid commercial licence via Mapi Research Trust — license or avoid. STOP-BANG is CC BY-NC-ND, non-commercial only, no derivatives without permission — obtain written permission or avoid. Berlin Questionnaire status unclear — verify before use. Recommended path: unbranded symptom questions covering snoring, unrefreshing sleep, daytime sleepiness and witnessed apnoea, which prompt a doctor visit without reproducing or scoring a copyrighted scale, and which must not be presented as a validated instrument score.

## CON-REG-05: Store compliance
- source: product/00-PRD.md §11.5 (REG-008 to REG-012); product/03-complete-features-spec.md §3.14.6
- type: nfr
- content: REG-008 complete the Google Play health apps declaration; budget two to four weeks review latency and possible rejection. REG-009 disclose device compatibility in the store listing where sensor-based health functions are used. REG-010 include an in-app "not a medical device" disclaimer and clinician-consultation reminder. REG-011 disclose accuracy methodology for any accuracy claim; SHALL NOT cite another company's figures as ours. REG-012 prepare an App Review 2.5.4 and 2.5.14 justification before shipping overnight audio. Additionally: privacy policy in-app and in listing; Health Connect per-data-type justification.

## CON-REG-06: Marketing claims
- source: product/00-PRD.md §11.6 (REG-013, REG-014)
- type: nfr
- content: REG-013 prohibit cure, reverse and restore-fertility claims across the entire chain: application, store listing, mycyclesafe cross-promotion and influencer content. The DMR Act 1954, FSSAI and ASCI all reach this material. REG-014 attach a visible evidence grade to every content claim.

---

# Clinician-review constraints

## CON-CLIN-01: Camera heart rate cut after clinical review
- source: hackathon/proposal.md ("Proposed solution" item 8, "Scope discipline", "Clinical review")
- type: protocol
- content: The passive version is blocked on iOS, Android and web as an OS-vendor privilege. The active version that was planned was removed after clinical review, because a clinician asked what a resting heart rate would actually tell a woman with PMOS and the honest answer is nothing that changes her care. The camera was repurposed to remove work rather than generate a number nobody would act on: photograph a printed lab report, photograph a medicine strip.
- note: DIRECTLY CONTESTS product/00-PRD.md REQ-camera-vitals (FR-301, MVP P0, named as MVP critical path and demo beat 2). See INGEST-CONFLICTS.md WARN-01. Not auto-resolved.

## CON-CLIN-02: Sleep-apnoea claim must not be a headline comparison
- source: hackathon/proposal.md (Scale table, Clinical review)
- type: protocol
- content: The sleep-apnoea headline comparison was removed on clinician review. The permitted statement is pooled prevalence around 37% with odds ratio 9.52, plus the caveat that OSA prevalence varies by age, BMI, sex, ethnicity and diagnostic method. A direct headline comparison against the general-population figure is to be avoided.
- note: CONTESTED — product/00-PRD.md §2.2 states "37% prevalence in PMOS against 6% general population", which is the comparison the clinician removed. See INGEST-CONFLICTS.md WARN-03.

## CON-CLIN-03: Indian prevalence is a criteria-tied range
- source: hackathon/proposal.md (Scale table, Clinical review)
- type: protocol
- content: Indian prevalence is stated as 13.6% to 19.6% depending on the diagnostic criteria used (AE-PCOS and Rotterdam respectively), per the ICMR national survey, n=8,993, stratified sampling across 8 states. It is not to be stated as a single figure.

## CON-CLIN-04: 90-day cycle sentinel behaviour, clinician-specified
- source: hackathon/proposal.md ("Proposed solution" item 7, Clinical review)
- type: protocol
- content: The sentinel prompts review when cycles exceed 90 days, because prolonged anovulation exposes the endometrium to unopposed oestrogen. Specified with a clinician: it says "please discuss this with your healthcare provider"; it first asks whether pregnancy is possible, whether she is taking hormonal medication, and whether she is already under treatment for irregular periods; it reminds again after two to four weeks if no period is logged, with a snooze.

## CON-CLIN-05: Mental-health protocol and crisis scope, clinician-specified
- source: hackathon/proposal.md ("What we are building" safety layer, Clinical review)
- type: protocol
- content: PHQ-4 and GAD-2 monthly or user-initiated. Immediate escalation on any suicidality or self-harm response, routed to Tele-MANAS, then prompting her to contact a trusted person or her clinician, with a check-in nudge after 24 hours. Sleep-apnoea screen. The clinician's explicit instruction is that the crisis pathway as written is the right scope for now and that we should not build more than it. Screen-and-refer language was clinician-specified.

## CON-CLIN-06: Support circle is user-initiated, state-independent
- source: hackathon/proposal.md ("The support circle, and why it is built the way it is")
- type: protocol
- content: The app SHALL NOT detect low mood and alert a third party. She initiates, always. Her supporter sees only that she would like to hear from them, never a mood, a score or a symptom. She chooses anyone, or nobody, and can change it silently with no notification to the person removed. The optional recurring reminder to her supporter fires on a fixed schedule regardless of how she is, so it produces the phone call without carrying any information about her state. Rationale: a women's health app that notifies a third party about her emotional state can be turned into a monitoring tool by whoever holds the other end; defaulting the contact by marital status makes it worse. The emotional value survives; the surveillance capability never exists.

## CON-CLIN-07: Product-scope refusals recorded in the proposal
- source: hackathon/proposal.md
- type: protocol
- content: Under-18 users excluded at launch under DPDP. No supplement sales or affiliate revenue. No "late" badge anywhere in the product. No calorie counting. Weight opt-in behind a permission prompt. Skin tracking off by default. Drug information limited to the attributed approved patient leaflet — no counselling on a medicine another clinician prescribed. Gemini handles language only, never computes patterns, scores a risk or suggests a dose. The Gemini API key is held in a Worker secret binding and never ships to the client. Health data stays on the device.

## CON-CLIN-08: CDSCO classification is unresolved and must be tested before any pilot
- source: hackathon/proposal.md ("Beyond the weekend")
- type: nfr
- content: The load-bearing legal risk is classification. Running PHQ-4 and GAD-2 on a cadence, escalating on suicidality, and prompting clinical review at a 90-day cycle threshold are exactly the behaviours that can tip software from wellness into medical device under CDSCO. The stated position is that this is unresolved, and that a CDSCO pre-submission classification opinion will be sought before any pilot with real users. The mental-health escalation pathway, including cadence, follow-up and named clinical oversight, is a pilot prerequisite treated as design work.

---

# Feasibility rulings (SPEC §0, precedence 2)

## CON-FEAS-01: No passive or background camera capture on any platform
- source: product/03-complete-features-spec.md §0.1(1), §0.3
- type: protocol
- content: Passive capture on unlock is an OS-vendor privilege, not an app capability. iOS exposes no unlock event and interrupts `AVCaptureSession` with `videoDeviceNotAvailableInBackground` on backgrounding. Android 9+ blocked background camera; Android 14+ throws `SecurityException` when a camera foreground service starts from the background. Web/PWA is the most restricted of the three. Every commercial rPPG SDK requires a foreground, user-held, still, well-lit session. Every camera feature is a 30–60s guided check-in. The word "passive" is reserved only for pedometer/accelerometer data.

## CON-FEAS-02: Ten features cut, permanently
- source: product/03-complete-features-spec.md §0.2; corroborated by product/00-PRD.md §8
- type: protocol
- content: Cut entirely, with reasons: passive HR on unlock (platform-blocked on iOS, Android, web); opportunistic re-sampling (depends on background capture); finger PPG SpO2 (App Store 1.4.1 ban plus phone sensors lack the 660nm/940nm wavelengths oximetry requires); pulse transit time blood pressure (1.4.1 ban; uncalibrated cuffless BP is not valid); bedside ballistocardiography (published evidence covers dedicated under-mattress hardware); camera stress from facial action units (construct-validity failure, Barrett et al. 2019); voice biomarker mood scoring (cross-lingual transfer collapses to ~49%, chance on a binary task; no Hindi/Tamil validation); automated hirsutism mFG scoring (no validated automated system; reference standard itself carries ~14 points interobserver variance); CGM sync (Stelo not sold in India, Libre has no legal third-party API, ~₹8,400/month); glucose-response meal tagging (depends on CGM); external keystroke dynamics (no iOS API; Android requires accessibility services which fails store review); Google Fit integration (sign-ups closed May 2024, support ends late 2026, replaced by Health Connect). These are a permanent record so they do not quietly return.

## CON-FEAS-03: Rewrites that replaced cut features
- source: product/03-complete-features-spec.md §0.3
- type: protocol
- content: Passive front-camera HR on unlock → guided 30–60s camera check-in. PHRM-style passive HR as hero → fingertip contact PPG as hero. Face rPPG as primary metric → face rPPG as secondary/beta, never the number symptoms correlate against. Wearable import (v1, load-bearing) → optional enrichment (Later/P3), no feature may depend on it. Brain fog via external typing speed → in-app typing dynamics in our own text fields only. Overnight BCG → actigraphy sleep-window detection. Facial-AU stress → 1-tap self-reported stress plus a validated instrument. Voice mood biomarker → voice-note journaling (ASR to text). Automated hirsutism score → self-scored illustrated mFG questionnaire. Google Fit / Apple Health / Samsung → Apple HealthKit and Health Connect.

## CON-FEAS-04: Native required — this cannot be a pure PWA
- source: product/03-complete-features-spec.md §0.4
- type: protocol
- content: A PWA cannot deliver the sensing core: there is no web API for HealthKit or Health Connect (both native-only), `getUserMedia` requires a visible foregrounded page, and background sync is unreliable on iOS. Native (or React Native / Flutter) is required for anything touching camera, microphone, motion or health stores. A PWA may carry the non-sensing surface only — cycle logging, symptom journal, education, doctor exports. If PWA-first India reach is wanted, the sensing features must be explicitly scoped out of it. Resolved in favour of the Capacitor shell by ADR-001.

## CON-FEAS-05: Monk Skin Tone failure rate is a first-class design constraint
- source: product/03-complete-features-spec.md §0.1(4), §3.14.4
- type: nfr
- content: Google's free-living PHRM data by Monk Skin Tone shows valid-measurement rates of 58% (MST 1–4), 45% (MST 5–7), 25% (MST 8–10). India sits predominantly in MST 5–8. Expect 25–45% of face rPPG attempts to fail quality gating. The UX must treat failure as the normal case: no broken streaks, no guilt copy, graceful degradation to zero HR data. Ship a lighting pre-check before capture. This is a major reason fingertip PPG — which showed no significant skin-tone difference — is the primary HR path and face rPPG is secondary/beta.

## CON-FEAS-06: Labs are not a device dependency, but nothing may be gated behind them
- source: product/03-complete-features-spec.md §3.6; product/00-PRD.md ADR-003
- type: protocol
- content: The no-external-devices rule exists to stop the product being unusable unless the user buys hardware. Labs fail every prong: a one-off service not an owned device, mandated by the 2023 Guideline whether or not this app exists, and low one-off cost in India (fasting insulin ~₹800, OGTT ₹100–300). Two hard constraints follow: (a) no n-of-1 pattern, experiment verdict, coaching lever, insight or doctor export may be gated behind a lab value — the lab vault is optional enrichment and everything must degrade gracefully to zero labs; (b) vitamin-D education must never be blocked on a test result.

## CON-FEAS-07: Design principles for all sensing
- source: product/03-complete-features-spec.md §3.14.7
- type: protocol
- content: (1) Foreground and user-initiated — no passive capture exists on any platform. (2) Opt-in with separate consent per sensor class (camera, mic, motion). (3) On-device first — raw video/audio never uploaded, only derived numbers sync. (4) Confidence gating — discard noisy readings, show "still learning", never false precision. (5) Self-relative only — trends vs her baseline, never population comparison. (6) Wellness framing — "signal for self-awareness", never "you have condition X". (7) Graceful degradation — every downstream feature must work with zero sensor data. (8) Failure is the normal case, especially for MST 5–8 users in warm indoor light. Device-capability gate is mandatory: check camera capability at install and provide a non-camera path.

## CON-FEAS-08: Accuracy-claim discipline and citation corrections
- source: product/03-complete-features-spec.md §0.5, §5.1; product/00-PRD.md REG-011
- type: nfr
- content: Google PHRM (Nature, 2 June 2026) is a demonstration of the science, not an integrable capability — no PHRM SDK, API, ML Kit feature or Health Connect type exists. PHRM-mini and the Google HR dataset are licensed for non-commercial, non-clinical academic research only, IRB-gated, and cannot be used. Quoted PHRM accuracy figures were computed only over clips that passed quality gating (43.1% of free-living clips) aggregated over ~231 clips/user/day; at 1–2 captures/day plan for 5–8 bpm single-measurement error and never display a single reading to the digit. Fitbit passive HR is wrist PPG on a purchased wearable, first-party only, and is never precedent for camera rPPG. Google's shipped camera features were both user-initiated: fingertip contact HR (MAPE 1.6% ± 4.3%) and front-camera respiratory rate (MAE 0.78 ± 0.61 br/min). Hard rule: no marketing or in-app copy may quote another company's accuracy figures as ours. The mHealth PCOS review at `doi.org/10.31435/ijitss...` has unverified indexing and must be replaced or corroborated before use in any pitch.

## CON-FEAS-09: Signal chains for the two validated camera measurements
- source: product/03-complete-features-spec.md §3.14.2, §3.14.3, §3.14.4
- type: api-contract
- content: Fingertip PPG — rear camera, torch on continuously, 30s at ≥30fps (60fps if available); lock auto-exposure, auto-white-balance and focus before capture (AE hunting is the number one signal killer); ROI is the full-frame mean of the RED channel; chain is per-frame spatial mean → detrend (smoothness priors, λ≈10) → 4th-order Butterworth bandpass 0.7–3.5 Hz (42–210 bpm) → peak detection plus FFT cross-check → quality gate rejecting on saturation, motion or weak AC/DC ratio; output BPM as a range or band, never a single precise digit. Coach the user to rest the finger lightly, warm hands, stay still. Respiratory rate — front camera, flash off, 30fps, 30–60s, phone propped (handheld is the main failure mode); ROI is the chest/shoulder region from pose or face-mesh landmarks expanded down; chain is dense optical flow or ROI intensity/centroid → detrend → bandpass 0.1–0.7 Hz (6–42 breaths/min) → FFT peak plus zero-crossing cross-check. Face rPPG (beta) — front camera, flash off, 30fps, exposure and WB locked, 45–60s; ROI forehead plus both cheeks via MediaPipe Face Mesh skipping eyes, lips, nostrils; chain per-ROI spatial mean R/G/B → POS or CHROM chrominance projection → detrend → bandpass → FFT; RMSE ~2 bpm in controlled lab conditions, degrades badly under low illumination and at elevated heart rates.

## CON-FEAS-10: Build-vs-buy for camera sensing
- source: product/03-complete-features-spec.md §3.14.5
- type: protocol
- content: In-house is recommended for fingertip PPG — classical DSP, open-source references `vitallens-python` and `rPPG-Toolbox` (POS/CHROM/G), no licence cost, full control, on-device by construction. Binah.ai SDK is fully on-device (matters for DPDP and offline), iOS 14+/iPhone XS+, Android 10+, per-seat pricing, negotiate flat or MAU-capped. NuraLogix Anura requires Camera2 FULL/LEVEL_3, which a material share of India's entry-level Android base will not qualify for. VitalLens (cloud) is economically impossible — priced per frame; 10K DAU at one capture/day is ~72M frames/month, roughly 18× the top published tier, and there is no Android SDK.

---

# Data model constraints (SPEC, precedence 1)

## CON-DATA-01: Entity relationships
- source: product/04-data-model.md
- type: schema
- content: USER has many CYCLE, CHECKIN, MEASUREMENT, EXPERIMENT, LAB_RESULT, CONSENT, INSIGHT; USER owns exactly one BASELINE_SET. CYCLE contains many BLEED_EVENT. CHECKIN contains many SYMPTOM_ENTRY. EXPERIMENT tracks many INTERVENTION and concludes in exactly one VERDICT. MEASUREMENT passes exactly one QUALITY_GATE.

## CON-DATA-02: Entity fields
- source: product/04-data-model.md
- type: schema
- content: USER {uuid id PK, int age_verified, string locale, enum cycle_state, bool paused}. CYCLE {uuid id PK, date start, int length_days, enum type, float phase_confidence}. CHECKIN {uuid id PK, datetime ts, int mood, int energy, int sleep_hours, time bed_time}. SYMPTOM_ENTRY {string dimension, int severity}. MEASUREMENT {uuid id PK, enum kind, float value, float confidence, enum source, string phase_tag}. EXPERIMENT {uuid id PK, string intervention, string declared_outcome, date baseline_start, date washout_end}. VERDICT {enum result, float effect_size, int n_observations, string plain_language}. INSIGHT {string pattern, int lag_days, float strength, int observations, bool surfaced}. CONSENT {enum data_class, bool granted, datetime ts, string purpose}.

## CON-DATA-03: The four schema design rules
- source: product/04-data-model.md
- type: schema
- content: (1) Every measurement carries confidence and source. (2) Every insight carries an observation count, which the confidence gate reads. (3) Consent is recorded per data class, never globally. (4) Baselines are per user and per cycle phase.

## CON-DATA-04: Field notes binding schema to requirements
- source: product/04-data-model.md
- type: schema
- content: USER.age_verified gates the 18+ requirement in REG-001; USER.paused drives pause mode FR-204. CYCLE.type carries the named states from FR-103; CYCLE.phase_confidence keeps phase estimation probabilistic per FR-107. MEASUREMENT.confidence and .source are mandatory — the n-of-1 engine weights by confidence and never mixes sources silently. INSIGHT.observations feeds the confidence gate in FR-403; INSIGHT.surfaced records whether it cleared the floor. VERDICT.result includes "no detectable change" as a first-class value per FR-406. CONSENT is one row per data class, never a global flag, required by REG-005. BASELINE_SET is held per user and per cycle phase so luteal variation is never read as an anomaly.

---

# Non-functional requirements (PRD §10, precedence 0)

## CON-NFR-01: Performance
- source: product/00-PRD.md §10.1
- type: nfr
- content: NFR-101 application cold start 2.5s or less on a ₹10,000-class Android. NFR-102 daily check-in completion 30s median. NFR-103 PPG result after capture ends 3s or less. NFR-104 pattern-reveal computation 5s or less over 18 months of data. NFR-105 doctor PDF generation 10s or less. NFR-106 application bundle size 60 MB or less initial download. NFR-107 battery drain per 30s capture 1% or less.

## CON-NFR-02: Reliability
- source: product/00-PRD.md §10.2
- type: nfr
- content: NFR-201 crash-free sessions 99.5% or better. NFR-202 zero data loss on unexpected termination; check-ins persist atomically. NFR-203 offline capability — full logging, viewing and insight display. NFR-204 sync conflict resolution last-write-wins per field, with audit trail. NFR-205 graceful degradation — every feature functions with zero sensor data. NFR-206 OEM battery-killer resilience — truncated background sessions handled without user-visible error.

## CON-NFR-03: Security
- source: product/00-PRD.md §10.3
- type: nfr
- content: NFR-301 encrypt data at rest with AES-256, keys in Secure Enclave or Android Keystore. NFR-302 TLS 1.3 or later with certificate pinning. NFR-303 optional biometric application lock. NFR-304 exclude health data from logs, crash reports and analytics payloads. NFR-305 never persist raw media beyond the processing window. NFR-306 commission an annual third-party penetration test before any scale release.

## CON-NFR-04: Privacy
- source: product/00-PRD.md §10.4, §9.12 preamble
- type: nfr
- content: NFR-401 collect only what a declared feature consumes. NFR-402 process all camera, audio and image data on device. NFR-403 granular per-class consent with independent revocation. NFR-404 full export in a machine-readable format. NFR-405 complete deletion within 72 hours across all systems. NFR-406 publish a plain-language privacy policy at eighth-grade reading level or below. Raw media is processed on the device and discarded; only derived numbers ever sync, and only with consent. Four things are never collected under any configuration: ad-tech SDKs, third-party analytics on health events, cross-user identifiable data, and raw video or audio.

## CON-NFR-05: Accessibility
- source: product/00-PRD.md §10.5
- type: nfr
- content: NFR-501 meet WCAG 2.1 AA across all user-facing surfaces. NFR-502 support TalkBack and VoiceOver fully. NFR-503 maintain 4.5:1 contrast minimum, never using colour alone to convey state. NFR-504 support dynamic type to 200% without layout breakage. NFR-505 touch targets 44 by 44 points or larger. NFR-506 provide a non-visual guidance path for camera capture.

## CON-NFR-06: Localisation
- source: product/00-PRD.md §10.6
- type: nfr
- content: NFR-601 ship English at launch, Hindi and Tamil at v1. NFR-602 use formally validated translations for clinical screeners; machine translation is prohibited. NFR-603 adapt cuisine and coaching content regionally rather than translating it. NFR-604 format dates, numbers and units per locale.

## CON-NFR-07: Content and safety
- source: product/00-PRD.md §10.7
- type: nfr
- content: NFR-701 attach an evidence grade and review date to every health claim. NFR-702 have a qualified clinician review content before release. NFR-703 prohibit cure, reverse, restore-fertility and guaranteed-outcome language everywhere, including influencer and cross-promotional copy. NFR-704 have a mental-health professional review crisis content. NFR-705 re-review the evidence base on guideline updates: NICE December 2026, international refresh 2028.

## CON-NFR-08: Compatibility
- source: product/00-PRD.md §10.8
- type: nfr
- content: NFR-801 support Android 8.0 and later (the Health Connect floor) and iOS 14 and later. NFR-802 function on 2 GB RAM devices. NFR-803 gate camera features on a capability check with a functional fallback. NFR-804 design portrait-first, tablet-tolerant.

## CON-NFR-09: Observability
- source: product/00-PRD.md §10.9
- type: nfr
- content: NFR-901 exclude health-data values from product analytics; events and counts only. NFR-902 monitor PPG capture success rate segmented by device class and skin tone. NFR-903 log crisis-path invocations as counts only, reviewed weekly. NFR-904 monitor pattern-reveal suppression rate to detect an over-tight confidence floor.

---

# Build-spec constraints (SPEC, precedence 3 — PRD wins on any disagreement)

## CON-BUILD-01: Naming rule — PMOS primary, "(formerly PCOS)" for recognition
- source: product/02-build-spec.md hook, §2
- type: protocol
- content: On 12 May 2026, after a 14-year global consensus across 56 organisations, PCOS was officially renamed PMOS — Polyendocrine Metabolic Ovarian Syndrome (The Lancet; 3-year rollout across 195 countries). The rename exists to stop framing the condition as a cysts/fertility problem and reframe it as a lifelong multisystem metabolic-endocrine condition. Use PMOS as the primary term and note "(formerly PCOS)" for user recognition, since women still search and self-identify with "PCOS".

## CON-BUILD-02: Engine must be interpretable statistics, not a neural black box
- source: product/02-build-spec.md §5; corroborated by hackathon/proposal.md (Tech stack)
- type: protocol
- content: The personalisation engine uses interpretable per-user time-series statistics — lagged cross-correlation, change-point detection, Bayesian small-sample estimates — chosen over a neural black box because the output must be explainable and trustworthy. The proposal states the same constraint as: per-user baselines, lagged cross-correlation, bootstrap confidence intervals, false-discovery-rate correction, in TypeScript, deterministic precisely because every insight must survive "how do you know that?". Testing many lag-and-symptom pairs surfaces spurious correlations by chance, so FDR correction and observation counts accompany every claim.

## CON-BUILD-03: Gemini's role is language only
- source: hackathon/proposal.md (Tech stack); product/02-build-spec.md §5
- type: protocol
- content: Gemini handles language, not inference about her body. The engine finds the association numerically; Gemini turns it into plain language while preserving the uncertainty, and writes the doctor-facing summary from structured data. It never computes a pattern, scores a risk, or suggests a dose. Grounded via RAG over a curated evidence base so advice is cited, not hallucinated.

## CON-BUILD-04: Skin-photo processing — hackathon path vs production end state
- source: product/02-build-spec.md §5, §9
- type: protocol
- content: The build spec's hackathon path called a closed-source multimodal vision model with a fixed numeric rubric (acne severity, redness, oiliness, under-eye → JSON scores) for self-relative tracking, with the stated production roadmap of moving to an on-device TFLite model so the face image never leaves the phone.
- note: SUPERSEDED for production by ADR-004 (locked) and FR-905 — skin scoring runs on device and images SHALL NOT leave the device. See INGEST-CONFLICTS.md INFO-02.

## CON-BUILD-05: Named risks
- source: product/02-build-spec.md §9
- type: protocol
- content: Small-n correlation is the credibility trap — overclaiming a pattern from five data points is the failure mode; the confidence gate and "still learning" honesty are core, not optional. Body-image harm — the skin selfie must be dignity-first or it worsens the exact distress it should ease. Skin-photo privacy — disclose any cloud path, get consent, do not store. Not a doctor — must escalate red flags, never replace care. Retention — consumer health apps die on churn; the personalisation reveal is the retention mechanic, which is why it is the MVP, not a feature.

## CON-BUILD-06: Hackathon demo mechanics from the build spec
- source: product/02-build-spec.md §6, §7
- type: protocol
- content: Build one thing flawlessly — the personalisation reveal loop. Ship with a seeded 60-day synthetic history for a persona ("Priya") so the engine has data to reveal a real pattern live, then let a judge do a fresh check-in to show the loop. Cut to vision/slideware: community, full mental-health suite, doctor-share export, supplement timing, wearable import, multi-language depth.
- note: SUPERSEDED by build-plan.md (prec 5) for the 8–9 August event: the seeded dataset is fourteen months, not 60 days, and generated under the blind-test protocol (CON-SEQ-04); the doctor export is ring 1 spine and is not cut. See INGEST-CONFLICTS.md INFO-03.

---

# Architecture constraints

## CON-ARCH-01: Three-tier architecture, health data on device
- source: hackathon/proposal.md (High-level architecture)
- type: protocol
- content: Organising principle — her health data stays on her phone, and only what is needed for accounts and operations crosses the network. Client: Capacitor app (Android/iOS) wrapping a React PWA, containing the React UI, the n-of-1 engine in TypeScript running on device, IndexedDB holding all health data, and native Swift/Kotlin plugins for camera capture, on-device OCR and encrypted storage. Edge: Cloudflare Pages serving the PWA shell, Workers for accounts, admin metrics and the AI proxy, and D1 for accounts and aggregate metrics with no personal health records. Gemini API is reached only through the Worker, with the key held in a Worker secret binding. Camera images are discarded on device after values are extracted. PDF generation is client-side to avoid a Worker CPU timeout on long histories.

## CON-ARCH-02: Tech stack
- source: hackathon/proposal.md (Tech stack)
- type: protocol
- content: Frontend React 18, TypeScript, Vite, Tailwind (the team's existing stack). Client shell Capacitor 6. Local store IndexedDB via Dexie, offline-first. Hosting Cloudflare Pages. API Cloudflare Workers. Database Cloudflare D1. Secrets via Worker secret bindings. Gemini API for the grounded companion with retrieval over a curated guideline corpus with citations; Gemini Nano for on-device inference where hardware supports it. Native Swift and Kotlin plugins for camera capture, on-device OCR and encrypted storage. Text recognition via on-device ML Kit OCR with a curated Indian medicine and lab-analyte vocabulary for post-correction, values always shown for confirmation before saving. Testing: unit tests on the correlation engine against synthetic series with known correlations and known noise; OCR checked against a fixed set of real Indian lab reports and medicine strips, measuring extraction accuracy and how often it wrongly claims confidence.

## CON-ARCH-03: Privacy and consent boundaries
- source: product/03-complete-features-spec.md §6.8; product/00-PRD.md §9.12
- type: protocol
- content: Granular DPDP consents are collected separately for: cycle and symptom data, camera sensing (PPG, respiratory), skin/hair images, mental-health screeners, mycyclesafe import, and microphone/sleep audio. Never leaves the device: raw camera frames, raw audio recordings, skin selfie pixels. Encrypted sync (opt-in) carries only derived numeric features (HR, respiratory rate, skin trend), check-in events and lab values. Never collected: ad-tech SDKs, third-party health analytics, cross-user identifiable data, raw video or audio ever.
