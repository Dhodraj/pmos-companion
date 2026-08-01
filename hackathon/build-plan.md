# Build plan

**PMOS Companion · Team War Room · TEAM-311**

Single source of truth for who builds what and when. If this document and a WhatsApp message disagree, this document wins. If this document is wrong, change it here first.

Directory paths below refer to the team repo, where the code gets written. This plan lives here.

**Lead:** Dhodraj. One person calls cuts and unblocks. That person is him.
**Build:** Sat 8 to Sun 9 August, GRD College. **Prep:** Sun 2 to Fri 7 August.

Everything below serves one sentence from the reviewer: *decide now which single one must be working when you demo, and build outward from it.*

---

## 1. The one thing that must be true

**The correlation engine runs, recovers a real lagged relationship it was never told about, and correctly reports nothing on a pair where nothing exists.**

If that is true at the demo, we have a project. If it is not, the other six components are a period tracker with a nice export.

Every schedule decision below follows from protecting it.

### The blind test, and why Rahul writes the data

The engine needs months of history to find anything, and we have none. So we generate fourteen months for a demo user.

The generator is written by **Rahul**, not by the person writing the engine. Rahul plants one lagged relationship (working assumption: sleep under six hours leads to a skin flare two to three days later) and leaves one pair deliberately null. He does not tell Dhodraj which pair is which, or the lag, or the strength.

Dhodraj runs the engine on the dataset and reports what it found. Rahul then opens the sealed parameters.

This costs an extra half hour of coordination and buys the only sentence in the pitch that cannot be faked: *the person who wrote the engine did not know what was in the data.* Without the split, the positive control proves nothing, because the engine author could have fitted to it without meaning to.

The negative control matters more than the positive one. Any engine can find a pattern. Ours has to be able to say there isn't one.

---

## 2. Who owns what

This changes the split we registered with. The old one had Rahul on coaching content and Satheesh on demo and pitch, which are ring 3 and ring 4 work, so both would have had nothing to do for the first ten hours while Dhodraj and Belson drowned. Dhodraj, push back on this now rather than at hour six.

| | Owns | Directory | Idle risk |
|---|---|---|---|
| **Dhodraj** | Data model, correlation engine, Worker, D1, Gemini proxy. Calls cuts | `src/core/`, `src/engine/`, `worker/` | None. He is the critical path |
| **Belson** | Client shell, check-in, insight card, cycle view, offline behaviour | `src/app/`, `src/ui/` | None |
| **Rahul** | Synthetic generator, then safety layer: 90-day sentinel, PHQ-4 and GAD-2, crisis routing, all clinical copy | `src/data/`, `src/safety/` | None, generator starts at hour zero |
| **Satheesh** | Doctor export, dignity review, demo, pitch | `src/export/`, `docs/demo/` | None, export starts at hour zero against frozen types |

Directory ownership is how four people share one repo for thirty-six hours without merge conflicts. Stay in your directory. If you need something in someone else's, ask them rather than editing it.

Lab report capture (ring 4) has no owner on purpose. It goes to whoever is free on Sunday morning, and only if the hour-ten checkpoint passed on time.

---

## 3. Interface contracts, frozen Friday 7 August

This is the part that decides whether the weekend works. Four people cannot build in parallel against types that do not exist yet. Everything in `src/types/` is frozen Friday evening and nobody changes it during the build without the lead agreeing out loud.

Three contracts matter:

**The log entry.** What a check-in writes and what the engine reads. Owned by Dhodraj, needed by Belson and Rahul on day one.

**The finding.** What the engine emits: the two variables, the lag in days, the direction, the strength, the observation count, and a confidence band that can be below the floor. Owned by Dhodraj, consumed by Belson's insight card and Satheesh's export. This is the contract with the most dependents, so it gets written first.

**The export payload.** Everything the doctor summary renders from. Owned by Satheesh, filled by Dhodraj.

A finding must be able to say *not enough data*. Build that state into the type on Friday, not into an `if` statement on Saturday night. The honesty of the product lives in that field.

---

## 4. Sunday 2 to Friday 7 August

Assume two to three hours a night on weekdays. Tomorrow, Sunday, is the only full day before the event. It carries the most weight of any day on this plan.

**Before anything else, Dhodraj asks the organizers what pre-event code is permitted.** Both branches are written below. We hold to whatever they say, and if the answer is ambiguous we take the stricter reading.

### If pre-event code is permitted

