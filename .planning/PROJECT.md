# PMOS Companion (working name)

> Name is unresolved — PRD open decision D3. "Cyster" appears in `product/02-build-spec.md` as a
> placeholder and is **not** the name. Do not adopt any name until D3 is decided.

## What This Is

A daily well-being companion for Indian women aged 18 to 35 with PMOS (Polyendocrine Metabolic
Ovarian Syndrome, renamed from PCOS by a Monash-led global consensus published in The Lancet on
12 May 2026). It treats an irregular cycle as signal rather than error, learns each user's own
lagged cause-and-effect patterns from what she logs, and turns eighteen months of lived experience
into evidence a doctor accepts in a seven-minute consultation. It runs on a ₹10,000 phone and
requires no purchased hardware.

## Core Value

The n-of-1 correlation engine tells her something true about her own body that nobody has told her
— and is honest enough to say when there is nothing there.

**Developer-facing success metric (the single measurable definition of the project working):**
the correlation engine recovers a planted lagged relationship it was never told about, **and**
correctly reports no pattern on a deliberately null pair. Both controls must pass. One without the
other is a failure.

## Business Context

- **Customer**: Indian women 18–35 with PMOS, diagnosed or suspecting it, phone-first.
- **Revenue model**: Unproven, to be tested. Free forever: logging, cycle engine, doctor export,
  every safety path. Paid: personalisation depth (Experiment Mode, full pattern engine, richer
  specialist exports), anchored ₹200–500/month. No supplement sales, no affiliate revenue, ever.
- **Success metric**: See Core Value. Product metrics (D7 retention >40% at MVP, pattern reveals
  >1/user/week, fingertip PPG success >85%) are in REQUIREMENTS.md.
- **Strategy notes**: `product/00-PRD.md` is the product source of truth.
  `hackathon/build-plan.md` is authoritative for the 8–9 August event only.

## Requirements

### Validated

(None yet — nothing has shipped.)

### Active

See `.planning/REQUIREMENTS.md` for the full checkable list. Summary of milestone v1.0 scope:

- [ ] The 8–9 August hackathon deliverable: frozen contracts, blind-test proof, ring 1 spine
- [ ] Irregular-native cycle engine and 30-second check-in with pause mode
- [ ] n-of-1 correlation engine with a confidence floor and honest "still learning"
- [ ] Doctor exports: gynaecology history, one-pager, guideline-cited test requests
- [ ] Crisis-safe mental-health floor, evidence-graded coaching, retrieval companion
- [ ] Fingertip PPG camera vitals (P0, with an unanswered clinical objection — see Open Items)
- [ ] Dignity and privacy defaults: 18+ gate, weight opt-in, anti-beauty guardrails, granular consent

### Out of Scope

Permanent exclusions. Reasons recorded so they do not quietly return.

- **Under-18 users** — DPDP classifies under-18s as children and prohibits their profiling; the
  n-of-1 engine *is* profiling. No consent checkbox resolves this. REG-001, not negotiable.
- **Diagnosis, condition-likelihood scores, dose recommendations** — screen-and-refer only. Not a
  medical device.
- **Blood pressure, blood oxygen, blood glucose or temperature from phone sensors** — App Store
  Review Guideline 1.4.1; renaming the output does not avoid classification.
- **Passive or background camera/microphone capture** — an OS-vendor privilege, not an app
  capability, on iOS, Android and web alike.
- **Any feature requiring purchased hardware** — no watch, no CGM, no cuff, no strips. ADR-003.
- **The ten permanently cut features** in CON-FEAS-02: passive HR on unlock, opportunistic
  re-sampling, finger PPG SpO2, PTT blood pressure, bedside ballistocardiography, camera stress
  from facial action units, voice biomarker mood scoring, automated hirsutism mFG scoring, CGM
  sync and glucose-response meal tagging, external keystroke dynamics, Google Fit.
