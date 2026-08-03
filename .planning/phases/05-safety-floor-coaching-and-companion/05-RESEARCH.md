# Phase 5: Safety floor, coaching and companion - Research

**Researched:** 2026-08-03
**Domain:** Mental-health screening/crisis routing, evidence-graded content display, retrieval-augmented "companion" chatbot with a hard refusal boundary, and a state-independent support-contact pattern — built on Capacitor + React + Cloudflare Workers/D1 + Gemini
**Confidence:** MEDIUM (see per-section breakdown in Metadata; two items need a decision before planning can lock scope — see Open Questions #1 and #2)

No `CONTEXT.md` exists yet for this phase (confirmed: `.planning/phases/05-safety-floor-coaching-and-companion/` is empty apart from this file). No project `./CLAUDE.md` or `.claude/skills/` / `.agents/skills/` directory exists in this repo, so there are no project-specific coding-convention overlays to apply beyond what `.planning/` already locks.

## Summary

This phase has one hard, non-negotiable line running through all 15 requirements: **nothing on a crisis path is model-generated.** Everything else — screening cadence, evidence grading, the RAG companion, the support-circle contact pattern — exists in service of that line or the parallel line that the companion is language-only and never computes a pattern, scores a risk, or suggests a dose `[VERIFIED: .planning/intel/constraints.md:280-283]`: "Gemini handles language, not inference about her body. The engine finds the association numerically; Gemini turns it into plain language while preserving the uncertainty, and writes the doctor-facing summary from structured data. It never computes a pattern, scores a risk, or suggests a dose. Grounded via RAG over a curated evidence base so advice is cited, not hallucinated."

Most of what this phase needs is **already decided and clinician-reviewed inside this repo**, not open for re-litigation. The clinician who reviewed the proposal specified the crisis pathway explicitly and was "explicit that this is the appropriate scope for now and that we should not build more than this" `[VERIFIED: .planning/intel/constraints.md:119-122]`. The planner's job is to build exactly that pathway faithfully, not to redesign it. Two things in the research brief that read as open questions are, on inspection of this repo's own authoritative documents, **already answered**: (a) escalation on a single positive response vs. persistence — the clinician's answer is immediate escalation on *any* single suicidality/self-harm response, no persistence requirement; (b) what the crisis text should say — it is pre-written and clinician-reviewed already, per the hackathon build-plan's own copy-QA step.

But this research surfaced **two things that are genuinely open and will change the size of the plan**, and a handful of pitfalls specific to this stack:

1. **PHQ-4 cannot elicit the suicidality response that SAFE-05 requires escalating on.** PHQ-4 (PHQ-2 + GAD-2) is explicitly an "ultra-brief" instrument that excludes the suicidal-ideation item (item 9 of the full PHQ-9) by construction. SAFE-01 mandates PHQ-4/GAD-2; SAFE-05 mandates immediate escalation on "any suicidality... response." As specified, there is no mechanism in the named instrument that can produce that response. A supplementary safety-net question must be added. See Open Question #1.
2. **The "support circle" contact-nomination mechanism (CIRC-01/CIRC-02) that this research brief asked about is explicitly marked "Tracked, not in the current roadmap" in `.planning/REQUIREMENTS.md`'s own Deferred Requirements section, and does not appear anywhere in Phase 5's actual 15-requirement list or the project's Traceability table.** SAFE-05 only requires the app to *prompt* her to contact a trusted person — fixed copy, no contact-selection UI, no notification-sending capability. Building the full support circle in this phase would be scope not currently authorized by this project's own requirements ledger. See Open Question #2.

**Primary recommendation:** build the crisis path as a fully bundled, offline-renderable, zero-network-dependency screen (never behind a Worker call, ever); add a single supplementary suicidality/self-harm question (PHQ-9 item 9, verbatim, free to use) to the PHQ-4/GAD-2 flow specifically to satisfy SAFE-05's escalation trigger; enforce the companion's refusal boundary structurally in the Worker (a pre-model intent router that never lets diagnosis/risk/dose questions reach Gemini at all) rather than relying on a system prompt alone; and get an explicit decision on Open Questions #1 and #2 before the plan is written, because both change what "done" means for SAFE-05.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SAFE-01 | PHQ-4 and GAD-2 run monthly or user-initiated. `[VERIFIED: .planning/REQUIREMENTS.md:140]` | Cadence confirmed clinician-reviewed (CON-CLIN-05). PHQ-4/GAD-2 composition, validated cutoffs (≥3 each), and licensing (Pfizer, free, commercial use permitted) researched below. **Gap found: see Open Question #1** — this instrument alone cannot produce the response SAFE-05 escalates on. |
| SAFE-02 | Crisis flow is pre-scripted and human-reviewed; generated text appears on no crisis path under any circumstance. `[VERIFIED: .planning/REQUIREMENTS.md:141-142]` | Architecture pattern below: crisis screen as a compile-time constant, structurally unreachable from any model/Worker call. Test recommendation in Validation Architecture makes this a build-time guarantee, not a runtime hope. |
| SAFE-03 | Crisis resources (Tele-MANAS 14416) never paywalled, login-gated or rate-limited. `[VERIFIED: .planning/REQUIREMENTS.md:143-144]` | Tele-MANAS number/hours/legitimacy verified below. Architecture recommendation: bundle as a static on-device asset so "never rate-limited" is true by construction (no network call to gate). Environment Availability and DevOps ownership (Rahul) noted. |
| SAFE-04 | Food-tracking depth gated behind an eating-disorder screen; positive screen suppresses depth and surfaces support. `[VERIFIED: .planning/REQUIREMENTS.md:145-146]` | Don't Hand-Roll section: the ED screen is a gating condition on an existing UI feature (COACH-03/04), not a new clinical instrument in Phase 5's scope — no ED screener instrument is named in this phase's requirement list, only the gating behaviour. |
| SAFE-05 | Immediate escalation on chest pain, fainting, drowsy driving, severe bleeding and suicidality; localised guidance; then prompt to contact a trusted person or clinician; 24h check-in nudge. `[VERIFIED: .planning/REQUIREMENTS.md:147-149]` | Architecture pattern below covers the full flow. **Directly affected by both Open Questions #1 and #2.** Escalation-trigger cadence question (single vs. persistent) resolved — see Summary. |
| COACH-01 | One or two evidence-graded, phase-aware micro-actions delivered daily from a curated set. `[VERIFIED: .planning/REQUIREMENTS.md:153-154]` | Don't Hand-Roll: this is a curated-content selection problem, not a recommendation-engine problem — no ML/ranking library needed. |
| COACH-02 | Visible evidence grade and review date on every health claim. `[VERIFIED: .planning/REQUIREMENTS.md:155-156]` | GRADE/USPSTF grading systems researched below; no consumer-app precedent found, so a simplified 3-tier translation is recommended, gated on REG-03 clinician sign-off for exact wording. |
| COACH-03 | Food language is additive and cuisine-native; no calorie counting or macro targets by default. `[VERIFIED: .planning/REQUIREMENTS.md:157-158]` | Don't Hand-Roll: do not back this feature with a calorie/macro nutrition API/database (USDA FoodData Central, Edamam, etc.) — those are calorie-shaped at the data-model level, one bug away from surfacing what the requirement forbids. |
| COACH-04 | Movement tracked as weekly minutes (150-300 + 2 strength sessions, 10-min entries count); calories burned never displayed. `[VERIFIED: .planning/REQUIREMENTS.md:159-160]` | Same Don't Hand-Roll principle: the movement data model must not compute calories at all, not merely hide the field. |
| COACH-05 | Weight entry behind an opt-in permission prompt; never default or headline. `[VERIFIED: .planning/REQUIREMENTS.md:161-162]` | UI/data-model gating pattern; consistent with existing `CONSENT` entity design already in `product/04-data-model.md` (per-data-class, never global). |
| COMP-01 | Questions answered from a curated guideline corpus via retrieval, with visible citations; Gemini reached only through the Worker, language only. `[VERIFIED: .planning/REQUIREMENTS.md:166-168]` | RAG architecture researched below: Cloudflare Vectorize + Gemini embeddings + Gemini generation, all called from the Worker via REST (not the Node SDK, which has documented edge-runtime issues). |
| COMP-02 | Companion never diagnoses, estimates condition likelihood, or recommends/adjusts a dose. `[VERIFIED: .planning/REQUIREMENTS.md:169-170]` | Structural (pre-model, code-level) guardrail pattern researched below — the OWASP-documented finding that prompt-only guardrails are bypassable is the central architecture driver here. |
| COMP-03 | Out-of-scope questions route to "discuss with your doctor" rather than being answered. `[VERIFIED: .planning/REQUIREMENTS.md:171-172]` | Same structural router; also fires when retrieval similarity is below threshold (no corpus match = out of scope by definition). |
| SKIN-01 | No beauty/attractiveness/symmetry score, no cross-user comparison, no before/after collage. `[VERIFIED: .planning/REQUIREMENTS.md:176-177]` | This is an absence-of-feature requirement — verified by a static/lint-style test (Validation Architecture), not a library choice. |
| REG-03 | A qualified clinician has reviewed all health content and a mental-health professional has reviewed all crisis content before release. `[VERIFIED: .planning/REQUIREMENTS.md:205-206]` | This is a process/governance gate, not code. Mapped to a Release Gate in the Architectural Responsibility Map and to a manual-only verification item in Validation Architecture. Satheeshkumar's assigned QA role against `clinician-review-brief.md` is the mechanism. |

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| PHQ-4/GAD-2 (+ safety-net item) responses, raw answers and scores | Browser/Client (IndexedDB via Dexie) | — | Health data; `[VERIFIED: .planning/intel/constraints.md:129-132]` (CON-CLIN-07): "Health data stays on the device." Mirrors the existing `CHECKIN`/`SYMPTOM_ENTRY` pattern in `product/04-data-model.md`. Must **not** land in D1 as raw responses. |
| Crisis screen: fixed text + Tele-MANAS number | Browser/Client (bundled static asset) | — | SAFE-03 requires zero rate-limit/paywall/login. The only architecture that makes "never rate-limited" true by construction is one with no network call in the path at all. |
| Screening/crisis **event metadata** (count only: screening completed, escalation fired, timestamp) | API/Backend (Worker → D1) | — | `[VERIFIED: product/00-PRD.md:704-707]` NFR-901 "Exclude health-data values from product analytics. Events and counts only"; NFR-903 "Log crisis-path invocations as counts only, reviewed weekly." This is the aggregate audit trail REG-03's weekly clinical review reads — not a store of her answers. |
| RAG retrieval logic + guardrail router | API/Backend (Cloudflare Worker) | CDN/Static (curated guideline corpus, likely bundled or in Vectorize) | Matches the existing architecture decision: "Grounded companion — Worker calls Gemini... The API key lives in a Worker secret binding and never ships to the client" `[CITED: hackathon/proposal.md:191]`. |
| Guideline corpus + vector index | Database/Storage (Cloudflare Vectorize) | — | Managed vector search paired with the existing Cloudflare edge stack; avoids adding a new external vendor. |
| Companion chat UI + citation display | Browser/Client | — | Belson's scope; renders `{answer, citations[]}` from the Worker response. |
| Micro-action content (evidence grade + review date) | CDN/Static or Database (curated dataset, likely bundled JSON or a D1 read-only table) | Browser/Client (render) | Curated, versioned content — not user-generated, not computed at runtime. |
| Movement/food/weight logs | Browser/Client (IndexedDB) | — | Extends existing `MEASUREMENT`/`CHECKIN` entities; no calorie/macro field by design (Don't Hand-Roll). |
| Dignity guardrails (SKIN-01) | Browser/Client (absence of a feature) | — | Nothing to build; a verification target (no such component exists). |
| Clinician + mental-health-professional sign-off | **Release Gate / Process** (not a runtime tier) | — | REG-03 is a governance checkpoint — a signed, dated artifact checked into the repo and verified before the phase can ship, not a service. |

## Standard Stack

### Core

| Library / Service | Version | Purpose | Why Standard |
|---|---|---|---|
| Cloudflare Vectorize | Managed (accessed via Wrangler binding, no npm version) | Vector index for the guideline corpus, RAG retrieval with metadata-filtered citations | Already inside the project's own Cloudflare Workers + D1 stack `[VERIFIED: hackathon/proposal.md:209]` ("Gemini API for the grounded companion, retrieval over a curated guideline corpus with citations"); avoids a new external vendor. `[CITED: developers.cloudflare.com/vectorize/get-started/intro/]` |
| Gemini API (generation + embeddings), called via direct `fetch()` from the Worker | Model family in flux — see State of the Art | Companion phrasing (language-only) and query embeddings for retrieval | `[VERIFIED: .planning/intel/constraints.md:280-283]` (CON-BUILD-03) locks Gemini to language-only, RAG-grounded. `[CITED: github.com/google-gemini/generative-ai-js/issues/37]` — edge runtimes (Workers) only implement a Node API subset; the official `@google/generative-ai` SDK has documented incompatibilities there. Direct REST calls, proxied through the Worker so the key stays in a secret binding, is the pattern multiple independent sources converge on. |
| Cloudflare AI Gateway (optional) | Managed | Caching/rate-limiting/observability wrapper in front of the Gemini calls | `[CITED: developers.cloudflare.com/ai-gateway/usage/providers/google-ai-studio/]` — native Google AI Studio provider integration; free to add on top of the existing Worker proxy pattern, no new vendor. |
| Wrangler | 4.20.5 confirmed available in this environment | D1 migrations, Vectorize/Worker deploys | `[VERIFIED: this session, \`npx wrangler --version\` → 4.20.5]`. Matches Cloudflare's current major version line. |
| Vitest + `@cloudflare/vitest-pool-workers` | vitest 4.1.10, `@cloudflare/vitest-pool-workers` 0.20.1 confirmed on npm this session | Test framework for Worker-side logic (guardrail router, RAG retrieval, event logging) | `[CITED: developers.cloudflare.com/workers/testing/vitest-integration/]` — official Cloudflare-recommended path; supports D1 and Vectorize bindings in tests. Requires Vitest ≥4.1 `[CITED: same]`. See Package Legitimacy Audit — both packages flagged SUS by the legitimacy heuristic ("too-new") despite being the officially documented path; see the note under that table. |

### Supporting

| Library | Version | Purpose | When to Use |
|---|---|---|---|
| `zod` | 4.4.3 confirmed on npm this session, OK legitimacy verdict | Runtime input validation at the Worker boundary (screening submission shape, companion query/response contract) | Recommended for every new Worker endpoint this phase adds (companion `ask`, screening-event logging) — see Security Domain, ASVS V5. Package name recommendation is `[ASSUMED]` (reasoned from training, not sourced from an official doc fetched this session) — see Package Legitimacy Audit. |
| `@capacitor/local-notifications` | 8.2.1 confirmed on npm this session | Scheduling the 24-hour crisis check-in nudge (SAFE-05) and the daily micro-action delivery (COACH-01) | Almost certainly already installed from Phase 3 (NOTF-01/02/03 requires the same scheduling primitive) — verify before treating as a new install. |
| `hono` (optional) | 4.12.34 confirmed on npm this session | Lightweight Worker routing, if the Worker does not already have a router from Phase 3/4 | Only if Phase 3/4's Worker is still a single unrouted `fetch` handler; otherwise reuse whatever routing pattern already exists — do not introduce a second routing convention. |
| `@cloudflare/workers-types` (optional) | 5.20260801.1 confirmed on npm this session | TypeScript types for Worker bindings (D1, Vectorize, AI Gateway, secrets) | Almost certainly already a devDependency from Phase 3/4's Worker setup. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Cloudflare Vectorize | D1 keyword/FTS5 search over the guideline corpus | Simpler, zero embedding cost, no new binding — but keyword matching is exactly what fails against adversarial rephrasing ("what would you guess my risk is" doesn't share keywords with a chunk about risk-scoring policy). Vectorize's semantic similarity is what makes the refusal boundary and the citation-matching both survive paraphrase. Recommend Vectorize; FTS5 is a legitimate fallback only if the corpus is small enough (tens of chunks) that the team is confident keyword coverage is exhaustive, which is a real risk given the fixed-in-advance nature of a hackathon-pace corpus. |
| Direct Gemini `fetch()` calls from the Worker | `@google/generative-ai` Node SDK | SDK gives typed responses and less boilerplate, but has documented edge-runtime compatibility gaps `[CITED: github.com/google-gemini/generative-ai-js/issues/37]`. Direct REST is the safer default for a Workers-hosted proxy. |
| PHQ-9 item 9 as the bolt-on safety-net question | NIMH's Ask Suicide-Screening Questions (ASQ), 4 items | ASQ is independently validated (~97% sensitivity in youth) and free `[CITED: nimh.nih.gov/research/research-conducted-at-nimh/asq-toolkit-materials]`, but introduces a second instrument with its own citation/branding, on top of the PHQ family already in the product (PHQ-4 now, full PHQ-9/GAD-7 at v1 per FR-605). Lifting PHQ-9 item 9 verbatim means the MVP safety-net question and the future v1 full-instrument's item 9 are the same question — zero rework at the v1 transition. Recommend PHQ-9 item 9; flag ASQ as the alternative if the clinician prefers a separately-validated screener. **Either choice needs clinician sign-off — this is new clinical-instrument scope beyond what has already been reviewed (see Open Question #1).** |

**Installation (illustrative — verify what Phase 3/4 already added before installing anything twice):**
```bash
npm install zod
# @capacitor/local-notifications and @cloudflare/workers-types are very likely already
# present from Phase 3 (notifications) and the Phase 3/4 Worker setup — check package.json
# before adding.
npm install -D vitest @cloudflare/vitest-pool-workers
```

**Version verification:** All versions above were confirmed via `npm view <package> version` in this session (2026-08-03) against the live npm registry, not from training data. Re-run this check at execution time regardless — Gemini's own model lineup (see State of the Art) turned over multiple times in the months leading up to this research date, and the same velocity should be assumed for the surrounding JS ecosystem over the Aug-Oct 2026 build window.

## Package Legitimacy Audit

| Package | Registry | Age (latest publish) | Downloads/wk | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| `zod` | npm | 2026-05-04 | 251,112,541 | github.com/colinhacks/zod | OK | Approved. Name-provenance `[ASSUMED]` (training knowledge, not sourced from an official doc fetched this session) — no checkpoint required per an OK verdict. |
| `hono` | npm | 2026-08-03 | 55,843,662 | github.com/honojs/hono | SUS ("too-new") | Kept, flagged. Name-provenance `[ASSUMED]`. Planner must add `checkpoint:human-verify` before install — **but see note below**. |
| `@cloudflare/workers-types` | npm | 2026-08-01 | 7,336,870 | github.com/cloudflare/workerd | SUS ("too-new") | Kept, flagged. Name-provenance `[ASSUMED]`. Checkpoint required — **see note**. |
| `@capacitor/local-notifications` | npm | 2026-07-15 | 446,433 | github.com/ionic-team/capacitor-plugins | SUS ("too-new") | Kept, flagged. Name-provenance `[ASSUMED]`. Checkpoint required — **see note**. Very likely already installed (Phase 3); checkpoint can double as "confirm already present" rather than a fresh install review. |
| `vitest` | npm | 2026-07-06 | 87,808,654 | github.com/vitest-dev/vitest | SUS ("too-new") | Kept, flagged. Name-provenance `[CITED]` — surfaced via an official Cloudflare docs fetch this session naming Vitest as the required test runner. Checkpoint required — **see note**. |
| `@cloudflare/vitest-pool-workers` | npm | 2026-07-31 | 2,399,428 | github.com/cloudflare/workers-sdk | SUS ("too-new") | Kept, flagged. Name-provenance `[CITED]` (same official-docs fetch). Checkpoint required — **see note**. |

**Note on the "too-new" verdict:** every SUS verdict above is triggered solely by a recent *latest-release* timestamp, not by low downloads or a missing source repo — every flagged package has an official upstream GitHub repository and download counts from 446K/week to 87.8M/week, which is not the profile of a hallucinated or slopsquatted package. This looks like an artifact of the legitimacy heuristic treating "ships releases often" the same as "just published, unproven." The `checkpoint:human-verify` task the protocol requires should still be added for each, but it can be a fast sanity check (confirm the download count and GitHub org shown above still hold at install time) rather than a deep suspicion review.

**Packages removed due to `[SLOP]` verdict:** none.
**Packages flagged as suspicious `[SUS]`:** `hono`, `@cloudflare/workers-types`, `@capacitor/local-notifications`, `vitest`, `@cloudflare/vitest-pool-workers` — all for the "too-new" reason described above, not for low-download or no-repo signals.

## Architecture Patterns

### System Architecture Diagram

**Flow A — companion question (COMP-01/02/03):**
```
Browser/Client (Chat UI)
   |  question text
   v
Worker: POST /companion/ask
   |
   v
[STAGE 1 -- structural pre-model guardrail: intent/keyword router]
   |  matches "diagnose me / what's my risk / what dose / do I have X" (incl. rephrasings)?
   |
   +--YES--> STOP. Gemini is never called.
   |         Return fixed "please discuss this with your doctor" text.  ---> satisfies COMP-02/COMP-03
   |
   +--NO---> continue
              |
              v
        [STAGE 2 -- embed the question]  (Gemini Embedding API, via fetch)
              |
              v
        [STAGE 3 -- Vectorize similarity search over the guideline corpus, top-k]
              |  best match similarity < threshold (e.g. 0.5)?
              |
              +--YES (no real match)--> STOP. Return fixed "discuss with your doctor" text. ---> COMP-03
              |
              +--NO (real match)-----> continue
                                          |
                                          v
                                 [STAGE 4 -- build grounded prompt: system
                                  instruction "answer ONLY from this context,
                                  cite sources, never diagnose/score/dose"
                                  + retrieved chunks + question]
                                          |
                                          v
                                 [STAGE 5 -- Gemini generation call, via fetch,
                                  Worker-held secret key]                    ---> satisfies COMP-01
                                          |
                                          v
                                 [STAGE 6 -- output-side scan: does the
                                  response text itself contain disallowed
                                  diagnosis/score/dose language? (defense
                                  in depth, in case Stage 1+3 both missed it)]
                                          |
                                          v
                          Return {answer, citations[]} to Browser/Client
                                          |
                                          v
                          Chat UI renders answer + visible citation chips
```

**Flow B — screening and crisis escalation (SAFE-01/02/03/05):**
```
Monthly cadence trigger, OR user taps "check in now"
   |
   v
Browser/Client: render PHQ-2 + GAD-2 + [supplementary safety-net question]
   (entirely on-device; IndexedDB via Dexie -- no network call needed to render or score)
   |
   v
On submit: score computed ON DEVICE
   |
   +--safety-net item = ANY affirmative response------------------------+
   |                                                                     |
   |                                                                     v
   |                                              Render CRISIS SCREEN immediately:
   |                                              bundled static asset, zero network
   |                                              dependency, fixed clinician-reviewed
   |                                              text + Tele-MANAS 14416 (tap-to-dial)
   |                                              + "contact a trusted person or your
   |                                              clinician" (fixed copy)          ---> SAFE-02/03/05
   |                                                                     |
   |                                                                     v
   |                                              Worker: log COUNT-ONLY event to D1
   |                                              {screening_type, escalation_fired:
   |                                              true, timestamp} -- NEVER the item
   |                                              responses or the score value
   |                                                                     |
   |                                                                     v
   |                                              Schedule 24h local notification
   |                                              check-in nudge (@capacitor/
   |                                              local-notifications)             ---> SAFE-05
   |
   +--PHQ-2/GAD-2 caseness >= cutoff, no safety-net trigger---------------+
   |                                                                      v
   |                                       Store full responses in IndexedDB only
   |                                       (per ADR-004 / CON-CLIN-07). Feeds mood-
   |                                       trend view. No forced escalation -- this
   |                                       is informational, not a red flag.
   |
   +--below cutoff----> store responses, no further action
```

### Recommended Project Structure

```
worker/
├── routes/
│   ├── companion.ts       # Flow A: guardrail router -> embed -> retrieve -> generate -> scan
│   └── screening-events.ts # Flow B: count-only event logging to D1 (never raw responses)
├── guardrail/
│   └── intent-router.ts   # Stage 1: keyword/intent classifier, structural, pre-model
├── rag/
│   ├── retrieve.ts        # Vectorize query + similarity threshold + citation metadata
│   └── prompt.ts          # grounded system-prompt construction (Stage 4)
└── migrations/
    └── 00XX_screening_events.sql   # D1: aggregate/count table only

src/
├── features/
│   ├── screening/          # PHQ-2/GAD-2/safety-net UI, on-device scoring, Dexie schema
│   ├── crisis/             # crisis screen -- bundled, offline-renderable, no Worker import at all
│   ├── coaching/           # micro-action cards with evidence grade + review date
│   └── companion/          # chat UI, citation rendering
└── data/
    └── curated-content/     # evidence-graded micro-action deck, guideline corpus source docs
```

### Pattern 1: Structural (code-level) refusal boundary, not prompt-only

**What:** A keyword/intent classifier that runs in the Worker *before* any call to Gemini, hard-routing diagnosis/risk-scoring/dose questions to fixed text without the model ever seeing the query.

**When to use:** Any time a user-facing LLM feature has a hard behavioural boundary (COMP-02) that must survive adversarial rephrasing.

**Why not a system prompt alone:** `[CITED: cross-corroborated — OWASP LLM Top 10 2025 (LLM01 Prompt Injection, LLM06 Excessive Agency) plus independent guardrail-engineering sources]` — "Prompt-level guardrails... work under normal conditions but fail when prompt injection, jailbreak, or multi-turn context manipulation overrides the instruction, whereas structural guardrails enforced by code outside the LLM's context window cannot be overridden by adversarial prompts." A system prompt telling Gemini "never diagnose" is a request the model can, in principle, be talked out of across a multi-turn conversation or a clever single-turn rephrasing ("hypothetically, if a friend had these symptoms, what would you guess..."). Code that never invokes the model at all for a matched intent cannot be argued with.

**Example (proposed pattern for this phase — not yet in the codebase):**
```typescript
// worker/guardrail/intent-router.ts
// Proposed pattern, consistent with CON-BUILD-03 and COMP-02/COMP-03.
// Field/route names below are this phase's design, not yet implemented anywhere.

const BLOCKED_INTENT_PATTERNS: RegExp[] = [
  /\b(diagnos|what.{0,15}(do i have|is wrong with me))\b/i,
  /\b(risk|likelihood|chance).{0,20}(pmos|pcos|condition|score)\b/i,
  /\b(dose|dosage|how much (should|can) i take|increase|decrease).{0,20}(medic|tablet|pill|metformin|inositol)\b/i,
  /\bhypothetical(ly)?\b.{0,40}\b(diagnos|risk|dose)\b/i,   // common jailbreak framing
  /\b(guess|estimate|approximat).{0,20}(my|her)\s+(risk|condition|dose)\b/i,
];

const FIXED_OUT_OF_SCOPE_RESPONSE =
  "This is something to discuss with your doctor. I can share what the guidelines say " +
  "in general, but I can't tell you what applies to you specifically.";

export function checkGuardrail(question: string): { blocked: boolean; response?: string } {
  const matched = BLOCKED_INTENT_PATTERNS.some((pattern) => pattern.test(question));
  return matched
    ? { blocked: true, response: FIXED_OUT_OF_SCOPE_RESPONSE }
    : { blocked: false };
}
```
Regex-only matching is a starting point, not the finished guardrail — pair it with the retrieval-similarity-threshold fallback (Flow A, Stage 3) and the output-side scan (Stage 6) so a rephrasing that slips past the keyword list still fails to retrieve a matching guideline chunk, or is caught reading the model's own answer before it reaches the user. Three independent layers, not one.

### Pattern 2: Structurally state-independent support-circle payload

**What:** If the support-circle contact mechanism is ever built (see Open Question #2), the reminder payload sent to a notification/Worker system must be a type that makes it *impossible* to attach mood/score/symptom data, not merely a policy against doing so.

**When to use:** Any feature where the product commitment is "this never carries information about her state" `[VERIFIED: .planning/intel/constraints.md:124-127]` (CON-CLIN-06): "The app SHALL NOT detect low mood and alert a third party... Her supporter sees only that she would like to hear from them, never a mood, a score or a symptom... The optional recurring reminder to her supporter fires on a fixed schedule regardless of how she is, so it produces the phone call without carrying any information about her state." This is independently corroborated by "safety by design" guidance for tech-facilitated-abuse resistance: `[CITED: esafety.gov.au Safety by Design guidance; IBM "coercive control resistant design"]` — defaulting a contact by relationship status (rather than free user choice) is a named anti-pattern that enables coercive control, exactly the failure mode this product's own clinician-reviewed design already avoids.

**Example (proposed pattern, illustrating the principle — not yet in the codebase):**
```typescript
// A schema that makes the vulnerable design impossible to write, not just discouraged.
import { z } from "zod";

const SupportCircleReminderPayload = z.object({
  contactId: z.string().uuid(),
  templateId: z.literal("thinking_of_you_v1"), // fixed, pre-approved copy only
  scheduledFor: z.string().datetime(),
  // Deliberately: no mood, score, symptom, or free-text field exists on this type.
  // A future contributor cannot wire in her state without changing this schema
  // in a code review that a reviewer can see and reject.
});
type SupportCircleReminderPayload = z.infer<typeof SupportCircleReminderPayload>;
```

### Anti-Patterns to Avoid

- **Storing PHQ-4/GAD-2 item responses or scores in D1:** violates ADR-004 ("health data stays on the device") and NFR-901/903 (analytics/logs are counts only). Only aggregate event metadata belongs server-side.
- **A crisis screen that fetches its text from the Worker (even "just to keep copy centrally editable"):** the moment the crisis screen depends on a network round-trip, "never rate-limited, never paywalled" stops being true by construction and becomes true only if every downstream system is perfectly configured, forever. Bundle it.
- **A single system-prompt guardrail with no structural backstop:** per the OWASP-documented finding above, this is a known-bypassable pattern for exactly the adversarial-rephrasing threat this phase's own research brief names.
- **A nutrition/food API that computes calories internally, with the UI simply not displaying the field:** COACH-03/04 require the *system* to never count a calorie, not merely to never show one it already computed. A hidden-but-present calorie value is one refactor away from a regression that displays it.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Suicidality risk detection | A custom symptom-severity heuristic ("if mood <= 2 for 3 days, escalate") | A single validated question — PHQ-9 item 9 (free, Pfizer-released) or NIMH's ASQ (free, validated) — appended to the existing PHQ-4/GAD-2 flow | `[CITED: Pfizer press release + phqscreeners.com/terms, already verified in this repo at product/03-complete-features-spec.md:1028]`: "PHQ-9, GAD-7 and PHQ-4 are free of copyright restriction... including commercially." A custom heuristic has no validation evidence behind it and is exactly the kind of "we invented our own screening logic" decision that raises CDSCO medical-device-classification risk (CON-CLIN-08) rather than lowering it. |
| Semantic retrieval over the guideline corpus | Custom TF-IDF or substring matching against a curated set of guideline documents | Cloudflare Vectorize (embeddings + similarity search) | `[CITED: developers.cloudflare.com/vectorize/get-started/intro/; developers.cloudflare.com/workers-ai/guides/tutorials/build-a-retrieval-augmented-generation-ai/]`. Substring/keyword matching is precisely what fails against the adversarial rephrasing this phase's own guardrail must resist. |
| LLM refusal enforcement | A single system-prompt instruction | A structural pre-model intent router (Pattern 1 above) + retrieval-similarity fallback + output-side scan | OWASP LLM Top 10 finding above: prompt-only guardrails are documented as bypassable under jailbreak/multi-turn manipulation; code outside the model's context window is not. |
| Evidence-grade taxonomy | An invented "5-star" or custom certainty scale with no clinical grounding | A simplified 3-tier consumer translation of GRADE (`high/moderate` -> low/very-low) or USPSTF (A/B -> C/D/I), worded and approved by the REG-03 sign-off clinician | `[CITED: uspreventiveservicestaskforce.org/uspstf/about-uspstf/methods-and-processes/grade-definitions]`. An invented scale gives the sign-off clinician (REG-03) nothing standard to check against, and risks reading as a stronger claim than the underlying evidence supports — the exact failure mode this phase's research brief warns against ("without it reading as a medical claim"). |
| Notification scheduling for the 24h check-in and daily micro-action | A custom setTimeout/background-task scheduler | `@capacitor/local-notifications` (already required for Phase 3's NOTF-01/02/03) | Reuses an existing, already-vetted platform primitive rather than building a second scheduling mechanism with its own OS-permission and reliability edge cases. |
| Crisis-path availability guarantee | A rate-limit allowlist rule, a login bypass flag, or any other *configuration* that has to be gotten right on every deploy | A crisis screen with zero network dependency, bundled at build time | Configuration can drift or be misapplied on a redeploy; a screen that never makes a network call cannot be rate-limited or paywalled no matter what the Worker's config says. |

**Key insight:** almost everything in this phase is a "don't invent a new safety mechanism" problem, not a "build a clever feature" problem. Every custom solution considered above (a homemade suicidality heuristic, keyword-only retrieval, a prompt-only guardrail, an invented evidence scale) fails the same way: it looks like it works in the demo case and fails silently against the exact adversarial or edge case this phase exists to catch.

## Common Pitfalls

### Pitfall 1: PHQ-4 structurally cannot produce the response SAFE-05 escalates on
**What goes wrong:** SAFE-01 names PHQ-4/GAD-2 as the instrument; SAFE-05 requires escalation on "any suicidality... response." A team implementing this literally will build a PHQ-4 screen, wire up an escalation branch, and then discover there is no field in PHQ-4's four items that a "suicidality response" could ever populate.
**Why it happens:** PHQ-4 is explicitly the *ultra-brief caseness* screener (PHQ-2 + GAD-2) and was designed to exclude item 9 (the suicidality item) precisely because it trades completeness for brevity. `[CITED, cross-corroborated: ResearchGate "An Ultra-Brief Screening Scale for Anxiety and Depression: The PHQ-4"; Medscape PHQ-4 calculator; ScienceDirect PHQ-2 overview]`: "Item 9 of the PHQ-9 is the suicidal ideation question, which is excluded from the PHQ-8 and therefore also from the PHQ-4 screening tools."
**How to avoid:** Add a single supplementary safety-net question (recommend PHQ-9 item 9 verbatim, or NIMH's ASQ) to the screening flow specifically to satisfy SAFE-05 — see Open Question #1. This needs a clinician decision, not just an engineering fix, since it is new clinical-instrument scope beyond what has already been reviewed.
**Warning signs:** A plan or PR that implements "escalate on suicidality" with no distinct question/field feeding it, or that silently reuses the PHQ-2/GAD-2 caseness cutoff (≥3) as the escalation trigger — that cutoff answers "is she likely depressed/anxious," not "is she at risk right now," and conflating the two either over-escalates (false alarms on everyone who screens positive for depression) or, worse, never escalates on real risk because the caseness cutoff was tuned for a different question.

### Pitfall 2: Building the full "support circle" (CIRC-01/02) when only a fixed prompt is in scope
**What goes wrong:** the research brief that motivated this document explicitly asks for research on "a user-initiated support circle contact mechanism" — but `.planning/REQUIREMENTS.md` marks CIRC-01/CIRC-02 "Tracked, not in the current roadmap," and neither ID appears in Phase 5's 15-requirement list or the project's Traceability table. A team that builds the full nominate-a-contact-and-notify-them feature under the impression it's part of SAFE-05 has built out-of-scope work relative to this project's own requirements ledger.
**Why it happens:** the hackathon proposal's own "safety layer" module description bundles the crisis pathway, sleep-apnoea screening and the support circle together in one narrative paragraph, and the phase's research brief inherited that bundling. The project's requirements-drafting process appears to have deliberately split them back apart (support circle deferred; crisis pathway kept, scoped down to "prompt her to contact a trusted person" with no contact mechanism).
**How to avoid:** resolve Open Question #2 explicitly — ideally via `/gsd:discuss-phase` — before the plan locks scope. Don't let the more expansive proposal narrative silently re-expand the phase beyond what REQUIREMENTS.md currently authorizes.
**Warning signs:** any task in the plan that involves contact nomination, contact storage, or sending a notification *to a third party* — none of that is in SAFE-05 as scoped by REQUIREMENTS.md.

### Pitfall 3: Crisis copy or the companion's answers routed through anything that could template in a variable
**What goes wrong:** a well-intentioned refactor ("let's make the crisis text localizable / A/B-testable / dynamically configurable from the Worker") reintroduces exactly the risk SAFE-02 exists to prevent — a code path where the displayed text is no longer a fixed, reviewed constant.
**Why it happens:** localization and remote-config systems are standard engineering hygiene almost everywhere else in an app; the crisis screen is the one place that hygiene is actively dangerous, because it reintroduces a place a template variable — or eventually a model output — could land.
**How to avoid:** treat the crisis screen's copy as a literal, compile-time string constant, not a resource-bundle key or a Worker-fetched value. If localization is needed later (Hindi/Tamil, per NFR-601, is v1 scope not this phase's MVP), each locale gets its own separately clinician-reviewed constant, not a runtime interpolation.
**Warning signs:** any import of the Worker client, the Gemini client, or an i18n templating library inside the crisis-screen component.

### Pitfall 4: Treating the guardrail as "done" after the keyword list ships
**What goes wrong:** the regex/keyword router (Pattern 1) catches the obvious phrasings tested during development and is declared complete; a live user finds a rephrasing the list doesn't cover, and the query reaches Gemini.
**Why it happens:** keyword lists are inherently incomplete against an adversarial or even just creatively-worded population — this is the entire reason OWASP treats prompt-injection/jailbreak resistance as an ongoing property to test, not a one-time feature.
**How to avoid:** the three-layer design in Flow A (pre-model router, retrieval-similarity threshold, output-side scan) is defense in depth specifically because no single layer is claimed to be complete. Maintain a running regression suite of adversarial rephrasings (see Validation Architecture, COMP-02) and add to it whenever a new bypass is found — treat this the same way a security team treats a bug bounty finding, not as a one-off bug fix.
**Warning signs:** a plan that implements only the keyword router and calls COMP-02 done, with no companion test suite and no output-side scan.

### Pitfall 5: Evidence-grade wording drifting into a stronger claim than the evidence supports
**What goes wrong:** a badge reading "Clinically proven" or a percentage-style number ("87% effective") appears on a micro-action card, which reads as a medical claim rather than a graded strength-of-evidence indicator — precisely the failure mode this phase's own research brief warns against.
**Why it happens:** consumer-facing UX conventions for "trust badges" (star ratings, percentages, "doctor recommended") are borrowed by default from e-commerce/marketing patterns that have no relationship to clinical evidence grading.
**How to avoid:** map every displayed grade back to an established clinical framework (GRADE or USPSTF, per Don't Hand-Roll) and route every wording choice through the REG-03 clinician sign-off before it ships — this is exactly why REG-03 exists as a hard gate on this phase, not a formality.
**Warning signs:** any grade wording invented without a clinician-reviewed mapping back to GRADE/USPSTF tiers.

### Pitfall 6: CDSCO classification risk being treated as this phase's problem to solve in code
**What goes wrong:** a plan tries to "fix" the CDSCO medical-device-classification risk (OPEN-05, CON-CLIN-08) through product design choices in this phase, when it is actually a pre-pilot regulatory gate that has to be resolved through a CDSCO pre-submission opinion, not through engineering.
**Why it happens:** the risk is directly caused by exactly what this phase builds — validated screening instruments run on a cadence, escalation on a clinical threshold `[VERIFIED: .planning/intel/constraints.md:134-137]` (CON-CLIN-08) — so it's tempting to think a code change resolves it.
**How to avoid:** build the phase as specified (this is already the clinician-reviewed, minimal-scope design); track CDSCO resolution as a separate pre-pilot milestone gate, not a Phase 5 deliverable. Nothing in this phase's 15 requirements asks for a classification opinion — don't invent that as in-scope work either.
**Warning signs:** a plan task that reads like "resolve CDSCO classification" — that belongs to the project's open-items list, not this phase's plan.

## Code Examples

### D1 schema: aggregate event log only (never raw screening responses)
```sql
-- Proposed pattern for this phase — not yet in the codebase.
-- Consistent with ADR-004 (health data stays on device) and NFR-901/903
-- (analytics/logs are counts only, reviewed weekly).
CREATE TABLE screening_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,           -- account reference only, no health content
  screening_type TEXT NOT NULL,    -- 'phq4_gad2' | 'ed_screen' | ...
  escalation_fired INTEGER NOT NULL DEFAULT 0,  -- boolean: did a red-flag trigger?
  escalation_reason TEXT,          -- enum-like: 'suicidality' | 'chest_pain' | ... (category only, never free text)
  occurred_at TEXT NOT NULL
  -- Deliberately: no item-level responses, no numeric score, no free-text field.
);
```
The actual PHQ-4/GAD-2/safety-net item responses and computed score belong in the existing on-device store (Dexie/IndexedDB), in the same tier as the `CHECKIN`/`SYMPTOM_ENTRY` entities already defined in `product/04-data-model.md` — that file currently has no `SCREENING` or `CRISIS_EVENT` entity, so this is new schema design for this phase, not a read of an existing definition.

### Vectorize retrieval with a similarity floor and citation metadata
```typescript
// Proposed pattern for this phase — not yet in the codebase.
// Source pattern: developers.cloudflare.com/vectorize/get-started/intro/ and
// the Cloudflare Workers AI RAG tutorial (both official docs, fetched this session).
const SIMILARITY_FLOOR = 0.5;

async function retrieve(env: Env, queryEmbedding: number[]) {
  const results = await env.GUIDELINE_INDEX.query(queryEmbedding, {
    topK: 5,
    returnMetadata: true,
  });
  const relevant = results.matches.filter((m) => m.score >= SIMILARITY_FLOOR);
  if (relevant.length === 0) {
    return { outOfScope: true as const };
  }
  return {
    outOfScope: false as const,
    chunks: relevant.map((m) => ({ text: m.metadata?.text, citation: m.metadata?.sourceDoc })),
  };
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| `@google/generative-ai` Node SDK called directly from an edge Worker | Direct REST `fetch()` to the Gemini API, proxied through the Worker | Ongoing — edge-runtime Node-API-subset limitations are a standing constraint, not a recent change | `[CITED: github.com/google-gemini/generative-ai-js/issues/37]`. Avoids adding an SDK dependency that may not fully work in the Workers runtime. |
| Gemini 2.0 Flash | Gemini 3.x family (3.5 Flash launched 19 May 2026; 3.1 Pro) | Gemini 2.0 Flash shut down 1 June 2026; the 2.5 family (Pro/Flash/Flash-Lite) is scheduled for retirement 16 October 2026 — inside this phase's Aug-Oct 2026 build window | `[CITED, single-pass web search, not cross-verified against ai.google.dev directly this session — LOW-MEDIUM confidence, re-verify at build time]`. Do not hardcode a specific Gemini model string in the plan; resolve the current model name against `ai.google.dev/gemini-api/docs/models` (or the Cloudflare AI Gateway's supported-models list) at implementation time, not from this document. |

**Deprecated/outdated:**
- Gemini 2.0 Flash: shut down 1 June 2026, per web search this session — do not target it.
- Gemini 2.5 family: scheduled retirement 16 October 2026 — if build slips toward the end of the Aug-Oct 2026 window, confirm this model family is still callable before demo/ship.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | PHQ-9 item 9 (rather than NIMH's ASQ) is the better bolt-on safety-net question for SAFE-05 | Standard Stack (Alternatives Considered), Don't Hand-Roll | If the sign-off clinician prefers ASQ or a different instrument, the screening UI's question count/flow and any citation/branding on-screen would need to change — not a large rework, but not zero either. |
| A2 | A simplified 3-tier consumer translation of GRADE/USPSTF is the right shape for the COACH-02 evidence-grade badge | Don't Hand-Roll, Pitfall 5 | If REG-03's sign-off clinician wants a different number of tiers or different underlying framework, the content-authoring template and the UI component's enum both change. |
| A3 | `hono`, `@cloudflare/workers-types`, and `@capacitor/local-notifications` are already present in the Phase 3/4 codebase and do not need fresh installation in Phase 5 | Standard Stack, Package Legitimacy Audit | If Phase 3/4 did not in fact establish Worker routing or notification scheduling, Phase 5's plan needs to budget time to add these from scratch, changing effort estimates. |
| A4 | Cloudflare Vectorize (rather than D1 keyword/FTS5 search) is the right choice for the guideline-corpus retrieval, given the team's stated preference for "no learning curve" additions | Standard Stack (Alternatives Considered) | If the curated corpus is small enough that keyword matching is exhaustive and the team is short on time, FTS5 avoids the embedding-generation step entirely — a legitimate simpler path this document does not recommend by default. |
| A5 | The current Gemini model family (3.x as of this research date) will still be callable through the Aug-Oct 2026 build window | State of the Art | Given the observed churn (2.0 shut down, 2.5 retiring mid-window), a model name pinned early in planning could be unavailable by ship date if not re-verified. |

**If this table is empty:** N/A — see rows above.

## Open Questions

1. **Does SAFE-05's "prompts her to contact a trusted person" require building the CIRC-01/CIRC-02 support-circle contact-nomination-and-notification mechanism, or is it satisfied by fixed crisis-screen copy with no contact-selection UI at all?**
   - What we know: `.planning/REQUIREMENTS.md`'s Traceability table maps only SAFE-01 through SAFE-05, COACH-01 through 05, COMP-01 through 03, SKIN-01 and REG-03 to Phase 5 `[VERIFIED: .planning/REQUIREMENTS.md:405-419]`. CIRC-01 and CIRC-02 appear only in the Deferred Requirements section, explicitly labelled "Tracked, not in the current roadmap" `[VERIFIED: .planning/REQUIREMENTS.md:305-311, 242-244]`, and are absent from the Traceability table entirely. Yet this phase's own research brief (the prompt that produced this document) asks for research on exactly that mechanism, and it is described in the hackathon proposal's "safety layer" module in the same breath as the crisis pathway `[CITED: hackathon/proposal.md:133]`.
   - What's unclear: whether the research brief's framing reflects an intended (but not yet requirements-recorded) scope expansion, or whether it inherited the proposal's narrative bundling without noticing the requirements-drafting process had already split the two apart.
   - Recommendation: resolve explicitly, ideally via `/gsd:discuss-phase`, before planning locks scope. The research in this document (support-circle safety-by-design patterns, state-independent payload design) is provided either way — useful now if the decision is "build it," and useful whenever CIRC-01/02 is eventually promoted out of Deferred if the decision is "not yet."

2. **Which instrument supplies the suicidality/self-harm response that SAFE-05 escalates on, given PHQ-4 alone cannot?**
   - What we know: PHQ-4 (PHQ-2+GAD-2) excludes the suicidal-ideation item by construction `[CITED, cross-corroborated: see Pitfall 1]`. Two free, validated candidates exist: PHQ-9 item 9 (verbatim) or NIMH's 4-item ASQ.
   - What's unclear: which the sign-off clinician (REG-03) would approve, and whether adding a question beyond the clinician-reviewed "PHQ-4 and GAD-2... monthly or user-initiated" wording `[VERIFIED: .planning/intel/constraints.md:119-122]` needs to go back to that clinician for a fresh review, since it is new instrument scope beyond what was already blessed.
   - Recommendation: treat this as a required clinician touchpoint before the plan finalizes the screening UI's exact question set — this is not purely an engineering decision.

3. **Does the crisis-path 24-hour check-in nudge (SAFE-05) need any state at all, or is it a fixed, content-free reminder ("checking in — how are you doing?")?**
   - What we know: the requirement says "checks in after 24 hours" `[VERIFIED: .planning/REQUIREMENTS.md:147-149]`; the clinician's own review specifies "one nudge after 24 hours" with no further detail on its content `[VERIFIED: hackathon/proposal.md:256-260]`.
   - What's unclear: whether this nudge should re-offer the crisis resources (in case she didn't act on them) or simply check in neutrally; whether a non-response to the nudge should do anything further (the clinician was explicit that the pathway "as written is the right scope for now" — suggesting no further escalation chain beyond this single nudge, but this is worth confirming rather than assuming).
   - Recommendation: default to a single, neutral, content-light nudge with no further automated escalation chain beyond it, consistent with the clinician's "do not build more than this" instruction — confirm during planning discussion rather than inventing additional logic.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build tooling | ✓ (this research environment) | v22.16.0 | — |
| npm | Package installs | ✓ | 10.9.2 | — |
| Wrangler (Cloudflare Workers CLI) | D1 migrations, Vectorize/Worker deploys | ✓ (via npx) | 4.20.5 | — |
| Cloudflare Vectorize | RAG retrieval (COMP-01) | Needs provisioning — managed service, not yet confirmed set up in this project | — | If Vectorize provisioning is blocked or delayed, D1 FTS5 keyword search is a functional (if weaker against paraphrase) fallback for a small, fixed corpus — see Standard Stack alternatives. |
| Gemini API access (key/quota) | Companion generation + embeddings (COMP-01) | Not verified in this session — depends on the Worker secret binding already established for Phase 4's doctor-summary phrasing | — | None identified if Gemini access is unavailable — the companion feature (COMP-01) has no non-LLM fallback path specified anywhere in the requirements; this would need explicit descoping, not a silent substitute. |
| Tele-MANAS 14416 | Crisis resource (SAFE-03) | ✓ — confirmed live, government-run, toll-free, 24/7 as of this research date `[CITED: pib.gov.in; telemanas.mohfw.gov.in]` | — | — |

**Missing dependencies with no fallback:**
- Gemini API access/quota for the companion feature — no alternative model or path is specified anywhere in this project's documents if Gemini becomes unavailable (quota, outage, or account issue). Worth a build-time check before Phase 5 work starts, given Phase 4 already depends on the same access for doctor-summary phrasing.

**Missing dependencies with fallback:**
- Cloudflare Vectorize provisioning — D1 FTS5 keyword search over the curated corpus is a viable, if weaker, fallback (see Standard Stack alternatives).

Per-machine toolchain verification across all four team members' devices is tracked as HACK-12 in Phase 1 and is not re-verified here.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — greenfield repo, no `package.json`/`src/` exists yet at the project root. Recommended: Vitest 4.1+ with `@cloudflare/vitest-pool-workers` for Worker-side logic, plus Vitest + a DOM testing library for React components. |
| Config file | none — see Wave 0 |
| Quick run command | `npx vitest run --project workers` (Worker-side: guardrail router, RAG retrieval, event logging) / `npx vitest run --project client` (UI components) — exact project names depend on the `vitest.config.ts` Wave 0 sets up |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SAFE-01 | PHQ-2/GAD-2 scoring and cadence trigger | unit | `vitest run tests/screening/scoring.test.ts` | Wave 0 |
| SAFE-02 | Crisis screen renders exact fixed text; never imports Worker/Gemini client | unit + static/import-graph audit | `vitest run tests/crisis/fixed-copy.test.ts` (snapshot) + `madge --circular` / import-graph lint (per user's own tooling preference) confirming zero import edge from crisis component to any Worker/Gemini module | Wave 0 |
| SAFE-03 | Crisis resource path renders with no auth/rate-limit gate | integration | `vitest run tests/crisis/no-gate.test.ts` (renders from a logged-out state) + deploy-config check (Rahul) | Wave 0 |
| SAFE-04 | ED-screen-positive suppresses food-tracking depth | unit | `vitest run tests/coaching/ed-gate.test.ts` | Wave 0 |
| SAFE-05 | Safety-net item positive -> crisis screen + count-only D1 event + 24h nudge scheduled | unit + integration | `vitest run tests/screening/escalation.test.ts` | Wave 0 |
| COACH-01 | 1-2 micro-actions/day selected from curated set | unit | `vitest run tests/coaching/daily-selection.test.ts` | Wave 0 |
| COACH-02 | Every micro-action card has non-null evidence grade + review date | unit (schema/content audit) | `vitest run tests/content/evidence-grade-schema.test.ts` | Wave 0 |
| COACH-03 | Food-log data model has no calorie/macro field | static audit | `vitest run tests/coaching/no-calorie-field.test.ts` (type/schema introspection) | Wave 0 |
| COACH-04 | Movement summary never includes a calories-burned field | unit | `vitest run tests/coaching/movement-summary.test.ts` | Wave 0 |
| COACH-05 | Weight field hidden unless opt-in permission granted | unit + UI | `vitest run tests/coaching/weight-optin.test.ts` | Wave 0 |
| COMP-01 | Companion answer includes >=1 resolvable citation | integration | `vitest run tests/companion/citation.test.ts` | Wave 0 |
| COMP-02 | Adversarial rephrasing regression suite — 100% hard-routed away from the model | integration (regression suite, re-run on every guardrail change) | `vitest run tests/companion/guardrail-adversarial.test.ts` | Wave 0 — **this suite is the single most safety-critical test in this phase; grow it whenever a new bypass phrasing is found** |
| COMP-03 | Below-similarity-threshold query routes to fixed fallback text | unit | `vitest run tests/companion/out-of-scope.test.ts` | Wave 0 |
| SKIN-01 | No beauty/symmetry/comparison/collage component exists anywhere in the codebase | static audit (absence test) | `rg -i "symmetry|attractiveness.{0,10}score|before.{0,3}after" src/` returning zero matches, wired into CI | Wave 0 |
| REG-03 | Signed, dated clinician + mental-health-professional sign-off artifact exists before release tag | manual-only (process gate) | A checked-in sign-off record (e.g. `SIGNOFF.md` with names/dates) verified present by a release-checklist step — justification: this is a governance decision, not a testable code property | N/A — process artifact, not a test file |

### Sampling Rate
- **Per task commit:** `npx vitest run` scoped to the changed area (e.g. `--project workers` for guardrail/RAG changes)
- **Per wave merge:** full `npx vitest run`
- **Phase gate:** full suite green, plus the COMP-02 adversarial regression suite green, plus the REG-03 sign-off artifact present, before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `vitest.config.ts` with a Workers project (`@cloudflare/vitest-pool-workers`) and a client/DOM project — framework install: `npm install -D vitest @cloudflare/vitest-pool-workers`
- [ ] `tests/companion/guardrail-adversarial.test.ts` — seed with the rephrasings already identified in Pattern 1 above ("hypothetically...", "guess my risk...", etc.) as a starting corpus
- [ ] `tests/crisis/fixed-copy.test.ts` and an import-graph check — no existing test infrastructure covers this, and it is this phase's highest-stakes property
- [ ] Curated evidence-graded content dataset (COACH-02) needs its schema defined before a schema-audit test can run against it

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | Partial — reused from Phase 3/4, no new auth work this phase | Whatever session/account mechanism Phase 3 established |
| V3 Session Management | Partial — reused | Same as above |
| V4 Access Control | Yes — with a deliberate, documented exception | The crisis resource/screen (SAFE-03) is the **one** surface in the entire app required to bypass normal access control, auth gating, and rate limiting. Every other Worker endpoint added this phase (companion `ask`, screening-event logging) should sit behind whatever access control Phase 3/4 established. |
| V5 Input Validation | Yes | `zod` (or equivalent) at every new Worker endpoint boundary — validate companion question length/shape and screening-event payload shape before processing. |
| V6 Cryptography | Yes — reused, not new | Any new data that does sync to D1 (aggregate counts) rides the same encrypted-at-rest path (AES-256, Secure Enclave/Keystore) already established by ADR-004/PRIV-05; no new crypto work needed, but new tables must not bypass it. |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Prompt injection / jailbreak to extract a diagnosis, risk score, or dose recommendation | Tampering / Elevation of Privilege | Structural pre-model guardrail (Pattern 1) + retrieval-similarity fallback + output-side scan — never a system prompt alone. `[CITED: OWASP LLM Top 10 2025, LLM01/LLM06]` |
| Excessive agency — a future change accidentally exposes a scoring/dosing "tool" or function-call capability to the model | Elevation of Privilege | Never wire any scoring/dosing/diagnosis function into the model's available tools at all — the strongest guarantee against "the model used a capability it shouldn't have" is that capability not existing in its reachable surface. `[CITED: OWASP LLM Top 10 2025, LLM06 Excessive Agency]` |
| Sensitive data leakage — screening responses or scores appearing in analytics, crash reports, or logs | Information Disclosure | `[VERIFIED: product/00-PRD.md:704, 706]` NFR-901/NFR-903 — counts only, health-data values excluded from analytics/logs by design. |
| Support-circle mechanism (if built — see Open Question #2) repurposed as covert monitoring by whoever holds the contact end | Tampering / Information Disclosure (by design intent, not a bug) | Structural non-transmission (Pattern 2) — the payload type cannot carry state, so no code change short of altering the schema (visible in review) can reintroduce it. `[VERIFIED: .planning/intel/constraints.md:124-127]`, corroborated by `[CITED: esafety.gov.au Safety by Design guidance]`. |
| Crisis resource made unavailable via rate-limit, paywall, login gate, or network dependency | Denial of Service against a safety control | Bundle the crisis screen as a static, offline-renderable asset with zero network dependency in its render path (Flow B). |

## Sources

### Primary (HIGH confidence — verified in-repo this session)
- `.planning/REQUIREMENTS.md` — SAFE-01 through 05, COACH-01 through 05, COMP-01 through 03, SKIN-01, REG-03; Traceability table; Deferred Requirements (CIRC-01/02)
- `.planning/intel/constraints.md` — CON-CLIN-04 through 08, CON-BUILD-03 (read directly, verbatim quotes above)
- `product/00-PRD.md` §9.6-9.11, §10.7, §10.9 — FR-600/700/900/1100 families, NFR-701-705, NFR-901-904
- `product/03-complete-features-spec.md` §3.7-3.8, §9.3, §9.5, §12 — PHQ family licensing (Pfizer), guardrail summary, sources list
- `product/04-data-model.md` — existing entity design (no SCREENING/CRISIS_EVENT entity yet — confirmed absent)
- `hackathon/proposal.md` (lines 133-260) and `hackathon/PMOS-clinical-review.pdf` (16 pages, read in full) — clinician-reviewed crisis pathway, support-circle design rationale, tech stack
- `hackathon/build-plan.md` — H22-H28 safety-layer build window, cut-list ordering
- This session's `npm view` checks: `zod` 4.4.3, `hono` 4.12.34, `@cloudflare/workers-types` 5.20260801.1, `@capacitor/local-notifications` 8.2.1, `vitest` 4.1.10, `@cloudflare/vitest-pool-workers` 0.20.1, `wrangler` 4.20.5 (via npx)

### Secondary (MEDIUM confidence — web search, cross-corroborated or official-source)
- Tele-MANAS 14416 — pib.gov.in (Government of India Press Information Bureau), telemanas.mohfw.gov.in
- PHQ-4 excludes suicidality item — ResearchGate ("An Ultra-Brief Screening Scale for Anxiety and Depression: The PHQ-4"), Medscape PHQ-4 calculator, ScienceDirect PHQ-2 overview (cross-corroborated across three independent sources)
- NIMH ASQ toolkit — nimh.nih.gov/research/research-conducted-at-nimh/asq-toolkit-materials
- Cloudflare Vectorize / Workers AI RAG pattern — developers.cloudflare.com/vectorize/get-started/intro/, developers.cloudflare.com/workers-ai/guides/tutorials/build-a-retrieval-augmented-generation-ai/
- Cloudflare D1 migrations — developers.cloudflare.com/d1/reference/migrations/, developers.cloudflare.com/d1/wrangler-commands/
- Cloudflare Workers Vitest integration — developers.cloudflare.com/workers/testing/vitest-integration/write-your-first-test/, /configuration/
- Gemini API from edge runtimes — github.com/google-gemini/generative-ai-js/issues/37; developers.cloudflare.com/ai-gateway/usage/providers/google-ai-studio/
- OWASP LLM Top 10 (2025) guardrail-layering finding — cross-corroborated across Datadog LLM guardrails blog and independent guardrail-engineering analysis
- GRADE / USPSTF evidence grading — uspreventiveservicestaskforce.org/uspstf/about-uspstf/methods-and-processes/grade-definitions
- Safety-by-design / coercive-control-resistant design — esafety.gov.au (Australian Government agency), IBM coercive-control-resistant design guidance
- PHQ-2/GAD-2 validated cutoffs (≥3 standard for both) — cross-corroborated across multiple peer-reviewed cohort studies (HIV care, migraine, chronic pain populations); no India-specific or PMOS-specific validation study found

### Tertiary (LOW confidence — single-pass, flagged for re-verification)
- Current Gemini model family/pricing (3.5 Flash, 3.1 Pro, 2.5 retirement date) — single web search pass, not cross-verified directly against ai.google.dev this session. Re-verify at build time regardless of this document's "Valid until" date, given the observed churn rate.

## Metadata

**Confidence breakdown:**
- Screening/crisis pathway requirements themselves: HIGH — read directly from this repo's own clinician-reviewed constraints with verbatim quotes and line citations.
- The PHQ-4/suicidality gap and its fix: MEDIUM — cross-corroborated across three independent academic/reference sources, but the specific fix (which instrument) is a recommendation pending clinician sign-off, not yet a locked decision.
- RAG/guardrail architecture: MEDIUM — official Cloudflare/OWASP sources corroborate the pattern; the specific similarity threshold and regex list in the code examples are illustrative starting points, not tuned values.
- Evidence-grading UX: LOW-MEDIUM — the underlying clinical frameworks (GRADE/USPSTF) are well-documented, but no consumer-app precedent for the exact badge design was found; this is a design recommendation, not a verified pattern.
- Support-circle safety-by-design: MEDIUM — the product's own design is already clinician-reviewed and independently corroborated by named safety-by-design guidance, but whether this feature belongs in this phase at all is unresolved (Open Question #2).
- Package/version data: HIGH for existence and version numbers (verified via `npm view` this session); MEDIUM-LOW for the "too-new" SUS verdicts, which appear to be a heuristic artifact rather than genuine risk signal (see note under Package Legitimacy Audit).
- Gemini model naming specifically: LOW — fast-moving, single-pass search, explicitly flagged for re-verification at build time.

**Research date:** 2026-08-03
**Valid until:** 2026-08-17 (14 days) for anything Gemini-model-specific or evidence-badge-UX-specific, given the churn observed during this research pass; 30 days for the clinical/regulatory/architecture findings, which are far more stable. Re-verify package versions and the Gemini model lineup regardless of which date applies, at actual implementation time.
