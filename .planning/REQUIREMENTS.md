# Requirements: PMOS Companion (working name)

**Defined:** 2026-08-03
**Core Value:** The n-of-1 correlation engine tells her something true about her own body that
nobody has told her — and is honest enough to say when there is nothing there.

**Scope of v1 here:** the 8–9 August hackathon deliverable plus the PRD MVP (Aug–Oct 2026).
PRD v1 / v2 / Later requirements are tracked in the deferred section and are not in the current
roadmap. Every requirement below traces to a PRD FR, a build-plan ring/gate, or an INFO-09
unrouted-scope item.

---

## v1 Requirements

### Pre-event readiness and contracts (HACK, Phase 1 subset)

- [ ] **HACK-01**: `src/types/` is frozen Friday 7 August evening with three types — the log entry
  (what a check-in writes and the engine reads), the finding (two variables, lag in days,
  direction, strength, observation count, confidence band), and the export payload. **The finding
  type can express *not enough data* as a value of the type**, not as an `if` statement. Nobody
  changes these during the build without Dhodraj agreeing out loud. (CON-SEQ-07)
- [ ] **HACK-02**: Fourteen months of demo-user history exist, generated under the blind-test
  protocol: Dhodraj writes the generator but does not choose its contents; Satheesh picks the
  planted pair from six candidates, rolls the lag and strength, runs the generator with a random
  seed, and hands Dhodraj the dataset alone. Parameters stay sealed in a file only Satheesh holds
  until the engine has reported. (CON-SEQ-04)
- [ ] **HACK-12**: Pre-event blockers are closed — hackathon start time confirmed, organizer answer
  on permitted pre-event code obtained (stricter reading if ambiguous), repo public-vs-private
  settled, three collaborator invites accepted, Android toolchain installed and verified on all
  four machines, demo phone chosen and wiped, four role scopes confirmed with all four people.

### Documentation corrections (DOCFIX, Phase 1)

- [ ] **DOCFIX-01**: `product/00-PRD.md` §2.2 and §15.2 are amended to the clinician-approved
  sleep-apnoea phrasing — substantially more common than in women without PMOS, pooled prevalence
  around 37%, odds ratio 9.52, and **no direct headline comparison**, because OSA prevalence varies
  by age, BMI, sex, ethnicity and diagnostic method. (WARN-03, CON-CLIN-02)
- [ ] **DOCFIX-02**: `hackathon/proposal.md` is amended so it no longer states that camera heart
  rate was cut, since camera vitals stand at P0 on the PRD release axis. The amendment records
  that the clinical objection remains unanswered and that release is gated on PPG-07. (WARN-01(b))
- [ ] **DOCFIX-03**: The "Day 47" cycle framing and the label "Building My Case" are renamed
  everywhere — PRD §5.3, `03-complete-features-spec` §3.10, pitch and any public material — before
  anything ships publicly. Both appear near-verbatim in competitor marketing. (INFO-10, FR-507)

### Hackathon weekend deliverable, 8–9 August (HACK, Phase 2)

Governed by `hackathon/build-plan.md` rings and cut list. This axis is the weekend only.

- [ ] **HACK-03**: The correlation engine recovers the planted lagged relationship it was never
  told about, within a day either side, **and** correctly reports nothing on the deliberately null
  pair. Both controls pass. This is the single measurable definition of the project working.
  (CON-SEQ-01)
- [ ] **HACK-04**: Ring 1 spine works end to end — a check-in writes a real row, the engine reads
  it back, a finding renders on a real screen as an insight card, and a doctor export is produced.
  The spine is never cut. (CON-SEQ-02)
- [ ] **HACK-05**: Ring 2 — the doctor export renders from the frozen export-payload type as a
  document a clinician could read.
- [ ] **HACK-06**: Ring 3 — an irregular-native cycle view showing the timeline, interval
  distribution and bleeds per year. Degrades to a plain list under cut-list item 4.
- [ ] **HACK-07**: Ring 4 — the safety layer: PHQ-4 and GAD-2, immediate escalation on any
  suicidality or self-harm response routed to Tele-MANAS 14416, all fixed text. Under cut-list
  item 3 the UI comes off and the logic stays with one slide.