- **Supplement sales and affiliate links** — the only reason inositol can be graded honestly.
- **Calorie counting, macro targets, meal plans, weight-loss goals by default** — food-tracking
  depth unlocks only after an eating-disorder screen.
- **Beauty, attractiveness or symmetry scores; cross-user comparison; before-and-after collages.**
- **"Late" badges, single due-dates, pregnancy-scare prompts.**
- **Guilt streaks, punitive gamification, notification spam.**
- **Ad-tech SDKs, third-party analytics on health events, data sale, consent inherited from
  mycyclesafe.**
- **Generated text on any crisis path** — fixed text, real numbers, clinician-reviewed. Zero
  improvisation.
- **Cure / reverse / regulate-your-cycle / restore-fertility claims** anywhere in the chain,
  including cross-promotion and influencer content. DMR Act 1954, FSSAI, ASCI all reach this.
- **Community feed** — moderated community was considered and is out of scope. The user-initiated
  support circle is the surviving related feature (INFO-08).
- **Quoting another company's accuracy figures as ours** — REG-011.

## Context

**Why now.** On 12 May 2026, after fourteen years and 56 organisations, PCOS was renamed PMOS in
The Lancet, specifically to reject the cysts-and-fertility framing. NICE has adopted the name
(GID-NG10436), consultation 1 July to 11 August 2026, publication expected 9 December 2026.
Medicine redefined the condition; no product has caught up. Use PMOS as the primary term with
"(formerly PCOS)" for recognition, since women still search and self-identify with "PCOS".

**The problem.** The care pathway is a loop, not a funnel: she seeks help, is dismissed, copes
alone, returns to the clinic, and nothing accumulates. A seven-minute consultation cannot
reconstruct eighteen months. Her period app assumes a 28-day cycle and tells her she is late until
she deletes it. She buys inositol because a stranger on Reddit said it worked, takes it for six
months, and never finds out whether it did anything.

**Evidence base (use these figures, in this phrasing).**
- Prevalence: 10–13% of women globally, roughly 1 in 8, up to 70% undiagnosed (WHO, Jan 2026).
- India: **13.6% to 19.6% depending on diagnostic criteria** (AE-PCOS and Rotterdam respectively),
  ICMR national survey, n=8,993, 8 states. Never a single figure.
- Sleep apnoea: **substantially more common than in women without PMOS; pooled prevalence around
  37%, odds ratio 9.52. No direct headline comparison** — OSA prevalence varies by age, BMI, sex,
  ethnicity and diagnostic method. This phrasing is clinician-mandated; see Open Items.
- Anxiety and depression roughly 6x and 4x general population. Body-image distress worse than
  controls on every MBSRQ-AS subscale after BMI adjustment.
- Diagnostic delay ~7 months average in India.

**What she asks for.** One request recurs almost verbatim: help me identify what personally
influences my wellbeing, by logging periods, skin, mood, food, sleep and supplements to find
correlations. Honest caveat: the largest survey of what women with this condition want (n=264)
ranked trustworthy evidence-based information *ahead* of tracking. The product does both.

**Retention ladder.** Day 1 a cycle view that does not shame her. Week 1 a readable symptom
timeline. Week 4 a doctor-ready export. Week 6+ first weak-signal observations, stated honestly.
Month 3+ confident patterns and experiment verdicts. Patterns are the reward for staying, not the
price of entry.

**Competitive position.** PMOS Vera (shipped, iPhone-only) already ships irregular-native framing,
lab tracking, photo journal, doctor PDF export, weight-neutral stance, and a *stronger* privacy
architecture — no servers, no accounts, no cloud. We are at parity on framing/export/photo/labs and
**behind on privacy**. Never lead with privacy as a differentiator against Vera. Josie (waitlist)
claims pattern recognition, specialist prep reports and four cycle states matching ours exactly.
Advantage: Experiment Mode, camera vitals, crisis routing, OSA screening, screening ledger,
vernacular, zero-commerce evidence grading.

