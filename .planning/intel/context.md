# Context

Running notes from the DOC-classified sources: `hackathon/proposal.md` (prec 4),
`hackathon/build-plan.md` (prec 5), `product/01-product-definition.md` (prec 6).

**RETRACTION NOTICE — read before using anything from `product/01-product-definition.md`.**
That document carries a FALSE traction claim of "500,000+ users across 120 countries" for
mycyclesafe.ai, plus six dependent claims. None of it appears in this file, in `decisions.md`,
`requirements.md`, `constraints.md` or `SYNTHESIS.md`, and none of it may be reintroduced.
Verified figures for mycyclesafe.ai: roughly 63 unique visitors per day, 52 countries,
2.8% India traffic, 2 registered users. See INGEST-CONFLICTS.md INFO-01.

---

## Topic: The problem

- source: hackathon/proposal.md (Problem statement); product/00-PRD.md §2
- The care pathway is a loop, not a funnel: she seeks help, is dismissed, copes alone, returns to the clinic, and nothing accumulates. A seven-minute consultation cannot reconstruct eighteen months.
- She downloads a period app, it assumes a 28-day cycle, and weeks later tells her she is 47 days late. It keeps telling her that until she deletes it.
- She is told it is stress, or to lose weight. Roughly seven months later in India she gets a name for it, and the appointment that gives her the diagnosis gives her almost nothing else, because the clinical conversation is about fertility.
- She reads Reddit, buys inositol because a stranger said it worked, takes it for six months and never finds out whether it did anything.
- The condition is lifelong and systemic, but every tool she has treats it as an event.

## Topic: Evidence base and sourced figures

- source: hackathon/proposal.md (Scale, with sources); product/00-PRD.md §2.2
- Prevalence: 10 to 13% of women globally, roughly 1 in 8, with up to 70% undiagnosed (WHO fact sheet, Jan 2026). Pooled meta-analysis 7.9% under NIH criteria, 12.1% Rotterdam.
- Prevalence in India: 13.6% to 19.6% depending on diagnostic criteria (AE-PCOS and Rotterdam respectively), ICMR national survey, n=8,993, stratified sampling across 8 states. Criteria-tied range, never a single figure (see constraints.md CON-CLIN-03).
- Sleep apnoea: pooled prevalence around 37%, odds ratio 9.52, with the caveat that prevalence varies by age, BMI, sex, ethnicity and diagnostic method. The direct headline comparison was removed on clinician review (see constraints.md CON-CLIN-02).
- Anxiety and depression: roughly 6x and 4x general population; 75% and 58% elevated screening scores.
- Body-image distress: significantly worse than controls on every MBSRQ-AS subscale, persisting after adjustment for BMI, and mediating elevated anxiety and depression. One 587-woman survey found 84.5% in the pathological range on appearance evaluation, though that sample was self-selected and uncontrolled.
- Diagnostic delay: ~7 months average in India; 2 months to 13 years in focus groups.
- Tracker burnout: 80-field symptom logs, users quit by week three. Hardware paywalls: metabolic insight behind a ₹4,000 wearable or ₹8,400/month CGM.

## Topic: Why now — the PMOS rename

- source: hackathon/proposal.md; product/02-build-spec.md; product/00-PRD.md §1.1
- 12 May 2026: a Monash-led global consensus published in The Lancet renamed PCOS to PMOS, Polyendocrine Metabolic Ovarian Syndrome. Fourteen years, 56 organisations, more than 14,300 people surveyed. The rename exists specifically to reject the cysts-and-fertility framing.
- NICE has already adopted the name: GID-NG10436, titled *Polyendocrine Metabolic Ovarian Syndrome*, consultation 1 July to 11 August 2026, publication expected 9 December 2026. Three-year global rollout follows.
- Medicine redefined the condition; no product has caught up. That gap is the opening.
- 2023: the International Guideline had already established the metabolic framing.

## Topic: What she asks for

- source: hackathon/proposal.md; product/00-PRD.md §2.3
- One request recurs almost verbatim: help me identify what personally influences my wellbeing, by logging periods, skin, mood, food, sleep and supplements to find correlations.
- A peer-reviewed analysis of 70,685 reviews of leading cycle apps found users complaining these apps track symptoms but "do not explain how they correlate to your cycle".
- Honest caveat recorded in the proposal: the largest survey of what women with this condition want from an app (n=264) ranked trustworthy, evidence-based information as most important, ahead of tracking. Correlation is a real and repeatedly expressed need, but not the top-ranked one. This is why the product does both — the evidence-graded library and grounded companion answer the first need, the n-of-1 engine the second.