- [ ] **HACK-08**: Voice entry works in English with on-device transcription and no audio leaving
  the phone. Owned by Belson, scheduled H22–H28 alongside the safety-layer screens. Remains
  cut-list item 2 — a genuine fallback to tap-only. (WARN-02 resolved in favour of the proposal)
- [ ] **HACK-09**: Ring 5 — lab report capture from a printed report. Optional, has no owner on
  purpose, happens only if the H22 checkpoint passes early, and is cut-list item 1.
- [ ] **HACK-10**: The five gates are enforced with named owners and each decided within ten
  minutes — H4 write path, H10 blind test (green/amber/red branches), H16 end to end, H22 clean
  install, H28 freeze. Cuts are called in fixed order by Dhodraj; Rahul enforces the H28 freeze.
  No new complex logic after H20. (CON-SEQ-03, CON-SEQ-05, CON-SEQ-06)
- [ ] **HACK-11**: The current APK installs clean on a wiped demo phone and the whole path works
  including with the radio off. Rahul's H22 screen recording exists so the fallback demo — engine
  on the seeded dataset, recovered lag, correctly empty null pair, doctor export as a static file —
  is always available. Someone other than the author has used it without being told how.
  (CON-SEQ-09)

### Cycle engine (CYCL, Phase 3) — PRD FR-100 family, MVP

- [ ] **CYCL-01**: Cycle windows are estimated probabilistically with confidence bands. No single
  predicted due-date is ever displayed. (FR-101)
- [ ] **CYCL-02**: Elapsed time is presented as a day count relative to her own historical range.
  Copy contains no "late", "overdue", "missed" or pregnancy-scare language. (FR-102)
- [ ] **CYCL-03**: Named cycle states are supported — regular, irregular, oligomenorrhea,
  amenorrhea, medically regulated, post-pill recovery. Each is valid, never an error. (FR-103)
- [ ] **CYCL-04**: Period, spotting, withdrawal bleed and breakthrough bleeding are distinguished,
  with flow intensity, clots and pain association. (FR-104)
- [ ] **CYCL-05**: A rolling cycle-interval distribution and a bleeds-per-year counter are
  maintained. (FR-105)
- [ ] **CYCL-06**: The 90-day sentinel raises a calm escalation at gaps over 90 days or fewer than
  4 bleeds a year, with endometrial-protection education and a one-tap gynaecology export. It first
  asks whether pregnancy is possible, whether she takes hormonal medication, and whether she is
  already under treatment; it reminds again after two to four weeks if no period is logged, with a
  snooze. It suggests no specific medication. (FR-106, CON-CLIN-04)
- [ ] **CYCL-07**: Cycle phase is estimated probabilistically with visible uncertainty. No hard
  ovulation prediction. (FR-107)

### Daily check-in (CHK, Phase 3) — PRD FR-200 family, MVP

- [ ] **CHK-01**: A full check-in completes in 30 seconds median, covering bleeding, sleep timing,
  movement, mood, energy, skin, cravings, pain and medications. (FR-201, NFR-102)
- [ ] **CHK-02**: The symptom set is capped at roughly 15 curated dimensions and never exceeds 20
  without an explicit scope decision. (FR-202)
- [ ] **CHK-03**: One-tap severity entry and a "same as yesterday" shortcut exist. (FR-203)
- [ ] **CHK-04**: Pause mode is a first-class state. Returning shows no guilt copy, no broken
  streaks and no backfill prompts. (FR-204)
- [ ] **CHK-05**: Voice-note journaling with on-device transcription writes into the symptom log,
  English at MVP. Voice is an input method, never a mood biomarker. (FR-208, upgraded from v2/P2
  per WARN-02)

### n-of-1 correlation engine (NOF1, Phase 4) — PRD FR-400 family, MVP

- [ ] **NOF1-01**: Per-user baselines are computed for every metric, segmented by cycle phase.
  No comparison against population norms. (FR-401, CON-DATA-04)
- [ ] **NOF1-02**: Lagged associations are discovered across 1 to 14 day windows — sleep to skin,
  supplement to mood, food to cycle — using interpretable statistics (lagged cross-correlation,
  bootstrap confidence intervals, FDR correction), deterministic and explainable. (FR-402,
  CON-BUILD-02)
