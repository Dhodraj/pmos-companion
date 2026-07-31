export const meta = {
  name: 't4g-portfolio',
  description: 'Track-grounded multi-persona research producing a PORTFOLIO of product ideas (4 per track) shortlisted for the builder',
  phases: [
    { title: 'Persona Research', detail: '16 personas (4/track) find real pains within each track\'s official scope' },
    { title: 'Track Synthesis', detail: 'cluster each track\'s pains into top opportunities' },
    { title: 'Idea Generation', detail: '4 distinct product concepts per track = 16 concepts' },
    { title: 'Portfolio Judge', detail: 'rank all 16, shortlist 6-8 with tags + rejects' },
    { title: 'One-Pagers', detail: 'compact build-ready spec for the top 5' },
  ],
}

const CTX = `
CONTEXT — Tech for Good 2026 hackathon, GRD College of Science, Coimbatore, Tamil Nadu, India. Aug 8-9 2026, 36-48hr in-person.
Theme: "Build with AI — Code for Communities". Organized by GDG Coimbatore, TiE Kovai Con, GRD College, Startup Culture.
VERIFIED FACTS (from the official site — do NOT invent others):
- Four SDG-aligned tracks. Participants pick ONE. Each tackles a localized issue with a globally scalable framework.
- Each track lists "example builds" that are STARTING POINTS, NOT REQUIREMENTS — some inspired by Y Combinator's Requests for Startups.
- Incentive for developers: the chance to PILOT their solution in real constituencies and local markets, with domain-expert
  mentorship from TiE Kovai, technical enablement from GDG Coimbatore, founder support from Startup Culture, and incubation
  pathways for winning teams. (Do NOT claim problems were submitted by a Member of Parliament — that is not stated.)
So: realism, in-scope fit, a strong 36hr demo, and a credible pilot/incubation path all matter.
The builder: a full-stack developer at a telemedicine company (a telemedicine company) — strong HEALTH-TECH domain, ships AI web apps fast
(React, PWA, Gemini). Rural Tamil Nadu context: Tamil-speaking users, patchy internet, low-end Android, overloaded paper-bound
govt workers. To research, load web tools: call ToolSearch("select:WebSearch") then WebSearch. Prefer real 2024-2026 evidence.
`

// Official track data (verbatim scope + example builds from t4g.gdgcbe.com/tracks)
const TRACKS = [
  {
    key: 'AI for Good Health & Well-being',
    sdg: 'SDG 3',
    scope: 'Building AI systems to streamline clinical operations, track medicine stock, and assist healthcare workers in resource-constrained settings.',
    examples: [
      'A clinical-ops copilot that automates hospital admin and medicine-stock tracking.',
      'A diagnostic assistant that analyzes patient history to support frontline health workers.',
    ],
    personas: [
      'a rural PHC staff nurse / VHN who single-handedly runs a Primary Health Centre in interior Tamil Nadu',
      'a pharmacist / storekeeper managing erratic medicine stock across a PHC and its sub-centres',
      'a District Health Officer accountable for PHC performance, drug stock, and maternal/child metrics',
      'an ASHA community health worker doing door-to-door outreach with a paper register and a cheap phone',
    ],
  },
  {
    key: 'AI for Zero Hunger & Economic Growth',
    sdg: 'SDG 2 & 8',
    scope: 'Developing intelligent tools for crop advisory, disease detection, and agricultural yield optimization using Indic languages.',
    examples: [
      'An Indic-language crop-advisory and disease-detection assistant for smallholder farmers.',
      'An AI back-office (accounting, compliance, invoicing) for rural micro-enterprises.',
    ],
    personas: [
      'a smallholder farmer (2 acres) in western Tamil Nadu deciding crop, inputs, disease control and when/where to sell',
      'an agricultural extension officer expected to advise thousands of farmers with no time or tools',
      'a rural woman running a Mahalir Thittam self-help-group micro-enterprise needing accounts, GST/compliance, credit',
      'a small kirana/FPO trader doing invoicing, stock and payments by hand',
    ],
  },
  {
    key: 'AI for Sustainable Cities & Climate Action',
    sdg: 'SDG 11 & 13',
    scope: 'Creating systems for neighborhood-level pollution mapping, predictive heatwave alerts, and smart municipal infrastructure.',
    examples: [
      'Neighborhood-level pollution mapping with predictive heatwave alerts from open sensor data.',
      'A closed-loop optimizer for municipal energy and water networks.',
    ],
    personas: [
      'a municipal sanitation / water engineer in a Tier-2 Tamil Nadu city (Coimbatore) judged on infra uptime',
      'an urban resident dealing with flooding, heat, air/water pollution and unreliable civic services',
      'a Pollution Control Board / environmental officer with too few sensors and too much area',
      'an informal-settlement resident exposed to extreme heat, water scarcity and poor drainage',
    ],
  },
  {
    key: 'AI for Strong Institutions',
    sdg: 'SDG 16',
    scope: 'Building civic-tech platforms to analyze citizen grievances and transform public data into actionable municipal priorities.',
    examples: [
      'A citizen-grievance analyzer that turns public complaint data into ranked municipal priorities.',
      'A "civic brain" that structures public records so agents can answer citizen queries.',
    ],
    personas: [
      'a municipal / ward officer drowning in unstructured citizen grievances across phone, paper and portals',
      'a citizen trying to lodge a complaint or access a scheme, lost in language and process',
      'a councillor / MLA-office staffer who must show "we fixed your problem" with data',
      'a local journalist / RTI activist trying to turn scattered public records into accountability',
    ],
  },
]