**mycyclesafe.ai — verified position.** A team member built and runs it on the same stack. Verified
figures: roughly 63 unique visitors a day, 52 countries, 2.8% India traffic, 2 registered users.
It is **not distribution**. It is a live deployment in this domain, infrastructure already
operated, and first-hand knowledge of where cycle prediction breaks down. Any earlier claim of
"500,000+ users across 120 countries" is **false and retracted**, along with every claim that
depended on it: zero-CAC distribution, brand-trust moat, "no competitor can rebuild this", the
cold-start-kill assumption, the segmentation premise, and the funnel as a defensible
differentiator. None of it may appear as a goal, metric, advantage or context. The consented
cycle-history import (PRIV-04) survives as legitimate work; its cold-start-removal outcome is
unverified.

**Team.** War Room, Tech for Good 2026, GDG Coimbatore, 8–9 August, GRD College. Dhodraj Sundaram
(lead; data model, engine, Worker, D1, Gemini proxy — never the toolchain, never the UI). Belson
Johnson (frontend only, every screen in ring order). Rahul Ramakrishnan (DevOps only; owns "it runs
on the demo phone"). Satheeshkumar (Dhodraj's second; pairs on the engine, holds the sealed
blind-test parameters, runs the demo). Stated bus-factor risk: Dhodraj is the only one who can do
the hard parts, and the predictable failure is him being pulled into a Gradle error for four hours.

## Constraints

- **Regulatory**: 18+ age gate, no processing of under-18 data. DPDP prohibits profiling of
  children; the n-of-1 engine is profiling. Not negotiable. (CON-REG-01)
- **Regulatory**: Screen-and-refer only. No diagnosis, no risk scores, no dosing. No BP/SpO2/
  glucose/temperature from device sensors. CDSCO classification is unresolved and a pre-submission
  opinion must be sought before any pilot with real users. (CON-REG-02, CON-CLIN-08)
- **Privacy**: Health records never leave the device. Only accounts and anonymised metrics cross
  the network. Raw video, audio and images are never uploaded under any configuration.
  (ADR-004, CON-ARCH-01, NFR-402)
- **Safety**: Nothing on a crisis path is generated. Fixed text, real numbers, clinician-reviewed.
  Tele-MANAS 14416 never paywalled, login-gated or rate-limited. (CON-CLIN-05, FR-602/603)
- **Sequencing**: The correlation engine is the single component that must be working at the 8–9
  August demo. Everything else is built outward from it in rings and cut from the outside in.
  Ring 1 spine — check-in, engine, insight card, export — is never cut. (CON-SEQ-01, CON-SEQ-02)
- **Sequencing**: Interface contracts in `src/types/` freeze Friday 7 August evening. Three frozen
  types: log entry, finding, export payload. A finding must be able to say *not enough data* as a
  value of the type, not as an `if` written at three in the morning. (CON-SEQ-07)
- **Sequencing**: No new complex logic after H20. Freeze at H28, cut list applied, no exceptions.
  (CON-SEQ-06)
- **Tech stack**: React 18 + TypeScript + Vite + Tailwind in a Capacitor 6 shell (Android, iOS).
  IndexedDB via Dexie, offline-first. Cloudflare Pages + Workers + D1 at the edge. Gemini API
  reached **only** through the Worker, key in a Worker secret binding, never shipped to the client.
  On-device ML Kit OCR. Native Swift and Kotlin plugins for camera, OCR and encrypted storage.
  (ADR-001, CON-ARCH-02)
- **Engine design**: Interpretable per-user statistics — lagged cross-correlation, bootstrap
  confidence intervals, FDR correction, change-point detection — in TypeScript, deterministic.
  Not a neural black box. Every insight must survive "how do you know that?". (CON-BUILD-02)
- **Gemini's role is language only.** It never computes a pattern, scores a risk, or suggests a
  dose. The engine finds the association numerically; Gemini phrases it while preserving the
  uncertainty. (CON-BUILD-03)
