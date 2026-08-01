# Architecture proposal: form fill

Paste these into [t4g.gdgcbe.com](https://t4g.gdgcbe.com) → Architecture proposal. Team **War Room**, TEAM-311.
Due Saturday 1 August, 11:59 PM IST. The coach reviews on submit and you can resubmit freely, so submit early.

Long-form reasoning behind every answer lives in [proposal.md](./proposal.md) and the [PDF](./PMOS-proposal.pdf).

---

## Problem statement

```
PMOS, renamed from PCOS by a global consensus published in The Lancet in May 2026, is a lifelong metabolic and endocrine condition affecting 13.6 to 19.6% of Indian women depending on diagnostic criteria. Every tool she has treats it as an event rather than a condition, so nothing accumulates.

Her period app assumes a 28-day cycle and tells her she is 47 days late, every day, until she deletes it. Her doctor talks about fertility when she wants to know why she is exhausted, after an average seven-month wait for the diagnosis. So she manages it alone, takes inositol for six months, and never finds out whether it did anything.

She generates a year of relevant data and arrives at a seven-minute consultation with none of it.
```

## Who it helps

```
Indian women aged 18 to 35 with PMOS, diagnosed or suspecting it, phone-first on mid-range Android. India's national ICMR survey puts prevalence at 13.6 to 19.6%, so this is not a niche.

Her clinician benefits second-hand: instead of her memory, they receive a structured export of eighteen months of cycles, symptoms and medications, with the tests she can ask for by name.

Under-18s are excluded at launch. DPDP prohibits profiling of children and our correlation engine is profiling. That costs us a group where the condition often first presents, and we are choosing to bear it rather than breach the Act.
```

## How do you know it's real? (optional)

```
We researched it before we designed it, and the research kept telling us we were wrong.

Every epidemiological claim was sourced individually, which caught three of our own errors: a "170 million worldwide" figure with no traceable primary source, a body-image statistic we had described as coming from a clinical cohort when it was a self-selected online survey, and our own repeated line that "The Lancet renamed PCOS" when it was a 14-year consensus across 56 organisations that The Lancet published.

We then tried to source our central claim, that women with this condition want a tool that finds their personal patterns. It came back only partially supported. The largest survey of what they want from an app, n=264, ranks trustworthy information above tracking. So we changed the product rather than the evidence: it now does both, and the proposal says so.

What held up: a peer-reviewed analysis of 70,685 cycle-app reviews where users complain the apps track symptoms but "do not explain how they correlate to your cycle"; the ICMR national prevalence survey of 8,993 Indian women; and the 2026 Lancet consensus.

We verified competitors directly instead of assuming, and found two already ship features we had claimed as ours. We rewrote that section.

A feasibility audit against platform policy then cut ten features before we wrote code. A practising clinician killed an eleventh: we planned camera heart rate, and they asked what it would actually tell a woman with PMOS. It would not change her care.

One of us also runs mycyclesafe.ai, a cycle tracker whose predictions fail on exactly the irregular cycles that define this condition. That is what pointed us here.
```

## Proposed solution

```
A daily companion built on one idea: her irregular cycle is signal, not error.

Thirty seconds a day of logging, by voice or tap, feeds an on-device correlation engine that finds HER patterns and states its own uncertainty: "your skin flares two to three days after nights under six hours. 12 observations, weak signal." When there is not enough data it says so rather than inventing something.

Value arrives before the patterns do. Day one, a cycle view that never says "late". Week one, a symptom timeline she can read. Week four, a doctor-ready export. Week six, first patterns. Patterns are the reward for staying, not the entry price.

Underneath sits a safety layer nobody in the category ships: a 90-day cycle sentinel for endometrial risk, monthly mental-health screening with immediate escalation on any self-harm response and routing to Tele-MANAS, and a sleep-apnoea screen. The camera reads lab reports so she stops typing them.

Weight-neutral by guideline. No supplements sold, which is the only reason we can grade the evidence on inositol honestly.
```

## High-level architecture

```
React PWA in a Capacitor shell (Android/iOS) → IndexedDB local-first store, works fully offline → n-of-1 correlation engine runs ON DEVICE over her full history → only accounts and anonymised metrics cross the network → Cloudflare Workers → D1. Gemini API called from the Worker, key never on the client, and used only for language: it turns the engine's numeric finding into a sentence she understands and writes the doctor summary from structured data. It never computes a pattern or scores a risk. ML Kit on-device OCR for lab reports; images discarded once values are read. Her health records never leave the phone.
```

## Tech stack

```
React, TypeScript, Capacitor, IndexedDB/Dexie, Cloudflare Pages + Workers + D1, Gemini API (called from the Worker), ML Kit on-device OCR, Swift/Kotlin native plugins
```

## Links (optional)

```
https://github.com/Dhodraj/pmos-companion
```

*Public.*

## GitHub usernames

| Form label | Username |
|---|---|
| Belson | `Belsonselva` |
| Dhodraj sundaram | `dhodraj` |
| Rahul | `Rahul-ramakrishnan06` |
| Satheesh Kumar | `SatheeshKumarSSK` |

## On the build weekend

**Staying overnight to build**

## MSI raffle

**Enter our team in the MSI raffle**

## Anything else (optional)

```
Phase 1 is the complete core product, built across the two days: onboarding and consent, the 30-second check-in with voice entry, the irregular-native cycle view, the correlation engine, the doctor export, the safety layer, and lab report capture. Phase 2 is enhancement on a working system rather than the missing half of one.

To be straight about what will actually be running by Sunday: the cycle engine, check-in, cycle view and doctor export as working code; the correlation engine working but with false-discovery-rate correction only partially implemented; lab capture working on report layouts we have tested, not every one; crisis routing with real numbers and scripts, though the 24-hour follow-up may not be finished. We are not going to present a mock as a build.

We ran a feasibility audit against platform policy and primary literature before writing anything, and cut ten features that would not have survived. Camera blood oxygen and blood pressure are forbidden by App Store guideline 1.4.1. Passive capture on unlock is an OS-vendor privilege. CGM costs around ₹8,400 a month in India. Facial-expression stress inference fails on evidence.

One open question we would value mentorship on: classification. Running validated screeners on a cadence and escalating at a clinical threshold may tip this from wellness software into a medical device under CDSCO. We plan to seek a pre-submission opinion rather than assume, and would welcome a steer from anyone who has been through it.

Full PRD, data model, feasibility audit and the clinician review pack are in the repo.
```

---

## Before you hit submit

- [ ] Paste each field above
- [ ] Select **Staying overnight to build**
- [ ] Click **Enter our team in the MSI raffle**
- [ ] Submit, read the coach's emailed feedback, resubmit
