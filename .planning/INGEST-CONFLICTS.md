## Conflict Detection Report

Mode: new (net-new bootstrap, no existing .planning context to check against)
Docs synthesized: 7 (1 PRD, 3 SPEC, 3 DOC)
Precedence applied: manifest-declared per-doc integers, 0 highest — 00-PRD (0), 04-data-model (1),
03-complete-features-spec (2), 02-build-spec (3), proposal (4), build-plan (5), 01-product-definition (6)
Cross-ref cycle detection: run over 5 edges, max depth 3, no cycles found
LOCKED set: ADR-001 to ADR-004, embedded in product/00-PRD.md §6

---

### BLOCKERS (0)

No blockers. No LOCKED-vs-LOCKED contradiction was found — the four ADRs are mutually
consistent (ADR-001 shell, ADR-002 capture model, ADR-003 hardware, ADR-004 inference location
address disjoint scopes and reinforce each other). No classification was UNKNOWN or
low-confidence. No cross-ref cycles. Safe to write destination files.

---

### WARNINGS (3)

[WARNING] WARN-01 — Competing scope for REQ-camera-vitals: camera heart rate is both P0-MVP-critical-path and cut
  Found: product/00-PRD.md (prec 0) FR-301 requires fingertip PPG heart rate at MVP P0, names it the MVP critical path in §12, lists it in the MVP definition of done, sets a >85% capture-success metric, and makes it demo beat 2 ("a judge places a finger on the camera and the pulse waveform draws itself in real time"). FR-302 to FR-312 build out the same capability.
  Found: hackathon/proposal.md (prec 4) records the opposite outcome — "This replaced an earlier plan to measure heart rate from the camera. A clinician reviewing this proposal asked what a resting heart rate would actually tell a woman with PMOS, and the honest answer is nothing that changes her care. We cut it." The camera is repurposed to lab-report and medicine-strip capture. The Scope discipline section lists "Camera heart rate, passive and active" as cut.
  Found: hackathon/build-plan.md (prec 5) contains no camera vitals in any of the five rings, in the frozen types, in the five gates, or in the five-minute demo script.
  Impact: Straight precedence would silently restore a P0 feature that a practising clinician removed on clinical-value grounds. The manifest designates clinician-review outcomes as constraints, so this is not a plain lower-beats-higher case. Picking either way loses real intent: choosing the PRD discards a clinical review; choosing the proposal removes what the PRD calls the MVP critical path and one of six surviving competitive advantages (§1.2 position 2, §5.3, and 03-complete-features-spec §7.3 item 2, "no PMOS competitor has any objective physiological signal").
  → Decide explicitly and write the decision back into product/00-PRD.md before routing. If camera vitals stay, record why the clinical objection is answered. If they go, FR-301 to FR-312, the PPG success metrics in §3.3, the MVP definition of done, demo beat 2, and competitive positions §1.2(2) and §5.3 all need rewriting. Both variants are preserved: requirements.md REQ-camera-vitals and constraints.md CON-CLIN-01.

[WARNING] WARN-02 — Competing phase for voice entry in REQ-daily-checkin
  Found: product/00-PRD.md (prec 0) FR-208 places voice-note journaling at v2, priority P2 — "Voice is an input method, never a mood biomarker."
  Found: hackathon/proposal.md (prec 4) places voice entry in Phase 1, ranked second in what the product does for her ("She can speak it instead of typing it"), and states its expected Sunday state as "Working in English. On-device transcription, no audio leaves the phone."
  Found: hackathon/build-plan.md (prec 5) cut list item 2 is "voice entry drops to tap", which presumes voice entry is in scope for the weekend build at all.
  Impact: The check-in's acceptance criteria differ materially between variants (voice-capable vs tap-only). The hackathon deliverable and the product roadmap disagree about whether on-device ASR is weekend work, and build-plan's H0-to-H16 window has no ASR task in it.
  → Confirm whether voice entry is in the 8–9 August scope. If it is, it needs an owner and an hour allocation in build-plan §8. If it is not, remove it from the proposal's Phase 1 table and from the cut list, since a cut list entry for something never built is misleading.

[WARNING] WARN-03 — Competing statement of the sleep-apnoea prevalence claim
  Found: product/00-PRD.md (prec 0) §2.2 states "37% prevalence in PMOS against 6% general population. No app screens for it", and §15.2 sources it as "Sleep apnoea prevalence of 37% against 6%, odds ratio 9.52".
  Found: hackathon/proposal.md (prec 4) records that the clinician review removed exactly this comparison: "Substantially more common than in women without PMOS. Pooled prevalence around 37%, odds ratio 9.52. We avoid a direct headline comparison because OSA prevalence varies by age, BMI, sex, ethnicity and diagnostic method." The Clinical review section confirms "the sleep-apnoea headline comparison came out".
  Impact: This is a public-facing clinical claim under NFR-701 (evidence grade on every health claim) and NFR-702 (clinician review before release). Shipping the PRD's phrasing reverses a documented clinician correction and would be visible in the pitch, the store listing and in-app education.
  → Adopt the proposal's phrasing everywhere and amend product/00-PRD.md §2.2. Both variants are preserved: context.md "Evidence base and sourced figures" and constraints.md CON-CLIN-02.