## Topic: Retention ladder — value before patterns arrive

- source: hackathon/proposal.md ("How it holds her attention before the patterns arrive")
- Day 1: a cycle view that does not shame her. Week 1: a structured symptom timeline she can read and share. Week 4: a doctor-ready export for her next appointment. Week 6+: first weak-signal observations, stated honestly. Month 3+: confident patterns and experiment verdicts.
- Patterns are the reward for staying, not the price of entry. Logging is never streak-gated and lapses are never punished, because a cohort with 4x depression rates will lapse and shame accelerates uninstalls.

## Topic: Module set and phasing as stated in the proposal

- source: hackathon/proposal.md ("What we are building")
- Phase 1: onboarding and consent (age gate, granular per-class consent); daily check-in (~12 curated dimensions, 30 seconds, pause mode, voice entry transcribed on device, English); cycle view (irregular-native timeline, interval distribution, bleeds per year); insights / correlation engine (weekly pattern reveal with observation counts and confidence, or an honest "still learning" — described as the core engine and the reason the product exists); doctor export; safety layer; lab report capture.
- Phase 2: medicine strip capture; Experiment Mode; companion; support circle; emotional continuity ("you have felt this way six times before and it lifted within four days"); skin tracking (off by default); "being understood" (shareable plain-language explainer card, scripts for hard conversations, post-appointment debrief); discretion (neutral app naming and a fast exit for users whose phones are not private).
- Phase 3: multi-device sync and platform health integration (Health Connect, HealthKit) — deliberately last; offline-first sync with conflict resolution fails visibly when half-built and adds little until the product needs a wearable, which it does not.
- The last four Phase-2 modules share one idea: the product supports the person, not just the condition. Most of the burden of PMOS is not clinical — it is explaining yourself repeatedly, doing everything right and seeing nothing change in the mirror, being asked about your fertility by relatives, and having a bad day that feels permanent.
- NOTE: these phase labels are the proposal's, and differ from the PRD's MVP/v1/v2/Later release plan and from the hackathon ring ordering. See INGEST-CONFLICTS.md INFO-05.

## Topic: Expected state of Phase 1 by Sunday (self-declared)

- source: hackathon/proposal.md ("What state Phase 1 will be in by Sunday")
- Cycle engine, check-in, cycle view: working code.
- Correlation engine: working. Lagged correlation with a confidence floor over a fixed symptom set. FDR correction and bootstrap intervals specified and partially implemented.
- Doctor export: working, one template. Safety layer: screeners and escalation working with real Tele-MANAS routing; the 24-hour follow-up nudge may not be finished. Lab report capture: working on printed reports tested, not robust to every layout. Voice check-in: working in English, on-device transcription, no audio leaves the phone.
- Phase 2 modules are specified, not built, and the team states it will say so rather than demo a mock.

## Topic: Competitive position

- source: product/00-PRD.md §5; product/03-complete-features-spec.md §7
- PMOS Vera (pmosvera.com) — shipped, iPhone-only, $5.99/mo or $39.99/yr. Already ships irregular-native framing, symptom/mood logging, lab tracking (HOMA-IR, LH:FSH, vitamin D), Apple Health read-only, photo journal for skin/hair, doctor PDF export, an explicit weight-neutral stance, and a stronger privacy architecture — no servers, no accounts, no cloud, AES-256 on device.
- Josie (josie.care) — not shipped; waitlist. Claims 50+ symptoms across 8 categories, pattern recognition, specialist-specific prep reports, "Building My Case mode", and four cycle states matching our named-states list exactly.
- Flo, Clue — shipped; 28-day assumption, the "you are late" harm, no metabolic layer. Veera, Gynoveda — clinic coaching or supplement commerce, episodic, fertility-leaning.
- Parity, not advantage: irregular-native framing, doctor export, weight-neutral design, photo journal, lab tracking, specialist reports.
- Behind: privacy architecture. Vera runs with zero servers.
- Advantage: Experiment Mode, camera vitals, crisis routing, OSA screening, screening ledger, vernacular, zero-commerce evidence grading.
- Two warnings recorded: close the privacy gap or stop claiming it — never position privacy as a lead differentiator against Vera; and rewrite copy that appears near-verbatim in competitor marketing, specifically the "Day 47" cycle framing and the label "Building My Case", before anything ships publicly.
- Still unverified: Vitalix (vitalix.health) and pmos-pcos.com — check before citing.

