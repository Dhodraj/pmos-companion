export const meta = {
  name: 't4g-track-research',
  description: 'Multi-persona research across all 4 Tech-for-Good tracks to find the highest-pain, production-grade AI hackathon project',
  phases: [
    { title: 'Persona Research', detail: '16 personas (4 per track) research real pain points via live web' },
    { title: 'Track Synthesis', detail: 'cluster each track\'s pains, score the opportunity' },
    { title: 'Cross-Track Judge', detail: 'rank tracks for THIS user, pick the #1 pain' },
    { title: 'Idea Panel', detail: '4 designers spec production-grade solutions, judged' },
    { title: 'Final Spec', detail: 'winner → production spec + 36hr MVP + demo + registration text' },
  ],
}

// ---- Context every agent gets ----
const CTX = `
CONTEXT — Tech for Good 2026 hackathon, GRD College, Coimbatore, Tamil Nadu, India. Aug 8-9 2026, 36-48hr in-person.
Theme: "Build with AI — Code for Communities". Each track is a REAL problem; winning solutions get PILOTED in real
constituencies / PHCs / districts with a Member of Parliament's office. So realism + pilot-readiness matter, not toys.
The builder is a full-stack developer working at a telemedicine company (a telemedicine company) — strong HEALTH-TECH domain, ships
AI web apps fast (React, Gemini). Rural Tamil Nadu context: Tamil-speaking users, patchy internet, low-end Android phones,
government workers who are overloaded and paper-bound. Judge every pain by REAL severity, not novelty.
To research, load web tools first: call ToolSearch with query "select:WebSearch" then use WebSearch. Search for real,
recent (2024-2026) evidence — govt reports, news, NGO studies on rural India / Tamil Nadu. Cite source hints briefly.
`

const PAIN_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['persona', 'track', 'pains'],
  properties: {
    persona: { type: 'string' },
    track: { type: 'string' },
    pains: {
      type: 'array', minItems: 3, maxItems: 6,
      items: {
        type: 'object', additionalProperties: false,
        required: ['title','description','whoAffected','severity','frequency','currentGap','aiLeverage','buildability','evidence'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          whoAffected: { type: 'string' },
          severity: { type: 'integer', minimum: 1, maximum: 5 },
          frequency: { type: 'integer', minimum: 1, maximum: 5 },
          currentGap: { type: 'string', description: 'why it is unsolved today' },
          aiLeverage: { type: 'integer', minimum: 1, maximum: 5, description: 'how much AI genuinely helps vs plain software' },
          buildability: { type: 'integer', minimum: 1, maximum: 5, description: 'demoable in 36hr AND has a real production path' },
          evidence: { type: 'string', description: 'concrete data point + source hint' },
        },
      },
    },
  },
}

const TRACK_SYNTH_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['track','trackScore','oneLineOpportunity','topPains'],
  properties: {
    track: { type: 'string' },
    trackScore: { type: 'integer', minimum: 1, maximum: 100, description: 'overall attractiveness for a pilot-ready hackathon win' },
    oneLineOpportunity: { type: 'string' },
    topPains: {
      type: 'array', minItems: 2, maxItems: 3,
      items: {
        type: 'object', additionalProperties: false,
        required: ['title','whyHighest','compositeScore','aiSolutionDirection'],
        properties: {
          title: { type: 'string' },
          whyHighest: { type: 'string' },
          compositeScore: { type: 'integer', minimum: 1, maximum: 100 },
          aiSolutionDirection: { type: 'string' },
        },
      },
    },
  },
}

const CROSS_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['ranking','recommendedTrack','recommendedDropdownLabel','recommendedPain','recommendedPainWhy'],
  properties: {
    ranking: {
      type: 'array', minItems: 4, maxItems: 4,
      items: {
        type: 'object', additionalProperties: false,
        required: ['track','painTitle','fitForUser','score','rationale'],
        properties: {
          track: { type: 'string' },
          painTitle: { type: 'string' },
          fitForUser: { type: 'string' },
          score: { type: 'integer', minimum: 1, maximum: 100 },
          rationale: { type: 'string' },
        },
      },
    },
    recommendedTrack: { type: 'string' },
    recommendedDropdownLabel: { type: 'string', description: 'exact registration dropdown label' },
    recommendedPain: { type: 'string' },
    recommendedPainWhy: { type: 'string' },
  },
}

