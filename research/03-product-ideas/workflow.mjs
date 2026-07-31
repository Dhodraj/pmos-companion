export const meta = {
  name: 'pir-health-india',
  description: 'Product Idea Researcher — ranked AI health product ideas for India (consumer-pain-breadth, scalable), YC-framework scored',
  phases: [
    { title: 'Research', detail: '6 dimensions: consumer pain, worker pain, competitors, regulation, GTM, pricing — live web' },
    { title: 'Ideate', detail: '15 candidate ideas grounded in research + YC RFS anchors' },
    { title: 'Score', detail: 'YC 10-question + tarpit + region filters, scored in parallel batches' },
    { title: 'Report', detail: 'rank top 7, write the skill report file' },
  ],
}

const CTX = `
PRODUCT IDEA RESEARCH — for the "Tech for Good 2026" hackathon (GRD College, Coimbatore) but the PRODUCT is meant to be a
real, scalable startup, NOT a hackathon toy. Judged for pilot + incubation (TiE Kovai / Startup Culture).
TRACK: "AI for Good Health & Well-being" — building AI systems to streamline clinical operations, track medicine stock,
and assist healthcare workers in resource-constrained settings.
REFERENCE EXAMPLES (structural anchors, NOT literal specs), from YC's Requests for Startups:
  (a) a clinical-ops copilot that automates hospital admin + medicine-stock tracking  [YC RFS: AI-Native Service Companies]
  (b) a diagnostic assistant that analyzes patient history to support frontline health workers  [YC RFS: AI Personalized Medicine]
REGION: INDIA (pan-India, India-centric first; scalable to other regions later — no cap, but India is the anchor market).
HARD CONSTRAINTS:
  - Do NOT frame anything as Tamil-specific or "for poor rural Tamil villagers". India-wide. Multilingual is fine but not the pitch.
  - PRIORITIZE BREADTH OF CONSUMER PAIN: favor products that resolve the MOST end-consumer/patient pain points, serving the
    largest number of Indian consumers — not a single narrow workflow. (The builder is a full-stack health-tech engineer at a
    telemedicine company, so consumer-facing health products are squarely in domain.)
  - Must be buildable by a small team with common tools (React/PWA, Gemini/LLMs, standard cloud) and India's public rails
    (ABDM/ABHA, UPI, Bhashini, ONDC-health if relevant).
BUILDER FIT: full-stack dev, React/PWA/Gemini, telemedicine domain — strong on consumer health apps + AI.
To research, load web tools: call ToolSearch("select:WebSearch") then WebSearch. Use real 2024-2026 India evidence
(news, ABDM/NHA data, Reddit r/india r/india_medicine, complaint threads, industry reports). Keep source URLs.
`

const RESEARCH_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['dimension', 'findings'],
  properties: {
    dimension: { type: 'string' },
    findings: { type: 'array', minItems: 4, maxItems: 8, items: {
      type: 'object', additionalProperties: false, required: ['point', 'detail', 'evidence', 'sourceUrl'],
      properties: {
        point: { type: 'string' }, detail: { type: 'string' },
        evidence: { type: 'string', description: 'the concrete data point / quote found' },
        sourceUrl: { type: 'string' },
      } } },
  },
}

const IDEAS_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['ideas'],
  properties: {
    ideas: { type: 'array', minItems: 12, maxItems: 18, items: {
      type: 'object', additionalProperties: false,
      required: ['name', 'pitch', 'consumerPains', 'targetAudience', 'solution', 'exampleAnchor', 'whyNow'],
      properties: {
        name: { type: 'string' }, pitch: { type: 'string' },
        consumerPains: { type: 'array', items: { type: 'string' }, description: 'the end-consumer pains it resolves (more = better)' },
        targetAudience: { type: 'string' }, solution: { type: 'string' },
        exampleAnchor: { type: 'string', description: 'which YC RFS anchor / pattern it draws on' },
        whyNow: { type: 'string', description: 'what changed recently (tech/reg/behavior) making it newly possible' },
      } } },
  },
}