- **Labs are never a gate**: no pattern, verdict, coaching lever, insight or export may be gated
  behind a laboratory value. Everything degrades gracefully to zero labs. (CON-FEAS-06)
- **Performance**: cold start ≤2.5s on a ₹10,000-class Android; check-in 30s median; PPG result
  ≤3s; pattern reveal ≤5s over 18 months of data; PDF ≤10s; bundle ≤60 MB; ≤1% battery per
  30s capture. Android 8.0+, iOS 14+, 2 GB RAM. (CON-NFR-01, CON-NFR-08)
- **Accessibility**: WCAG 2.1 AA, TalkBack and VoiceOver, 4.5:1 contrast, dynamic type to 200%,
  44×44pt targets, a non-visual guidance path for camera capture. (CON-NFR-05)
- **Content**: evidence grade and review date on every health claim; qualified clinician review
  before release; mental-health professional review of crisis content. (CON-NFR-07)
- **Failure is the normal case.** Expect 25–45% of face rPPG attempts to fail for Monk Skin Tone
  5–8 users in warm indoor light. No broken streaks, no guilt copy, graceful degradation to zero
  sensor data. (CON-FEAS-05, CON-FEAS-07)

## Key Decisions

<decisions>

### ADR-001 — Capacitor shell with native plugins — **LOCKED**

**Decision.** Ship a Capacitor shell wrapping the React web application, with native plugins
(Swift/Kotlin) for every sensing capability. Roughly 85% of the product lives in the web layer;
only sensing crosses the bridge. A Capacitor native plugin runs the same Swift and Kotlin code a
fully native app would run, so for the PPG pipeline there is no capability or performance
difference.

**Scope.** Application architecture, platform shell, sensing core, camera PPG, HealthKit / Health
Connect access, on-device ML, secure storage.

**Rejected alternatives.** Pure PWA — cannot deliver the sensing core; no web API for HealthKit or
Health Connect, `getUserMedia` unreliable inside WKWebView, documented WebKit defect blanks camera
preview when torch is enabled. React Native — workable but requires rebuilding the interface
layer. Separate Swift and Kotlin codebases — buy nothing native plugins do not already provide,
cost two codebases for a four-person team.

**Consequences.** One codebase, React skills retained, native performance where it matters, any
screen replaceable with native later, store distribution which health-data permissions require
regardless.

**Note.** The build-plan's "fall back to the PWA in a mobile browser and say so on stage" is a demo
contingency, not an architecture position. The ring-1 spine contains no sensing, so the fallback
surface is exactly the non-sensing surface a PWA is permitted to carry. (INFO-06)

**Status.** LOCKED. Source: `product/00-PRD.md` §6.

### ADR-002 — Camera capture is always foreground and user-initiated — **LOCKED**

**Decision.** Every camera measurement is a foreground, user-initiated session. Interaction model:
notification → tap → foreground capture screen → 30 to 60 seconds → result. There is no passive,
background or on-unlock capture on any platform.

**Scope.** All camera sensing: fingertip PPG, respiratory rate, face rPPG, skin capture.

**Rationale.** iOS exposes no unlock event API and interrupts `AVCaptureSession` with
`videoDeviceNotAvailableInBackground` when the app backgrounds; the green recording indicator
cannot be suppressed. Android has blocked background camera since API 28, and Android 14+ throws
`SecurityException` when a camera foreground service starts from the background because `CAMERA`
is while-in-use. Web is more restricted than either. Google's PHRM works only because Google owns
the OS face-unlock hook; no PHRM SDK, API, ML Kit feature or Health Connect type exists, and the
released model is licensed non-commercial/non-clinical under IRB approval. Every commercial rPPG
SDK (Binah.ai, NuraLogix, VitalLens) requires a foreground, user-held, still session.

**Status.** LOCKED. Source: `product/00-PRD.md` §6.

### ADR-003 — No external devices — **LOCKED**