const IDEA_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['name','oneLiner','angle','coreFeatures','aiComponents','productionArchitecture','mvp36hr','differentiator','pilotPath','risks'],
  properties: {
    name: { type: 'string' },
    oneLiner: { type: 'string' },
    angle: { type: 'string', description: 'the distinct strategic angle this design takes' },
    coreFeatures: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 5 },
    aiComponents: { type: 'array', items: { type: 'string' } },
    productionArchitecture: { type: 'string' },
    mvp36hr: { type: 'string', description: 'the ONE slice to build and demo in 36hr' },
    differentiator: { type: 'string' },
    pilotPath: { type: 'string' },
    risks: { type: 'array', items: { type: 'string' } },
  },
}

const JUDGE_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['scores','winner','whyWinner','graftFromRunnersUp'],
  properties: {
    scores: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['name','total','notes'],
        properties: {
          name: { type: 'string' },
          total: { type: 'integer', minimum: 1, maximum: 100 },
          notes: { type: 'string' },
        },
      },
    },
    winner: { type: 'string' },
    whyWinner: { type: 'string' },
    graftFromRunnersUp: { type: 'string', description: 'best ideas from losers to fold into the winner' },
  },
}

// ---- Personas: 4 tracks x 4 personas ----
const TRACKS = [
  {
    key: 'AI for Good Health & Well-being (SDG 3)',
    personas: [
      'a rural PHC staff nurse / ANM who single-handedly runs a Primary Health Centre in interior Tamil Nadu',
      'an elderly rural patient with chronic disease (BP/diabetes/TB) who struggles to reach and follow up with care',
      'a District Health Officer accountable for PHC performance, drug stock, and maternal/child health metrics',
      'an ASHA community health worker doing door-to-door outreach with a paper register and a cheap phone',
    ],
  },
  {
    key: 'AI for Zero Hunger & Economic Growth (SDG 2 & 8)',
    personas: [
      'a smallholder farmer (2 acres) in western Tamil Nadu deciding crop, inputs, and when/where to sell',
      'an agricultural extension officer expected to advise hundreds of farmers with no time or tools',
      'a Farmer Producer Organisation (FPO) manager / farmgate trader dealing with price and logistics',
      'a rural woman running a self-help-group micro-enterprise who needs credit, market access, and skills',
    ],
  },
  {
    key: 'AI for Sustainable Cities & Climate Action (SDG 11 & 13)',
    personas: [
      'a municipal sanitation / solid-waste engineer in a Tier-2 Tamil Nadu city (e.g. Coimbatore)',
      'an urban resident dealing with flooding, air/water pollution, traffic and unreliable civic services',
      'a Pollution Control Board / environmental officer with too few sensors and too much area to monitor',
      'an informal-settlement resident exposed to heat, water scarcity and poor drainage',
    ],
  },
  {
    key: 'AI for Strong Institutions (SDG 16)',
    personas: [
      'a Member of Parliament / MLA office staffer deciding how to allocate constituency development funds',
      'a citizen trying to access a government scheme/certificate and lost in the process',
      'an RTI activist / local journalist tracking corruption, fund misuse, and grievance redressal',
      'a District Collector / administrative officer drowning in grievances, files, and inter-department coordination',
    ],
  },
]