const PAIN_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['persona','track','pains'],
  properties: {
    persona: { type: 'string' }, track: { type: 'string' },
    pains: { type: 'array', minItems: 3, maxItems: 5, items: {
      type: 'object', additionalProperties: false,
      required: ['title','description','severity','frequency','aiLeverage','buildability','inScope','evidence'],
      properties: {
        title: { type: 'string' }, description: { type: 'string' },
        severity: { type: 'integer', minimum: 1, maximum: 5 },
        frequency: { type: 'integer', minimum: 1, maximum: 5 },
        aiLeverage: { type: 'integer', minimum: 1, maximum: 5 },
        buildability: { type: 'integer', minimum: 1, maximum: 5 },
        inScope: { type: 'string', description: 'how it maps to this track\'s official scope/example builds' },
        evidence: { type: 'string' },
      } } },
  },
}

const SYNTH_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['track','topPains'],
  properties: {
    track: { type: 'string' },
    topPains: { type: 'array', minItems: 3, maxItems: 4, items: {
      type: 'object', additionalProperties: false, required: ['title','whyHighest','solutionDirection'],
      properties: { title: { type: 'string' }, whyHighest: { type: 'string' }, solutionDirection: { type: 'string' } } } },
  },
}

const CONCEPT_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['name','track','oneLiner','pain','whoUses','angle','coreFeatures','aiComponents','mvp36hr','differentiator','pilotPath','buildability','wowFactor','domainFit','crowdedness','risks'],
  properties: {
    name: { type: 'string' }, track: { type: 'string' }, oneLiner: { type: 'string' },
    pain: { type: 'string' }, whoUses: { type: 'string' }, angle: { type: 'string' },
    coreFeatures: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 5 },
    aiComponents: { type: 'array', items: { type: 'string' } },
    mvp36hr: { type: 'string' }, differentiator: { type: 'string' }, pilotPath: { type: 'string' },
    buildability: { type: 'integer', minimum: 1, maximum: 5 },
    wowFactor: { type: 'integer', minimum: 1, maximum: 5 },
    domainFit: { type: 'integer', minimum: 1, maximum: 5, description: 'fit to THIS builder (health-tech, React/Gemini)' },
    crowdedness: { type: 'integer', minimum: 1, maximum: 5, description: '5 = extremely cloned/me-too, 1 = fresh' },
    risks: { type: 'array', items: { type: 'string' } },
  },
}

