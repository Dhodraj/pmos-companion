# KAAVAL (காவல்) — Build-Ready Plan
### Tech for Good 2026 · Track: AI for Good Health & Well-being

---

## 1. Product name + one-line pitch

**KAAVAL (காவல் — "the watch")**

*An offline-first risk-triage engine that turns the maternal data a VHN already collects into a ranked Tamil daily worklist — "இன்று இந்த 8 பேரை பாருங்கள்" (see these 8 today) — and a live escalation dashboard for the DHO, catching high-risk mothers before they crash.*

One thumb, one phone, no internet.

---

## 2. The pain — with hard evidence

The care cascade **leaks invisibly**. A VHN/ANM in rural Tamil Nadu is responsible for ~5,000 people (1:3,000 in tribal blocks). She captures antenatal data into paper registers and 6–7 disconnected government apps (ANMOL, RCH, Poshan Tracker, Nikshay) — but **nothing tells her which of her 200+ mothers is about to become an emergency this week.** Risk sits inside the data, unread. By the time a severe-anemia mother or a rising-BP pre-eclampsia case surfaces, it's an ambulance call, not a home visit.

Three hard evidence points:

- **Severe anemia is a silent killer that IS already in the register.** Anemia raises postpartum-hemorrhage risk **~7×**; severe anemia is clinically defined as **Hb < 7 g/dL**, and PPH affects ~**12%** of Indian births. NFHS-5 puts anemia in pregnancy at **54.3% rural**. The Hb value is written down at every ANC visit — it just isn't *triaged*. ([Lancet Global Health, WOMAN-2 cohort](https://www.thelancet.com/journals/langlo/article/PIIS2214-109X(23)00245-0/fulltext); [J Obstet Gynecol India, 2024](https://link.springer.com/article/10.1007/s13224-024-02022-3))
- **Tamil Nadu's own MMR is rising** — **45.5 (2023–24)** per state health-department data, after years of being India's model state. The gains are stalling exactly where invisible defaulters and untriaged high-risk cases leak. India identified **78.27 lakh high-risk pregnancies to Dec 2024** via e-PMSMA — identification exists; *daily action-routing at the sub-centre does not.* ([TN MMR summary](https://www.usthadian.com/maternal-mortality-ratio-in-tamil-nadu/); [PWOnlyIAS / e-PMSMA](https://pwonlyias.com/current-affairs/maternal-health-in-india/))
- **The frontline worker is drowning in data-entry, not starved of data.** ASHAs/ANMs maintain **10+ registers plus 6–7 apps**, spend personal money on phone/data, and do "hidden labor" retrying failed uploads — apps are "complex, text-heavy, and not localised." KAAVAL does not add a 7th data-entry app; it reads what's captured and hands back a *decision*. ([New Lines Magazine](https://newlinesmag.com/reportage/indias-digital-health-push-is-overworking-its-front-line-women/); [Behanbox, 2024](https://behanbox.com/2024/01/16/how-asha-workers-overwhelming-workload-impacts-indias-healthcare-system/))

The insight: **the data is captured, the leak is in prioritization.** KAAVAL is a read-layer, not another entry burden.

---

## 3. Who uses it + the exact user journey

**Primary user — VHN / ASHA (village level).** Overloaded, Tamil-first, low-end Android, patchy signal.
**Secondary user — DHO / Block Medical Officer.** Wants an escalation view across sub-centres, not raw rows.

**VHN journey (daily, offline):**
1. Morning, no signal. She opens KAAVAL. It has already synced overnight from the RCH/ANMOL export.
2. Home screen: **"இன்று இந்த 8 பேரை பாருங்கள்"** — 8 of her 200 mothers, ranked. Top card is **red**: *"லதா, 28 வா — Hb 6.8, கடந்த 2 வருகைகள் தவறியது"* (Latha, wk 28 — Hb 6.8, missed last 2 visits). One tap plays the reason in plain spoken Tamil.
3. She taps **✔ பார்த்தேன் (Seen)**, **↗ அனுப்பு (Refer to PHC)**, or **✖ இப்போது இல்லை (Dismiss)** — a single thumb, no typing, no internet.
4. Each tap is stored locally with a reason and timestamp. When signal returns, it syncs.

**DHO journey (weekly, connected):**
1. Opens the escalation dashboard on a laptop/desktop at the block office.
2. Sees a heat-strip of sub-centres, a queue of **RED cases unactioned > 72h**, and defaulter counts trending.
3. Clicks a red case → sees the risk reasons and the VHN's action trail. Escalates or calls.

---

## 4. Core features (production vision)

1. **Deterministic maternal risk engine** — transparent, rule-based scoring on captured fields (Hb, BP trend, prior C-section, gestational age, missed-visit count, age, prior obstetric history). Every score comes with **human-readable Tamil reasons** — never a black box.
2. **Ranked daily worklist ("see these N today")** — capped, prioritized, color-banded (red/amber). Reads as triage, not a dump.
3. **One-thumb action loop** — Seen / Refer / Dismiss, each captured as a labelled outcome event.
4. **Bhashini Tamil voice** — TTS reads each case aloud (for low-literacy/eyes-busy field use); ASR optional for spoken note capture.
5. **DHO escalation dashboard** — cross-sub-centre queue, unactioned-red SLA timer, defaulter trend lines.
6. **Offline-first sync** — local-first store, background sync, conflict-safe.
7. *(Scale-up, slideware for hackathon)* NCD & TB verticals (refill-gap + reading-trend drift), RAG-over-protocol-PDF explanations, restless-bandit prioritizer graduated from accrued outcome labels.

---

## 5. AI components (specific models/APIs and why)

| Component | What we use | Why |
|---|---|---|
| **Tamil TTS (case read-aloud)** | **Bhashini** TTS (MeitY, IITM Tamil v1.0) | Government's own India stack → **pilot-native and cost-defensible to a government/health-system partner**, not a foreign paid API. Reads clinically-worded Tamil for eyes-busy fieldwork. |
| **Tamil ASR (optional spoken notes)** | **Bhashini** ASR (wav2vec Tamil v1.0, 2024) | Same govt stack; lets the VHN dictate a note instead of typing on a low-end keyboard. |
| **Risk stratification (MVP)** | **Deterministic clinical rules**, not ML | Judges and DHOs must *trust and audit* every flag; "Hb 6.8 < 7" is defensible, a neural score is not. Ships flawlessly in 36h with zero training data. |
| **Prioritizer (scale-up)** | **Restless multi-armed bandit** (ARMMAN/SAHELI lineage), trained on accrued confirm/dismiss/refer outcome labels | Learns *which* flagged mothers actually convert to emergencies → the moat. Staged safely *behind* the deterministic start. |
| **Reasoning/explanation (scale-up)** | Gemini / LLM over protocol PDFs (RAG) | Turns MoHFW/TN protocol text into the "why" behind a flag. Deferred to slideware. |

**Design discipline:** the MVP ships **no ML**. The wow is in the *triage + Tamil voice + offline*, and the AI story in the pitch is the credible scale-up path — not a fragile demo-day model.

---

## 6. Architecture (offline / Tamil / low-end Android)

```
[RCH/ANMOL/PICME CSV export]
        │  (overnight / periodic sync)
        ▼
  KAAVAL Sync Service ──► [Postgres + risk-engine (Node/Python)]  ← DHO dashboard (web)
        │                          │
        │  delta push              │  outcome events pushed back
        ▼                          ▲
  ┌─────────────────────────────────────────┐
  │  VHN PWA on low-end Android              │
  │  • IndexedDB local store (offline-first)│
  │  • Service Worker cache (works offline) │
  │  • Deterministic scorer runs LOCALLY    │
  │  • Bhashini TTS: pre-cache audio OR      │
  │    call-on-connect, fall back to text   │
  │  • One-thumb action queue, syncs on 3G  │
  └─────────────────────────────────────────┘
```

Design constraints, met deliberately:
- **Offline-first**: PWA + Service Worker + IndexedDB. The worklist and scoring run with **zero connectivity**; only sync needs signal. No app-store install, no 200MB APK.
- **Low-end Android**: PWA, not React Native — installs via "Add to Home Screen", ~few-hundred-KB shell, runs on 1GB-RAM Android Go.
- **Tamil-first**: all UI strings in Tamil, large touch targets, color-band + icon (not text-dependent), Bhashini audio for every case.
- **Battery/data-frugal**: text-first; TTS audio pre-cached during overnight sync so field use burns no data.
- **Read-layer, not entry-burden**: KAAVAL *consumes* the RCH/ANMOL export — it does not ask the VHN to re-enter anything.

---

## 7. The 36–48h MVP slice — cut ruthlessly

**BUILD (must ship, must be flawless):**
- **Maternal vertical ONLY.** No NCD, no TB.
- **Seed a realistic 200-row RCH/ANMOL/PICME-shaped CSV** (RCH-ID, name, age, LMP/gestational week, Hb series, BP series, prior C-section flag, ANC visit dates, missed-visit count). 200 rows so **"see these 8 of 200"** reads as real triage, not a rounding artifact.
- **Deterministic risk engine** → ranked worklist with Tamil human-readable reasons.
- **VHN PWA**: worklist screen + case detail + one-thumb Seen/Refer/Dismiss, **fully offline**.
- **Bhashini Tamil TTS** on the top case (the demo's audible wow). Pre-cache audio for demo reliability.
- **DHO dashboard** (single web page): unactioned-red queue + one trend line + drill-in.
- **Sync**: even a simple push/pull is fine; offline action-queue that flushes on reconnect.

**CUT (explicitly, to slideware/scale-up):**
- ML/bandit prioritizer, RAG-over-PDF, NCD & TB tracks, real ANMOL API integration, auth/roles, multi-district, push notifications, the ASR note-capture (nice-to-have only if time).

**Rule:** if it doesn't serve the 90-second demo or the deterministic maternal loop, it doesn't get built in 36h.

---

## 8. Hour-by-hour build plan (2–4 person team)

**Roles:** **P1 Engine/Data** (CSV + scorer + API), **P2 VHN PWA** (offline + one-thumb UI), **P3 DHO dashboard + Bhashini TTS + demo**, **P4 (if 4)** data realism, Tamil copy, pitch deck, dry-runs. With 2 people: P1 does engine+dashboard, P2 does PWA+TTS+deck.

| Hours | P1 Engine/Data | P2 VHN PWA | P3 Dashboard + TTS + Demo |
|---|---|---|---|
| **0–3** | Design the 200-row CSV schema (RCH/ANMOL/PICME-shaped); generate realistic seed data | PWA skeleton, Service Worker, IndexedDB, Tamil font/RTL-safe layout | Register Bhashini API, test Tamil TTS on one string, save audio blob |
| **3–9** | Deterministic scorer: Hb<7, BP-rise, prior C-section, missed-visits → weighted rank + Tamil reason strings | Worklist screen: ranked red/amber cards, big touch targets | Dashboard shell: pull scored data, render unactioned-red queue |
| **9–15** | Score-to-API; freeze rule thresholds with a clinician sanity check | Case detail + one-thumb Seen/Refer/Dismiss → local action queue | TTS wired to top card play button; pre-cache demo audio |
| **15–21** | Outcome-event store (confirm/dismiss/refer, timestamped, labelled) | Offline test: airplane mode, full loop works; sync-on-reconnect flush | Dashboard trend line + drill-in to reasons + action trail |
| **21–27** | Data realism pass: make the "8 of 200" ranking clinically believable | Polish: Tamil copy, color bands, empty/error states | Draft 90-sec script; source a **printed pill strip** prop |
| **27–33** | Freeze engine; write the "why this compounds" moat slide (RCH-ID cross-join, outcome-labelled dataset, bandit) | Bug-bash the offline loop on a real low-end Android | Build cluster-vs-control pilot slide; deck assembly |
| **33–39** | **Full dry-run ×3.** Fix only demo-critical bugs. | Freeze UI. | **Choreograph the reveal** (pill strip → Tamil voice → worklist lights red). Rehearse to the clock. |
| **39–48** | Buffer / sleep rotation / final rehearsal. **No new features.** | | |

---

## 9. 90-second demo script (the wow moment)

> **[0:00–0:20] The physical hook.**
> "This is Latha. 28 weeks pregnant, one of 200 mothers under a single VHN." Hand a judge a **real printed pill strip** — "Her iron tablets. She's been skipping them. Nobody knows yet." Judge is holding the problem in their hand.
>
> **[0:20–0:40] The Tamil voice.**
> "The VHN has no internet this morning." Airplane mode ON, visibly. Tap the top card. **Bhashini speaks plain Tamil:** *"லதா, 28 வாரம். ஹீமோகுளோபின் 6.8 — ஆபத்து. கடந்த 2 வருகைகள் தவறியது."* The judges *hear* the triage.
>
> **[0:40–1:05] The reveal.**
> "Out of 200 mothers, KAAVAL says: **see these 8 today.**" The worklist lights up — top cards **red**, each with a human-readable reason. "No dashboard to read, no data to enter, no signal needed. **One thumb, one phone, no internet.**"
>
> **[1:05–1:25] The action + escalation.**
> Tap **↗ Refer**. Cut to the DHO's laptop: Latha appears in the escalation queue with a 72-hour SLA timer. "The DHO sees the leak *before* it becomes an ambulance."
>
> **[1:25–1:30] The close.**
> "The data was always there. KAAVAL is the watch that reads it. Maternal today — NCD and TB next, on the same engine."

The wow = the reveal that a **red, reasoned, spoken-Tamil worklist appears offline from data she already collects.**

---

## 10. Pilot path with the MP / govt partner

- **Start read-only / shadow-mode (low risk).** KAAVAL consumes an existing RCH/ANMOL/PICME export and produces worklists **alongside** current practice. It changes no official record and adds no data-entry — the single biggest barrier to frontline adoption. This is what makes a DHO / health-system partner say yes.
- **Cluster-vs-control design.** Pick **intervention sub-centres** running KAAVAL vs matched **control sub-centres** running as-usual. Cleaner outcome story than single-arm before/after. **Primary outcomes:** high-risk mothers reviewed within target window; defaulter follow-up rate; time-to-referral for Hb<7 / rising-BP cases. **Secondary:** VHN-reported workload.
- **Why it compounds and can't be copied.** Every Seen/Refer/Dismiss tap accrues into a **proprietary defaulter-OUTCOME-labelled dataset**, keyed on **RCH-ID cross-joined across PICME × MTM home-readings × Nikshay**. That labelled data **graduates a restless-bandit prioritizer** (ARMMAN/SAHELI lineage) that learns which flags actually convert to emergencies. A competitor can copy the rules; they cannot copy the outcome-labelled data trail. This defensibility ceiling sits **safely behind** the read-only start.
- **Scale ladder:** 1 block (maternal) → district (add NCD refill-gaps, TB via Nikshay) → integrate as an RCH read-layer. Bhashini keeps it cost-defensible and India-stack-native at every rung.

---

## 11. Why this wins vs other teams

- **Real severity, not novelty.** Hb<7 → 7× PPH risk, rising TN MMR — a health-system judge recognizes this as a genuine leak, not a hackathon toy.
- **We don't add burden — that's the killer insight.** Every rival health app asks the overworked VHN to enter *more*. KAAVAL reads what's captured and hands back a decision. Frontline-worker adoption is where pilots die; we designed around it.
- **It works offline, in Tamil, on a ₹6,000 phone** — demonstrated live in airplane mode. Most teams demo on Wi-Fi with English UI.
- **Deterministic and auditable.** Every flag is a reason a DHO can defend. No black-box risk score to distrust on day one.
- **India-stack native.** Bhashini, not a foreign paid API — reads as pilot-ready and cost-defensible to a government partner.
- **Ruthless scope.** One vertical, flawless. The demo reads as real triage ("8 of 200"), not a rounding artifact.
- **A real moat and a real pilot design.** Cluster-vs-control measurement + an outcome-labelled-data compounding story — most teams have neither.
- **Domain credibility.** Built by a full-stack telemedicine engineer — the maternal risk logic is right, not guessed.

---

## 12. Registration form answers

- **Role:** Full-Stack Developer (Health-Tech) — React / PWA / Gemini, telemedicine domain (a telemedicine company).
- **Preferred track (exact dropdown label):** **AI for Good Health & Well-being**
- **Team-status guidance:** Register as a **2–4 person team**. Ideal split: 1 full-stack (engine + data + dashboard), 1 frontend/PWA (offline VHN app + Bhashini TTS), and optionally 1 for data realism + Tamil copy + pitch/dry-runs. If registering solo, mark **"looking for teammates"** and recruit one frontend and one designer/domain person on-site — the plan is executable by 2, comfortable at 3.

**"Anything else you'd like us to know?"**

> We're building KAAVAL (காவல், "the watch") — an offline-first maternal risk-triage engine that turns the antenatal data a VHN *already* collects into a ranked Tamil worklist: "see these 8 of 200 today." The problem isn't missing data — Hb below 7 raises postpartum-hemorrhage risk sevenfold and it's written in every register; the leak is that nobody triages it before it becomes an ambulance call. KAAVAL adds **zero** data-entry (frontline workers already juggle 10+ registers and 6–7 apps), runs fully offline on a low-end Android, reads each case aloud in plain Tamil via Bhashini — the government's own language stack — and gives the DHO a live escalation dashboard. It's deterministic and auditable today, with a clear compounding moat tomorrow: every confirm/dismiss/refer tap becomes outcome-labelled data that graduates a smarter prioritizer. We want it **piloted read-only in real sub-centres** (intervention vs control), because it's built by a telemedicine engineer to be pilot-ready, not demo-ready. One thumb, one phone, no internet.
