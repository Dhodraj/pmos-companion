# Sollu — Build Spec
**Track:** AI for Strong Institutions · **Tag:** Boldest · Scalability 4/5 · Pain 3/5

**Pitch:** Speak a civic problem in plain Tamil; instantly get back a formal, correctly-addressed petition — named officer, statutory deadline, tracking code.

**Universal core vs Tamil launch locale:** The product is a *restate-and-route normalization layer* that sits on top of any grievance backend: voice-in (colloquial, any language) → structured petition-out (right department, responsible officer, SLA, entitlement). Language-agnostic ASR, intent classification, and petition drafting are the core. Locale = one swappable config: the officer/SLA gazetteer. Tamil + Coimbatore ward table is just the first config; Marathi-Pune or Swahili-Nairobi is the same engine, new CSV.

**Pains it covers (breadth):**
- Mis-routing: colloquial voice/photo grievances land in the wrong department → intent classifier maps to correct dept + officer.
- No grounded answer on responsibility/timeline/entitlement → petition cites named officer + statutory deadline + citizen right.
- Literacy-gated forms block filing entirely → voice-only front door, zero typing.

**Evidence (hard point):** Tamil Nadu's Right to Public Services Act (2019) already fixes statutory time limits per service — the legal deadlines exist and are enforceable, but citizens can't map a spoken complaint to the right act/officer/clock. Sollu closes exactly that gap.

**Who + core loop:** Resident taps mic → speaks → hears+sees draft petition → confirms → routed to backend (or WhatsApp/PDF to office) → gets code → checks status by voice.

**AI stack:** Gemini (multimodal: Tamil ASR + photo evidence understanding + structured JSON petition), retrieval over officer/SLA gazetteer for grounding, React PWA (offline-queue, low-end Android, patchy-net tolerant), on-device TTS readback.

**36hr MVP slice:** ONE hero flow — Tamil voice → grounded routed petition + code for 3 Coimbatore departments (roads, water, sanitation). Built: full loop for these three. Vision (shown, not built): multi-language config swap, live backend write-back, status-by-voice.

**90-sec wow:** Judge speaks a messy Tanglish complaint aloud; 4 seconds later Sollu reads back a formal petition naming the actual Corporation officer and the legal deadline, with a QR-tracked code.

**Global scale path + TAM:** Every municipality on Earth runs grievance intake; config-swap = new market. Beyond TN: 20+ Indian states, then Global South govtech / civic-SaaS — a multi-billion-dollar public-sector market.

**Pilot/incubation:** TiE Kovai domain mentors validate the gazetteer; pilot in Coimbatore wards; incubation via Startup Culture.

**Why it wins / risks:** Wins on boldness + instant demo magic + genuine institution-strengthening. Risk: gazetteer accuracy and backend integration — mitigated by PDF/WhatsApp fallback needing zero government API.
