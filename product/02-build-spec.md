# PMOS (formerly PCOS) Well-Being Companion — Build-Ready Spec
### Tech for Good 2026 · Track: AI for Good Health & Well-being
*Working name: **Cyster** (what women with the condition already call each other online). Name is a placeholder.*

> **⚡ Timely hook — use this to open the pitch.** On **12 May 2026**, after a 14-year global consensus across 56 organisations, PCOS was officially renamed **PMOS — Polyendocrine Metabolic Ovarian Syndrome** (*The Lancet*; 3-year rollout across 195 countries). The entire purpose of the rename is to **stop framing it as a "cysts / fertility" problem and reframe it as a lifelong, multisystem metabolic-endocrine condition.** That is *exactly this product's thesis.* The medical establishment just officially validated the wedge: the condition is about daily, lifelong metabolic well-being — not a future pregnancy. We use **PMOS** as the primary term and note "(formerly PCOS)" for user recognition, since women still search and self-identify with "PCOS" today.

> Scar-sourced. Every claim below traces to real lived-experience research, not invention. Sources at the bottom.

---

## 1. One-line pitch
**A daily well-being companion for the ~1-in-10 Indian women with PCOS whom the medical system only sees as a future pregnancy — it treats your PCOS as an experiment of one, learns what *personally* moves your symptoms, and coaches the daily levers your doctor never mentions.**

Not a period tracker. Not a fertility clinic. The abandoned middle.

---

## 2. The wedge (why this exists and nothing fills it)
> The 2026 PCOS→PMOS rename *is* the wedge, officially stamped: the condition was renamed precisely to move it off "cysts/fertility" and onto lifelong metabolic-endocrine well-being. Products haven't caught up. We build for the new definition.

PMOS products are one of two things, and both fail the daily reality:
- **Generic period trackers** — *assume a 28-day cycle and break on the irregular/absent cycles that define PCOS*; spam 7+ notifications/day; never explain what's *causing* the irregularity.
- **Fertility clinics** (Veera Health, Allara) — treat PCOS as a *conception* problem; the daily living-with-it, the mental load, the body-image grief go unowned.

The users themselves name the hole: *"help me identify what personally influences my wellbeing — log periods, skin, mood, food, sleep, supplements to spot correlations."* And the clinical truth underneath it: **PCOS is an n-of-1 disease — "what works differs significantly from person to person" — yet no product personalizes it.**

**Cyster owns that middle: personalization + beyond-fertility + dignity.**

---

## 3. Who + the daily loop
**Primary user:** Indian women 16–35 with PCOS (diagnosed or self-suspected), phone-first, active in Reddit/WhatsApp PCOS communities, failed by generic apps and dismissive doctors.

**The core loop (one condition, one device, a daily signal, always-on):**
1. **30-second morning check-in** — cycle state, today's symptoms (energy, mood, cravings, pain, bloating), sleep, and an **optional dignified skin selfie** (tracks acne/skin as *your* trend, never a "beauty score").
2. **Always-on nudges** — during the day the companion suggests the *cause-directed* action ("low sleep 3 nights → your acne usually flares in 2 days; front-load water, protein breakfast, lights out by 11").
3. **Weekly reveal** — the AI surfaces one **personal cause→effect pattern** it found in *your* data ("inositol moved your mood, not your weight"; "dairy weeks = worse skin for you").
4. **Support layer** — validation the doctor withheld, a mood-trajectory, coping tools, and community ("you're not alone" — isolation is the norm and connection is therapeutic).

---

## 4. The hard technical core (what makes it more than a form)
This is where the engineering lives — and it's honest, explainable stats, not black-box overclaiming:

