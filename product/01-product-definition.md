# PMOS Companion — Final Product Definition

*Synthesized from three strategy lenses (retention-first, moat-first, trust-India). Where lenses conflicted, the decision and reasoning are stated inline.*

---

## 1. Positioning Statement

**For the woman whose cycle broke every period app she ever tried — and whose doctor told her to come back when she wants a baby — this is the lifelong PMOS companion that treats her irregular cycle as signal, not error, and treats her body as an experiment of one.** It learns *her* cause-and-effect patterns (sleep→skin, supplement→mood, food→cycle), coaches the evidence-graded daily levers the medical system withholds, and arms her with doctor-ready evidence against 7-month diagnostic delays. It is weight-neutral by guideline, mental-health-aware by design, and private by architecture — extending mycyclesafe.ai's 500K-user privacy-first brand into the one category that brand uniquely unlocks: the irregular-cycle women generic prediction already failed are, by definition, the PMOS audience, reachable at zero CAC through a consented in-app bridge. First to build product and vocabulary around the Lancet 2026 rename — **PMOS (formerly PCOS): lifelong metabolic-endocrine well-being, not a cyst-and-fertility problem** — at an India-first, lifelong price point no consult-led or supplement-led incumbent can follow.

*(Note: "owning the PMOS rename" appears in all three lenses as a differentiator. It is demoted here to positioning: naming first-mover advantage is real but not durably defensible on its own — anyone can rename their app. What is defensible is the product architecture the rename describes, which is the stack below.)*

---

## 2. The Differentiator Stack

Ranked by defensibility × user pain. Two panel claims were killed as fluff: *"always-on beats episodic"* (a pricing/format choice any AI entrant can copy) and *"PMOS rename ownership"* (moved to positioning, above).

| # | Claim | vs Whom | Why Genuinely Defensible |
|---|-------|---------|--------------------------|
| 1 | **The n-of-1 engine that concludes, not just notices** — one consented data plane (cycle + metabolic + mood + visual) feeding lagged cause→effect discovery and structured experiments that end in verdicts ("8 weeks myo-inositol: your cycle variance down, skin unchanged") | Posiva, Allura, PCOS Journey (retrospective dashboards); the entire split segment | The market is structurally bisected: cycle apps with no metabolic layer (Flo, Clue, Stardust, Allura) vs lifestyle programs with no cycle intelligence (Cysterhood, PCOS Pal, HealthifyMe). Merging requires rebuilding their core data architecture, and DPDP/GDPR forbids incumbents merging fragmented health datasets without full re-consent. Her accumulated causal map is non-portable — switching cost compounds daily. |
| 2 | **The mycyclesafe.ai funnel** — SUPERSEDED. The traction this assumed does not exist; see the note in the funnel section below |
| 3 | **Irregular-native from the first screen** — probabilistic windows with confidence bands, day-count framing ("day 43 of your usual 30–60 range"), no "late" badge ever; cycle-variance *shrinking* is the celebrated win metric | Flo, Clue, Stardust, Allura | Inverting "predict the next period" into "variance as the outcome" breaks the mass-market product Flo's 420M users expect — architecture debt, not a feature gap. The "late" alarm is a documented churn trigger ("anxious opening the app"). Allura, the only irregular-first rival, is thin, US-centric, distribution-less. |
| 4 | **Zero-commerce evidence honesty** — every claim carries a visible evidence grade and date; supplements compared honestly against metformin; no sales, no affiliate links, ever | Gynoveda, Cysterhood, Veera, all supplement-funded content | Structurally uncopyable: the moment pill revenue exists, "inositol is LOW certainty and metformin beats it on hirsutism" becomes commercially impossible — and under DMR Act 1954/FSSAI, their editorial content legally converts into regulated advertising. Competitors must break their own P&L to follow. |
| 5 | **Dignity-first, weight-neutral by guideline** — weight opt-in behind a permission prompt (guideline-verbatim); progress = cycle-band adherence, energy, sleep regularity, screenings done | Cysterhood ("PCOS Weight Loss"), HealthifyMe, Veera ("Fat Burn Duo") | With 84.5% pathological body-image scores, shame *is* the churn mechanism. Incumbents' brands and revenue are welded to weight loss; the 2023 guideline mandates permission-before-weighing, making this the only compliant position. Only stalled US Pollie ever tried; India is entirely open. |
| 6 | **Escalation quality as the product** — guideline-verbatim triggers (>90-day gaps, <4 bleeds/yr, OSA positives, PHQ-9 item-9) routing to doctor-ready dossiers and pre-scripted Tele-MANAS crisis flows | Posiva (exports but never coaches), all episodic clinical players (lose the 89 days between visits) | Advocacy-grade escalation requires clinical rigor + non-SaMD discipline baked into prompts and eval suites — natural for a telemedicine-background founder, a liability minefield for growth-hacked apps, and un-buildable by US incumbents who price India out. It converts doctors from gatekeepers into a distribution channel. |
| 7 | **Self-relative visual biomarkers** — optional skin/hair selfie scored by multimodal vision as a private trend vs only her own baseline, time-aligned to interventions; never a beauty score | Nobody — zero incumbents; acne/hirsutism are checkboxes everywhere | Requires two assets no rival holds together: multimodal vision competence and enough privacy trust to be handed face photos daily (Flo post-FTC cannot credibly ask). Doubles as the objective outcome measure for n-of-1 experiments — welding differentiators #1 and #7 into one loop. Her photo baseline is non-portable. |