- [ ] **NOF1-03**: A confidence floor suppresses any pattern below threshold and displays "still
  learning". No pattern is surfaced from insufficient observations. (FR-403)
- [ ] **NOF1-04**: Every reveal states observation count and signal strength in plain language,
  for example "12 observations, weak signal". (FR-404)
- [ ] **NOF1-05**: At least one pattern reveal is delivered per active user per week once
  sufficient data exists. (FR-405)

### Doctor advocacy (DOC, Phase 4) — PRD FR-500 family, MVP

- [ ] **DOC-01**: A one-tap gynaecology export produces 18-month cycle history, interval statistics
  and bleeding log as a PDF, generated client-side, in 10 seconds or less. (FR-501, NFR-105)
- [ ] **DOC-02**: A doctor one-pager presents symptom timeline, cycle history, medication log and
  guideline-cited test requests. (FR-502)
- [ ] **DOC-03**: The tests she can request are named: fasting insulin, free testosterone, DHEAS,
  75g OGTT, AMH. (FR-503)
- [ ] **DOC-04**: All app-derived physiological values in exports are labelled explicitly as
  wellness trends, not clinical measurements. (FR-504)

### Mental-health safety floor (SAFE, Phase 5) — PRD FR-600 family, MVP

- [ ] **SAFE-01**: PHQ-4 and GAD-2 run monthly or user-initiated. (FR-601, CON-CLIN-05)
- [ ] **SAFE-02**: The crisis flow is pre-scripted and human-reviewed. **Generated text appears on
  no crisis path under any circumstance.** (FR-602)
- [ ] **SAFE-03**: Crisis resources, Tele-MANAS 14416, are never paywalled, login-gated or
  rate-limited. (FR-603)
- [ ] **SAFE-04**: Food-tracking depth is gated behind an eating-disorder screen; on a positive
  screen depth is suppressed and support surfaced. (FR-604)
- [ ] **SAFE-05**: Immediate escalation fires on chest pain, fainting, drowsy driving, severe
  bleeding and suicidality, with localised guidance, then prompts her to contact a trusted person
  or her clinician, with a check-in nudge after 24 hours. (FR-609, CON-CLIN-05)

### Coaching and evidence (COACH, Phase 5) — PRD FR-700 family, MVP

- [ ] **COACH-01**: One or two evidence-graded, phase-aware micro-actions are delivered daily from
  a curated set. (FR-701)
- [ ] **COACH-02**: A visible evidence grade and review date appear on every health claim.
  (FR-702, NFR-701)
- [ ] **COACH-03**: Food language is additive and cuisine-native. No calorie counting or macro
  targets by default. (FR-703)
- [ ] **COACH-04**: Movement is tracked as weekly minutes — 150 to 300 plus two strength sessions,
  counting 10-minute entries. Calories burned are never displayed. (FR-704)
- [ ] **COACH-05**: Weight entry sits behind an opt-in permission prompt and is never a default or
  headline metric. (FR-705)

### Retrieval companion (COMP, Phase 5) — PRD FR-1100 family, MVP

- [ ] **COMP-01**: Questions are answered from a curated guideline corpus using retrieval, with
  visible source citations. Gemini is reached only through the Worker and handles language only —
  it never computes a pattern, scores a risk or suggests a dose. (FR-1101, CON-BUILD-03)
- [ ] **COMP-02**: The companion never diagnoses, estimates condition likelihood, or recommends or
  adjusts any dose. (FR-1102)
- [ ] **COMP-03**: Out-of-scope questions route to "discuss with your doctor" rather than being
  answered. (FR-1104)

### Dignity guardrails (SKIN, Phase 5) — PRD FR-900 family, MVP

- [ ] **SKIN-01**: No beauty, attractiveness or symmetry score is displayed; no cross-user
  comparison is enabled; no before-and-after collage is produced. (FR-903)

### Privacy and platform (PRIV, Phase 3) — PRD FR-1200 family, MVP

- [ ] **PRIV-01**: Purpose-bound granular consent is collected per data class — cycle and symptom
  data, camera sensing, skin images, mental-health screeners, mycyclesafe import, microphone. One
  row per class, never a global flag. Consent is never inherited from mycyclesafe. (FR-1201,
  CON-DATA-03, CON-ARCH-03)
