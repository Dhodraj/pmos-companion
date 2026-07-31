# PMOS Companion

**Team War Room** · AI for Good Health & Well-being · [github.com/Dhodraj/pmos-companion](https://github.com/Dhodraj/pmos-companion)

Dhodraj Sundaram ([dhodraj](https://github.com/dhodraj)) · Belson Johnson ([Belsonselva](https://github.com/Belsonselva)) · Rahul Ramakrishnan ([Rahul-ramakrishnan06](https://github.com/Rahul-ramakrishnan06)) · Satheeshkumar ([SatheeshKumarSSK](https://github.com/SatheeshKumarSSK))

Staying overnight. Entering the MSI raffle.

---

## Problem

Her periods stop being predictable. She downloads a period app; it assumes a 28-day cycle and tells her she is 47 days late, every day, until she deletes it. She sees a doctor and is told it is stress, or to lose weight. Seven months later, on average in India, she gets a name for it, and a conversation about fertility she did not ask for. So she manages it alone: Reddit, six months of inositol, no way to know if it did anything. A year on she sits in front of a doctor for seven minutes and tries to summarise eighteen months from memory.

**The condition is lifelong and systemic, but every tool she has treats it as an event, and nothing accumulates.**

In May 2026 a Monash-led global consensus published in The Lancet renamed PCOS to PMOS, explicitly to reject the cysts-and-fertility framing. NICE has adopted the name. Medicine has redefined the condition; no product has caught up.

## Who it helps

Indian women aged 18 to 35 with PMOS, diagnosed or suspecting it, phone-first on mid-range Android. India's national ICMR survey puts prevalence at 13.6 to 19.6% depending on diagnostic criteria. Her clinician benefits second-hand, through an export built for a seven-minute consultation.

Under-18s are excluded at launch: DPDP prohibits profiling of children, and our correlation engine is profiling. That costs us a group where the condition often first presents, and we are choosing to bear it.

## Solution

Thirty seconds a day, and value that arrives before the patterns do.

| When | What she gets |
|---|---|
| Day 1 | A cycle view built for irregularity. "Day 47 of your usual 30 to 60 range", never "late". The reason she stops deleting apps |
| Week 1 | A structured symptom timeline she can already read and share |
| Week 4 | A doctor-ready export: cycle history, symptoms, medications, and the tests she can ask for by name |
| Week 6+ | First patterns, with honest uncertainty: *"your skin flares two to three days after nights under six hours. 12 observations, weak signal"* |
| Month 3+ | Experiment Mode verdicts. "No detectable change" is a valid, first-class result |

Underneath: a 90-day cycle sentinel for endometrial risk, monthly mental-health screening with immediate escalation on any self-harm response, and a sleep-apnoea screen. The camera reads lab reports and medicine strips so she stops typing them.

## Architecture

Her health data never leaves the phone. Only accounts and anonymised metrics cross the network.

```
CLIENT   Capacitor app (Android/iOS) wrapping a React PWA
         React UI · n-of-1 correlation engine (runs ON DEVICE)
         IndexedDB local-first store · fully offline
         Native plugins: camera capture, on-device OCR, encrypted storage
                    |  accounts + anonymised usage only
                    v  NO personal health records cross this line
EDGE     Cloudflare: Pages (PWA) · Workers (API, AI proxy) · D1 (accounts, metrics)
                    v
AI       Gemini API called FROM the Worker. Key never on the client.
```

**Stack:** React 18, TypeScript, Vite, Capacitor 6, IndexedDB/Dexie · Cloudflare Pages, Workers, D1 · **Gemini API** (grounded companion with citations), **Gemini Nano** (on-device), **ML Kit** (on-device OCR) · Swift/Kotlin plugins for camera and encrypted storage.

## What we cut, before writing code

We ran a feasibility audit against platform policy and primary literature, then had a practising clinician review it. Ten features went.

- **Camera heart rate.** Our clinician asked what a resting heart rate would tell a woman with PMOS. It is not a marker for this condition and would not change her care. Cut.
- **Blood oxygen and blood pressure from camera.** App Store guideline 1.4.1 forbids both by name.
- **Passive capture on unlock.** An OS-vendor privilege, blocked on iOS, Android and web.
- **CGM integration.** About ₹8,400 a month in India, and no legal third-party API.
- **Facial-expression stress, voice mood biomarkers, automated hirsutism scoring.** Each fails on evidence.
- **Multi-device sync and platform health integrations.** Cut from MVP on effort-to-value.

The clinician's review also removed our sleep-apnoea headline comparison, widened Indian prevalence to a range, and specified the 90-day and crisis protocols. We would rather show the work being corrected than claim it was right first time.

## What will actually run by Sunday

| Working code | Cycle engine, check-in, cycle view, doctor export, lab report capture on tested layouts |
| Working, reduced | Correlation engine: lagged correlation with a confidence floor. FDR correction specified, not finished |
| Demonstrated, not general | Medicine strip capture on a small set of common Indian strips |
| Real flow, partial protocol | Crisis routing: real numbers and scripts, without the full 24-hour follow-up |
| Specified, not built | Experiment Mode, support circle, emotional continuity |

We are not presenting a mock as a build.

## Two risks we would rather name

**Classification.** Running validated screeners on a cadence, escalating on suicidality, and prompting review at 90 days are exactly what can tip wellness software into medical device under CDSCO. We do not think our position is obviously wrong, or obviously safe. We will seek a pre-submission opinion before any pilot rather than assume.

**Retention**, which is what kills consumer health apps, made harder by a cohort with roughly 4x depression rates. Our answer is the ladder above: patterns are the reward for staying, not the entry price.

## Sustaining it

Free forever: logging, cycle engine, doctor export, and every safety path. We will not paywall a crisis flow. Paid: personalisation depth, roughly ₹200 to 500 a month. We sell no supplements and take no affiliate revenue, which is the only reason we can grade the evidence on inositol honestly.

---

*Full detail in the repo: PRD (102 functional, 48 non-functional, 14 regulatory requirements, 4 architecture decisions), data model, feasibility audit, clinician review pack, and the raw research behind every claim.*