## Topic: Differentiator stack (01-product-definition, non-retracted entries only)

- source: product/01-product-definition.md §2
- #1 The n-of-1 engine that concludes, not just notices — one consented data plane feeding lagged cause→effect discovery and structured experiments that end in verdicts. Defensibility argument: the market is structurally bisected between cycle apps with no metabolic layer and lifestyle programs with no cycle intelligence; merging requires rebuilding their core data architecture, and DPDP/GDPR forbid incumbents merging fragmented health datasets without full re-consent. Her accumulated causal map is non-portable.
- #3 Irregular-native from the first screen — probabilistic windows with confidence bands, day-count framing, no "late" badge ever; cycle-variance shrinking as the celebrated win metric. Inverting "predict the next period" into "variance as the outcome" breaks the mass-market product Flo's users expect.
- #4 Zero-commerce evidence honesty — every claim carries a visible evidence grade and date; supplements compared honestly against metformin; no sales, no affiliate links ever. Structurally uncopyable: the moment pill revenue exists, honest grading becomes commercially impossible, and under DMR Act 1954 / FSSAI their editorial content legally converts into regulated advertising.
- #5 Dignity-first, weight-neutral by guideline — weight opt-in behind a permission prompt; progress measured as cycle-band adherence, energy, sleep regularity, screenings done. With 84.5% pathological body-image scores, shame is the churn mechanism.
- #6 Escalation quality as the product — guideline-verbatim triggers routing to doctor-ready dossiers and pre-scripted Tele-MANAS crisis flows. Advocacy-grade escalation requires clinical rigour plus non-SaMD discipline baked into prompts and eval suites.
- #7 Self-relative visual biomarkers — optional skin/hair selfie as a private trend versus only her own baseline, time-aligned to interventions, never a beauty score. Doubles as the objective outcome measure for n-of-1 experiments.
- Entry #2 in the source table was the mycyclesafe funnel and is marked SUPERSEDED in the source itself; it is excluded here under the retraction rule.
- Also demoted in the source: "owning the PMOS rename" moved from differentiator to positioning, on the reasoning that naming first-mover advantage is real but not durably defensible — anyone can rename their app. "Always-on beats episodic" was killed as fluff.

## Topic: Anti-features — what will not be built

- source: product/01-product-definition.md §4; product/03-complete-features-spec.md §8
- No supplement sales or affiliate links, ever.
- No "late" badges, single due-dates, or pregnancy-scare prompts.
- No beauty/attractiveness/symmetry scores, cross-user comparison, goal bodies, or before/after collages.
- No calorie counter, macro targets, fasting prompts, meal plans, or weight-loss goals by default; food-tracking depth unlocks only after an ED screen.
- No fertility-first funnel or ambient TTC/ovulation content.
- No under-18 users at launch.
- No diagnosis, PMOS-likelihood score, self-diagnosis quiz verdict, or dose recommendation. Screen-and-refer is permitted; score-and-conclude is not.
- No "cure PCOS", "reverse insulin resistance", "regulate your cycle" or "restore fertility" claims anywhere in the funnel, including cross-promotion and influencer content.
- No 80-field exhaustive tracker.
- No guilt streaks, punitive gamification, or notification spam.
- No ad-tech SDKs, third-party analytics on health events, or data sale — and no consent inherited from mycyclesafe.
- No human-coach-dependent core tiers, no time-boxed "90-day program" framing.
- No LLM improvisation on crisis paths.
- No passive/background camera or microphone capture.
- No feature that requires buying hardware.
- No blood pressure, blood oxygen, or blood glucose measurement from phone sensors.
- No inference of internal emotional state from facial expression.
- No quoting another company's accuracy figures as our own.

## Topic: Evidence-graded coaching levers