// ===== Phase 1: 16 persona research agents (parallel) =====
phase('Persona Research')
const personaTasks = []
for (const t of TRACKS) {
  for (const p of t.personas) {
    personaTasks.push(() => agent(
      `${CTX}\n\nYou ARE this person, thinking in first person: ${p}.\nTrack: "${t.key}".\n` +
      `List the 3-6 pain points that most wreck your day/life within this track. For each, be brutally specific and grounded ` +
      `in the rural/Tamil Nadu reality. Research the web for real 2024-2026 evidence (govt data, news, studies) to back each pain ` +
      `and to fill 'evidence'. Score severity (how bad when it hits), frequency (how often), aiLeverage (does AI genuinely solve ` +
      `it better than plain software), buildability (a real demo in 36hr AND a credible production path). Set track to "${t.key}".`,
      { schema: PAIN_SCHEMA, phase: 'Persona Research', label: `pain:${t.key.split(' ')[2] || t.key.slice(7,15)}` }
    ))
  }
}
const rawPains = (await parallel(personaTasks)).filter(Boolean)
log(`Collected pain reports from ${rawPains.length}/16 personas`)

// group pains by track
function painsForTrack(trackKey) {
  return rawPains.filter(r => r.track === trackKey || (r.pains && rawPains.indexOf(r) >= 0 && r.persona))
}

// ===== Phase 2: per-track synthesis (parallel, one per track) =====
phase('Track Synthesis')
const synth = await parallel(TRACKS.map((t, i) => () => {
  const bundle = rawPains.slice(i * 4, i * 4 + 4)
  const dump = bundle.map(b => `Persona: ${b.persona}\n` + b.pains.map(pn =>
    `- ${pn.title} [sev ${pn.severity}/freq ${pn.frequency}/ai ${pn.aiLeverage}/build ${pn.buildability}] ${pn.description} | gap: ${pn.currentGap} | evidence: ${pn.evidence}`
  ).join('\n')).join('\n\n')
  return agent(
    `${CTX}\n\nTrack: "${t.key}". Below are pain reports from 4 personas in this track. Cluster overlapping pains, ` +
    `discard weak/generic ones, and identify the 2-3 HIGHEST-pain opportunities where an AI solution would be genuinely ` +
    `transformative AND pilot-ready. Score the track overall (trackScore) for a hackathon win that gets piloted. ` +
    `compositeScore each top pain by severity*frequency*aiLeverage weighted down by low buildability.\n\nREPORTS:\n${dump}`,
    { schema: TRACK_SYNTH_SCHEMA, phase: 'Track Synthesis', label: `synth:${t.key.slice(7,20)}` }
  )
})).then(a => a.filter(Boolean))

// ===== Phase 3: cross-track judge =====
phase('Cross-Track Judge')
const synthDump = synth.map(s =>
  `TRACK: ${s.track} (score ${s.trackScore}/100)\nOpportunity: ${s.oneLineOpportunity}\n` +
  s.topPains.map(tp => `  * ${tp.title} (${tp.compositeScore}) — ${tp.whyHighest} → ${tp.aiSolutionDirection}`).join('\n')
).join('\n\n')
const pick = await agent(
  `${CTX}\n\nHere are the synthesized top pains for all 4 tracks:\n\n${synthDump}\n\n` +
  `Rank all 4 tracks FOR THIS SPECIFIC BUILDER. Weigh: (a) real-world pain severity, (b) his health-tech domain edge, ` +
  `(c) demoable in 36hr with a strong wow-moment, (d) production/pilot credibility with an MP's office, (e) how crowded/cliché ` +
  `the space is (penalize me-too farmer-chatbots and generic dashboards). Pick ONE track + ONE headline pain to build on. ` +
  `recommendedDropdownLabel must be the exact registration option: "AI for Good Health & Well-being", ` +
  `"AI for Zero Hunger & Economic Growth", "AI for Sustainable Cities & Climate Action", or "AI for Strong Institutions".`,
  { schema: CROSS_SCHEMA, phase: 'Cross-Track Judge', label: 'judge:tracks' }
)
log(`Chosen: ${pick.recommendedTrack} → ${pick.recommendedPain}`)