const SCORE_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['scored'],
  properties: {
    scored: { type: 'array', items: {
      type: 'object', additionalProperties: false,
      required: ['name','problemAcuteness','marketSize','regionalViability','scalability','teamFit','consumerPainBreadth','tarpitRisk','kept','verdict','sources'],
      properties: {
        name: { type: 'string' },
        problemAcuteness: { type: 'string', enum: ['strong','moderate','weak'] },
        marketSize: { type: 'string', enum: ['strong','moderate','weak'] },
        regionalViability: { type: 'string', enum: ['strong','moderate','weak'], description: 'India regulatory + GTM + pricing power combined' },
        scalability: { type: 'string', enum: ['strong','moderate','weak'], description: 'pure-software scale vs services/headcount cap' },
        teamFit: { type: 'string', enum: ['strong','moderate','weak'] },
        consumerPainBreadth: { type: 'integer', minimum: 1, maximum: 5, description: 'how many consumer pains one product resolves' },
        tarpitRisk: { type: 'string', description: 'has this been tried & failed? name the structural barrier + whether there is a way past, or "no barrier found"' },
        kept: { type: 'boolean', description: 'false = drop (tarpit with no way past, or fails hard)' },
        verdict: { type: 'string', description: 'short overall qualitative verdict + the key differentiating insight vs Indian + global competitors' },
        sources: { type: 'array', items: { type: 'string' } },
      } } },
  },
}

// ===== Phase 1: Research (6 dimensions) =====
phase('Research')
const DIMENSIONS = [
  { key: 'consumer/patient pain points', ask: 'What do Indian patients/consumers actually struggle with across the care journey — finding the right doctor, teleconsults, prescriptions, diagnostics/lab reports, medicine access & prices, chronic-disease follow-up, insurance/claims, elder care, records fragmentation. Search Reddit (r/india, r/bangalore, r/india_medicine), complaint sites, news. Find the biggest, most widespread consumer pains.' },
  { key: 'healthcare-worker & clinic pain points', ask: 'Pains of Indian doctors, small clinics, nursing homes, pharmacies, diagnostic labs, frontline/ASHA workers — admin overload, medicine-stock, patient history, billing, no-shows, coordination. Ground in real evidence.' },
  { key: 'competitors & global proxies', ask: 'Map Indian health-tech players (Practo, Apollo 24|7, PharmEasy, Tata 1mg, Eka Care, MediBuddy, HealthifyMe, Redcliffe/Orange labs, Nova, Bajaj Health, ABDM ecosystem apps) and what they still do badly, PLUS global proxies (Zocdoc, Ro, Oscar, Cost Plus Drugs, Abridge, Nabla) whose models could transplant to India. Identify white space.' },
  { key: 'regulation & public rails', ask: 'India health regulation & rails that gate or enable products: ABDM/ABHA health-ID & health records, DPDP Act 2023 (health data), Telemedicine Practice Guidelines 2020, e-pharmacy/online drug sale rules, NMC, diagnostic accreditation, insurance IRDAI, PMJAY. What is newly possible because of ABDM/UPI/Bhashini/ONDC-health?' },
  { key: 'GTM & distribution norms', ask: 'How Indian health products actually reach users: D2C app downloads & CAC, pharmacy/clinic partnerships, insurer/corporate (B2B2C), hospital sales cycles, WhatsApp as channel, ASHA/govt rails. What GTM a small team can realistically run.' },
  { key: 'pricing power & willingness-to-pay', ask: 'What Indian consumers/clinics actually pay today: teleconsult fees, subscription health plans (1mg/Apollo/HealthifyMe pricing), diagnostic package prices, pharmacy margins, clinic SaaS pricing, out-of-pocket share of health spend. Realistic price points + margin.' },
]
const researchRaw = await parallel(DIMENSIONS.map(d => () => agent(
  `${CTX}\n\nRESEARCH DIMENSION: ${d.key}.\n${d.ask}\nRun ~4-6 web searches. Return 4-8 concrete findings, each with a real ` +
  `data point in 'evidence' and a 'sourceUrl'. Set dimension to "${d.key}".`,
  { schema: RESEARCH_SCHEMA, phase: 'Research', label: `res:${d.key.split(' ')[0]}` }
)))
const research = researchRaw.filter(Boolean)
log(`Research done: ${research.length}/6 dimensions`)