const PORTFOLIO_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['shortlist','rejected','diversityNote'],
  properties: {
    shortlist: { type: 'array', minItems: 5, maxItems: 8, items: {
      type: 'object', additionalProperties: false, required: ['name','track','tag','total','scalability','painCoverage','painsCovered','universalCore','oneLiner','why'],
      properties: {
        name: { type: 'string' }, track: { type: 'string' },
        tag: { type: 'string', description: 'e.g. Safest Bet / Boldest / Best Domain Fit / Most Buildable / Highest Impact / Best Pilot Story / Most Scalable / Broadest Coverage' },
        total: { type: 'integer', minimum: 1, maximum: 100 },
        scalability: { type: 'integer', minimum: 1, maximum: 5, description: 'how well the CORE generalizes beyond Tamil Nadu (5 = language/geo-agnostic core, huge TAM; 1 = value intrinsically local)' },
        painCoverage: { type: 'integer', minimum: 1, maximum: 5, description: 'how many of THIS track\'s synthesized top pains this ONE product meaningfully addresses (5 = consolidates most/all into one platform; 1 = single narrow pain)' },
        painsCovered: { type: 'array', items: { type: 'string' }, description: 'the specific track pains this product addresses' },
        universalCore: { type: 'string', description: 'the language/geography-agnostic product underneath, and what is merely the Tamil launch locale' },
        oneLiner: { type: 'string' }, why: { type: 'string' },
      } } },
    rejected: { type: 'array', items: {
      type: 'object', additionalProperties: false, required: ['name','why'],
      properties: { name: { type: 'string' }, why: { type: 'string' } } } },
    diversityNote: { type: 'string' },
  },
}

// ===== Phase 1: persona research (16) =====
phase('Persona Research')
const personaTasks = []
for (const t of TRACKS) {
  for (const p of t.personas) {
    personaTasks.push(() => agent(
      `${CTX}\n\nYou ARE this person (first person): ${p}.\nTRACK: "${t.key}" (${t.sdg}).\n` +
      `Official track scope: "${t.scope}"\nOfficial example builds (starting points, not requirements): ${t.examples.map(e=>`"${e}"`).join('; ')}\n\n` +
      `List 3-5 pains that most wreck your day within THIS track's scope. Ground each in rural/TN reality, research the web for ` +
      `2024-2026 evidence, and in 'inScope' say how it maps to the track scope / example builds. Score severity, frequency, ` +
      `aiLeverage, buildability (real 36hr demo + production path). Set track to "${t.key}".`,
      { schema: PAIN_SCHEMA, phase: 'Persona Research', label: `pain:${t.key.split(' ')[2]||t.sdg}` }
    ))
  }
}
const rawPains = (await parallel(personaTasks)).filter(Boolean)
log(`Collected pains from ${rawPains.length}/16 personas`)

// ===== Phase 2: per-track synthesis =====
phase('Track Synthesis')
const synthRaw = await parallel(TRACKS.map((t, i) => () => {
  const bundle = rawPains.slice(i * 4, i * 4 + 4)
  const dump = bundle.map(b => `Persona: ${b.persona}\n` + b.pains.map(pn =>
    `- ${pn.title} [sev${pn.severity}/freq${pn.frequency}/ai${pn.aiLeverage}/build${pn.buildability}] ${pn.description} | scope: ${pn.inScope} | ev: ${pn.evidence}`
  ).join('\n')).join('\n\n')
  return agent(
    `${CTX}\n\nTRACK: "${t.key}" (${t.sdg}). Scope: "${t.scope}". Examples: ${t.examples.join(' | ')}.\n\n` +
    `Cluster these persona pains, drop weak/generic ones, and name the 3-4 highest-value, in-scope, AI-solvable, ` +
    `36hr-buildable opportunities.\n\nPAINS:\n${dump}`,
    { schema: SYNTH_SCHEMA, phase: 'Track Synthesis', label: `synth:${t.sdg}` }
  )
}))
const synth = synthRaw.filter(Boolean)

