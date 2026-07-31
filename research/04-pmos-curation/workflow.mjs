export const meta = {
  name: 'pmos-feature-curation',
  description: 'Curate differentiators + tiered feature set for the PMOS well-being companion as a real product (mycyclesafe.ai funnel)',
  phases: [
    { title: 'Research', detail: 'competitor teardowns (trackers + clinical), community demand mining, evidence base' },
    { title: 'Curation Panel', detail: '3 product lenses: retention, moat, trust/India' },
    { title: 'Synthesis', detail: 'final positioning + differentiator stack + tiered features + anti-features' },
  ],
}

const CTX = `
PRODUCT STRATEGY — a REAL consumer product, not a hackathon demo (the hackathon is just the launchpad).
PRODUCT: a daily well-being companion for women with PMOS (Polyendocrine Metabolic Ovarian Syndrome — renamed from PCOS
in The Lancet, May 2026, precisely to reframe it OFF "cysts/fertility" and ONTO lifelong multisystem metabolic-endocrine
well-being). ~1 in 8-10 women; India burden huge; 7-month diagnostic delays; doctors say "come back when you want a baby";
generic period apps break on irregular cycles; anxiety 6x / depression 4x; 84.5% pathological body-image scores.
CORE THESIS (already decided): the product is an n-of-1 PERSONALIZATION companion — treats each woman's PMOS as an
experiment of one; irregular cycle is signal, not error; learns HER personal cause->effect patterns (sleep->skin,
supplement->mood, food->cycle); coaches evidence-based daily levers the system withholds; dignity-first; mental-health-aware;
privacy-first. Optional daily skin selfie scored by multimodal vision as a self-relative trend (never a beauty score).
EXISTING BUSINESS ASSET: mycyclesafe.ai — the founder's AI menstrual cycle tracker claiming 500,000+ women across 120
countries, privacy-first brand, cycle-phase education content. It is the DISTRIBUTION FUNNEL: users whose cycles are
irregular (the ones generic prediction fails) are exactly the PMOS-companion audience. Assume cross-promotion, shared brand
trust, and possibly shared auth/data (with consent).
BUILDER: full-stack health-tech engineer (telemedicine background), React/PWA, Gemini/LLMs, small team. India-first,
globally scalable. Not a medical device: well-being companion framing, escalate red flags to doctors.
YOUR JOB IS PRODUCT CURATION — differentiators and features — NOT demo planning. Do not talk about synthetic data or
hackathon demos. Think like a product strategist building a durable consumer health product.
To research: call ToolSearch with query "select:WebSearch" then use WebSearch (and WebFetch if useful).
`

const TEARDOWN_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['segment', 'players', 'whitespace'],
  properties: {
    segment: { type: 'string' },
    players: { type: 'array', minItems: 3, maxItems: 8, items: {
      type: 'object', additionalProperties: false, required: ['name', 'what', 'keyFeatures', 'pricing', 'strengths', 'gaps'],
      properties: {
        name: { type: 'string' }, what: { type: 'string' },
        keyFeatures: { type: 'array', items: { type: 'string' } },
        pricing: { type: 'string' }, strengths: { type: 'string' }, gaps: { type: 'string' },
      } } },
    whitespace: { type: 'array', items: { type: 'string' }, description: 'concrete feature/positioning gaps NO player in this segment fills' },
  },
}

const DEMAND_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['demands'],
  properties: {
    demands: { type: 'array', minItems: 6, maxItems: 14, items: {
      type: 'object', additionalProperties: false, required: ['ask', 'voice', 'frequency', 'servedToday', 'featureImplication'],
      properties: {
        ask: { type: 'string', description: 'what PMOS women explicitly ask for / complain is missing' },
        voice: { type: 'string', description: 'a representative quote or paraphrase from community posts' },
        frequency: { type: 'string', enum: ['very common', 'common', 'niche'] },
        servedToday: { type: 'string', description: 'who serves it today, if anyone, and how badly' },
        featureImplication: { type: 'string', description: 'the concrete product feature this demand implies' },
      } } },
  },
}

