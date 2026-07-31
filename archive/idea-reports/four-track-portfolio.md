# Product Portfolio — Tech for Good 2026

Track-grounded research workflow, judged on **two co-primary lenses: global scalability + pain-coverage breadth** (one product that knocks out the most of its track's pains, with a language/geography-agnostic core where Tamil is only the launch locale). 42 agents, 0 errors. Grounded in the official track scope + example builds from t4g.gdgcbe.com/tracks.

**Verified event framing:** SDG-aligned tracks; example builds are starting points (some inspired by YC's Requests for Startups); incentive = pilot in real constituencies + local markets with TiE Kovai mentorship, GDG enablement, Startup Culture incubation. *(No "MP problem statement" claim — early web-search error, corrected.)*

## Shortlist (ranked on scalability + coverage)

| # | Product | Track | Tag | Total | Scale | Coverage | One-liner |
|---|---|---|---|---|---|---|---|
| 1 | **Theervu** | Institutions (SDG 16) | Broadest Coverage | 90 | 5 | 4 | Officer cockpit: de-dupes grievances → ranked priorities + exposes fake closures → shows True Unresolved Load. |
| 2 | **OruKural** | Health (SDG 3) | Best Domain Fit | 88 | 4 | 2 | Nurse speaks 1 Tamil sentence → fans out to every register + ANMOL/HMIS payloads, offline. |
| 3 | **Sollu** | Institutions (SDG 16) | Boldest | 85 | 4 | 3 | Citizen speaks messy Tamil complaint → hears back a formal routed petition + officer + legal deadline + code. |
| 4 | **Nilai** | Health (SDG 3) | Safest Bet | 84 | 4 | 3 | DHO cockpit: messy HMIS exports → ranked, explained review agenda + "distrust these numbers" sentinel. |
| 5 | **Kanakku** | Zero Hunger (SDG 2&8) | Most Scalable | 83 | 5 | 3 | Voice-first back-office → every sale becomes a compounding "data passport" → invoices, loan statements, claims. |
| 6 | **PayirDesk** | Zero Hunger (SDG 2&8) | Best Pilot | 83 | 4 | 3 | One AAO supervises AI across 1,100 farms — auto-closes routine cases, surfaces outbreak clusters. |
| 7 | **VeppaNadi** | Cities/Climate (SDG 11&13) | Freshest | 80 | 3 | 2 | Ward heat-warning calibrated by live telemedicine consult data — predict→verify→act loop. |

One-pager specs for the **top 5** are in [`one-pagers/`](../civic-track/one-pagers/), each with a "universal core vs Tamil launch locale", "pains it covers", and "global scale path + TAM" section.

## 🥇 Why Theervu wins both lenses
- **Broadest coverage** — one read-only platform consolidates 4 track pains: FIFO→evidence-ranking, ghost-closure trust, grounded status/owner/SLA answers, and auto accountability reports.
- **Scalability 5/5** — core is a *grievance-intelligence tier* every 311/grievance system on Earth needs. Tamil + Coimbatore PGRS = launch locale + seed data only. TAM: TN's 600+ local bodies → India's ~4,000 ULBs → global govtech SaaS.
- **Low-friction pilot** — read-only over existing exports; no rip-and-replace, no procurement blocker.
- **Defensible** — the "True Unresolved Load" metric no intake app computes.

## Alternative scalable cores
- **Kanakku** — thin-file micro-enterprise → bankable data passport. ~$530B MSME credit-gap TAM; the same voice stream bills, insures, underwrites (cross-integration moat). Weakest fit for a health-tech dev (3/5); watch 36hr scope.
- **OruKural** — capture-once health-records layer; generalizes to every CHW program worldwide (~1M ASHAs in India alone). Best *demo wow* + best domain fit, but deliberately deep-on-one-pain (coverage 2).

## Rejected concepts (culled)
Saatchi (moat strong but coverage narrower than Theervu on same track), Nool, Vayal Vaidhyar (crowded/Plantix clone), Kaaval (agri), Kaaval Grid (heavy satellite pipeline), Niraivu, Veyyil/Veil Kaaval variants (dupe climate lane). Full reasons in the raw output.

## ⚠️ Honest flags before pitching
- **Web-search budget ran out** during the re-judge; evidence points for **Sollu, Nilai, Kanakku** are from prior knowledge / directional (e.g. Theervu's grievance volumes, Nilai's HMIS-vs-NFHS divergence, Kanakku's $530B gap). Verify each figure before using in a pitch.
- The Zero Hunger track had a safety-classifier unavailable during one agent's review earlier; outputs were sanity-checked but treat its stats as needing a second source.

## History
- `KAAVAL-spec.md` — the very first (pre-track-scope) single pick, maternal risk-triage. Kept for reference; superseded by this scope-grounded portfolio.
- Two research runs: `research-artifacts/raw-workflow-output.json` (run 1, single winner) and `../../research/02-portfolio/output.json` (this portfolio run).

## Artifacts
- `one-pagers/*.md` — top-5 compact build specs (scalability + coverage framed)
- `../../research/02-portfolio/output.json` — full result (all 16 concepts scored, shortlist, rejects)
- `../../research/02-portfolio/journal.jsonl` — every agent's raw return
- `../../research/02-portfolio/workflow.mjs` — reproducible workflow
