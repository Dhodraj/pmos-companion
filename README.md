# PMOS Companion

A daily well-being companion for women with **PMOS** (Polyendocrine Metabolic Ovarian Syndrome, renamed from PCOS by a 14-year global consensus published in The Lancet in May 2026).

It treats an irregular cycle as signal rather than error, learns each woman's own cause-and-effect patterns, and turns eighteen months of her life into evidence a doctor can act on in a seven-minute consultation.

**Team War Room** · Tech for Good 2026, GDG Coimbatore, 8 to 9 August · Track: AI for Good Health & Well-being

Dhodraj Sundaram ([dhodraj](https://github.com/dhodraj)) · Belson Johnson ([Belsonselva](https://github.com/Belsonselva)) · Rahul Ramakrishnan ([Rahul-ramakrishnan06](https://github.com/Rahul-ramakrishnan06)) · Satheeshkumar ([SatheeshKumarSSK](https://github.com/SatheeshKumarSSK))

---

## The problem

Her periods stop being predictable. She downloads a period app; it assumes a 28-day cycle and tells her she is 47 days late, every day, until she deletes it. She sees a doctor and is told it is stress, or to lose weight. Seven months later, on average in India, she gets a name for it, and a conversation about fertility she did not ask for. So she manages it alone: six months of inositol, no way to know whether it did anything. A year on she sits in front of a doctor for seven minutes and tries to summarise eighteen months from memory.

The condition is lifelong and systemic, but every tool she has treats it as an event, and nothing accumulates.

Medicine redefined this condition in May 2026. No product has caught up.

## Start here

| Document | What it is |
|---|---|
| [hackathon/build-plan.md](hackathon/build-plan.md) | **The master plan.** Who owns what, the schedule for 2 to 9 August, the go/no-go checkpoint, the cut list, the risk register |
| [hackathon/proposal.md](hackathon/proposal.md) · [PDF](hackathon/PMOS-proposal.pdf) | The proposal. Problem, solution, architecture, what we cut and why |
| [hackathon/form-fill.md](hackathon/form-fill.md) | The submitted answers, field by field |
| [product/PMOS-PRD.pdf](product/PMOS-PRD.pdf) · [source](product/00-PRD.md) | Full requirements: 102 functional, 48 non-functional, 14 regulatory, 4 architecture decisions |
| [product/04-data-model.md](product/04-data-model.md) | Entity model and design rules |
| [research/05-feasibility-audit/](research/05-feasibility-audit/) | Why ten features were cut before any code was written |
| [hackathon/clinician-review-brief.md](hackathon/clinician-review-brief.md) | What we asked a practising clinician to tear apart |

## How this was built

The research came first, and it kept correcting us.

- **A feasibility audit** against platform policy and primary literature cut ten features before a line of code. Camera blood oxygen and blood pressure are forbidden outright by App Store guideline 1.4.1. Passive capture on unlock is an operating-system privilege no third-party app can claim. CGM costs around ₹8,400 a month in India.
- **Sourcing every epidemiological claim** caught three of our own errors, including a widely repeated "170 million worldwide" figure with no traceable primary source.
- **Trying to source our own central claim** returned only partial support. The largest survey of what these women want from an app ranks trustworthy information above tracking, so we changed the product rather than the evidence.
- **Verifying competitors directly** found two already shipping features we had listed as differentiators. We rewrote that section.
- **A practising clinician** then reviewed it and changed five things, including killing a feature we liked: camera-based heart rate, because a resting heart rate would not change a woman's care.

The `research/` directory holds the raw outputs behind all of this, including the runs whose conclusions we later overturned.

## Repository layout

```
hackathon/   build plan, proposal, submitted form answers, clinician review pack
product/     PRD, data model, feature specification, product definition
research/    raw research outputs, one directory per run
archive/     superseded directions, kept for their reasoning
```

Planning and research live here. Code gets written in the team repo at
[Build-with-AI-Code-for-Communities/health-team-311-war-room](https://github.com/Build-with-AI-Code-for-Communities/health-team-311-war-room).

## A note on the archive

`archive/` holds directions we explored and abandoned: a maternal-health triage tool, contactless vital signs, a phone-based stethoscope, and three rounds of ranked product ideas. They are kept because the reasons for abandoning them are more useful than the ideas were.

---

*Not a medical device. Screen-and-refer only: no diagnosis, no risk scores, no dosing.*
