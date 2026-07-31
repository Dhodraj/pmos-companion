# Clinical review request

**PMOS Companion** - a proposed well-being app for women with PMOS (Polyendocrine Metabolic Ovarian Syndrome, renamed from PCOS by a Monash-led global consensus published in The Lancet, May 2026).

Prepared for the Tech for Good 2026 hackathon, GDG Coimbatore, 8 to 9 August. Team: War Room.

---

## What we are asking you to do

We are not asking for endorsement. We are asking you to find what is wrong before a jury does, and before any of this reaches a real patient.

The proposal follows this page. It has already been through a structured internal review covering platform feasibility, regulation and competitive position, and an AI-simulated clinical review that raised the concerns listed below. **We want a real clinician's judgement on the same questions**, because a simulated one is not evidence.

Please be blunt. If something is unsafe, overstated or would embarrass us in front of a doctor, we would rather hear it now.

---

## The eight questions we most need answered

### 1. Are the epidemiological claims accurate?

The proposal cites: global prevalence of 10 to 13% (WHO); India at 13.6 to 19.6% depending on diagnostic criteria (ICMR national survey); sleep apnoea at 37% against 6%; anxiety around 6x and depression around 4x; worse body image than controls across all MBSRQ-AS subscales, persisting after BMI adjustment; diagnostic delay averaging seven months in India.

These were re-sourced after an earlier draft misattributed two of them, so we would value a second pass. In particular:
- Is the 37% sleep apnoea figure sound, and is the 6% general-population comparator fair?
- We quote a single survey finding 84.5% in the pathological range on appearance evaluation, but flag it as self-selected and uncontrolled with a mean BMI of 31.3. Is that an appropriate way to use it, or should we drop it and rely only on the meta-analysis?
- Is quoting Rotterdam and AE-PCOS figures side by side the right way to present Indian prevalence, or is one criterion standard in Indian practice?

### 2. The 90-day cycle sentinel

We escalate when a cycle exceeds 90 days, on the basis that prolonged anovulation exposes the endometrium to unopposed oestrogen, and that guidelines support inducing a withdrawal bleed at least every three months.

- Is 90 days the right threshold?
- Is it appropriate for an app to raise this at all, or does it cross into clinical judgement?
- What should the escalation actually say? We want wording that is accurate without being frightening.
- Should it repeat if ignored, and should it be dismissible?

### 3. Mental health screening and crisis routing

We plan PHQ-4 and GAD-2 on a defined cadence, with a pre-scripted route to Tele-MANAS (14416) and no generated text anywhere on a crisis path.

Our internal review rated this the most serious open issue in the whole product. Specifically:
- What cadence is appropriate, and what should trigger escalation? A single positive screen, or persistence across two or more?
- What happens after we surface the helpline? Should we follow up, and how?
- What does responsible governance look like for a consumer app doing this? Who reviews escalations?
- Are we exposing users to harm through false reassurance or through false positives?

### 4. The screen-and-refer boundary

We intend to screen and refer, never to diagnose, score risk, or suggest doses. Does the product as described actually hold that line? Our internal review flagged the phrase "finds *her* patterns" as drifting toward causal language.

### 5. Camera-based heart rate in an anxious population

The app measures heart rate from a fingertip on the phone camera. This population has roughly 6x baseline anxiety.

- Is presenting an objective cardiac number to this group wise?
- What guidance should accompany a reading? We plan to show a normal range for context.
- What should happen on an abnormal or implausible reading?
- Is a visible pulse waveform reassuring or alarming?

### 6. Skin photo tracking and body image

Users may optionally photograph their skin to track change over time. Images stay on the device, there are no beauty or attractiveness scores, no cross-user comparison, and no before-and-after collages.

Given the body-image burden in this group, is that mitigation sufficient? Should we screen for body-image distress or disordered eating before enabling it?

### 7. The support circle

Users may nominate someone to contact. We deliberately made this user-initiated only: the contact learns she would like to hear from them, never her mood, score or symptoms. An optional recurring reminder to that contact fires on a fixed schedule so it carries no information about her state.

We rejected the obvious design (app detects low mood, notifies family) because it can be turned into a monitoring tool by whoever holds the other end. Is our version safe? Have we missed a way it could be misused?

### 8. Indian regulatory positioning

We position as wellness software rather than a medical device, and plan to seek a CDSCO pre-submission classification opinion before any pilot. Given that we run validated screening instruments and escalate on a clinical threshold, is that positioning defensible, or should we assume medical-device classification from the start?

---

## What we would find most useful

- Anything factually wrong, however small
- Anything that could harm a patient
- Anything that would make a clinician distrust the product on sight
- What you would want to see before you would let this near your own patients

If it is easier to mark up the document directly, please do.

---

*The proposal follows.*
