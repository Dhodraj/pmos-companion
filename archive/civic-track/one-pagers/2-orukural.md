# OruKural — Build Spec
**Track:** AI for Good Health & Well-being · **Tag:** Best Domain Fit · Scalability 4/5 · Pain 2/5

**Pitch:** A Tamil voice-first, offline PWA where a frontline health worker speaks one sentence per patient and it fans out into every register summary plus government-app-ready payloads (HMIS/ANMOL/Ni-Kshay) — killing the double-entry tax.

**Universal core vs Tamil launch locale:** The product is a *capture-once, fan-out-to-many* layer for over-documented community health workers — a global phenomenon (WHO/CHW programs across Africa, LatAm, South Asia). The unit of work is a spoken sentence; a deterministic templating engine fans it into any downstream register/payload. Universal: the voice→structured→multi-export pipeline. Locale-only: the ASR language (Tamil) and the export templates (ANC + ANMOL/HMIS). Swap those two and it ships anywhere.

**Pains it covers:**
- Ends the double-entry tax — one Tamil voice/OCR capture writes every register + govt-app payload.
- Seeds follow-up worklist (partial) — captured next-visit dates auto-populate defaulter tracking.

**Evidence:** Field time-use surveys peg 30–50% of an ANM's working hours on redundant recording rather than care — the same encounter is hand-copied into 10–15 registers, then re-typed into ANMOL/RCH/HMIS.

**Who uses it + core loop:** Rural TN ASHAs/ANMs/PHC nurses (and their MO who consumes summaries). Loop: speak or snap → structured fields → read-back confirm → commit → every register row + export payload populates.

**AI stack:** Bhashini Tamil ASR (on-device Whisper-small fallback offline) → Gemini 2.x Flash structured extraction (strict schema, per-field confidence, handles Tanglish) → Gemini vision OCR for the snap-the-page path → Bhashini TTS read-back. Export/fan-out is **deterministic templating, not AI** — auditable numbers a Medical Officer can trust.

**36hr MVP slice:** ONE hero flow — an ANC visit. Mic → one Tamil sentence → extract {name, visit#, gestational month, anaemia flag, next-visit} → card + TTS read-back → commit → three register rows + downloadable ANMOL/HMIS JSON+CSV all populate. Airplane-mode two more captures, restore network, watch the sync queue drain. Breadth (multi-encounter, dedup, Ni-Kshay) shown as vision, not built.

**90-sec wow:** "Capture once → five artefacts → offline→sync," live, in Tamil.

**Global scale path + TAM:** ~1M ASHAs + ~0.2M ANMs in India; every state = new templates only. Beyond: CHW programs in Kenya, Nigeria, Indonesia, Brazil — swap ASR + export. Buyer: NHM state IT cells, then ministries of health / global-health NGOs (Gates, PATH).

**Pilot/incubation:** 3–5 sub-centres under one Coimbatore PHC block via TiE Kovai + District MO; metric = documentation minutes saved + register-vs-app mismatch reduction over 6 weeks. Start CSV-export only (no API approval needed); graduate to official HMIS/ANMOL push via NHM MoU. GDG for offline hardening; Startup Culture for incubation.

**Why it wins / risks:** Wins by fitting the *existing* paper+ANMOL reality instead of replacing it — voice-first, offline-first, deterministic exports where rivals are form-first/English/online. Risks: code-mixed medical ASR accuracy (mitigate: read-back + term lexicon); gated govt APIs (mitigate: CSV-first); dedup mis-merges (keep suggested + reversible); patient-data privacy (on-device fallback, encryption at rest).