1. **Irregular-cycle model** — treats a 24/45/absent cycle as *signal, not error*: probabilistic cycle-phase estimation that tolerates missing periods (the exact thing generic trackers get wrong). This alone is a real differentiator.
2. **n-of-1 personalization engine (the moat)** — per-user **lagged correlation discovery** across sparse, noisy self-report (sleep → skin, supplement → mood, food → cycle), with:
   - per-user baselines (everyone's "normal" differs),
   - **lag windows** (skin flares days after the trigger),
   - **small-n honesty** — only surfaces a pattern when it clears a confidence threshold, and says "still learning" otherwise (the discipline that separates a real tool from horoscope-ware).
3. **Daily-signal vision** — on-device skin/acne/hirsutism change-detection *relative to the user's own history* (progress, not diagnosis), with dignity-first framing and on-device processing (no image leaves the phone).
4. **Adaptive nudge engine** — cause-directed, timed to the user's predicted state; deliberately *quiet* (the anti-"7-spam-notifications" design).
5. **Mental-health layer** — validated short screeners (anxiety/depression are 6×/4× more common here) woven in as check-ins, with coping content + escalation to real help when flags trip.

---

## 5. AI stack (specific)
- **Personalization engine:** interpretable per-user time-series stats (lagged cross-correlation, change-point detection, Bayesian small-sample estimates) — chosen over a neural black box *because the output must be explainable and trustworthy* ("here's the pattern and how sure I am").
- **Conversational companion / coaching:** Gemini, grounded via RAG over a curated **evidence base** (inositol/myo+d-chiro, vit-D, omega-3, sleep, resistance training, low-GI) so advice is cited, not hallucinated, and stays in the well-being lane.
- **Skin signal (hackathon):** a **closed-source multimodal (Gemini 2.x Vision / GPT-4o-vision)** called with a **structured numeric rubric** (acne severity, redness, oiliness, under-eye → JSON scores) for self-relative tracking — zero training, buildable in hours. Feeds the correlation engine as another logged variable.
  - **Consistency:** the fixed rubric + numeric output + controlled lighting tame frame-to-frame jitter (LLM-vision is noisier than a dedicated model — flagged).
  - **Production roadmap:** move to an **on-device model (TFLite)** so the face image never leaves the phone — the privacy-correct end state (see §9).
- **Multilingual:** English + major Indian languages (companion tone, not clinical).
- **Privacy-preserving by design** — sensitive women's health data; on-device where possible, encrypted, consented (see §9).

---

## 6. The 36-hour MVP (cut ruthlessly)
**Build one thing flawlessly: the personalization reveal loop.**
- Onboarding → the 30-sec daily check-in (cycle + symptoms + sleep + optional skin selfie).
- The **n-of-1 correlation engine** running on the logged data → surfaces **one personal cause→effect insight** + one coached daily lever.
- A quiet, cause-directed nudge.
- Mood-trajectory view.

**Demo reliability:** ship with a **seeded 60-day synthetic history** for a persona ("Priya") so the engine has data to reveal a real pattern live — then let a judge do a fresh check-in to show the loop.

**Cut to vision/slideware:** community, full mental-health suite, doctor-share export, supplement-timing, wearable import, multi-language depth.

---

## 7. The 90-second demo
1. "1 in 10 Indian women has PCOS. Her doctor says 'come back when you want a baby.' Her period app assumes a 28-day cycle she hasn't had in months." — the abandonment, stated.
2. Open Priya's companion. It shows a pattern it *found in her data*: **"Your skin flares 2–3 days after nights under 6 hours. Not your face wash — your sleep."** Judges see the app know something a doctor never told her.
3. Today's card: three cause-directed actions, quiet and specific.
4. A judge does a live 30-sec check-in → it slots in, updates her trajectory.
5. "It's not a tracker and not a clinic. It's the first companion that treats PCOS as an experiment of one — and it's built from what these women are literally begging for online."

---

## 8. Competitive positioning (honest)
| Player | What it is | Why Cyster is different |
|---|---|---|
| Flo / Clue / generic trackers | Period prediction on regular cycles | Break on PCOS irregularity; no causation, no coaching |
| Dedicated PCOS trackers (Posiva, Cysterly…) | Symptom logs | Log without **personalized correlation discovery**; notification spam |
| **Veera Health (India), Allara (US)** | Doctor/coach telehealth for PCOS | Clinic model, fertility-leaning, human-cost-capped; Cyster is an **always-on AI n-of-1 companion**, not a booking front-end |

Cyster's defensibility is **depth + the personalization engine + trust/retention + the India well-being framing**, not a novel algorithm — the right moat for a consumer well-being product.

---

## 9. Regulatory & honest risks
- **Framing:** a **well-being companion, not a diagnostic** — no PCOS diagnosis, no drug dosing; coaching + evidence-based lifestyle levers with "see a doctor" escalation. Keeps clear of SaMD/CDSCO device rules.
- **Data:** sensitive women's health + face images under **DPDP Act 2023** — on-device processing where possible, explicit consent, encryption, easy delete, never sold. This is also a *trust* differentiator, not just compliance.
- **Real risks (say them in the pitch):**
  - **Small-n correlation = the credibility trap.** Overclaiming a pattern from 5 data points is the failure mode; the confidence-gate + "still learning" honesty is core, not optional.
  - **Body-image harm** — the skin selfie must be dignity-first (self-relative progress, opt-in, internal numeric scores drive the engine but are shown as trend/progress, never as a "beauty score") or it worsens the exact distress it should ease.
  - **Skin-photo privacy** — the hackathon build sends the selfie to a cloud multimodal API; disclose it, get consent, don't store, and state the on-device production plan (§5). Be upfront if a judge probes — the mature answer wins.
  - **Not a doctor** — must escalate red flags (e.g., prolonged amenorrhea, severe mental-health signs), never replace care.
  - **Retention** — consumer health apps die on churn; the personalization reveal *is* the retention mechanic, which is why it's the MVP, not a feature.

---

## 10. GTM & why it scales
- **Distribution:** the community *is* the channel — PCOS Reddit/Instagram/WhatsApp groups, women's-health creators, college health cells. Near-zero CAC vs the ₹1,800+ app-download CAC that kills D2C health apps.
- **Scale:** India-first (huge, underserved, English+vernacular), then the same engine serves PCOS women globally (US/UK communities are large and equally frustrated). Pure software; the n-of-1 engine is condition-agnostic — the architecture later extends to any chronic well-being condition (thyroid, endometriosis).
- **Model:** freemium; the correlation engine + coaching depth as the paid tier. Never sell data.

---

## 11. Registration answers
- **Role:** Full-Stack Developer (Health-Tech) — React/PWA, on-device ML, telemedicine.
- **Preferred track:** **AI for Good Health & Well-being**
- **Team:** 2–4. Split: 1 full-stack/data (personalization engine + backend), 1 mobile/PWA (daily-signal capture + on-device skin CV + companion UI), 1 for evidence-base curation + women's-health/UX dignity + demo + deck.

**"Anything else you'd like us to know?"**
> We're building a daily well-being companion for the 1-in-10 Indian women with PCOS whom the system only sees as a future pregnancy. Their own words drove this: generic period apps break on the irregular cycles that define PCOS, doctors say "come back when you want a baby," and the one thing they beg for — *"help me find what personally influences my wellbeing"* — nobody builds. PCOS is an experiment of one ("what works differs person to person"), so our core is an n-of-1 personalization engine: it treats an irregular cycle as signal not error, learns each woman's personal cause→effect patterns across sleep, skin, mood, food and supplements, and coaches the evidence-based levers the Indian system withholds — with mental-health support and community, dignity-first, on-device and private. Not a tracker, not a fertility clinic — the abandoned middle, built from real scars.

---

## Sources (scar evidence)
- **PCOS→PMOS rename (The Lancet, 12 May 2026; reframes as lifelong multisystem metabolic condition)** — https://www.statnews.com/2026/05/12/pcos-now-called-pmos-polyendocrine-metabolic-ovarian-syndrome/ · https://www.ajmc.com/view/pcos-renamed-pmos-in-landmark-shift-reflecting-metabolic-and-endocrine-features
- India PCOS crisis, 7-month diagnostic delay, fertility-only framing — https://www.thinkglobalhealth.org/article/india-unprepared-pcos-crisis
- Lived experience / psychological meta-synthesis — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12894167/
- Mental-health burden (anxiety 6×, depression 4×; 75%/58% elevated) — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12176914/
- Body image (84.5% pathological appearance scores) & India marriage-pressure context — https://lamsaleb.org/the-impact-of-polycystic-ovary-syndrome-pcos-on-mental-health-anxiety-depression-and-body-image-distress/
- Generic-app failure + "spot correlations across skin/mood/food/sleep" ask — app-store review synthesis (Posiva/PCOS Tracker/Allura)
- Inositol / supplement personalization variability — https://healthunlocked.com/verity-pcos/posts/147186304/looking-for-the-best-supplement-for-pcos
