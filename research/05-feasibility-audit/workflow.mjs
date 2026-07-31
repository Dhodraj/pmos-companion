export const meta = {
  name: 'pmos-feasibility-audit',
  description: 'Adversarial feasibility audit of the PMOS complete-features spec: platform limits, sensing science, device dependencies, citation verification',
  phases: [
    { title: 'Audit', detail: '6 parallel audits: PHRM/third-party access, platform APIs, sensing science, device deps, citations, clinical/regulatory' },
    { title: 'Verify', detail: 'adversarially re-check every BLOCKED/NOT-VIABLE verdict before it kills a feature' },
    { title: 'Rulings', detail: 'final per-feature ruling table + corrected architecture' },
  ],
}

const CTX = `
CONTEXT — auditing the feasibility of a product spec for a PMOS (formerly PCOS) well-being companion app.
The spec proposes heavy PASSIVE SMARTPHONE SENSING inspired by Google's PHRM (passive heart rate monitoring),
plus wearable/CGM sync, camera vision, audio analysis, and an n-of-1 personalization engine.

THE BUILD CONTEXT THAT MATTERS:
- Built by a SMALL INDEPENDENT TEAM (4 people), a normal third-party app developer. NOT Google, NOT Apple,
  NOT an OS vendor. This distinction is critical for anything involving OS-level hooks.
- Distributed as a consumer app (App Store / Play Store) and/or PWA. India-first, global later.
- HARD NEW CONSTRAINT: **NO EXTERNAL DEVICES.** The product must work with nothing but the phone the user
  already owns. No wearables, no smartwatches, no CGM sensors, no glucometers, no chest straps, no BP cuffs,
  no add-on hardware of any kind. Any feature that REQUIRES a purchased device violates this and must be
  flagged. (Optional import from a device the user *already happens to own* is a grey zone — flag it as such,
  do not silently allow it as a core feature.)
- Framing is a NON-DIAGNOSTIC well-being companion (not a regulated medical device).

YOUR JOB: brutal, evidence-based feasibility auditing. Be adversarial. A plausible-sounding feature that a
third-party app CANNOT actually ship is the most dangerous thing in this document — it would be built into a
roadmap and discovered as impossible months later, or worse, promised to hackathon judges and investors.
Distinguish sharply between: (a) genuinely shippable today by a small team, (b) shippable with heavy effort or
degraded quality, (c) research-only / not reliable enough to ship, (d) BLOCKED by platform/OS policy, and
(e) requires external hardware.

To research, call ToolSearch with query "select:WebSearch,WebFetch" then use them. Cite source URLs.
Prefer official platform documentation (Apple/Google developer docs, App Store/Play policy) and peer-reviewed
sources over blogs and marketing pages.
`

const AUDIT_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['area', 'findings', 'headline'],
  properties: {
    area: { type: 'string' },
    headline: { type: 'string', description: 'the single most important thing the spec author must know from this audit' },
    findings: { type: 'array', minItems: 4, maxItems: 14, items: {
      type: 'object', additionalProperties: false,
      required: ['claimOrFeature', 'verdict', 'reality', 'evidence', 'sourceUrl', 'correction'],
      properties: {
        claimOrFeature: { type: 'string', description: 'the spec feature or claim being audited' },
        verdict: { type: 'string', enum: ['SHIPPABLE', 'DEGRADED', 'RESEARCH-ONLY', 'PLATFORM-BLOCKED', 'NEEDS-EXTERNAL-DEVICE', 'CITATION-PROBLEM'] },
        reality: { type: 'string', description: 'what is actually true, precisely' },
        evidence: { type: 'string', description: 'the concrete fact/quote/policy that establishes this' },
        sourceUrl: { type: 'string' },
        correction: { type: 'string', description: 'what the spec should say instead — a concrete rewrite, or the viable substitute feature' },
      } } },
  },
}