// ===== Phase 4: idea panel (4 angles) + judge =====
phase('Idea Panel')
const ANGLES = [
  'MVP-first: the smallest thing that produces a jaw-drop demo in 36hr, then scales',
  'Depth-first: go narrow on ONE workflow and make it flawless and truly production-grade',
  'Data-moat: exploit a unique data source / integration others cannot easily copy',
  'Human-in-the-loop: AI assists the overloaded worker rather than replacing them, maximizing trust and adoption',
]
const ideas = (await parallel(ANGLES.map(a => () => agent(
  `${CTX}\n\nWINNING TRACK: ${pick.recommendedTrack} (dropdown: "${pick.recommendedDropdownLabel}").\n` +
  `HEADLINE PAIN to solve: ${pick.recommendedPain} — ${pick.recommendedPainWhy}\n\n` +
  `Design a PRODUCTION-GRADE AI product for this pain, using this angle: ${a}\n` +
  `Be concrete: name it, real AI components (which models/APIs, e.g. Gemini, speech, vision, RAG), production architecture ` +
  `(offline-first, Tamil, low-end Android as needed), the ONE 36hr MVP slice, a sharp differentiator, and a realistic pilot path ` +
  `with a govt/MP partner. Research the web to confirm feasibility and avoid reinventing existing tools.`,
  { schema: IDEA_SCHEMA, phase: 'Idea Panel', label: `idea:${a.split(':')[0]}` }
))).then(x => x.filter(Boolean)))

const ideaDump = ideas.map(i =>
  `NAME: ${i.name} (${i.angle})\n${i.oneLiner}\nFeatures: ${i.coreFeatures.join('; ')}\nAI: ${i.aiComponents.join('; ')}\n` +
  `MVP36hr: ${i.mvp36hr}\nDiff: ${i.differentiator}\nPilot: ${i.pilotPath}\nRisks: ${i.risks.join('; ')}`
).join('\n\n---\n\n')
const verdict = await agent(
  `${CTX}\n\nFour designs for pain "${pick.recommendedPain}":\n\n${ideaDump}\n\n` +
  `Score each /100 on: demo wow-factor, production credibility, pilot-readiness, defensibility, 36hr feasibility, domain fit. ` +
  `Pick the winner and note the best pieces from the losers to graft into it.`,
  { schema: JUDGE_SCHEMA, phase: 'Idea Panel', label: 'judge:ideas' }
)

// ===== Phase 5: final spec =====
phase('Final Spec')
const winnerIdea = ideas.find(i => i.name === verdict.winner) || ideas[0]
const finalSpec = await agent(
  `${CTX}\n\nProduce the FINAL, build-ready plan. Winning track: "${pick.recommendedDropdownLabel}". ` +
  `Winning pain: ${pick.recommendedPain}. Winning concept: ${winnerIdea.name} — ${winnerIdea.oneLiner}. ` +
  `Graft these improvements: ${verdict.graftFromRunnersUp}\n\n` +
  `Write markdown with these sections:\n` +
  `1. Product name + one-line pitch\n2. The pain, with 2-3 hard evidence points\n3. Who uses it + the exact user journey\n` +
  `4. Core features (production vision)\n5. AI components (specific models/APIs and why)\n6. Architecture (offline/Tamil/low-end Android)\n` +
  `7. The 36-48hr MVP slice — exactly what to build, cut ruthlessly\n8. Hour-by-hour build plan for a 2-4 person team (roles)\n` +
  `9. 90-second demo script (the wow moment)\n10. Pilot path with the MP/govt partner\n11. Why this wins vs other teams\n` +
  `12. Registration form answers: role, preferred track (exact dropdown label), team-status guidance, and a punchy ` +
  `"Anything else you'd like us to know?" paragraph.\nBe specific and concrete throughout — no fluff.`,
  { phase: 'Final Spec', label: 'final:spec', effort: 'high' }
)

return {
  chosenTrack: pick.recommendedDropdownLabel,
  chosenPain: pick.recommendedPain,
  trackRanking: pick.ranking,
  winnerConcept: verdict.winner,
  finalSpec,
}