| Day | Dhodraj | Belson | Rahul | Satheesh |
|---|---|---|---|---|
| **Sun 2** | Types frozen in draft. Engine algorithm on paper: per-phase baselines, 1 to 14 day lags, confidence floor, FDR correction | Vite + React + Capacitor building to a real Android device | Generator design. Which variables, which distributions, what a plausible PMOS cycle looks like | Export layout as static HTML with fake data |
| **Mon 3** | Dexie schema against the frozen types | Check-in screen, tap only | Generator writing | Demo narrative v1. What are the five screens we show |
| **Tue 4** | Engine skeleton, baselines working | Insight card against a hand-written finding | Generator writing | Export rendering from the frozen payload type |
| **Wed 5** | Lagged correlation | Cycle view | 90-day sentinel logic. PHQ-4 and GAD-2 scoring tables | Dignity pass on Belson's screens |
| **Thu 6** | Worker, D1 schema, Gemini key in Worker secrets | Offline behaviour verified with the radio off | Crisis copy written and fixed. Tele-MANAS 14416 dialled and confirmed live | Demo script v2 |
| **Fri 7** | **Types frozen. Engine runs end to end on Rahul's dataset.** | Shell merged | **Dataset sealed and handed over** | Rehearsal against whatever exists |

If this branch runs, Saturday becomes integration and polish rather than a scramble, and the checkpoint moves to hour four.

### If pre-event code is not permitted

Same six days, no code. Design and decisions only.

Type definitions written out on paper or in a markdown file. Engine algorithm specified to the point where writing it is transcription. Generator variables and distributions chosen and sealed. Wireframes for all five demo screens. Export layout drawn. Crisis copy written, because words are not code. Cloudflare account, D1 database and Gemini key provisioned, because accounts are not code either. Capacitor and Android toolchain installed and verified on everyone's machine, because losing four hours on Saturday to a broken SDK install has killed better teams than ours.

Then the Saturday schedule in section 5 runs as written.

---

## 5. Saturday 8 August

Clock times assume a 09:00 start. **Dhodraj, confirm the real start time and shift every row by the difference.**

| | Dhodraj | Belson | Rahul | Satheesh |
|---|---|---|---|---|
| **H0 to H2**<br>09:00 | Dexie schema live, types committed first thing so everyone unblocks | App shell, routing, running on a real phone | Generator | Export skeleton against the frozen payload |
| **H2 to H6**<br>11:00 | Engine: per-phase baselines, then lagged correlation | Check-in, tap entry, writing to Dexie | Generator finished, dataset sealed | Export layout |
| **H6 to H8**<br>15:00 | Confidence floor, FDR correction | Check-in done, starts insight card | Hands the sealed dataset to Dhodraj | Export rendering real fields |
| **H8 to H10**<br>17:00 | **Blind test run** | Insight card | Safety layer starts | Export |

### H10, around 19:00. Go or no-go

Dhodraj runs the engine on Rahul's data and says out loud what it found. Rahul opens the sealed parameters.

**Green.** The engine recovers the planted lag within a day either side, and reports no pattern on the null pair. Everyone stays on their ring, we carry on into the evening as scheduled.

**Amber.** It finds the lag but also fires on the null pair. This is a threshold problem, not an engine problem. Dhodraj fixes the confidence floor alone while everyone else continues. Re-test at H13.

**Red.** It finds nothing, or it finds the wrong thing. All hands collapse onto the engine. Belson and Satheesh stop their rings and take instruction from Dhodraj. Ring 2 onward is abandoned that evening and the demo becomes the engine, the check-in and the export, which is still a project. Rahul keeps going on safety because it has no dependency on the engine.

The lead calls green, amber or red within ten minutes of the test. No debate. If people disagree they get five minutes, then he calls it.

| | Dhodraj | Belson | Rahul | Satheesh |
|---|---|---|---|---|
| **H10 to H14**<br>19:00 | Worker, D1, Gemini proxy. Findings become sentences | Insight card finished, cycle view starts | 90-day sentinel, PHQ-4, GAD-2 | Export complete on seeded data |
| **H14 to H17**<br>23:00 | Gemini phrasing preserves the uncertainty band. Verify it cannot invent a pattern | Cycle view | Crisis routing with fixed copy, nothing generated | Demo script against what now exists |

### Sleep, 02:00 to 10:00

Nobody builds well after twenty hours. Two shifts, and this is not optional.

**02:00 to 06:00: Dhodraj and Satheesh sleep.** Belson and Rahul carry voice entry and safety-layer finishing.
**06:00 to 10:00: Belson and Rahul sleep.** Dhodraj takes integration, Satheesh takes rehearsal.