// ===== Phase 2: Ideate =====
phase('Ideate')
const resDump = research.map(r => `## ${r.dimension}\n` + r.findings.map(f => `- ${f.point}: ${f.detail} [${f.evidence}] (${f.sourceUrl})`).join('\n')).join('\n\n')
const ideaSet = await agent(
  `${CTX}\n\nRESEARCH FINDINGS:\n${resDump}\n\n` +
  `Brainstorm 12-18 candidate product ideas. Use the YC RFS anchors as structural patterns (AI-native service company; ` +
  `AI personalized-medicine assistant), but drive EVERY idea from a real, specific consumer pain found above — not "apply AI to ` +
  `health" (avoid solution-in-search-of-a-problem). Strongly favor ideas that consolidate the MOST consumer pain points into one ` +
  `India-scalable product, serving the largest number of Indian consumers. Fill consumerPains with the specific pains each resolves.`,
  { schema: IDEAS_SCHEMA, phase: 'Ideate', label: 'ideate:candidates', effort: 'high' }
)
log(`Generated ${ideaSet.ideas.length} candidate ideas`)

// ===== Phase 3: Score (YC framework, in parallel batches) =====
phase('Score')
const ideas = ideaSet.ideas
const batches = [[], [], []]
ideas.forEach((it, i) => batches[i % 3].push(it))
const scoreResultsRaw = await parallel(batches.map((b, bi) => () => agent(
  `${CTX}\n\nScore these candidate ideas against the YC-style framework. For EACH: judge problemAcuteness, marketSize, ` +
  `regionalViability (India regulatory+GTM+pricing), scalability (flag services-disguised-as-software), teamFit, and ` +
  `consumerPainBreadth (1-5, how many consumer pains one product resolves — weight this heavily per the user's ask). ` +
  `Run the tarpit check: if an idea has been tried repeatedly and failed, name the structural barrier and whether THIS version ` +
  `gets past it; if no way past, set kept=false. Treat competitors, boring-space, and hard-to-start as POSITIVE signals. ` +
  `In 'verdict' name the specific differentiating insight vs Indian + global competitors. Do 1-2 web checks per idea if needed.\n\n` +
  `IDEAS:\n${b.map(x => `### ${x.name}\n${x.pitch}\nPains: ${x.consumerPains.join('; ')}\nSolution: ${x.solution}\nWhyNow: ${x.whyNow}`).join('\n\n')}`,
  { schema: SCORE_SCHEMA, phase: 'Score', label: `score:batch${bi+1}`, effort: 'high' }
)))
const scoreResults = scoreResultsRaw.filter(Boolean)
const scored = scoreResults.flatMap(s => s.scored)
const kept = scored.filter(s => s.kept)
log(`Scored ${scored.length}; kept ${kept.length} after tarpit filter`)

// ===== Phase 4: Report =====
phase('Report')
const rank = { strong: 3, moderate: 2, weak: 1 }
const ranked = [...kept].sort((a, b) =>
  (rank[b.problemAcuteness] + rank[b.marketSize] + rank[b.regionalViability] + b.consumerPainBreadth) -
  (rank[a.problemAcuteness] + rank[a.marketSize] + rank[a.regionalViability] + a.consumerPainBreadth)
)
const topNames = ranked.slice(0, 8).map(r => r.name)
const ideaByName = Object.fromEntries(ideas.map(i => [i.name, i]))
const scoreByName = Object.fromEntries(scored.map(s => [s.name, s]))
const packet = topNames.map(n => ({ idea: ideaByName[n], score: scoreByName[n] }))
const report = await agent(
  `${CTX}\n\nWrite the final ranked product-ideas report in markdown, following this section structure PER IDEA: ` +
  `One-line pitch · Pain points & evidence (cite source URLs) · Target audience (India) · Proposed solution · Differentiation ` +
  `(name Indian + global competitors) · Market size & competition · Regulatory notes (ABDM/DPDP/telemedicine/e-pharmacy) · ` +
  `GTM & distribution (India) · Pricing & margin potential · Technical feasibility (small team) · Tarpit-risk flag · ` +
  `YC framework verdict (call out the 3-4 questions that matter most) · Sources.\n` +
  `Start with a summary table (Idea | Problem acuteness | Market size | Regional viability | Consumer-pain breadth | Overall). ` +
  `Rank highest-potential first. Emphasize consumer-pain BREADTH and India-scalability in the ranking rationale. No placeholder text.\n\n` +
  `TOP IDEAS (ranked, with their scores):\n${JSON.stringify(packet)}`,
  { phase: 'Report', label: 'report:write', effort: 'high' }
)

return { topNames, ranked: ranked.slice(0, 8), droppedTarpits: scored.filter(s => !s.kept).map(s => ({ name: s.name, why: s.tarpitRisk })), report }