---

### INFO (10)

[INFO] INFO-01 — Retracted traction claim, recorded and excluded, never to be resolved as a variant
  Note: product/01-product-definition.md (prec 6) retains a FALSE claim of "500,000+ users across 120 countries" for mycyclesafe.ai in three places: §1 positioning ("mycyclesafe.ai's 500K-user privacy-first brand"), §2 differentiator #2 (which the document itself marks SUPERSEDED), and §5, where the figure survives only inside an explicit correction note kept as the record of an error. Verified figures: roughly 63 unique visitors a day, 52 countries, 2.8% India traffic, 2 registered users. The claim and its six dependent claims — zero-CAC distribution via the in-app bridge; "brand trust transfers / from the makers of mycyclesafe" as a moat; "no competitor can buy or rebuild this" and "no competitor can shortcut this"; the cold-start-kill assumption that imported histories arrive at meaningful volume; the segmentation step presuming a user base large enough to algorithmically segment irregular-cycle cohorts; and any framing of the funnel as a defensible differentiator — appear nowhere in decisions.md, requirements.md, constraints.md, context.md or SYNTHESIS.md as fact, goal, success metric or context. hackathon/proposal.md carries the corrected position and is the source used in context.md. This is logged as INFO, not as a competing variant, and is not open for resolution.
  Note (downstream implications, recorded so they are not lost): product/00-PRD.md §1.2 position 6 and §5.3 both list "the mycyclesafe funnel" as a surviving competitive advantage, and product/03-complete-features-spec.md §7.2 marks it "structurally unique" — each rests on the retracted premise and is not carried forward as an advantage. product/00-PRD.md FR-1204 (consented cycle-history import) is preserved as a requirement because the import path and its consent airlock are legitimate work, but the cold-start-removal outcome is annotated as unverified. Open decision D6 (Hindi and Tamil sequencing) is stated as depending on where mycyclesafe's Indian users concentrate; that data does not exist at usable scale and D6 is annotated accordingly. Risk R12 in PRD §13 already states the correct posture: treat bridge conversion as an assumption to test, not a certainty.

[INFO] INFO-02 — Auto-resolved: ADR-004 (LOCKED) beats 02-build-spec on skin-photo processing
  Note: product/02-build-spec.md (prec 3) §5 specifies a closed-source cloud multimodal vision model (Gemini 2.x Vision / GPT-4o-vision) with a fixed numeric rubric for the hackathon build, and §9 names "cloud skin-photo privacy" as a disclosed gap with an on-device TFLite production roadmap. product/00-PRD.md ADR-004 is LOCKED and places skin scoring on device; FR-905 states images SHALL NOT leave the device in production; NFR-402 requires all camera, audio and image data to be processed on device; hackathon/proposal.md states camera images are discarded on device after values are extracted. LOCKED ADR wins. The build-spec position is recorded as superseded in constraints.md CON-BUILD-04. Note that skin tracking is not in any hackathon ring, so no weekend decision turns on this.

[INFO] INFO-03 — Auto-resolved: build-plan supersedes 02-build-spec on hackathon demo mechanics
  Note: product/02-build-spec.md (prec 3) §6 specifies a seeded 60-day synthetic history for a persona "Priya" and cuts the doctor-share export to slideware. hackathon/build-plan.md (prec 5) specifies fourteen months of generated history under the blind-test protocol with sealed parameters, and puts the doctor export inside the ring-1 spine that is never cut. The build-plan is the later and event-specific document and states "If this document and a message in the group disagree, this document wins." Its version governs the 8–9 August build. Recorded in constraints.md CON-BUILD-06 and CON-SEQ-02/04.

[INFO] INFO-04 — Auto-resolved: 18+ gate beats the 16–35 and teen-safe framings
  Note: product/02-build-spec.md (prec 3) §3 names the primary user as "Indian women 16–35 with PCOS". product/01-product-definition.md (prec 6) §3 specifies "not-TTC as default mode with teen-safe gate" and quotes a 13-year-old user, and §3.14/Later lists teen-safe defaults. Both are superseded by REG-001 in product/00-PRD.md (prec 0) and by product/03-complete-features-spec.md §9.1, which explicitly states the change: "Changed from 'teen-safe mode'. DPDP prohibits profiling of under-18s and our n-of-1 engine *is* profiling." hackathon/proposal.md agrees. The 18+ gate is a hard regulatory constraint recorded as CON-REG-01 and is not negotiable at any precedence.

