# Track Analysis — Tech for Good 2026 (GDG Coimbatore)

**Method:** multi-persona research workflow — 16 personas (4 per track) researched real 2024–26 pain points via live web → per-track synthesis → cross-track judge scored each track *for this specific builder* (full-stack health-tech dev at a telemedicine company, React/PWA/Gemini). 27 agents, 0 errors.

## Event facts
- **Build with AI — Code for Communities**, GRD College of Science, Coimbatore
- **Aug 08–09 2026**, 36–48hr in-person buildathon
- Organizers: GDG Coimbatore, TiE Kovai, GRD College, Startup Culture
- **SDG-aligned tracks; example builds are starting points (some inspired by YC's Requests for Startups).** Winning solutions get **piloted in real constituencies and local markets** — TiE Kovai mentorship, GDG enablement, Startup Culture incubation. Realism + pilot-readiness are scored, not toys.

## Cross-track ranking (for this builder)

| Rank | Track (dropdown label) | Score | Headline pain | Verdict |
|---|---|---|---|---|
| 🥇 | **AI for Good Health & Well-being** | **89** | Leaking care cascade — no "who's about to crash" worklist for high-risk mothers / drifting NCD-TB patients | **WIN.** Domain moat, highest real severity, uncrowded (everyone builds symptom-checkers, nobody builds defaulter-triage). |
| 🥈 | AI for Strong Institutions | 82 | Tamil petition intake→resolution engine (classify, dedup, fake-closure detection) | Best pilot-credibility (prize *is* MP-office pilot) but no domain edge — even fight vs every team. |
| 🥉 | AI for Sustainable Cities & Climate Action | 73 | Multilingual civic-grievance intelligence + fix-verification | Overlaps Institutions engine, weaker sponsor; differentiated sub-pains drag in satellite-data risk. |
| 4 | AI for Zero Hunger & Economic Growth | 63 | Photo→Tamil dose-correct "pocket agronomist" | Severe pain (sev5/freq5) BUT most-cloned hackathon build in India. Red ocean, zero domain leverage. **Avoid.** |

## Chosen pain (detail)
> The care cascade leaks invisibly. Build a risk-stratification + defaulter-alerting engine that turns captured field data into a ranked Tamil daily worklist ("see these 8 today") for the ASHA/ANM plus an escalation dashboard for the DHO — flagging high-risk mothers (Hb<7, rising BP, prior C-section, missed visits) and drifting NCD/TB patients (refill-gaps, reading trends) before they crash.

**Core insight:** the data is already captured (6–7 govt apps, 10+ registers). The leak is *prioritization*, not collection. So the winning product is a **read-layer that adds zero data-entry** — see [KAAVAL-spec.md](../archive/civic-track/KAAVAL-spec.md).

## Artifacts
- `KAAVAL-spec.md` — full 12-section build-ready plan (the winning concept)
- `registration.md` — form answers to paste
- `research-artifacts/raw-workflow-output.json` — full workflow result (all rankings, synthesis, idea panel)
- `research-artifacts/persona-research-journal.jsonl` — every agent's raw return (16 persona pain reports + synthesis + judging)
- `research-artifacts/workflow-script.mjs` — the reproducible workflow (re-runnable / editable)