// ===== Phase 3: idea generation — 4 concepts per track (16) =====
phase('Idea Generation')
const ANGLES = [
  { tag: 'frontline-worker tool', hint: 'a tool the overloaded worker (nurse/officer/extension-officer) actually uses in the field' },
  { tag: 'end-user / citizen tool', hint: 'a Tamil, low-literacy, phone-first tool the citizen/farmer/resident uses directly' },
  { tag: 'official / admin intelligence', hint: 'a dashboard that turns messy field data into ranked decisions for an official/DHO/municipal officer' },
  { tag: 'data-moat / novel integration', hint: 'exploit a unique data source or cross-integration competitors cannot easily copy' },
]
const conceptTasks = []
for (const t of TRACKS) {
  const s = synth.find(x => x.track === t.key) || synth[TRACKS.indexOf(t)]
  const pains = s ? s.topPains.map(tp => `${tp.title} — ${tp.solutionDirection}`).join(' | ') : t.scope
  for (const a of ANGLES) {
    conceptTasks.push(() => agent(
      `${CTX}\n\nTRACK: "${t.key}" (${t.sdg}). Official scope: "${t.scope}". Example builds: ${t.examples.join(' | ')}.\n` +
      `Top pains in this track: ${pains}\n\n` +
      `Design ONE production-grade AI product for this track, from this angle: ${a.tag} — ${a.hint}. ` +
      `MUST stay within the track's official scope (example builds are starting points, not limits). Be concrete: name it, ` +
      `the ONE 36hr MVP slice, specific AI components (Gemini, Bhashini Tamil TTS/ASR, vision, RAG — say which & why), a sharp ` +
      `differentiator, a realistic pilot/incubation path. Score buildability, wowFactor, domainFit (to a health-tech React/Gemini ` +
      `dev), crowdedness (5=cloned to death). Research the web to avoid reinventing an existing tool. Set track to "${t.key}".`,
      { schema: CONCEPT_SCHEMA, phase: 'Idea Generation', label: `idea:${t.sdg}:${a.tag.split(' ')[0]}` }
    ))
  }
}
const concepts = (await parallel(conceptTasks)).filter(Boolean)
log(`Generated ${concepts.length} concepts across 4 tracks`)

// ===== Phase 4: portfolio judge =====
phase('Portfolio Judge')
const cDump = concepts.map((c, i) =>
  `#${i+1} ${c.name} [${c.track}] (${c.angle})\n  ${c.oneLiner}\n  pain: ${c.pain}\n  MVP: ${c.mvp36hr}\n  diff: ${c.differentiator}\n` +
  `  scores build ${c.buildability}/wow ${c.wowFactor}/fit ${c.domainFit}/crowd ${c.crowdedness}\n  pilot: ${c.pilotPath}`
).join('\n\n')
const painsByTrack = synth.map(s =>
  `TRACK ${s.track} — top pains: ${s.topPains.map(tp => tp.title).join(' | ')}`
).join('\n')
const portfolio = await agent(
  `${CTX}\n\nHere are ${concepts.length} candidate products across the 4 tracks:\n\n${cDump}\n\n` +
  `The synthesized top pains per track (use these to judge coverage):\n${painsByTrack}\n\n` +
  `Act as a portfolio selector for THIS builder. Do NOT collapse to one winner — return a DIVERSE shortlist of 6-8 products ` +
  `he can choose from, each with a distinct 'tag' (Safest Bet, Boldest, Best Domain Fit, Most Buildable, Broadest Coverage, ` +
  `Best Pilot Story, Freshest/Least-Crowded, Most Scalable, Best Non-Health option).\n\n` +
  `TWO CO-PRIMARY LENSES THIS TIME:\n` +
  `1) GLOBAL SCALABILITY — the event rewards "a localized issue solved with a globally scalable framework." Tamil is only the ` +
  `LAUNCH LOCALE, never the product's identity. Favor concepts whose CORE is language/geography-agnostic (a records/triage/` +
  `verification/routing engine that ships Tamil-first but works in any language/state/country) with a large TAM. PENALIZE value ` +
  `that is intrinsically local (one govt portal, one dialect) or framed as "for poor rural illiterate users." Frame everything ` +
  `as a universal tool with a Tamil-first rollout.\n` +
  `2) PAIN COVERAGE — the builder wants ONE product that knocks out the MOST pain points on its track, not a one-trick feature. ` +
  `For each concept, assess how many of that track's top pains it consolidates into a single platform (fill 'painCoverage' 1-5 ` +
  `and list 'painsCovered'). A product that resolves 3-4 of a track's top pains at once beats one that nails a single pain, ` +
  `AS LONG AS it stays 36hr-demoable (one hero flow shown, breadth shown as the platform vision — flag any that would overreach ` +
  `scope in 36hr).\n\n` +
  `Score each /100 weighing scalability and pain-coverage HIGHEST (co-primary), then in-scope fit, 36hr demo wow, pilot/` +
  `incubation credibility, defensibility, and crowdedness. Also fill 'scalability', 'painCoverage', 'painsCovered', and ` +
  `'universalCore'. Ensure the top pick is the best SCALABLE + BROAD-COVERAGE idea. Spread the shortlist across >=3 tracks. ` +
  `List rejected concepts with a one-line reason. In diversityNote, comment on the scalability + coverage spread.`,
  { schema: PORTFOLIO_SCHEMA, phase: 'Portfolio Judge', label: 'judge:portfolio', effort: 'high' }
)
log(`Shortlist: ${portfolio.shortlist.map(s => s.name).join(', ')}`)