// ===== Phase 1: parallel audits =====
phase('Audit')
const AUDITS = [
  { key: 'phrm-third-party', brief:
`Google PHRM (Passive Heart Rate Monitoring). The spec cites a Nature paper (June 2026) and builds an entire
v2 pillar on "front-camera 8-second rPPG clip captured automatically on phone unlock."
VERIFY, precisely:
1. Does the cited Google PHRM research actually exist? Get the real citation. Is the Nature URL in the spec
   (https://www.nature.com/articles/s41586-026-10507-6) real, and does it point to what the spec claims?
2. THE CRITICAL QUESTION: is PHRM available to THIRD-PARTY developers — as an SDK, API, ML Kit feature,
   Health Connect data type, or anything else? Or is it a Google-internal / Pixel / Fitbit-app-only capability
   that only the OS vendor can implement? Search Google developer docs, ML Kit, Health Connect, Android APIs.
3. Are the quoted accuracy numbers (<10% mean percentage error vs ECG; <5 bpm MAE for daily RHR) real, and
   under what conditions/populations (incl. the Monk Skin Tone findings)?
4. Are there ANY third-party SDKs that do camera rPPG on phones (e.g. Binah.ai, NuraLogix Anura SDK, Rouast,
   open-source rPPG toolboxes)? What do they cost, what do they require (foreground? user holding still?),
   and what are their honest accuracy/regulatory positions?
Be blunt about whether a 4-person team can ship "passive HR on unlock."` },

  { key: 'platform-policy', brief:
`Platform capability + policy audit. For each, state what iOS and Android each allow for a NORMAL third-party
app in 2026, citing official docs/policy:
1. BACKGROUND / non-foreground CAMERA access. Can an app capture front-camera video when not in the foreground,
   or immediately on device unlock, without the user opening the app? (iOS background camera policy, the
   mandatory camera/mic privacy indicators; Android foreground-service camera restrictions, Android 9+ background
   camera block.)
2. DEVICE UNLOCK EVENTS. Can a third-party app detect phone unlock? (iOS: any API at all? Android:
   ACTION_USER_PRESENT / SCREEN_ON — is it usable given implicit-broadcast restrictions since Android 8, and
   what does it cost in battery/foreground-service requirements?)
3. BACKGROUND MICROPHONE overnight (for snore detection). What do iOS background audio modes and Android
   foreground-service-microphone permission actually permit? What do App Store / Play policies say about
   overnight mic recording? Do shipping sleep apps do this, and how?
4. TYPING SPEED / keystroke dynamics OUTSIDE the app (the spec's "brain fog proxy"). Possible? What permission
   would it need (accessibility services?) and would it pass store review?
5. HEALTH DATA APIs: Apple HealthKit (native only?) and the CURRENT state of Google Fit APIs vs Health Connect —
   is Google Fit deprecated, what is the migration, and what does a third party need to read sleep/HR/steps?
6. PWA LIMITS: can a Progressive Web App access HealthKit, Health Connect, background camera, background mic,
   or run reliable background sync/push on iOS? What breaks if this product is a PWA rather than a native app?` },

  { key: 'sensing-science', brief:
`Smartphone-only sensing science audit — is each signal actually reliable enough to ship in a consumer health
product, using ONLY the phone (no external device)? For each: state maturity, real-world accuracy, failure modes,
and whether a small team can achieve it. Be sceptical; separate lab results from field reality.
1. Camera rPPG heart rate (front camera, face) and contact PPG (fingertip on rear camera + flash).
2. HRV (rMSSD) from smartphone PPG — is phone-derived HRV trustworthy enough for biofeedback and for correlating
   with symptoms? What sampling rate / duration is needed?
3. SpO2 / blood oxygen from a phone camera. Critically: do phone RGB cameras have the wavelengths needed? What
   happened with phone makers' own SpO2 features? Is this regulated as a medical measurement?
4. Contactless respiratory rate from front camera.
5. Ballistocardiography (BCG) — phone placed on the mattress overnight, accelerometer detecting heartbeat
   micro-vibrations. Real-world reliability: mattress type, bed partner, phone placement, battery/heat.
6. Camera-based stress estimation from facial action units. Address the scientific controversy about inferring
   emotional/stress states from facial expressions (e.g. Barrett et al.).
7. Voice biomarkers for mood from short voice clips — evidence strength, and cross-language/cultural validity
   (Hindi/Tamil).
8. Pulse transit time (PTT) blood-pressure estimation using face + finger PPG simultaneously — is simultaneous
   multi-camera capture even possible on phones, and is cuffless BP without calibration valid?
9. Skin/acne severity scoring and hirsutism (Ferriman-Gallwey-style) density scoring from selfies — what exists,
   what's achievable with a general multimodal model vs a trained model, and how reliable across skin tones and
   lighting?
IMPORTANT — the founder specifically WANTS impressive camera-only sensing ("heartbeat monitoring with camera alone").
So be constructive as well as sceptical: for every signal that IS viable, specify exactly HOW to build it —
front vs rear camera, flash on/off, capture duration, foreground-only or not, sampling rate, the signal-processing
chain (ROI, detrending, bandpass, FFT/peak detection), realistic error bars, and any open-source libraries or
commercial SDKs a small team could use. Identify which of these are demo-ready showpieces.` },

  { key: 'device-dependencies', brief:
`External-device dependency audit against the HARD "no external devices" rule. Go through the spec's features and
identify EVERY one that requires, or silently assumes, hardware beyond the phone itself. For each: name the device,
its real cost/availability IN INDIA, and propose the phone-only substitute (or state honestly that there is none).
Cover at minimum:
1. CGM sync (the spec names Dexcom Stelo and Abbott Libre). Is Stelo available in India at all? What does Libre
   cost per sensor in India? Is CGM realistic for a mass-market Indian well-being app?
2. Wearable import (Apple Health / Google Fit / Samsung Health) for sleep stages, resting HR, HRV, SpO2 — all of
   which presuppose the user owns a wearable.
3. Home glucometer logging.
4. Any BP measurement.
5. Lab tests (fasting insulin, OGTT, lipids, vitamin D) — these need a phlebotomy lab, not a device the user owns.
   Is this the same category of violation, or is it acceptable because it is a referral to routine healthcare
   rather than a product hardware dependency? Give a clear reasoned ruling.
Also: what proportion of the spec's "innovative" v2 pillar collapses if external devices are removed?` },

  { key: 'citations', brief:
`Citation verification. The spec's §11 Sources list and inline claims must be checked — fabricated or misattributed
citations in a health product are a credibility catastrophe. For EACH, verify existence and that it says what the
spec claims. Flag anything you cannot verify as CITATION-PROBLEM (do not assume it is fine):
1. "Google PHRM (Nature, June 2026)" — https://www.nature.com/articles/s41586-026-10507-6
2. "Draft NICE PMOS Guideline (July 2026 consultation)" — https://www.nice.org.uk/guidance/GID-NG10436/documents/450
   Does a NICE PMOS/PCOS guideline in development exist, and is the ID right?
3. PMOS rename in The Lancet, May 2026 — verify the actual paper and the exact new name.
4. 2023 International Evidence-based Guideline (Fertility & Sterility DOI given).
5. "PCOS app MARS analysis" — https://doi.org/10.2196/71118
6. "mHealth PCOS systematic review (2026)" — https://doi.org/10.31435/ijitss.1(49).2026.4653 — is this a
   legitimate indexed journal or a predatory one?
7. Competitor products claimed to exist: PMOS Vera (pmosvera.com), Josie (josie.care), Vitalix
   (vitalix.health), pmos-pcos.com. Do these exist and do they do what the competitive matrix claims?
8. The epidemiology claims: PMOS ~8-13% prevalence; OSA ~37% in PCOS vs ~6%; anxiety ~6x / depression ~4x;
   84.5% pathological body-image scores; "7-15 year diagnostic delay"; Flo FTC settlement / $56M class action.
Report precisely which check out, which are misstated, and which appear not to exist.` },

  { key: 'clinical-regulatory', brief:
`Clinical instrument + regulatory audit for shipping this as a NON-DIAGNOSTIC well-being app, India-first.
1. SCREENER LICENSING: PHQ-4 / PHQ-9 / GAD-7 — what are the actual copyright/licensing terms for commercial app
   use? Are validated Hindi and Tamil translations available, and under what terms? Same question for any
   validated OSA screening instrument (STOP-BANG, Berlin, Epworth) — note Epworth's licensing specifically.
2. INDIA REGULATION: where is the Software-as-a-Medical-Device line under CDSCO for an app that does
   screen-and-refer vs one that scores/flags a condition? Does displaying camera-derived heart rate, HRV, or
   SpO2 cross into medical-device territory in India / EU MDR / FDA general-wellness?
3. Is the spec's "cycle-interval sentinel" (escalating on >90-day gaps / <4 bleeds per year for endometrial
   protection) clinically correct per the 2023 international guideline, and does implementing it cross the
   diagnostic line?
4. DPDP Act 2023 obligations specifically for: face images, voice recordings, mental-health responses, and
   children/teens (the spec has a "teen-safe mode" — what does DPDP require for under-18 users, and does that
   materially constrain the product?)
5. App Store / Play Store health-app review requirements that could block launch (medical claims, mental-health
   crisis handling, camera/mic justification).` },
]