- [ ] **PRIV-02**: One-tap full export in a machine-readable format and one-tap full deletion,
  honoured within 72 hours across all systems. (FR-1202, NFR-404/405)
- [ ] **PRIV-03**: No ad-tech SDK or third-party analytics on health events is integrated, and no
  data is sold. Health data is excluded from logs, crash reports and analytics payloads.
  (FR-1203, NFR-304, NFR-901)
- [ ] **PRIV-04**: A consented cycle-history import from mycyclesafe exists, re-collecting consent
  rather than inheriting it. **Cold-start removal is an unverified assumption, not a delivered
  outcome** — mycyclesafe has ~2 registered users and no account system. (FR-1204, INFO-01)
- [ ] **PRIV-05**: Raw video, audio and images are never uploaded under any configuration. Raw
  media is processed on device and discarded within the processing window; only derived numbers
  sync, and only with consent. Data at rest is AES-256 with keys in Secure Enclave or Android
  Keystore. (FR-1207, NFR-305, NFR-301, ADR-004)

### Regulatory build items (REG, Phases 3 and 5)

- [ ] **REG-01** *(Phase 3)*: An 18+ age gate is enforced at onboarding and no under-18 data is
  processed. `USER.age_verified` gates it in the data model. (CON-REG-01, CON-DATA-04)
- [ ] **REG-02** *(Phase 3)*: An in-app "not a medical device" disclaimer and a
  clinician-consultation reminder are present. No diagnosis, no condition-likelihood score, no
  dosing anywhere. No BP, SpO2, glucose or temperature from device sensors. (REG-010, CON-REG-02)
- [ ] **REG-03** *(Phase 5)*: A qualified clinician has reviewed all health content and a
  mental-health professional has reviewed all crisis content before release. (NFR-702, NFR-704)

### Notifications (NOTF, Phase 3) — PRD FR-1300 family, MVP

- [ ] **NOTF-01**: Every notification carries a personal insight or a due action. No generic
  engagement prompts. (FR-1301)
- [ ] **NOTF-02**: At most one or two notifications a day, with user-controlled quiet hours.
  (FR-1302)
- [ ] **NOTF-03**: No guilt-based streaks and no punitive gamification. (FR-1303)

### Camera vitals (PPG, Phase 6) — PRD FR-300 family, MVP P0

> **P0 on the PRD release axis (MVP, Aug–Oct 2026). NOT in the 8–9 August hackathon rings.**
> Ships with the clinical objection unanswered — see OPEN-01 and PPG-07.

- [ ] **PPG-01**: Fingertip PPG heart rate — rear camera with torch on continuously, 30 seconds at
  ≥30fps. Red-channel spatial mean → detrend with smoothness priors at λ≈10 → fourth-order
  Butterworth 0.7–3.5 Hz → peak detection cross-checked against FFT. Target accuracy MAPE ≤5%.
  Result within 3 seconds of capture ending. (FR-301, CON-FEAS-09, NFR-103)
- [ ] **PPG-02**: Auto-exposure, auto-white-balance and focus are locked before capture begins.
  AE hunting is the number one signal killer. (FR-302)
- [ ] **PPG-03**: A live pulse waveform renders during capture. (FR-303)
- [ ] **PPG-04**: Heart rate is displayed as a range with confidence, never a single precise digit.
  (FR-304, CON-FEAS-08)
- [ ] **PPG-05**: Captures failing saturation, motion or AC/DC ratio checks are rejected. Rejection
  is presented as normal, with guidance on what to change, and breaks no streaks. Failure is the
  normal case. (FR-305, CON-FEAS-05/07)
- [ ] **PPG-06**: Camera features are gated on device capability at install, with a fully
  functional non-camera path. Every downstream feature works with zero sensor data. (FR-311,
  NFR-205, NFR-803)
- [ ] **PPG-07**: **A written clinical rebuttal or a second clinical opinion answering the recorded
  objection — "what would a resting heart rate tell a woman with PMOS?" — exists before release.**
  Camera vitals do not ship to users without it. (OPEN-01, NFR-702)

---

## Deferred Requirements