const EVIDENCE_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['levers', 'framingNotes'],
  properties: {
    levers: { type: 'array', minItems: 6, maxItems: 14, items: {
      type: 'object', additionalProperties: false, required: ['lever', 'evidenceStrength', 'whatItMoves', 'howProductCoaches', 'safetyNotes'],
      properties: {
        lever: { type: 'string' },
        evidenceStrength: { type: 'string', enum: ['strong', 'moderate', 'emerging'] },
        whatItMoves: { type: 'string' },
        howProductCoaches: { type: 'string', description: 'how a non-clinical well-being companion can responsibly coach this' },
        safetyNotes: { type: 'string' },
      } } },
    framingNotes: { type: 'array', items: { type: 'string' }, description: 'what the PMOS rename means for product framing/marketing; what a well-being (non-SaMD) product can and cannot claim' },
  },
}

const PANEL_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['lens', 'positioning', 'differentiators', 'features', 'antiFeatures'],
  properties: {
    lens: { type: 'string' },
    positioning: { type: 'string', description: 'one-sentence positioning from this lens' },
    differentiators: { type: 'array', minItems: 3, maxItems: 6, items: {
      type: 'object', additionalProperties: false, required: ['claim', 'whyDefensible'],
      properties: { claim: { type: 'string' }, whyDefensible: { type: 'string' } } } },
    features: { type: 'array', minItems: 6, maxItems: 16, items: {
      type: 'object', additionalProperties: false, required: ['name', 'tier', 'what', 'why'],
      properties: {
        name: { type: 'string' },
        tier: { type: 'string', enum: ['MVP', 'v1', 'later'] },
        what: { type: 'string' }, why: { type: 'string' },
      } } },
    antiFeatures: { type: 'array', items: { type: 'string' }, description: 'things to deliberately NOT build, with the reason inline' },
  },
}

// ===== Phase 1: Research =====
phase('Research')
const research = await parallel([
  () => agent(
    `${CTX}\nTEARDOWN SEGMENT: cycle trackers + dedicated PMOS/PCOS tracker apps. Tear down the feature sets of: Flo (incl. its
PCOS/irregular-cycle handling and premium), Clue, Stardust or similar, and dedicated PCOS apps (Posiva, Cysterly, Allura,
PCOSpal, PCOS Journey — whichever you can verify). For each: key features, pricing, strengths, gaps SPECIFICALLY for a woman
with PMOS (irregular cycles, metabolic focus, mental health, personalization). End with concrete whitespace no one fills.`,
    { schema: TEARDOWN_SCHEMA, phase: 'Research', label: 'teardown:trackers' }),
  () => agent(
    `${CTX}\nTEARDOWN SEGMENT: clinical/coaching PMOS players + metabolic-coaching apps. Tear down: Veera Health (India),
Allara (US), Pollie, HealthifyMe / sugar.fit-style metabolic programs, Gynoveda or similar India ayurvedic players. For each:
program structure, pricing, human-vs-AI mix, what they cover and what they miss for daily living-with-PMOS. End with concrete
whitespace no one fills (especially: always-on AI companion vs episodic consults; beyond-fertility framing).`,
    { schema: TEARDOWN_SCHEMA, phase: 'Research', label: 'teardown:clinical' }),
  () => agent(
    `${CTX}\nDEMAND MINING: what do PMOS/PCOS women explicitly ask for and complain is missing? Mine r/PCOS, r/PCOSIndia,
app-store reviews of PCOS apps, community threads (2023-2026). Capture the top asks with representative voices: correlation
discovery ("what triggers MY flares"), irregular-cycle-native tracking, supplement guidance, non-fertility framing, mental
health, India-specific (dismissive doctors, family pressure, vernacular). For each: how badly it's served today + the concrete
feature it implies.`,
    { schema: DEMAND_SCHEMA, phase: 'Research', label: 'demand:community' }),
  () => agent(
    `${CTX}\nEVIDENCE BASE: which daily levers have real evidence for PMOS symptom/well-being improvement (myo/d-chiro inositol,
vitamin D, omega-3, resistance training, low-GI diet, sleep regularity, stress reduction, weight-neutral approaches, metformin
[Rx-only — note as escalation not coaching], GLP-1 context)? Use 2023-2026 guidelines (incl. the 2023 international PCOS
guideline and any post-rename 2026 updates). For each lever: evidence strength, what it moves, how a NON-CLINICAL well-being
companion responsibly coaches it, safety notes. Plus framingNotes: what the PMOS rename means for product framing and what a
well-being product can/cannot claim (India + global).`,
    { schema: EVIDENCE_SCHEMA, phase: 'Research', label: 'evidence:levers' }),
])
const [trackers, clinical, demand, evidence] = research
log('Research complete: 2 teardowns, demand mining, evidence base')