const audits = (await parallel(AUDITS.map(a => () => agent(
  `${CTX}\n\nAUDIT AREA: ${a.key}\n\n${a.brief}\n\nSet area to "${a.key}". Be precise and cite sources.`,
  { schema: AUDIT_SCHEMA, phase: 'Audit', label: `audit:${a.key}`, effort: 'high' }
)))).filter(Boolean)
log(`Audits complete: ${audits.length}/6`)

// ===== Phase 2: adversarial verification of blocking verdicts =====
phase('Verify')
const blocking = audits.flatMap(a => a.findings.filter(f =>
  ['PLATFORM-BLOCKED', 'RESEARCH-ONLY', 'NEEDS-EXTERNAL-DEVICE', 'CITATION-PROBLEM'].includes(f.verdict)
).map(f => ({ ...f, area: a.area })))
log(`${blocking.length} blocking verdicts to adversarially verify`)

const VERDICT_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['claimOrFeature', 'originalVerdict', 'upheld', 'finalVerdict', 'reasoning', 'workaround'],
  properties: {
    claimOrFeature: { type: 'string' },
    originalVerdict: { type: 'string' },
    upheld: { type: 'boolean', description: 'true = the blocking verdict survives scrutiny' },
    finalVerdict: { type: 'string', enum: ['SHIPPABLE', 'DEGRADED', 'RESEARCH-ONLY', 'PLATFORM-BLOCKED', 'NEEDS-EXTERNAL-DEVICE', 'CITATION-PROBLEM'] },
    reasoning: { type: 'string' },
    workaround: { type: 'string', description: 'a genuine viable alternative that respects phone-only + platform rules, or "none" if there truly is not one' },
  },
}