- source: product/01-product-definition.md §6
- Strong: movement dose (150–300 min/wk moderate + 2x strength; weekly minutes, never calories burned; 10-minute entries count; capability framing). Cycle-interval monitoring and endometrial-protection escalation (the sentinel; never suggests a progestogen). Cardiometabolic screening adherence (BP, lipids, glycaemic, OGTT — due/done/trended; celebrates the visit, not the number). Mental-health screening (skills moderate) — validated screeners then refer; CBT/ACT micro-skills framed as "skills practice, not therapy". Structured self-monitoring, goal setting and relapse prevention — the n-of-1 engine itself is a guideline-backed intervention. Metformin, escalation and adherence support only.
- Moderate: sleep regularity and OSA screening (screening directive strong). Low-glycaemic-load eating, pattern-agnostic, coached inside her cuisine, ED-gated. Yoga and mind-body — first-class logged lever, India-native adherence advantage, honest "promising, small trials" framing. Weight-inclusive framing (guideline-explicit). Vitamin D test-then-correct. Omega-3, food-first, vegetarian-aware. GLP-1s, context only, with the contraception-required safety message.
- Emerging: myo-/D-chiro-inositol — the honesty showcase: "small, inconsistent studies; metformin beats it on hirsutism; it wins on tolerability" → structured 12-week experiment with an honest verdict.
- Red lines, escalate never prescribe: chest pain, fainting, drowsy driving, critical lab values, post-menopausal or severe abnormal bleeding → "see a doctor now", localised and actionable. PHQ-9 item-9 / suicidality → pre-scripted Tele-MANAS 14416 flow, human-reviewed, never paywalled, zero generative improvisation. ED signals → suppress food-tracking depth, route to support. Never diagnose or rule out PMOS, interpret labs or wearables as clinical findings, recommend/adjust/substitute any prescription or dose, set personal lab targets, reassure that endometrial risk is negligible, or imply the ledger replaces a clinician.

## Topic: mycyclesafe.ai — verified position

- source: hackathon/proposal.md ("Beyond the weekend")
- One team member built and runs mycyclesafe.ai, an AI cycle tracker on the same stack (Astro, Cloudflare, Firebase). Built as a cause rather than a commercial product, never marketed, carries no account system or analytics, so there is no basis on which to claim traction either way.
- Verified usage: a few dozen visitors a day across 52 countries, with almost no Indian audience. The ingest manifest records the figures as roughly 63 unique visitors/day, 52 countries, 2.8% India traffic, 2 registered users.
- What it gives the team is explicitly NOT distribution. It is a live deployment in exactly this domain, infrastructure and a codebase already operated, and first-hand experience of where cycle prediction breaks down — which is what pointed them at this problem.
- PMOS Companion is the product; mycyclesafe is the reason they know it needs to exist. If it later becomes a route to early users, any cross-promotion would need fresh purpose-bound consent under DPDP rather than inherited consent.

## Topic: Business model

- source: hackathon/proposal.md ("How it sustains itself"); product/00-PRD.md §14 D2
- Free forever: logging, the cycle engine, the doctor export, and every safety path. No crisis flow or 90-day escalation will be paywalled.
- Paid: personalisation depth — Experiment Mode, the full pattern engine, richer specialist exports. Anchor around ₹200 to ₹500 a month.
- No supplement sales and no affiliate revenue: a deliberate constraint, and the only reason the evidence on inositol can be graded honestly.
- Stated explicitly as unproven — the model they would test, and the first thing they would want to learn from a pilot is whether she will pay for insight once she has seen it.

## Topic: Team and ownership

- source: hackathon/build-plan.md §2; hackathon/proposal.md (Team)
- Team: War Room. Track: AI for Good Health & Well-being. Event: Tech for Good 2026, GDG Coimbatore, 8 to 9 August, GRD College. Prep window Sunday 2 to Friday 7 August.
- Lead: Dhodraj. One person calls cuts and unblocks.
- Dhodraj Sundaram (github: dhodraj) — everything complex: data model, correlation engine, Worker, D1, Gemini proxy, integration. Never touches the toolchain or the UI.
- Belson Johnson (github: Belsonselva) — frontend only, every screen in ring order. Never blocks on Dhodraj; codes against the frozen types with hand-written fixtures.
- Rahul Ramakrishnan (github: Rahul-ramakrishnan06) — DevOps only: build, deploy, device, CI, secrets, seeding, backups. Owns the sentence "it runs on the demo phone".
- Satheeshkumar (github: SatheeshKumarSSK) — Dhodraj's second: pairs on the engine, takes mechanical work off him, holds the sealed parameters, runs the demo. Reviews every commit Dhodraj makes after hour twenty.
- Stated bus-factor risk: Dhodraj is the only one who can do the hard parts, and the predictable failure is that the core developer gets pulled into non-core work and the critical path stops for four hours. It is almost never dramatic — a Gradle error, an expired token, a broken Capacitor sync, a CSS bug. Each costs twenty minutes; six of them cost the engine.
- Sleep: the team has decided not to sleep. The schedule is built around what degrades — reaction time and typing hold up past twenty hours, judgement does not, and what goes first is the ability to notice that an approach is wrong.