---

## 3. Feature Set

**Key merge decisions across lenses:**
- **Mental health floor → MVP** (trust-India won over retention/moat's v1): a companion for a 6x-anxiety population cannot ship without a crisis path; scoped as PHQ-4/GAD-2 + scripted routing at launch, full validated screeners in v1.
- **Doctor one-pager → MVP** (trust-India won): the export is the peak-value moment that justifies the product's existence in India; the full advocacy kit (scripts, localized referrals) deepens in v1.
- **Daily coach → thin MVP, deep v1** (resolves retention-MVP vs moat/trust-v1): without any action layer the check-in is a diary ("I don't know what to DO with the info" is a top demand), so MVP ships a curated evidence-graded micro-action deck; full personalization from her own patterns lands in v1.
- **Experiment Mode → v1** (all lenses roughly agree): it needs data density and the supplement library to be meaningful; pattern-surfacing v0 delivers the magic earlier.
- **Screening ledger → v1** (moat/trust won over retention's "later"): it is structurally simple (reminders + storage) and is the retention spine once fertility isn't the topic.
- **Vernacular → Indian content from day one in English; Hindi/Tamil UI + validated screeners in v1** (splits retention's "later" and trust-India's "v1" honestly — validated translation is slow, credentialed work, but food/yoga content must be India-native from launch).

### MVP — the smallest set that delivers the core magic loop
*(Loop: 30-second log → pattern reveal → one micro-action → escalation when it matters.)*

| Feature | What + Why (traced) |
|---|---|
| **Irregular-native cycle engine** | Probabilistic windows with confidence bands; day-count framing; first-class states for anovulatory cycles, phantom PMS, spotting-vs-period, medication bleeds; zero "late"/pregnancy-scare copy. → #1 community grievance ("200 days… Flo never fails to remind me"); the trust handshake for the funnel. |
| **mycyclesafe handoff + consent airlock + history import** | In-app bridge framed "your cycles are data, not a bug"; fresh purpose-bound DPDP consent (never inherited); imports her cycle history so insights start day one. → activates differentiator #2; kills cold-start; legally mandatory. |
| **30-second unified check-in with pause mode** | One log: bleeding, sleep timing, movement minutes, mood, energy, skin, meds/supplements. Capped scope; missed days never punished; first-class pause. → "exhausted juggling four apps" demand; PCOS Journey's 80-field burnout is the cautionary tale; guideline-backed self-monitoring is itself an intervention. |
| **Weekly pattern reveal (n-of-1 v0)** | Her lagged associations with honest uncertainty ("skin better in the 3 days after 7+ hr nights; 12 observations, weak signal"); hard suppression floor below confidence threshold. → women hand-roll this in spreadsheets and ask Reddit "anyone else?"; the compounding-value mechanic. |
| **Daily micro-action coach (thin)** | 1–2 evidence-graded, phase-aware micro-actions/day from a curated deck, Indian-cuisine-native (additive "add dal and a vegetable" language), 10-minute movement entries count. → "I don't know what to do with the info" demand; strong movement/sleep/low-GL levers. |
| **Cycle-interval sentinel + gynae-ready export** | Rolling interval distribution and bleeds/year; calm escalation past ~90-day gaps or <4 bleeds/yr (endometrial protection — strong evidence); one-tap 18-month cycle-history PDF. → "the strongest single argument for the product's existence"; a 7-minute OPD visit cannot reconstruct this. |
| **Doctor-visit one-pager v0** | Symptom timeline + cycle history + med/supplement log; guideline-cited "tests you can ask for by name" (fasting insulin, androgens, lipids, thyroid). → "did anyone's doctor gaslight them?"; attacks the 7-month delay from launch. |
| **Crisis-safe mental-health floor** | PHQ-4/GAD-2 light check-ins; pre-scripted, human-reviewed crisis flow (Tele-MANAS 14416), zero LLM improvisation, never paywalled or login-gated. → 6x/4x prevalence means these paths fire at scale from week one; one mishandled crisis ends the brand. |
| **Dignity-first defaults** | Weight opt-in behind permission prompt; not-TTC as default mode with teen-safe gate; no shame copy anywhere; ED screen before any food-tracking depth. → 84.5% pathological body image; guideline weight-stigma mandate; "I'm 13 and I don't want sex stuff on my app." |
| **Dual-named, evidence-graded education starter** | "PMOS (formerly PCOS)" across product and store metadata; every claim graded and dated; PCOD-vs-PMOS myth-busting. → claims the rename vacuum in India; fills the "my doctor told me nothing" void PCOS Pal paywalled. |

### v1 (first 6 months) — retention + trust deepeners

| Feature | What + Why (traced) |
|---|---|
| **Experiment Mode** | Structured n-of-1 trials: pre-declared outcome, baseline, 8–12-week window, washout, honest verdict including "no detectable change." Launch templates: myo-inositol, sleep-window, spearmint, yoga. → the segment's emptiest whitespace ("noticing, never concluding"); each trial is a quarter-long engagement arc. |
| **Evidence-graded supplement library + stack tracker** | Purpose, studied dose/form, certainty grade in plain language, India availability/price; stack pipes into Experiment Mode; stacking-confound warnings; zero commerce. → "Overwhelmed by how many!"; the honesty no supplement-selling rival can match. |
| **Full mental-health layer** | Regionally validated PHQ-9/GAD-7 (proper local-language validation, not machine translation) on guideline cadence; "what this suggests and who to talk to" framing; mood-aware pacing of all coaching. → guideline mandate; mood-blind coaching on a bad day reads as pressure, and pressure is churn. |
| **Self-relative skin/hair vision trend** | Optional private selfie → trend vs her own baseline only, time-aligned to interventions, usable as an experiment outcome. Hard-coded: no beauty/symmetry score, no cross-user comparison, separate unbundled consent, one-tap disable + full deletion, no training use without explicit opt-in. → "squinting at chin hair changes alone in the dark"; sequenced to v1 so the consent spine is proven first. |
| **Full doctor-visit advocacy kit** | Question scripts (guideline-backed assertiveness training), localized referral pathways so "see a doctor" is actionable in her city and budget, red-flag "see a doctor now" copy. → deepens the MVP one-pager into the referral engine. |
| **Guideline screening ledger** | BP annually, lipids at diagnosis, glycaemic status every 1–3 yrs, OGTT pre-pregnancy; test-first vitamin D; results stored and trended; nudges written as reminders, never report cards; celebrates the completed visit, never the number. → the rename made operational; the retention spine after fertility stops being the reason she opened the app. |
| **Sleep-regularity + OSA screen-and-refer** | Bed/wake consistency tracking; guideline snoring/unrefreshed/sleepiness check-in; positive screen → doctor-ready summary; drowsy-driving urgent escalation. → OSA at 37% vs 6% — an enormous undetected metabolic driver no app screens for. |
| **Prescribed-treatment companion (metformin/GLP-1)** | Education-only: prescriber question lists, adherence + side-effect logging, n-of-1 correlation of prescribed changes; the never-delivered GLP-1 safety message (restored ovulation ⇒ contraception required). Never dose advice, never sourcing. → "handed a strip and no explanation"; highest-misinformation topic; stays cleanly non-SaMD. |
| **Vernacular v1** | Hindi/Tamil UI and content; validated local-language screeners; deeper regional-cuisine coaching; guided yoga/breathwork library as a logged lever (yoga ranked #1 for HOMA-IR and testosterone in the 19-RCT NMA — India's highest-adherence lever). → guideline says "regionally validated" literally; all eight tracker rivals are English-only. |
| **Lapse-tolerant re-engagement** | Re-engagement copy that expects lapses ("welcome back — your patterns are still here"); capped streaks; obsessive-tracking detection that eases off. → guideline relapse-prevention component; for a lifelong condition, surviving the lapse *is* the retention feature. |

### Later — the compounding vision

| Feature | Why (traced) |
|---|---|
| **Privacy-preserving cohort priors** | Aggregate-only, consented cross-user learning ("in women with patterns like yours, this showed effect in 6–8 weeks") — converts per-user switching cost into a data network effect no late entrant can bootstrap. |
| **Clinician portal + structured annual review** | Longitudinal reports co-designed with Indian gynaecologists/endocrinologists, snapped to NICE's structured annual review (final expected Dec 2026; international refresh 2028) — turns doctors into the distribution channel. |
| **Full phenotype driver profiler + lab vault** | Symptoms + labs decoded into a driver profile (insulin-resistant/adrenal/lean/post-pill) refined by her n-of-1 results — the credible answer to Instagram's "4 types" pseudoscience; only works atop accumulated data, so clones can't fake it. |
| **Local-first / on-device intelligence** | Pattern mining and skin scoring on-device with encrypted opt-in sync — the privacy promise converted from policy into verifiable architecture; the endgame of the mycyclesafe brand. |
| **Full life-stage modes** | Perimenopause; TTC as a deliberate opt-in module. Life-stage transitions become retention events instead of deletion events (16 → 50). |
| **Regional depth beyond Hindi/Tamil** | More languages, more regional cuisines — widening the governance moat over the largest underserved PMOS population on earth. |

---

## 4. Anti-Features — what we will NOT build

1. **No supplement sales or affiliate links, ever.** The single highest-leverage strategic decision: pill revenue makes honest evidence grading commercially impossible and legally converts content into regulated advertising (DMR Act 1954/FSSAI). This refusal *is* differentiator #4.
2. **No "late" badges, single due-dates, or pregnancy-scare prompts.** The segment's most-cited harm; certainty theater is churn. Irregularity is our input signal, not an error to apologize for.
3. **No beauty/attractiveness/symmetry scores, cross-user comparison, goal bodies, or before/after collages.** With 84.5% pathological body-image scores this is iatrogenic. The selfie is hard-coded self-relative-only or it doesn't ship — and we defend that publicly.
4. **No calorie counter, macro targets, fasting prompts, meal plans, or weight-loss goals by default.** Food tracking is the highest ED-risk surface per the guideline; depth unlocks only after an ED screen; weight is permission-based and never the headline.
5. **No fertility-first funnel or ambient TTC/ovulation content.** "Come back when you want a baby" is the dismissal this product exists to answer. Fertility is a later opt-in module, invisible to teens and not-TTC users.
6. **No diagnosis, PMOS-likelihood score, self-diagnosis quiz verdicts, or dose recommendations.** The non-SaMD line (CDSCO draft, EU MDR Rule 11, FDA wellness carve-out) is enforced in LLM system prompts and the eval suite, not just the ToS. Screen-and-refer is permitted; score-and-conclude is not.
7. **No "cure PCOS," "reverse insulin resistance," "regulate your cycle," "restore fertility" claims anywhere in the funnel** — including mycyclesafe cross-promotion and influencer content (DMR/FSSAI/ASCI reach the whole marketing chain). Gynoveda's unfalsifiable claims are the trust vacuum we position against, not a playbook.
8. **No 80-field exhaustive tracker.** PCOS Journey proves breadth without prioritization burns users out by week three. The check-in stays capped at the fixed set the n-of-1 engine actually needs.
9. **No guilt streaks, punitive gamification, or notification spam.** Every notification carries a personal insight or a due action; shame accelerates the deletion pipeline in exactly this population.
10. **No ad-tech SDKs, third-party analytics on health events, or data sale — and no consent inherited from mycyclesafe.** Flo's FTC settlement proves one integration poisons a brand for a decade; DPDP makes it illegal as well as self-destructive.
11. **No human-coach-dependent core tiers, no time-boxed "90-day program" framing.** Pollie's collapse proves coach economics fail under $70/mo; Veera's day-90 cliff proves program framing fails a lifelong condition. AI-first, always-on, lifelong pricing is the structural wedge.
12. **No LLM improvisation on crisis paths.** Suicidality signals route only to pre-scripted, human-reviewed, locally resourced flows (Tele-MANAS 14416) — never paywalled, never generative.

---

## 5. The mycyclesafe.ai Funnel Play

**The asset:** an existing unmarketed cycle tracker on the same stack. NOTE: an earlier draft of this document claimed 500K+ users across 120 countries, taken from the product's own landing page. Verified against Cloudflare and Firebase, actual usage is a few dozen visitors a day with no account system in place. The corrected position is in hackathon/proposal.md. The women whose cycles break generic prediction — the ones mycyclesafe *already knows it fails* — are precisely the PMOS-companion audience. No competitor can buy or rebuild this.

**Segmentation (inside mycyclesafe):** identify irregular-cycle users algorithmically — cycle length habitually >35 days, high inter-cycle variance, repeated prediction misses, long gaps (>60–90 days), <4 bleeds/year. These are engagement-failure signals for a tracker and qualification signals for the companion.

**The bridge (in-app, consented):** a well-being-framed invitation — *"Your cycles don't follow the usual pattern. That's not a bug in your body — it's data. There's a companion built for exactly this."* Never "you might have PMOS" (a diagnostic claim that crosses the SaMD line). The qualifying signal is that prediction fails on her; the offer is a product built for that reality.

**The consent airlock (non-negotiable):** consent is re-collected at the boundary, never inherited. A user who consented to cycle tracking has not consented to a metabolic, mental-health, and facial-image companion (DPDP 2023 purpose-bound explicit consent; GDPR Art. 9). Ship separate, unbundled, purpose-specific consents for: (a) cycle-history import, (b) PMOS symptom/metabolic data, (c) mental-health screening responses, (d) skin images — each with granular deletion and one-tap export. Plain-language data promise; no ad-tech SDKs on either property.

**Cold-start kill:** with consent, her mycyclesafe cycle history imports on day one — the pattern engine and interval sentinel start with 12–18 months of data instead of eight empty weeks. No competitor can shortcut this.

**Brand mechanics:** shared privacy-first trust transfers ("from the makers of mycyclesafe"); all cross-promotion and influencer copy is claim-governed with pre-approved language (DMR/FSSAI/ASCI reach the whole chain). The reverse loop: companion users get calmer, irregular-native tracking; mycyclesafe gets a retention answer for its own hardest cohort.

---

## 6. Evidence-Based Coaching Scope

**Levers we coach** (every claim carries a visible grade and date in-product; updated when NICE lands Dec 2026 and the international guideline refreshes in 2028):

| Lever | Strength | Product role |
|---|---|---|
| Movement dose (150–300 min/wk moderate + 2x strength) | **Strong** | Weekly minutes dose, never calories burned; 10-min entries count; n-of-1 payoff shown from *her* data; capability framing, never body reshaping |
| Cycle-interval monitoring + endometrial-protection escalation | **Strong** | The sentinel: calm escalation past ~90-day gaps / <4 bleeds/yr with gynae-ready export — never suggests a progestogen |
| Cardiometabolic screening adherence (BP/lipids/glycaemic/OGTT) | **Strong** | The ledger: due/done/trended, doctor-visit prep, celebrates the visit not the number |
| Mental-health screening + stress skills | **Strong** (screening) / moderate (skills) | Validated screeners → refer; CBT/ACT micro-skills explicitly "skills practice, not therapy"; scripted crisis routing |
| Structured self-monitoring, goal setting, relapse prevention | **Strong** | The n-of-1 engine itself is a guideline-backed intervention — confidence-gated, lapse-tolerant |
| Metformin (escalation + adherence support only) | **Strong** | Education, prescriber prep, adherence/side-effect logging, n-of-1 correlation — never start/stop/dose advice |
| Sleep regularity + OSA screening | **Moderate** (screening directive strong) | Timing-consistency tracking; guideline OSA questions; screen-and-refer with export |
| Low-glycaemic-load eating (pattern-agnostic) | **Moderate** | Mechanism coached inside her cuisine, additive language, ED-gated, no calorie counting by default |
| Yoga / mind-body | **Moderate** | First-class logged lever; India-native adherence advantage; honest "promising, small trials" framing |
| Weight-inclusive framing | **Moderate** (guideline-explicit) | Permission-before-weighing productized; non-scale outcomes as default metrics |
| Vitamin D (test-then-correct) | **Moderate** | Push the test, not the pill; clinician sets the dose; app reminds retest |
| Omega-3, food-first | **Moderate** | Vegetarian-aware (ALA/algal); optional, time-boxed experiment; tied to her own lipid numbers |
| Myo-/D-chiro-inositol | **Emerging** | The honesty showcase: "small, inconsistent studies; metformin beats it on hirsutism; it wins on tolerability" → structured 12-week experiment with an honest verdict |
| GLP-1s (context only) | **Moderate** | Neutral education + the contraception-required safety message; never sourcing, dosing, or promotion |

**Red lines — escalate, never prescribe:**
- Chest pain, fainting, drowsy driving, critical lab values, post-menopausal or severe abnormal bleeding → prompt "see a doctor now," localized and actionable.
- PHQ-9 item-9 / suicidality signals → pre-scripted Tele-MANAS 14416 flow, human-reviewed, never paywalled, zero generative improvisation.
- ED signals → suppress food-tracking depth, route to support — never serve more tracking.
- Never: diagnose or rule out PMOS; interpret labs/wearables as clinical findings; recommend, adjust, or substitute any prescription or dose; set personal lab targets; reassure that endometrial risk is negligible; imply the ledger replaces a clinician.

---

## 7. Open Product Decisions

1. **Standalone app vs module inside mycyclesafe.** Standalone maximizes PMOS-native identity and consent clarity (recommended default: standalone with a deep bridge); module maximizes funnel conversion and shared retention. Decide before MVP architecture — it determines the consent flow, the app-store SEO play for "PMOS," and whether mycyclesafe's rating/reviews carry over.
2. **Pricing and the freemium line.** Anchor is Rs 200–500/mo lifelong (the wedge between Gynoveda's unintelligent Rs 2K/mo pills and Veera/sugar.fit's Rs 12–36K human-heavy programs). Must decide: what is permanently free (crisis flows and red-flag escalation are non-negotiable free; likely also the cycle engine + check-in) vs paid (pattern engine? Experiment Mode? vision trend? doctor kit?). The free tier must be generous enough to convert the funnel; the paid tier must monetize the personalization, not the safety.
3. **Brand and the rename bet.** How hard to lead with "PMOS" vs "PMOS (formerly PCOS)" in-market, given a 3-year phased transition and near-zero Indian awareness of the rename. Recommended: dual-name everywhere for 3 years, own both search surfaces — but the app's *name* itself (PMOS-forward or condition-neutral) is an unmade branding call with SEO consequences.
4. **On-device architecture timing.** Local-first is the privacy endgame (differentiator-hardening, "your images never leave your phone"), but multimodal vision scoring and LLM coaching are cloud-natural today. Decide the MVP posture (cloud with strict no-third-party guarantees + published roadmap vs on-device-first with reduced capability) — this is a public trust commitment that can't be walked back.
5. **Clinician-side product timing.** The doctor-ready export ships in MVP, but whether to invest in a true clinician portal/report format co-designed with Indian gynaecologists in year one (accelerating doctor-as-channel, differentiator #6) or defer until NICE's annual-review format lands (Dec 2026) is a sequencing bet between consumer velocity and medical-establishment trust.