Tracked, not in the current roadmap. Grouped by the PRD release axis so the two are not conflated.

### PRD v1 (Oct 2026 – Mar 2027)

- **Experiment Mode** (critical path): FR-406 pre-declared outcome, baseline period, 8–12 week
  window, washout and a verdict, with "no detectable change" as a first-class outcome; FR-407
  templates (myo-inositol, sleep window, spearmint, yoga, low-glycaemic eating, metformin
  adherence); FR-408 automatic pre-intervention baseline; FR-409 multi-intervention warning;
  FR-410 fused insights only on two agreeing independent signal types.
- **Cycle engine**: FR-108 medication-induced bleeds tracked separately; FR-109 cycle-variance
  reduction as the progress metric.
- **Check-in**: FR-205 obsessive-tracking detection; FR-206 home-screen widget; FR-207 self-scored
  illustrated nine-area mFG questionnaire.
- **Camera**: FR-306 contactless respiratory rate (MAE ≤2 br/min); FR-307 prop-the-phone
  onboarding; FR-308 HRV as a personal-baseline z-score only; FR-309 60/120fps capture with peak
  interpolation.
- **Doctor advocacy**: FR-505 trend charts only in exports; FR-506 specialist templates
  (gynaecology, endocrinology, dermatology, psychiatry); FR-507 evidence-pack mode **(renamed —
  see DOCFIX-03)**; FR-508 guideline-backed question scripts; FR-509 localised referral pathways.
- **Safety**: FR-605 full PHQ-9 and GAD-7 with formally validated Hindi and Tamil translations;
  FR-606 suppress action-heavy prompts on low mental-health days; FR-607 CBT/ACT micro-skills as
  skills practice; FR-608 one-tap self-reported stress rating.
- **Coaching**: FR-706 coaching derived from her own patterns; FR-707 OSA screen-and-refer with an
  urgent drowsy-driving flag, using unlicensed symptom questions unless ESS or STOP-BANG is
  properly licensed (REG-004); FR-708 evidence-graded supplement library, zero commerce; FR-709
  prescribed-treatment companion; FR-710 GLP-1 safety education with the contraception message;
  FR-711 yoga and breathwork library.
- **Labs and screening**: FR-801 guideline screening ledger; FR-802 lab vault; FR-804 nothing gated
  behind a lab value; FR-805 OGTT reminders and logging; FR-806 vitamin D test-then-correct;
  FR-807 blood pressure labelled as clinic- or pharmacy-measured.
- **Skin**: FR-901 guided selfie with lighting check; FR-902 self-relative time-lapse; FR-904
  separate unbundled consent for skin images.
- **Sleep**: FR-1001 sleep regularity by bed and wake consistency.
- **Privacy**: FR-1205 biometric application lock.
- **Notifications**: FR-1304 re-engagement copy that expects lapses.
- **Localisation**: NFR-601 Hindi and Tamil at v1 (sequencing open — OPEN-11).

### PRD v2 (Mar – Jul 2027)

- FR-310 face rPPG (POS/CHROM, experimental, never the value symptoms correlate against);
  FR-312 graceful handling of 25–45% face rPPG failure for MST 5–8 users.
- FR-803 lab OCR from a photographed printed report, confirmed by the user before saving.
- FR-905 on-device skin scoring; FR-906 coarse four-level acne category, no lesion counts.
- FR-1002 accelerometer sleep window and restlessness index; FR-1003 on-device snore detection with
  raw audio discarded; FR-1004 explicit session initiation with the platform recording indicator.
- FR-1103 on-device LLM with cloud retrieval fallback and disclosed model location.
- FR-1206 Health Connect and HealthKit write-back; FR-1208 local-first mode, no account.

### PRD Later (Aug 2027+)

- FR-411 aggregate-only, opt-in, k-anonymised cohort priors.
- Clinician portal (timing open — OPEN-10).

### Unrouted proposal scope (INFO-09) — written here at their proposal-stated phases

These are specified in `hackathon/proposal.md` and have no PRD requirement. They are recorded so
they are not dropped silently.

- **MED-01** *(proposal Phase 2)*: Medicine strip capture — photograph a strip, log the medicine,
  and surface **only the attributed approved patient leaflet**. Never generated counselling, never
  advice on a medicine another clinician prescribed. (CON-CLIN-07)