[INFO] INFO-05 — Three different phase axes are in play and must not be conflated
  Note: the ingest set contains three non-equivalent sequencing schemes. (a) product/00-PRD.md §12 release plan: MVP Aug–Oct 2026, v1 Oct 2026–Mar 2027, v2 Mar–Jul 2027, Later Aug 2027 onward. (b) hackathon/proposal.md module table: Phase 1 built across the two days, Phase 2 enhancement, Phase 3 sync/health-store. (c) hackathon/build-plan.md rings 1 to 5 with a fixed cut list, governing only the 8–9 August weekend. These disagree on individual items — most visibly lab report capture, which is PRD v2/P1, proposal Phase 1, and build-plan ring 5 and first-to-cut; and the safety layer, which is PRD MVP/P0, proposal Phase 1, and build-plan ring 4, abandoned if the H10 blind test is red. No precedence resolution is appropriate because the axes measure different things. Downstream planning must keep the hackathon ring/cut sequencing (build-plan, authoritative for the event) separate from the product release plan (PRD, authoritative for the product).

[INFO] INFO-06 — Auto-resolved: PWA fallback is a demo contingency, not an architecture position
  Note: product/03-complete-features-spec.md (prec 2) §0.4 rules that a PWA cannot deliver the sensing core and that native is required for anything touching camera, microphone, motion or health stores. ADR-001 (LOCKED) resolves this with a Capacitor shell wrapping the React web layer. hackathon/build-plan.md (prec 5) §12 lists a risk response: "Fall back to the PWA in a mobile browser and say so on stage rather than hiding it." No contradiction in practice — the ring-1 spine (check-in, engine, insight card, export) contains no sensing, so the fallback surface is exactly the non-sensing surface §0.4 permits a PWA to carry. Recorded so the fallback is not later mistaken for an architecture decision.

[INFO] INFO-07 — Auto-resolved: product naming
  Note: product/02-build-spec.md (prec 3) uses the working name "Cyster" and marks it a placeholder. hackathon/proposal.md and product/00-PRD.md use "PMOS Companion (working name)". PRD open decision D3 records the name as unresolved, with options Cyster, PMOS-forward, or condition-neutral. D3 governs; "Cyster" is not treated as the name. Recorded in decisions.md D3.

[INFO] INFO-08 — Auto-resolved: community and support features
  Note: product/02-build-spec.md (prec 3) §3 places community inside the core daily loop as step 4, then cuts it in §6. product/01-product-definition.md (prec 6) and product/03-complete-features-spec.md §3.7 place moderated, anonymity-first community at Later/P3, and it is absent from product/00-PRD.md scope entirely. hackathon/proposal.md instead specifies a user-initiated support circle at Phase 2, with an explicit design refusal recorded as CON-CLIN-06 (the app never notifies a third party about her emotional state). Higher-precedence sources win: community is not in scope, and the support circle is the surviving related feature. The support circle appears in no PRD requirement — see INFO-09.

[INFO] INFO-09 — Content present in DOC sources but absent from the PRD
  Note: the following are specified in hackathon/proposal.md (prec 4) but have no corresponding requirement in product/00-PRD.md: medicine strip capture with attributed approved patient leaflet only (Phase 2); the support circle and its state-independent reminder design (Phase 2); emotional continuity ("you have felt this way six times before and it lifted within four days"); the "being understood" module (shareable explainer card, scripts for hard conversations, post-appointment debrief); and discretion features (neutral app naming, fast exit). These are not conflicts — the PRD is silent, not contradictory — but they are unrouted scope. They are preserved verbatim in context.md under "Module set and phasing as stated in the proposal". A roadmapper should either write requirements for them or record them as out of scope; they should not be dropped silently.

[INFO] INFO-10 — Near-verbatim competitor copy flagged for rewrite in two sources
  Note: product/00-PRD.md §5.3 and product/03-complete-features-spec.md §7.3 both record that two phrases appear near-verbatim in competitor marketing — the "Day 47" cycle framing (PMOS Vera ships "Day 47 sits inside your own usual range") and the label "Building My Case" (Josie ships "Building My Case mode"). Both must be rewritten before any public material ships. product/03-complete-features-spec.md §3.10 still uses "Building My Case" as a feature name, and product/00-PRD.md FR-507 already carries the rename instruction. Recorded so the rename is not lost between documents. Also unverified and not to be cited without checking: Vitalix (vitalix.health) and pmos-pcos.com.
