# Theervu — Build Spec
**Track:** AI for Strong Institutions · **Tag:** Broadest Coverage

**Pitch:** An officer's decision cockpit that de-dupes messy grievances into ranked ward priorities and exposes fake "resolved" closures — showing the *true unresolved load* instead of a flat FIFO queue.

**Universal core vs Tamil launch locale:** The product is a language- and geography-agnostic intelligence tier: *messy complaint stream → trust-corrected ranked priorities + accountability report*. Embed-dedup, evidence-based ranking, and an anomaly layer that treats the official `resolved` flag as adversarial data are what any 311/grievance system on earth needs. Tamil + Coimbatore PGRS/CM-Helpline is only the launch locale and seed dataset — swap the corpus, the engine ports.

**Pains it covers (the breadth story):**
- Flat FIFO queue → evidence-based ranking of what's genuinely urgent
- Ghost closures ("resolved" with no work) → recomputed *True Unresolved Load*
- No grounded answer on status/owner/timeline → RAG attaches owning officer + statutory SLA
- Messy Tamil/Tanglish intake → normalized, clustered problems (partial: normalizes the export)

**Evidence (1 hard point):** TN runs CM Helpline (1100) and the PGRS portal receiving lakhs of grievances across phone, web, WhatsApp and paper — with no cross-channel de-duplication, so one pothole reported 40 times reads as 40 tickets, and closures are compiled by hand into monthly aging reports. (Directionally verified; exact figures pending ULB export.)

**Who uses it + core loop:** Municipal zonal/ward officers, DHOs, councillor/MLA back-offices — the *admin* intelligence layer, not citizen intake. Loop: ingest export → embed+cluster → score+explain → officer triages → auto-report.

**AI stack:** Gemini text-embedding-004 (location+issue de-dup/clustering) · Gemini Flash (dept/urgency classification, "why-ranked" + report narrative, TA/EN) · Gemini Vision (proof-photo plausibility + EXIF geo cross-check for ghost-closure detection) · Bhashini Tamil ASR (voice→text intake) · lightweight RAG over jurisdiction charters + SOP timelines.

**36hr MVP slice (hero flow):** Single ward, seeded Tamil/Tanglish CSV mimicking PGRS fields. Embed→cluster→classify→**ranked dashboard** (top ~10 problems: report-count, owning officer, SLA clock, why-ranked). Bolt on ghost-closure detection on a demo subset → headline *True Unresolved Load* → one-click TA+EN aging PDF. *Built:* the pipeline. *Vision:* multi-ward, live PGRS feed, callback verification.

**90-sec wow:** Officer opens cockpit — raw FIFO queue vs Theervu's trustworthy ranked list *side by side* — a fast-closure flag fires, unresolved load jumps, PDF exports in Tamil.

**Global scale path + TAM:** Every ULB, state helpline, and national 311 needs a trust-and-ranking tier over existing intake. TN has 600+ local bodies; India ~4,000+ ULBs; then other states/languages, then any country with a grievance backend (US 311, GovTech markets). GovTech SaaS, normalization+intelligence layer — no rip-and-replace.

**Pilot/incubation:** Read-only over one Coimbatore Corporation zone via existing export (low political friction). GDG technical enablement · TiE Kovai mentors validate scoring weights with a real zonal officer · councillor office = first report user · Startup Culture incubation.

**Why it wins / risks:** Everyone builds intake classifiers; almost no one attacks *data trust* — the ghost-closure layer and True Unresolved Load are the edge. **Risks:** gated ULB data (demo on synthetic), politically sensitive flags (frame as "verify," human-in-loop), colloquial Tamil geo-extraction errors, vision proof is heuristic (needs EXIF+callback), slow govt procurement.