- **CIRC-01** *(proposal Phase 2)*: A user-initiated support circle. She initiates, always. Her
  supporter sees only that she would like to hear from them — never a mood, a score or a symptom.
  She chooses anyone, or nobody, and can change it silently with no notification to the person
  removed. **The app never notifies a third party about her emotional state.** (CON-CLIN-06)
- **CIRC-02** *(proposal Phase 2)*: The optional recurring supporter reminder fires on a fixed
  schedule **regardless of how she is**, so it produces the phone call while carrying no
  information about her state. State-independence is the design, not an implementation detail.
- **CONT-01** *(proposal Phase 2)*: Emotional continuity — "you have felt this way six times before
  and it lifted within four days."
- **UNDR-01** *(proposal Phase 2)*: The "being understood" module — a shareable plain-language
  explainer card, scripts for hard conversations, and a post-appointment debrief.
- **DISC-01** *(proposal Phase 2)*: Discretion features — neutral app naming and a fast exit, for
  users whose phones are not private.
- **SYNC-01** *(proposal Phase 3)*: Multi-device sync and platform health integration (Health
  Connect, HealthKit). Deliberately last — offline-first sync with conflict resolution fails
  visibly when half-built and adds little until the product needs a wearable, which it does not.

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Under-18 users | DPDP prohibits profiling of children; the n-of-1 engine is profiling. REG-001. Real, stated product loss — adolescent support becomes a funded roadmap item needing verifiable-parental-consent infrastructure. |
| Diagnosis, PMOS-likelihood score, self-diagnosis verdict, dose recommendation | Screen-and-refer is permitted; score-and-conclude is not. CDSCO / App Store 1.4.1. |
| BP, SpO2, blood glucose, body temperature from phone sensors | App Store Review Guideline 1.4.1. Renaming the output does not avoid classification. |
| Passive / background camera or microphone capture | OS-vendor privilege, not an app capability, on iOS, Android and web. |
| Passive HR on unlock; opportunistic re-sampling | Platform-blocked. Google's PHRM works only because Google owns the OS face-unlock hook; the model is non-commercial/non-clinical, IRB-gated. |
| Finger PPG SpO2; PTT blood pressure; bedside ballistocardiography | 1.4.1 ban; phone sensors lack the 660/940nm wavelengths; published BCG evidence covers dedicated hardware. |
| Camera stress from facial action units | Construct-validity failure (Barrett et al. 2019). Replaced by a one-tap self-reported rating. |
| Voice biomarker mood scoring | Cross-lingual transfer collapses to ~49%, chance on a binary task; no Hindi/Tamil validation. Voice survives as an input method only. |
| Automated hirsutism mFG scoring | No validated automated system; the reference standard itself carries ~14 points interobserver variance. |
| CGM sync, glucose-response meal tagging | Stelo not sold in India; Libre has no legal third-party API; ~₹8,400/month. ADR-003. |
| External keystroke dynamics | No iOS API; Android requires accessibility services, which fails store review. |
| Google Fit integration | Sign-ups closed May 2024, support ends late 2026. Health Connect replaces it. |
| Any feature requiring purchased hardware | ADR-003. Works on a ₹10,000 phone. |
| Supplement sales, affiliate links | The only reason the evidence on inositol can be graded honestly. |
| Calorie counting, macro targets, meal plans, fasting prompts, weight-loss goals by default | Body-image distress is the churn mechanism; food depth unlocks only after an ED screen. |
| Beauty / attractiveness / symmetry scores, cross-user comparison, before-and-after collages | Dignity-first. FR-903. |
| "Late" badges, single due-dates, pregnancy-scare prompts | The specific harm that makes her delete the app. |
| Guilt streaks, punitive gamification, notification spam | A cohort with 4x depression rates will lapse; shame accelerates uninstalls. |
| Generated text on any crisis path | One mishandled crisis ends the product. Zero LLM improvisation. |
| Cure / reverse / regulate / restore-fertility claims | DMR Act 1954, FSSAI, ASCI reach the whole chain including influencer content. |
| Ad-tech SDKs, third-party health analytics, data sale, inherited consent | DPDP REG-005/007. |
| Community feed | Out of scope at every precedence above the build spec. The user-initiated support circle is the surviving related feature. INFO-08. |
| Quoting another company's accuracy figures as ours | REG-011. Google's PHRM and Fitbit figures are not ours and are not precedent. |
| "500,000+ users across 120 countries" and its six dependent claims | **Retracted as false.** Verified: ~63 unique visitors/day, 52 countries, 2.8% India traffic, 2 registered users. Never a goal, metric, advantage or context. INFO-01. |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| HACK-01 | Phase 1 | Pending |
| HACK-02 | Phase 1 | Pending |
| HACK-12 | Phase 1 | Pending |
| DOCFIX-01 | Phase 1 | Pending |
| DOCFIX-02 | Phase 1 | Pending |
| DOCFIX-03 | Phase 1 | Pending |
| HACK-03 | Phase 2 | Pending |
| HACK-04 | Phase 2 | Pending |
| HACK-05 | Phase 2 | Pending |
| HACK-06 | Phase 2 | Pending |
| HACK-07 | Phase 2 | Pending |
| HACK-08 | Phase 2 | Pending |
| HACK-09 | Phase 2 | Pending |
| HACK-10 | Phase 2 | Pending |
| HACK-11 | Phase 2 | Pending |
| CYCL-01 | Phase 3 | Pending |
| CYCL-02 | Phase 3 | Pending |
| CYCL-03 | Phase 3 | Pending |
| CYCL-04 | Phase 3 | Pending |
| CYCL-05 | Phase 3 | Pending |
| CYCL-06 | Phase 3 | Pending |
| CYCL-07 | Phase 3 | Pending |
| CHK-01 | Phase 3 | Pending |
| CHK-02 | Phase 3 | Pending |
| CHK-03 | Phase 3 | Pending |
| CHK-04 | Phase 3 | Pending |
| CHK-05 | Phase 3 | Pending |
| PRIV-01 | Phase 3 | Pending |
| PRIV-02 | Phase 3 | Pending |
| PRIV-03 | Phase 3 | Pending |
| PRIV-04 | Phase 3 | Pending |
| PRIV-05 | Phase 3 | Pending |
| REG-01 | Phase 3 | Pending |
| REG-02 | Phase 3 | Pending |
| NOTF-01 | Phase 3 | Pending |
| NOTF-02 | Phase 3 | Pending |
| NOTF-03 | Phase 3 | Pending |
| NOF1-01 | Phase 4 | Pending |
| NOF1-02 | Phase 4 | Pending |
| NOF1-03 | Phase 4 | Pending |
| NOF1-04 | Phase 4 | Pending |
| NOF1-05 | Phase 4 | Pending |
| DOC-01 | Phase 4 | Pending |
| DOC-02 | Phase 4 | Pending |
| DOC-03 | Phase 4 | Pending |
| DOC-04 | Phase 4 | Pending |
| SAFE-01 | Phase 5 | Pending |
| SAFE-02 | Phase 5 | Pending |
| SAFE-03 | Phase 5 | Pending |
| SAFE-04 | Phase 5 | Pending |
| SAFE-05 | Phase 5 | Pending |
| COACH-01 | Phase 5 | Pending |
| COACH-02 | Phase 5 | Pending |
| COACH-03 | Phase 5 | Pending |
| COACH-04 | Phase 5 | Pending |
| COACH-05 | Phase 5 | Pending |
| COMP-01 | Phase 5 | Pending |
| COMP-02 | Phase 5 | Pending |
| COMP-03 | Phase 5 | Pending |
| SKIN-01 | Phase 5 | Pending |
| REG-03 | Phase 5 | Pending |
| PPG-01 | Phase 6 | Pending |
| PPG-02 | Phase 6 | Pending |
| PPG-03 | Phase 6 | Pending |
| PPG-04 | Phase 6 | Pending |
| PPG-05 | Phase 6 | Pending |
| PPG-06 | Phase 6 | Pending |
| PPG-07 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 68 total
- Mapped to phases: 68
- Unmapped: 0 ✓

---
*Requirements defined: 2026-08-03*
*Last updated: 2026-08-03 after ingest of 7 documents and resolution of WARN-01, WARN-02, WARN-03*