const verified = (await parallel(blocking.slice(0, 24).map((f, i) => () => agent(
  `${CTX}\n\nAn auditor ruled this feature/claim **${f.verdict}**. Your job is to REFUTE that ruling if you can —
try hard to find a legitimate way it IS shippable by a small third-party team, phone-only, within platform policy.
Search for real shipping apps that do this, official APIs, or SDKs that make it possible.

FEATURE/CLAIM: ${f.claimOrFeature}
AUDITOR'S REASONING: ${f.reality}
AUDITOR'S EVIDENCE: ${f.evidence} (${f.sourceUrl})

If after genuine effort the blocking ruling stands, uphold it and say precisely why, and propose the best
phone-only workaround that a user would actually accept. Default to upholding only when the evidence is clear —
but do NOT rescue a feature with wishful thinking or a workaround that quietly requires a wearable, an OS-vendor
privilege, or research-grade accuracy the team cannot validate.`,
  { schema: VERDICT_SCHEMA, phase: 'Verify', label: `verify:${(f.claimOrFeature||'x').slice(0, 28)}`, effort: 'high' }
)))).filter(Boolean)
log(`Verification complete: ${verified.filter(v => v.upheld).length}/${verified.length} blocking verdicts upheld`)

// ===== Phase 3: final rulings + corrected architecture =====
phase('Rulings')
const rulings = await agent(
  `${CTX}\n\nFULL AUDIT RESULTS:\n${JSON.stringify(audits)}\n\n` +
  `ADVERSARIAL VERIFICATION OF BLOCKING VERDICTS:\n${JSON.stringify(verified)}\n\n` +
  `Produce the definitive feasibility ruling document in markdown. Structure:\n\n` +
  `1. **Verdict summary** — can this spec be built as written? Lead with the 3-5 findings that most change the plan.\n` +
  `2. **The showstoppers** — features that CANNOT be built as specified (platform-blocked, external-device-dependent,\n` +
  `   or research-only), each with: why, the evidence, and the concrete replacement feature that IS buildable.\n` +
  `3. **Per-feature ruling table** — every feature from the spec's sections 3.1-3.14, with a verdict\n` +
  `   (SHIPPABLE / DEGRADED / RESEARCH-ONLY / PLATFORM-BLOCKED / NEEDS-EXTERNAL-DEVICE) and a one-line note.\n` +
  `   Be exhaustive — the author needs to see every feature accounted for.\n` +
  `4. **Corrected architecture** — what the platform must actually be (PWA vs native vs hybrid) given the sensing\n` +
  `   ambitions, and what each choice costs. Give a clear recommendation.\n` +
  `5. **Corrected phase roadmap** — MVP / v1 / v2 / Later rebuilt from only what survives, phone-only.\n` +
  `6. **Citation corrections** — which references are verified, misstated, or unverifiable; exact fixes.\n` +
  `7. **What actually remains differentiated** — after removing the impossible features, is the product still\n` +
  `   distinctive? Be honest. If the passive-sensing pillar collapses, say what carries the product instead.\n` +
  `8. **THE COOL-BUT-REAL LIST (the founder specifically wants this)** — the maximum set of genuinely impressive,\n` +
  `   camera/phone-ONLY sensing features that a small team CAN actually ship and demo, ranked by wow-factor.\n` +
  `   The founder explicitly asked for "cool features like heartbeat monitoring with camera alone" — so be\n` +
  `   constructive here, not just restrictive: for each, give the capture method (which camera, flash on/off,\n` +
  `   duration, foreground), the realistic accuracy, the libraries/approach to implement it, and how to frame it\n` +
  `   legally as wellness. If camera heart rate IS viable in some form, say exactly which form and how to build it.\n\n` +
  `Be decisive and concrete. Every ruling must trace to evidence from the audits. Do not hedge where the evidence\n` +
  `is clear, and do not soften a showstopper to be encouraging.`,
  { phase: 'Rulings', label: 'rulings:final', effort: 'xhigh' }
)

return {
  rulings,
  auditHeadlines: audits.map(a => ({ area: a.area, headline: a.headline })),
  blockingCount: blocking.length,
  upheldCount: verified.filter(v => v.upheld).length,
  overturned: verified.filter(v => !v.upheld).map(v => ({ feature: v.claimOrFeature, finalVerdict: v.finalVerdict, why: v.reasoning })),
}