// ===== Phase 5: one-pager specs for top 5 =====
phase('One-Pagers')
const top5 = portfolio.shortlist.slice(0, 5)
const onePagers = (await parallel(top5.map(s => () => {
  const c = concepts.find(x => x.name === s.name) || {}
  return agent(
    `${CTX}\n\nWrite a COMPACT one-page build spec (markdown, ~280-380 words) for this shortlisted product.\n` +
    `Name: ${s.name} | Track: ${s.track} | Tag: ${s.tag} | Scalability: ${s.scalability}/5 | PainCoverage: ${s.painCoverage}/5\n` +
    `One-liner: ${s.oneLiner}\nUniversal core: ${s.universalCore}\nPains it covers: ${(s.painsCovered||[]).join('; ')}\n` +
    `Concept detail: ${JSON.stringify(c)}\n\n` +
    `FRAME IT AS A GLOBALLY SCALABLE PRODUCT with a Tamil-first launch — NOT "an app for rural illiterate Tamils." ` +
    `Sections (tight, no fluff): **Pitch** (1 line) · **Universal core vs Tamil launch locale** (what generalizes, what's ` +
    `just locale) · **Pains it covers** (bullet the track pains this ONE product resolves — this is the breadth story) · ` +
    `**Evidence** (1 hard point) · **Who uses it + core loop** · **AI stack** (specific; language-agnostic where possible) · ` +
    `**36hr MVP slice** (one hero flow, cut ruthlessly; note what breadth is shown as vision vs built) · **90-sec demo wow** · ` +
    `**Global scale path + rough TAM** (who buys it beyond TN — other states, languages, countries) · **Pilot/incubation path** · ` +
    `**Why it wins / risks**. Keep it to one screen.`,
    { phase: 'One-Pagers', label: `spec:${s.name}`, effort: 'high' }
  ).then(md => ({ name: s.name, track: s.track, tag: s.tag, scalability: s.scalability, md }))
}))).filter(Boolean)

return {
  shortlist: portfolio.shortlist,
  rejected: portfolio.rejected,
  diversityNote: portfolio.diversityNote,
  onePagers,
  allConcepts: concepts.map(c => ({ name: c.name, track: c.track, angle: c.angle, oneLiner: c.oneLiner,
    buildability: c.buildability, wowFactor: c.wowFactor, domainFit: c.domainFit, crowdedness: c.crowdedness })),
}