**Decision.** No feature may require the user to buy hardware. No watch, no sensor, no strips, no
cuff. The claim is: works on a ₹10,000 phone. Laboratory tests are explicitly NOT a device
dependency (a one-off service, guideline-mandated regardless, ~₹800 for fasting insulin), but the
constraint that follows is that no insight, pattern, verdict, coaching action or export may be
gated behind a laboratory value.

**Scope.** CGM sync (Dexcom Stelo, Abbott Libre), wearable dependency, glucometer, BP cuff, lab
values.

**Rationale.** Stelo is not sold in India; Libre publishes no third-party API so every working
integration violates LibreView terms; CGM costs ~₹8,400/month, roughly half average per-capita
monthly income; the 2023 Guideline names the OGTT at ₹100–300 as the accurate glycaemic test.
India's wearables market contracted 4.0% in 2025 with smartwatches down 17.6%, and budget brands
holding over half the market often ship no Health Connect integration.

**Status.** LOCKED. Source: `product/00-PRD.md` §6.

### ADR-004 — On-device inference as the privacy position — **LOCKED**

**Decision.** Inference moves onto the device. PPG signal processing (native), skin scoring (TFLite
or Core ML), sleep audio analysis (raw audio discarded), and the n-of-1 correlation engine all run
on device. Companion question answering uses an on-device LLM where hardware allows, with cloud RAG
fallback. Encrypted sync carries derived numbers only, never raw video, audio or images.

**Scope.** Inference location, privacy architecture, sync payload, camera/audio/image processing.

**Rationale.** PMOS Vera runs with no servers; we cannot claim stronger privacy while sending data
to a cloud model.

**Supersedes.** `product/02-build-spec.md` §5's cloud multimodal vision path for skin photos.
Skin scoring runs on device; images do not leave the device in production. (INFO-02)

**Status.** LOCKED. Source: `product/00-PRD.md` §6.

</decisions>

### Decision log

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| ADR-001 Capacitor shell with native plugins | PWA cannot deliver the sensing core; RN/dual-native cost more than they return for a four-person team | LOCKED |
| ADR-002 Camera capture always foreground and user-initiated | Passive capture is an OS-vendor privilege on every platform | LOCKED |
| ADR-003 No external devices | Works on a ₹10,000 phone; CGM/wearables are economically and legally unavailable in India | LOCKED |
| ADR-004 On-device inference | Cannot claim stronger privacy than Vera while sending data to a cloud model | LOCKED |
| **WARN-01 resolved: camera vitals stay P0** | Product MVP critical path and a surviving competitive advantage | ⚠️ Revisit — clinical objection unanswered, see Open Items |
| **WARN-02 resolved: voice entry is in 8–9 Aug scope** | Proposal wins; English only, on-device transcription, no audio leaves the phone; Belson, H22–H28 | — Pending — Belson already carries six screens, allocation is tight |
| **WARN-03 resolved: proposal's sleep-apnoea phrasing adopted** | Clinician removed the direct headline comparison; NFR-701/702 apply | ✓ Good |
| 18+ gate beats 16–35 and teen-safe framings | DPDP prohibits profiling of under-18s; the engine is profiling | ✓ Good — real, stated product loss |
| Community out of scope; support circle survives | Support circle is user-initiated and state-independent by design | ✓ Good |
| Build-plan supersedes build-spec on demo mechanics | 14 months of blind-test history, not 60 days; export is spine, not slideware | ✓ Good |

## Open Items

These are open. Do not treat any of them as settled.