## Topic: Demo scripts on record

- source: hackathon/build-plan.md §13; product/00-PRD.md §12.2; product/02-build-spec.md §7
- build-plan.md, five minutes (authoritative for the 8–9 August event): (1) her problem in her words, twenty seconds, no slides; (2) log one entry live on the phone; (3) the seeded user's insight card — the recovered finding with its uncertainty stated; (4) the null pair — the engine reports it found nothing, then explain that the person who wrote the engine did not know what was in the data; (5) the doctor export; (6) what we cut and why, briefly, because it is the strongest thing about us. Satheesh owns the laptop, cable, adapter, spare device and the recording of a working run.
- PRD §12.2, five beats: open with the rename; fingertip PPG live with a judge's finger on the camera; the reveal ("your skin flares two to three days after nights under six hours"); the export; close on distribution.
- 02-build-spec §7, 90 seconds: the abandonment stated; open Priya's companion showing a pattern found in her data; today's card with three cause-directed actions; a judge does a live 30-second check-in; closing line.
- These three scripts are not consistent on whether camera PPG appears. See INGEST-CONFLICTS.md WARN-01.

## Topic: Risks on record

- source: product/00-PRD.md §13; hackathon/build-plan.md §12; product/02-build-spec.md §9
- Product risks (PRD): competitors already ship features we claimed (critical) → lead with Experiment Mode, camera vitals and India-native depth, rewrite near-verbatim copy immediately. Privacy claim weaker than Vera's (high) → ship on-device inference, reframe, do not lead with privacy. PPG quality gate rejects too often for MST 5–8 (high) → fingertip PPG remains primary, face rPPG stays beta, failure treated as normal, monitor by skin tone. Small-sample correlation surfaces a false pattern (critical) → hard confidence floor, observation count always stated, "still learning" first-class. Skin capture worsens body-image distress (critical). A crisis is mishandled (critical). Store rejection (high). Losing the adolescent segment to DPDP (high). Retention collapse (critical) → the pattern reveal is the retention mechanism. OSA instrument licensing blocks a P0 feature (high). Indian OEM battery managers truncate background sessions (medium). The mycyclesafe bridge underperforms (high) → treat conversion as an assumption to test in week one, not a certainty, and hold an organic acquisition plan in reserve.
- Build risks (build-plan): Dhodraj pulled into toolchain or UI work → Rahul takes it back immediately. Engine finds nothing real at H10 red → all hands to engine, rings 2 to 4 abandoned. Engine fires on the null pair at H10 amber → raise the confidence floor, retest H13. Belson blocked waiting on the engine → he should not be; fixtures exist from Friday. Capacitor or Android build breaks → fall back to the PWA in a mobile browser and say so on stage rather than hiding it. Gemini quota or latency → pre-generated phrasing on the demo path; the engine is what is being shown, not the wording. Judgement degrading past H20 → no new complex logic, cut instead of debug. Demo device fails on stage → H22 screen recording, spare device, section 10 fallback. Lab OCR eats Sunday → it was optional, drop it without discussion.

## Topic: Open items requiring answers before the build

- source: hackathon/build-plan.md §15, §7
- Confirm the hackathon start time; every clock time in the schedule shifts with it.
- Ask the organizers what pre-event code is permitted. Both branches are written; if the answer is ambiguous, take the stricter reading. If pre-event code is permitted, Saturday becomes integration rather than a scramble and the H10 gate moves to H4.
- Three collaborator invites are unaccepted (Belson, Rahul, Satheesh).
- The team repo is private and the organizers' own README says to keep it public — ask which is right.
- Android toolchain installed and verified on all four machines before Friday. Demo phone chosen and wiped. Confirm the four role scopes with all four people.
