# PMOS Companion — product work
*(folder started as Tech for Good 2026 hackathon research; the product outgrew the event)*

**Event:** Tech for Good 2026 · GDG Coimbatore · GRD College · **Aug 08–09 2026** · 36–48hr in-person
**Track:** AI for Good Health & Well-being
**Winning solutions** get piloted in real constituencies/local markets — TiE Kovai mentorship, GDG enablement, Startup Culture incubation.

---

## Where things landed

**Product: PMOS Well-Being Companion** — an n-of-1 personalization companion for women with **PMOS** (Polyendocrine Metabolic Ovarian Syndrome — renamed from PCOS by a global consensus published in The Lancet, 12 May 2026, specifically to move the condition off "cysts/fertility" and onto lifelong metabolic-endocrine well-being).

It treats an irregular cycle as **signal, not error**, learns each woman's personal cause→effect patterns, coaches evidence-graded daily levers the medical system withholds, and escalates to real doctors with a ready dossier. Dignity-first, weight-neutral, zero-commerce.

**Not just a hackathon build** — it launches at the event and lives on as a real product, promoted through **mycyclesafe.ai** (existing tracker, 500k+ users, 120 countries) whose irregular-cycle users *are* the PMOS audience.

---

## Read in this order

| # | File | What |
|---|---|---|
| 1 | **[product/PMOS-PRD.pdf](product/PMOS-PRD.pdf)** | **Start here. The single source of truth.** 30-page PRD: 102 functional, 48 non-functional and 14 regulatory requirements, 4 architecture decisions, 6 flowcharts. Source: [00-PRD.md](product/00-PRD.md) |
| 2 | [product/01-product-definition.md](product/01-product-definition.md) | Positioning, differentiator stack, anti-features, funnel play (superseded by the PRD) |
| 3 | [product/03-complete-features-spec.md](product/03-complete-features-spec.md) | Full feature catalogue and feasibility rulings (§0) |
| 4 | [product/04-data-model.md](product/04-data-model.md) | Entity model, design rules, field notes |
| 5 | **[hackathon/proposal-short.md](hackathon/proposal-short.md)** | **THE SUBMISSION.** One page, due Sat 1 Aug 11:59 PM IST |
| 6 | [hackathon/proposal.md](hackathon/proposal.md) | Full proposal, the appendix behind the short one |
| 7 | [hackathon/PMOS-clinical-review.pdf](hackathon/PMOS-clinical-review.pdf) | Clinician review pack, with their findings applied |
| 8 | [hackathon/registration.md](hackathon/registration.md) | Registration form answers |
| 9 | [hackathon/track-analysis.md](hackathon/track-analysis.md) | Why this track; all 4 tracks scored |

---

## Folder map

```
product/      ← ACTIVE. The thing being built.
hackathon/    ← event logistics (registration, track choice)
archive/      ← superseded explorations, kept for reasoning history
  idea-reports/    3 ranked idea reports (pain-breadth · complex/unsolved · 4-track portfolio)
  frontier-bets/   PulseSight (contactless vitals) · StethoPhone (AI stethoscope)
  civic-track/     KAAVAL maternal triage + 5 civic one-pagers
research/     ← raw workflow outputs, one folder per run
  01-persona-tracks/   16 personas × 4 tracks → KAAVAL
  02-portfolio/        16 concepts → 7 shortlisted
  03-product-ideas/    YC-framework India health ideas (2 runs: pain-breadth, complex)
  04-pmos-curation/    3-lens product curation → the definition
```
Each `research/*` folder holds `output.json` (result), `journal.jsonl` (every agent's raw return), `workflow.mjs` (re-runnable).

---

## How we got here (the reasoning trail)

1. **4-track persona research** → picked Good Health, landed on KAAVAL (maternal triage) → *too Tamil-specific, too narrow*
2. **Portfolio run** (16 concepts, all tracks) → Theervu/OruKural/Sollu → *scalable but not exciting*
3. **YC-framework India health ideas** → RxLekha, Sehat Copilot… → *too obvious, AI wrappers*
4. **Complex/unsolved rerun** → PolyGuard, ShelfSense, MetaTwin → *still not zero-to-one*
5. **Frontier bets** → PulseSight, StethoPhone → *PulseSight already solved (NuraLogix/Binah); StethoPhone needs an add-on*
6. **Architecture insight (founder):** one condition · one device · one daily image · always-on companion · well-being only
7. **Scar mining** → PCOS: 7-month delays, "come back when you want a baby," apps that break on irregular cycles, 6× anxiety
8. **PMOS rename discovered** (May 2026) → the medical establishment officially validated the wedge
9. **3-lens product curation** (retention · moat · trust/India) → the current definition

---

## Open decisions (from the definition, §7)
1. Standalone app vs module inside mycyclesafe *(rec: standalone + deep bridge)*
2. Pricing / freemium line *(₹200–500/mo wedge; safety paths always free)*
3. How hard to lead with "PMOS" vs "PMOS (formerly PCOS)" in-market
4. Cloud vs on-device MVP posture *(a public trust commitment — can't be walked back)*
5. Clinician-portal timing

## Next steps
- [ ] **Submit the project proposal by Sat 1 Aug, 11:59 PM IST** (needs GitHub usernames, overnight decision, raffle choice)
- [ ] Fill in name/phone/GitHub and submit registration
- [ ] Decide the 5 open questions above (esp. the product name)
- [ ] MVP build plan from the definition's MVP tier
- [ ] Hackathon pitch narrative