const RESEARCH_DUMP = `
== TRACKER/APP TEARDOWN ==\n${JSON.stringify(trackers)}\n
== CLINICAL/COACHING TEARDOWN ==\n${JSON.stringify(clinical)}\n
== COMMUNITY DEMAND ==\n${JSON.stringify(demand)}\n
== EVIDENCE BASE ==\n${JSON.stringify(evidence)}`

// ===== Phase 2: Curation panel (3 lenses) =====
phase('Curation Panel')
const LENSES = [
  { key: 'retention-first', brief: 'Consumer-product/retention lens: what habit loop and feature set makes her open this every day for years? What creates compounding value per check-in? Where do consumer health apps die (churn) and how does each feature fight it?' },
  { key: 'moat-first', brief: 'Differentiation/moat lens: which features make this impossible for Flo (scale), Veera (clinical), or a weekend clone to copy? Weigh the n-of-1 engine, longitudinal personal data, the mycyclesafe.ai funnel (500k users, irregular-cycle segment), and community. Rank differentiators by real defensibility, not marketing.' },
  { key: 'trust-india', brief: 'Trust/clinical-credibility + India lens: dignity-first design, privacy (DPDP, on-device roadmap), honest confidence-gated insights, red-flag escalation, vernacular, affordability, family/marriage-pressure context, avoiding body-image harm. Which features build the trust that health products live or die on?' },
]
const panel = await parallel(LENSES.map(l => () => agent(
  `${CTX}\nRESEARCH:\n${RESEARCH_DUMP}\n\nYou are the ${l.key} product strategist. ${l.brief}\n
Propose: a one-line positioning, 3-6 differentiators (each with WHY it is defensible), a tiered feature set
(MVP = launch via hackathon + mycyclesafe funnel; v1 = first 6 months; later = the compounding vision), and anti-features
(what we deliberately do NOT build — e.g. fertility funnels, beauty scores, generic 28-day prediction, notification spam —
with reasons). Every feature must trace to a researched demand, gap, or evidence lever — no invented features. Set lens to "${l.key}".`,
  { schema: PANEL_SCHEMA, phase: 'Curation Panel', label: `lens:${l.key}` }
)))
const lenses = panel.filter(Boolean)
log(`Panel complete: ${lenses.length}/3 lenses`)

// ===== Phase 3: Synthesis =====
phase('Synthesis')
const final = await agent(
  `${CTX}\nRESEARCH:\n${RESEARCH_DUMP}\n\nPANEL PROPOSALS (3 lenses):\n${JSON.stringify(lenses)}\n\n` +
  `Synthesize the FINAL curated product definition as a markdown document. Merge the three lenses; where they conflict,
decide and say why. Structure:
1. **Positioning statement** — one tight paragraph (the wedge: n-of-1 personalization, beyond-fertility/PMOS-native,
   irregular-cycle-native, dignity+privacy; mycyclesafe.ai as brand/funnel context).
2. **The differentiator stack** — ranked table of 5-7 differentiators: claim | vs whom | why genuinely defensible
   (kill any that are marketing fluff).
3. **Feature set** — three tiers with a one-line rationale each, every feature traced to a demand/gap/evidence source:
   - MVP (launch): the smallest set that delivers the core magic loop
   - v1 (first 6 months): retention + trust deepeners
   - Later (the compounding vision): moat builders
4. **Anti-features** — what we will NOT build and why (make these sharp).
5. **The mycyclesafe.ai funnel play** — concretely how the 500k-user tracker feeds this (segmentation: irregular-cycle users,
   in-app bridge, shared privacy brand), and what data/consent bridge is needed.
6. **Evidence-based coaching scope** — the levers we coach (with strength) and the red lines (escalate, never prescribe).
7. **Open product decisions** — the 3-5 decisions the founder still must make (pricing, standalone app vs module, etc.)
Make it decisive and concrete — a document a team can build from. No hackathon/demo talk.`,
  { phase: 'Synthesis', label: 'synthesize:final', effort: 'xhigh' }
)

return { final, lensSummaries: lenses.map(l => ({ lens: l.lens, positioning: l.positioning })) }