Dhodraj sleeps first because Sunday morning integration is the hardest thinking left and he should not do it at hour twenty-two.

---

## 6. Sunday 9 August

| Time | What |
|---|---|
| **06:00** | Dhodraj integrates. Everything on one branch, running on one phone |
| **09:00** | Rahul's content QA: every clinical claim on a screen is checked against a source, or it comes off the screen |
| **10:00** | Satheesh's dignity pass. Every screen, read as if she has just been diagnosed and is frightened |
| **11:00** | Lab capture only if H10 was green and everything above is done. Otherwise it does not exist |
| **13:00** | **Freeze.** Dhodraj applies the cut list. Nothing new after this line |
| **13:00 to 16:00** | Three full rehearsals on the demo device, in flight mode for at least one of them |
| **16:00** | Buffer. Something will have broken |

### The cut list, in order

Lab capture. Then voice entry drops to tap. Then the safety-layer UI comes off while the logic stays and gets one slide. Then the cycle view degrades to a plain list.

The spine never gets cut: check-in, engine, insight card, doctor export. If those four are gone there is nothing to present.

Dhodraj calls each cut. Not a vote.

### The demo, five minutes

1. Her problem, in her words. Twenty seconds, no slides
2. Log one entry live on the phone
3. The seeded user's insight card. The planted finding, with its uncertainty stated
4. **The null pair. The engine says it found nothing.** Then explain that the person who wrote the engine did not know what was in the data
5. The doctor export
6. What we cut and why, briefly, because it is the strongest thing about us

Satheesh owns the laptop, the cable, the adapter, and a screen recording of a working run in case the live device fails.

---

## 7. Definition of done

A thing is done when it runs on the demo phone from a clean install, works with the radio off if it is meant to, and someone other than the author has used it without being told how.

Not when it works on your laptop.

---

## 8. Working rules

**Blocked for twenty minutes, say so.** Post in the group. Sitting quietly with a broken build is the most expensive thing anyone can do this weekend.

**Commit to main every two hours minimum.** Small commits, your own directory. No long-lived branches, we do not have time to merge them.

**No new dependencies after H10** without asking the lead. An npm install that breaks the build at hour twenty is how teams lose.

**Nothing on a crisis path is generated.** Fixed text, real numbers, reviewed by Rahul. This is the one rule with no exceptions.

**One phone is the demo phone.** It gets tested on from hour two. Not an emulator.

---

## 9. Risks

| Risk | Owner | Trigger | Response |
|---|---|---|---|
| Engine finds nothing real | Dhodraj | H10 red | All hands to engine, abandon rings 2 to 4 |
| Engine fires on the null pair | Dhodraj | H10 amber | Raise the confidence floor, retest H13 |
| Generator is not plausible enough to be worth testing against | Rahul | Sat H6 | Simplify to fewer variables with a cleaner planted signal |
| Capacitor Android build breaks | Belson | Any | Fall back to the PWA in a mobile browser. Say so on stage rather than hiding it |
| Gemini quota or latency | Dhodraj | Any | Pre-generated phrasing for the demo path. The engine is what we are showing, not the wording |
| Someone hits hour twenty-four awake | Dhodraj | Any | Send them to sleep. This is a call, not a suggestion |
| Lab OCR eats Sunday | whoever picks it up | 11:00 Sun | It was ring 4 and optional. Drop it without discussion |

---

## 10. Open items

- [ ] **Confirm the hackathon start time.** Every clock time above shifts with it
- [ ] **Ask the organizers what pre-event code is permitted.** Section 4 has both branches
- [ ] **Three collaborator invites are unaccepted.** Belson, Rahul, Satheesh, from GitHub notifications
- [ ] **The repo is private, and the organizers' own README says to keep it public.** Ask them which is right
- [ ] Everyone installs and verifies the Android toolchain before Friday
- [ ] Confirm the role rebalance in section 2 with all four people

---

*Problem, architecture and evidence: [proposal.md](./proposal.md). Requirements: [PRD](../product/00-PRD.md). Why ten features were cut: [feasibility audit](../research/05-feasibility-audit/). Clinician review: [clinician-review-brief.md](./clinician-review-brief.md).*

*Code is built in the team repo, [Build-with-AI-Code-for-Communities/health-team-311-war-room](https://github.com/Build-with-AI-Code-for-Communities/health-team-311-war-room). Planning stays here.*