| # | Item | Owner / gate |
|---|------|--------------|
| OPEN-01 | **Camera vitals ship at P0 with the clinical objection unanswered.** A practising clinician asked what a resting heart rate would tell a woman with PMOS and the recorded answer was "nothing that changes her care". FR-301 to FR-312 stand. NFR-702 requires clinician review before release. **A written rebuttal or a second clinical opinion is required before release.** | Blocks Phase 6 release (PPG-07) |
| OPEN-02 | **`hackathon/proposal.md` and the PRD now disagree.** The submitted, validated proposal states camera heart rate was cut. The PRD keeps it at P0. The proposal must be amended. | DOCFIX-02, Phase 1 |
| OPEN-03 | **PRD §2.2 sleep-apnoea phrasing must be amended** to the clinician-approved wording (pooled ~37%, OR 9.52, no direct headline comparison, variance caveat). | DOCFIX-01, Phase 1 |
| OPEN-04 | **Two phrases appear near-verbatim in competitor marketing** and must be renamed before any public material ships: the "Day 47" cycle framing (PMOS Vera) and the label "Building My Case" (Josie). FR-507 carries the rename instruction. | DOCFIX-03, Phase 1 |
| OPEN-05 | **CDSCO classification is unresolved.** Running PHQ-4/GAD-2 on a cadence, escalating on suicidality, and prompting review at a 90-day threshold are exactly the behaviours that can tip software from wellness into medical device. A pre-submission classification opinion must be obtained before any pilot with real users. | Pre-pilot gate |
| OPEN-06 | **D1** — standalone application or a module inside mycyclesafe. Recommendation: standalone with a deep bridge. | PRD §14 |
| OPEN-07 | **D2** — pricing and the freemium line. Recommendation: ₹200–500/month, safety paths always free, monetise personalisation never safety. | PRD §14 |
| OPEN-08 | **D3** — product name, unresolved. Options: Cyster, PMOS-forward, condition-neutral. Blocks store metadata and all public material. | PRD §14 |
| OPEN-09 | **D4** — how hard to lead with "PMOS". Recommendation: dual-name for three years. | PRD §14 |
| OPEN-10 | **D5** — clinician portal timing. Recommendation: defer until after NICE publishes, December 2026. | PRD §14 |
| OPEN-11 | **D6** — Hindi and Tamil together at v1, or Hindi first. Stated as depending on where mycyclesafe's Indian users concentrate; **that data does not exist at usable scale**, so the dependency is unresolvable as stated and D6 needs a different basis. | PRD §14 |
| OPEN-12 | **Pre-event unknowns**: hackathon start time (every clock time shifts with it); what pre-event code the organizers permit (take the stricter reading if ambiguous); repo public vs private; three unaccepted collaborator invites. | HACK-12, Phase 1 |
| OPEN-13 | **Belson's H22–H28 allocation is tight.** He carries six screens and now also owns voice entry alongside the safety-layer screens. Voice stays on the cut list as a genuine fallback to tap-only. | Phase 2, cut-list item 2 |
| OPEN-14 | **Vitalix (vitalix.health) and pmos-pcos.com are unverified** and must not be cited without checking. The mHealth PCOS review at `doi.org/10.31435/ijitss...` has unverified indexing and must be replaced or corroborated before use in any pitch. | Before any pitch |

## Three phase axes — do not conflate

Three non-equivalent sequencing schemes are in play. Keeping them separate is a hard requirement
(INFO-05).

| Axis | Authoritative for | Scheme |
|------|-------------------|--------|
| **PRD release plan** | The product | MVP Aug–Oct 2026 · v1 Oct 2026–Mar 2027 · v2 Mar–Jul 2027 · Later Aug 2027+ |
| **Build-plan rings 1–5 + cut list** | The 8–9 August weekend, and nothing else | Ring 1 spine (never cut) → ring 2 export → ring 3 cycle view → ring 4 safety → ring 5 lab capture |
| **Proposal module phases 1–3** | The proposal's own narrative | Phase 1 built over the weekend · Phase 2 enhancement · Phase 3 sync/health-store |

The GSD roadmap in `ROADMAP.md` is a fourth thing: the delivery sequence. Phases 1–2 deliver the
hackathon axis; phases 3–6 deliver the PRD MVP axis. **Camera vitals are P0 on the PRD release
axis and are NOT in the weekend rings.** Do not insert them into the weekend sequencing.

---
*Last updated: 2026-08-03 after ingest of 7 documents and resolution of WARN-01, WARN-02, WARN-03*
