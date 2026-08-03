# Phase 4: The Engine and the Evidence She Takes to a Doctor - Research

**Researched:** 2026-08-03
**Domain:** N-of-1 statistical pattern discovery (lagged cross-correlation, bootstrap CI, FDR
correction) + client-side PDF report generation + guarded LLM phrasing from a Cloudflare Worker
**Confidence:** MEDIUM-HIGH (stack/library facts verified against the npm registry directly;
statistical methodology cross-corroborated across multiple sources; the Gemini API integration
surface turned out to be genuinely unstable during this research session — see State of the Art)

## Summary

Phase 4 turns the engine that was hand-built fast for the 8–9 August hackathon (Phase 2) into the
product-grade version: real per-cycle-phase baselines, real bootstrap confidence intervals, real
Benjamini-Hochberg false-discovery-rate correction across every symptom pair tested — and an
18-month doctor export that renders client-side in under ten seconds. The locked architecture is
non-negotiable and this research does not revisit it: the correlation engine runs entirely on
device (ADR-004), and Gemini is reached only from the Cloudflare Worker, only to turn a finished
numeric finding into a sentence or a doctor-summary paragraph — never to compute the pattern or
score anything itself (CON-BUILD-03).

The most important finding from this research is what does **not** exist: there is no dedicated,
well-adopted npm package for Benjamini-Hochberg FDR correction, and `simple-statistics` — the best
general-purpose correlation/resampling library for this stack — has no native bootstrap-CI
function either. Both the FDR step-up procedure and the bootstrap-CI resampling loop must be
hand-written in this phase. That is correct, not a shortcut: the algorithms are short,
well-specified in the statistics literature, and directly testable against synthetic data with a
known answer — the same blind-test discipline (HACK-02/HACK-03) the project already trusts,
applied at unit-test grain. Everything *around* those two custom pieces — the correlation
primitive, the t-distribution math needed for a p-value, PDF rendering, and the native
file/share bridge — has a mature, verified, currently-maintained library, and hand-rolling any of
those would be the mistake.

The second major finding is a caution, not a recommendation: the exact current shape of the
Gemini API's structured-output request (which field names constrain the model to a JSON schema)
could not be pinned down with confidence in this session — two direct fetches of Google's own
official documentation page returned two different, apparently-coexisting API surfaces (a
`generateContent()` + `generationConfig` pattern this researcher's training data recognizes, and a
newer "Interactions API" pattern neither fetch could fully reconcile). This is flagged explicitly
rather than papered over (see State of the Art, Open Questions, Assumption A4) because guessing
wrong here fails at the exact moment code is written, which is the most expensive place to find
out.

**Primary recommendation:** Hand-roll only the Benjamini-Hochberg step-up procedure and a
*seeded* (deterministic) bootstrap-CI loop — nothing else does this end to end — built on top of
`simple-statistics` (correlation + resampling primitives) and `jstat` (t-distribution CDF for
p-values), with one unit test per synthetic planted-lag/null-pair fixture. Run the whole
computation inside a Web Worker so it never blocks the UI thread. Render the doctor PDF with
jsPDF's native vector-drawing API plus `jspdf-autotable` — never the `html2canvas` route, which is
the documented way to blow the 10-second budget. Call Gemini from the Worker via a direct `fetch()`
to the REST endpoint rather than the `@google/genai` SDK, and never trust its output unchecked:
verify the returned sentence echoes the exact numbers the engine computed, and fall back to a
fixed template — the same zero-improvisation philosophy this project already applies to crisis
text (SAFE-02) — on any mismatch, timeout, or quota failure.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Correlation engine (baselines, lag search, bootstrap, FDR) | Browser/Client (on-device, in a Web Worker) | — | ADR-004 locked: the engine reads the user's full history and must stay local; CON-BUILD-02 requires it be "deterministic... in TypeScript, not a neural black box" |
| Confidence-floor / "still learning" decision | Browser/Client | — | Part of the engine's own output, not a display-only concern — the gate reads the FDR-adjusted p-value and observation count, both computed on device |
| Insight-sentence phrasing | API/Backend (Cloudflare Worker) → Gemini | Browser/Client (deterministic template fallback) | Locked: "Gemini API called only from the Cloudflare Worker, and only for language" |
| "How do you know that?" explainer | Browser/Client | — | Recommendation: fixed methodology text + the already-computed structured numbers, not a second live Gemini round-trip. **Put to the team as a blocking decision in Plan 04-04 Task 2** rather than assumed — see Open Question 3/Assumption A6 |
| Doctor-export compilation (assemble 18 months of data) | Browser/Client | — | DOC-01 states the export is "generated client-side"; keeps the full raw health history off the network entirely |
| Doctor one-pager narrative prose | Browser/Client (deterministic, on device) — **Gemini variant deferred beyond Phase 4** | — | The project pitch says Gemini "writes the doctor summary from structured data", and that remains the eventual intent. **Phase 4 ships the deterministic `renderDoctorNarrative` only** (Plan 04-03), and the model-phrased variant is explicitly descoped — see Plan 04-04's "Descoped from this phase" for the reasoning (a second guarded schema plus a network round trip inside DOC-01's measured ten-second export budget) and for what re-adding it requires. DOC-02 is satisfied without it |
| PDF rendering | Browser/Client (in a Web Worker where possible) | — | DOC-01/NFR-105: client-side, ≤10s; avoids the Worker's CPU-time budget and its cold-start latency entirely |
| PDF file save + OS share sheet | Native bridge (Capacitor plugin) | Browser/Client (triggers it) | Filesystem/Share cross the Capacitor bridge per ADR-001; must run on the main thread, not inside the Web Worker (see Common Pitfalls) |
| Accounts, admin metrics | API/Backend (Worker) → D1 | — | Established in `hackathon/proposal.md`'s own "what runs where" table; D1 never holds health data |
| Health record storage (check-ins, measurements, cycle/phase tags) | Browser/Client (IndexedDB via Dexie) | — | ADR-004; leaves the device only as consented, derived numbers |

## Phase Requirements

<phase_requirements>

| ID | Description | Research Support |
|----|-------------|------------------|
| NOF1-01 | Per-user baselines for every metric, segmented by cycle phase; no population norms | Baseline-computation pattern with a sparse-phase shrinkage fallback (Code Example 1, Common Pitfall 5); field shapes cross-checked against `product/04-data-model.md`'s `MEASUREMENT`/`BASELINE_SET` design |
| NOF1-02 | Lagged associations across 1–14 day windows, using lagged cross-correlation, bootstrap confidence intervals and FDR correction, deterministic and explainable | Core stats stack (`simple-statistics` + `jstat`); hand-rolled BH-FDR and seeded bootstrap-CI, because no library does either end to end (Don't Hand-Roll; Code Examples 2–4) |
| NOF1-03 | A confidence floor suppresses any pattern below threshold and displays "still learning" | Confidence-gate discriminated-union type (Code Example 5); trustworthy-low-confidence-state UX pattern (Architecture Pattern 2) |
| NOF1-04 | Every reveal states observation count and signal strength in plain language | `Finding` type keeps statistical significance (the FDR-adjusted p-value, the actual gate) and effect-size band (`strength`, the label) as two separate fields — conflating them is Common Pitfall 2; Gemini-phrasing-with-fallback pattern (Code Example 6) |
| NOF1-05 | At least one pattern reveal per active user per week once sufficient data exists | This is a cadence/monitoring property, not a per-commit unit test — cross-references the PRD's own NFR-904 ("Monitor pattern-reveal suppression rate to detect an over-tight confidence floor"); see Validation Architecture |
| DOC-01 | One-tap gynaecology export: 18-month cycle history, interval statistics, bleeding log as PDF, client-side, ≤10s | jsPDF native-drawing-API pattern (not `html2canvas`), Web Worker offload, Standard Stack |
| DOC-02 | Doctor one-pager: symptom timeline, cycle history, medication log, guideline-cited test requests | Export-compiler pattern; `jspdf-autotable` for the tabular sections (interval stats, medication log) |
| DOC-03 | Name the tests she can request: fasting insulin, free testosterone, DHEAS, 75g OGTT, AMH | Verbatim from `REQUIREMENTS.md:133-134` and `product/00-PRD.md:475` — render as fixed literal strings in the template, never model-generated |
| DOC-04 | All app-derived physiological values in exports labelled explicitly as wellness trends, not clinical measurements | Template-level requirement — every numeric value's render path must carry the disclaimer; directly unit-testable (Validation Architecture) |

</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `simple-statistics` | 7.9.3 | `sampleCorrelation` (Pearson r), `sampleWithReplacement`/`sample` (resampling primitive for the bootstrap) | Zero dependencies, ~1.2M weekly downloads, purpose-built for exactly this combination `[VERIFIED: npm registry + simple-statistics.github.io/docs, package-legitimacy verdict OK]` |
| `jstat` | 1.9.6 | `jStat.studentt.cdf` (t-distribution CDF → p-value for a correlation), `jStat.spearmancoeff` (native Spearman rank correlation) | The only realistic route to an accurate correlation p-value without hand-rolling the incomplete-beta function `[VERIFIED: npm registry + jstat.github.io/all.html, package-legitimacy verdict OK]` |
| `jspdf` | 4.2.1 | Client-side PDF rendering via a native vector-drawing API (`text()`, `rect()`, `line()`, `splitTextToSize()`) | Actively maintained, ~14M weekly downloads, purpose-built for exactly DOC-01's client-side/≤10s requirement `[VERIFIED: npm registry + github.com/parallax/jsPDF, package-legitimacy verdict OK]` |
| `jspdf-autotable` | 5.0.8 | Tabular PDF sections (interval statistics, medication log, symptom timeline) with automatic multi-page pagination via `didDrawPage`/`willDrawPage` hooks | Official jsPDF companion plugin, ~3.8M weekly downloads `[VERIFIED: npm registry + github.com/simonbengtsson/jsPDF-AutoTable, package-legitimacy verdict OK]` |
| `@capacitor/filesystem` | **6.0.4** (pin — do not install `latest`, which resolves to the 8.x line) | Write the generated PDF to device storage | Official first-party Capacitor plugin; `6.0.4`'s `peerDependencies` require `@capacitor/core: ^6.0.0`, matching ADR-001's locked "Capacitor 6" `[VERIFIED: npm registry — checked `peerDependencies` directly]` |
| `@capacitor/share` | **6.0.4** (pin — same reason) | Hand the written file off to the OS share sheet (Gmail/Drive/WhatsApp on Android, Files/AirDrop on iOS) | Official first-party Capacitor plugin, same version-pin reasoning `[VERIFIED: npm registry — checked `peerDependencies` directly]` |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@google/genai` | 2.15.0 `[WARNING: flagged SUS by the package-legitimacy gate — see Package Legitimacy Audit before installing]` | Official current Gemini JS/TS SDK, if a Node-compatible SDK path is preferred over raw `fetch()` | Only if the Worker runs with the `nodejs_compat` compatibility flag and a quick spike confirms it works; otherwise prefer raw `fetch()` to the REST endpoint (see Architecture Patterns, Open Questions) |
| Cloudflare AI Gateway | — (a Cloudflare product feature, not an npm package) | Caches and observes the Worker's Gemini calls | Recommended low-effort addition on Rahul's infra path — one-line config gives free response caching (repeat phrasing requests) plus an analytics dashboard `[CITED: developers.cloudflare.com/ai-gateway]` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| jsPDF's native drawing API | `html2canvas` + jsPDF (screenshot a rendered DOM section into the PDF) | Easier to write, but rasterizes text, risks browser memory limits on long documents, and is the documented way to blow the ≤10s budget on a ₹10,000-class phone — avoid for this phase |
| `pdf-lib` | jsPDF + `jspdf-autotable` | `pdf-lib` gives lower-level control (editing/embedding existing PDFs) but has had no version published since **2021-11-06** `[VERIFIED: npm registry]` — functionally complete but effectively unmaintained. jsPDF's active maintenance and native table plugin fit a from-scratch report better |
| Hand-rolled t-distribution CDF | `jstat` | The incomplete-beta function underlying an accurate t-CDF is a classic numerical-methods trap — small errors concentrate exactly in the tails where FDR accept/reject decisions are made |
| `@google/genai` SDK | Raw `fetch()` to the Gemini REST endpoint | Removes the Node.js ≥20 / Workers-edge-runtime compatibility question entirely (unconfirmed either way this session), smaller Worker bundle, matches the pattern seen in several community Cloudflare-Worker Gemini-proxy repos |

**Installation:**
```bash
npm install simple-statistics jstat jspdf jspdf-autotable
npm install @capacitor/filesystem@6 @capacitor/share@6
```

**Version verification:** Every version above was confirmed via `npm view <pkg> version` and
`npm view <pkg>@6 peerDependencies` against the live registry during this research session
(2026-08-03), not read from training data. Re-run these commands again immediately before Phase 4
executes, since several months may pass between research and implementation.

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| `simple-statistics` | npm | mature, long-standing | ~1.2M/wk | github.com/simple-statistics/simple-statistics | OK | Approved |
| `jstat` | npm | mature | ~849k/wk | github.com/jstat/jstat | OK | Approved |
| `jspdf` | npm | mature, active | ~14.0M/wk | github.com/parallax/jsPDF | OK | Approved |
| `jspdf-autotable` | npm | active (v5 released 2026-05-17) | ~3.8M/wk | github.com/simonbengtsson/jsPDF-AutoTable | OK | Approved |
| `pdf-lib` | npm | last publish 2021-11-06 | ~10.5M/wk | github.com/Hopding/pdf-lib | OK | Approved — maintenance-status caveat, not a slop signal |
| `dexie` | npm | mature, active | ~2.1M/wk | github.com/dexie/Dexie.js | OK | Approved |
| `@capacitor/filesystem` | npm | mature, active | ~935k/wk | github.com/ionic-team/capacitor-filesystem | OK | Approved — **pin to `6.0.4`, not `latest` (8.x)** |
| `@capacitor/share` | npm | mature, active | ~829k/wk | github.com/ionic-team/capacitor-plugins | OK | Approved — **pin to `6.0.4`, not `latest` (8.x)** |
| `@google/genai` | npm | latest version published 2026-07-30 | ~17.8M/wk | github.com/googleapis/js-genai | **SUS** ("too-new") | Flagged — planner must add `checkpoint:human-verify` before install. Context: 17.8M weekly downloads and an official `googleapis` GitHub repo strongly suggest this is a false positive from a recent version bump, not low adoption — but only relevant if the SDK path is actually chosen over raw `fetch()` (see Standard Stack recommendation) |
| `vitest` | npm | latest version published 2026-07-06 | ~87.8M/wk | github.com/vitest-dev/vitest | **SUS** ("too-new") | Same false-positive pattern — keep, add checkpoint per protocol |
| `happy-dom` | npm | latest version published 2026-07-22 | ~13.5M/wk | github.com/capricorn86/happy-dom | **SUS** ("too-new") | Same false-positive pattern — keep, add checkpoint per protocol |
| `@testing-library/react` | npm | mature, active | ~51.6M/wk | github.com/testing-library/react-testing-library | OK | Approved |

**Packages removed due to [SLOP] verdict:** none.

**Packages flagged as suspicious [SUS]:** `@google/genai`, `vitest`, `happy-dom` — all three are
flagged purely for "too-new" (the *latest version's* publish timestamp is recent), not for low
adoption: each has between 13M and 88M weekly downloads and an official/canonical source
repository. This looks like a heuristic false positive triggered by normal, frequent releases from
actively-developed, foundational packages, not evidence of a supply-chain risk. Per protocol the
planner must still insert a `checkpoint:human-verify` task before each install; the actual risk
read from the evidence gathered here is low.

## Architecture Patterns

### System Architecture Diagram

```mermaid
flowchart TB
    subgraph DEVICE["ON DEVICE — locked: correlation logic never leaves the phone (ADR-004)"]
        IDB[("IndexedDB via Dexie<br/>check-ins, measurements,<br/>cycle-phase tags — Phase 3")]
        WRK["Web Worker<br/>(off the main thread)"]
        BASE["Per-phase baselines<br/>NOF1-01"]
        LAG["Lagged cross-correlation<br/>1-14 day windows — NOF1-02"]
        BOOT["Seeded bootstrap CI<br/>NOF1-02"]
        FDR["Benjamini-Hochberg<br/>FDR correction — NOF1-02"]
        GATE{"Clears confidence<br/>floor? NOF1-03"}
        STILL["'Still learning' state<br/>NOF1-03"]
        FINDING["Finding object:<br/>lag, direction, strength,<br/>observations, CI, p-value"]
        COMPILER["Export compiler<br/>18mo history + stats +<br/>timeline + meds + named tests"]
        PDFGEN["PDF renderer<br/>jsPDF + jspdf-autotable"]
    end

    subgraph WORKERAPI["CLOUDFLARE WORKER — locked: Gemini reached only from here, language only"]
        PROXY["Gemini proxy route<br/>system prompt: 'translate this<br/>number, do not reason about it'"]
        GUARD{"Output echoes the<br/>given numbers?"}
        TEMPLATE["Fixed-template<br/>fallback sentence<br/>(same philosophy as SAFE-02)"]
    end

    GEMINI[["Gemini API<br/>(language only, never scores<br/>or computes a pattern)"]]

    UICARD["Insight reveal card +<br/>'how do you know that?' panel"]
    UIEXPORT["Export button + result screen"]
    SHARE["Capacitor Filesystem + Share<br/>(main thread, native bridge)<br/>-> OS share sheet"]

    IDB --> WRK --> BASE --> LAG --> BOOT --> FDR --> GATE
    GATE -->|No| STILL --> UICARD
    GATE -->|Yes| FINDING
    FINDING -->|structured numbers only, no raw log data| PROXY
    PROXY --> GEMINI --> PROXY --> GUARD
    GUARD -->|No / error / timeout| TEMPLATE --> UICARD
    GUARD -->|Yes| UICARD
    FINDING -.->|"how do you know that?" — fixed<br/>methodology text, NOT a second<br/>Gemini call (recommendation)| UICARD

    IDB --> COMPILER --> PDFGEN --> UIEXPORT --> SHARE
    COMPILER -->|structured summary only| PROXY
```

A reader can trace the primary use case end to end: a check-in already stored in IndexedDB (Phase
3) feeds the Web Worker, which computes baselines, searches lags, bootstraps a CI, applies FDR
correction, and either suppresses ("still learning") or produces a `Finding`. Only the `Finding`'s
already-computed numbers — never raw logs — cross into the Worker for Gemini to phrase, and the
Worker never trusts that phrasing unchecked. The export path is a separate, parallel flow that
also stays on-device until the final Worker call for doctor-summary prose.

### Recommended Project Structure

```
src/
├── types/                       # Frozen contracts (HACK-01, Phase 1) — read, never redefine
│   ├── log-entry.ts
│   ├── finding.ts                # extend, don't replace — must express "not enough data" as a value
│   └── export-payload.ts         # shape unconfirmed in this repo as of this research — see Open Questions
├── engine/                       # NEW in Phase 4 — Dhodraj
│   ├── baseline.ts                # per-user, per-cycle-phase baselines (NOF1-01)
│   ├── lag-correlation.ts         # lagged cross-correlation, 1-14 day windows (NOF1-02)
│   ├── bootstrap.ts               # seeded bootstrap CI (NOF1-02)
│   ├── fdr.ts                     # Benjamini-Hochberg correction (NOF1-02)
│   ├── confidence-gate.ts         # floor logic, "still learning" (NOF1-03)
│   ├── engine.worker.ts           # Web Worker entry point wrapping the above
│   └── __tests__/
│       ├── fixtures/               # synthetic planted-lag + null-pair series — reuse HACK-02's generator
│       └── *.test.ts
├── export/                       # NEW in Phase 4 — Belson (trigger UI) + Dhodraj (compiler)
│   ├── compile-export-payload.ts  # assembles 18mo history into the export payload type
│   ├── render-pdf.ts              # jsPDF + jspdf-autotable, native drawing API only
│   └── __tests__/
└── components/
    ├── InsightCard.tsx             # reveal + "still learning" state — Belson
    ├── HowDoYouKnow.tsx            # methodology disclosure panel — Belson
    └── ExportButton.tsx            # one-tap trigger + result screen — Belson

worker/                           # Cloudflare Worker — Rahul deploys, Dhodraj owns the logic
├── routes/
│   └── phrase-finding.ts          # Gemini proxy: finding -> sentence; structured data -> doctor prose
├── prompts/
│   └── phrase-finding.prompt.ts   # system prompt + guardrails ("translate, do not reason")
└── __tests__/
```

### Pattern 1: On-device engine in a Web Worker, not the main thread

**What:** Run the entire baseline/lag-search/bootstrap/FDR pipeline inside a Web Worker rather than
on React's main thread.
**When to use:** Always, for this engine. `PROJECT.md`'s own performance budget gives the engine a
hard **≤5 second** ceiling "over 18 months of data" `[VERIFIED: PROJECT.md:181-183 — "pattern
reveal ≤5s over 18 months of data"]` on a ₹10,000-class Android phone; running that synchronously
on the main thread risks visible jank or an ANR warning.
**Caveat found this session:** Capacitor plugin calls (e.g. `@capacitor/filesystem`,
`@capacitor/share`) do not reliably reach native code from inside a Web Worker — only pure
JavaScript computation is safe there `[CITED: github.com/ionic-team/capacitor/issues/6309]`.
IndexedDB itself is a standard Web API and works fine inside a worker with no Capacitor bridge
involved, so the engine can read Dexie data directly from the worker; only the later PDF-save/share
step must happen back on the main thread.

### Pattern 2: The "trustworthy low-confidence" card, applied to "still learning"

**What:** UX research on AI/ML dashboards converges on five parts for a trustworthy
prediction/insight card: the finding itself, an explicit plain-language confidence signal (not a
raw number), a short explanation of what drives that label, a path to verify the evidence, and a
defined fallback state for when the system cannot answer reliably
`[CITED: cross-referenced across multiple dashboard-UX sources found via WebSearch]`.
**When to use:** This maps directly onto NOF1-03/04's requirements: finding = the phrased sentence;
confidence signal = the `strength` label ("weak"/"moderate"/"strong"); explanation = the
observation count in plain language (FR-404's own example, "12 observations, weak signal"); the
verification path = the "how do you know that?" panel; the fallback state = "still learning".
Design the reveal card and the confidence-gate type together (Code Example 5) so all five parts
exist by construction, not bolted on afterward.

### Pattern 3: Deterministic-template fallback for every Gemini call

**What:** Every Worker route that calls Gemini must check its own output before showing it, and
fall back to a fixed, human-reviewed template sentence on any mismatch, error, timeout, or quota
failure.
**When to use:** Always, for both the insight-phrasing call and the doctor-summary call. This
research did not find this pattern in general prompt-engineering literature — it is this
project's own established design philosophy, already applied to crisis text (`SAFE-02`: "Generated
text appears on no crisis path under any circumstance" `[VERIFIED: REQUIREMENTS.md:141-142]`),
extended here to a much lower-stakes but still trust-critical surface. A cheap, concrete guard:
verify the model's returned sentence contains the exact `observations` and `lagDays` numbers the
engine computed (Code Example 6) before trusting it.

### Pattern 4: "How do you know that?" as a static disclosure, not a second Gemini call

**What:** Recommendation (unconfirmed — see Open Questions/Assumption A6): answer "how do you know
that?" with a fixed, human-reviewed paragraph explaining the *method* (lagged cross-correlation +
bootstrap CI + FDR correction, in plain language) plus the finding's own already-computed
structured numbers — never a fresh live Gemini call.
**When to use:** This is a direct, low-risk extension of `CON-BUILD-02`'s "deterministic and
explainable" requirement `[VERIFIED: PROJECT.md:173-175]` and avoids a second unnecessary
model round-trip (latency, cost, and one more surface where the model could invent something).
Confirm this reading with Dhodraj/Satheesh before locking it into a plan — a live interactive Q&A
might be the team's actual intent.

### Anti-Patterns to Avoid

- **`html2canvas` + jsPDF for the doctor export:** rasterizes text to an image before embedding it
  — slow, blurry, and the documented way to miss the ≤10s budget on long documents `[CITED:
  multiple jsPDF-focused sources found via WebSearch]`. Use jsPDF's native drawing API instead.
- **Installing `@capacitor/filesystem`/`@capacitor/share` at `latest`:** resolves to the 8.x line,
  which requires `@capacitor/core ^8.0.0` — a hard peer-dependency conflict with ADR-001's locked
  Capacitor 6 `[VERIFIED: npm registry `peerDependencies` check]`.
  Pin explicitly to `6.0.4`.
- **Testing every symptom pair at every one of 14 lags as 14 independent hypotheses:** with
  CHK-02's ~15 curated symptom dimensions `[VERIFIED: REQUIREMENTS.md:103-104]`, that is
  C(15,2) × 14 ≈ 1,470 tests — a huge, easy-to-get-wrong multiple-testing family (see Common
  Pitfall 4).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PDF file format generation | A hand-rolled PDF byte-stream writer | `jsPDF` (+ `jspdf-autotable`) | PDF is a complex binary/text hybrid spec (xref tables, object streams, font embedding) — reinventing it wastes the entire ≤10s budget on plumbing instead of content |
| t-distribution CDF / p-value from a correlation coefficient | A hand-rolled incomplete-beta-function or t-CDF approximation | `jstat`'s `studentt.cdf` | A numerically tricky special function; small errors concentrate in the tails, exactly where FDR accept/reject decisions happen |
| Client-side file save + native share sheet | Custom native Swift/Kotlin plugins for file I/O and sharing | `@capacitor/filesystem` + `@capacitor/share` | ADR-001 already established Capacitor for exactly this kind of native-bridge capability — these are the official first-party plugins |
| Seeded PRNG for the bootstrap | A brand-new bespoke random-number generator | Whichever seeded-RNG utility Phase 1/2 already built for the blind-test dataset generator (`HACK-02`: "runs the generator with a random seed" `[VERIFIED: REQUIREMENTS.md:22-23]`), or a well-known tiny algorithm (e.g. mulberry32) if none exists yet | HACK-02 already establishes a "roll with a random seed" convention in this codebase — reuse it for consistency rather than introducing a second seeding scheme |

**Key insight:** The two things this phase *must* hand-roll — the Benjamini-Hochberg step-up
procedure and the bootstrap-CI resampling loop — have no dedicated, well-adopted npm package (this
research found none on npm for either, only R and Python implementations). That is the correct
place to write custom code: both algorithms are short, precisely specified in the statistics
literature, and directly testable against synthetic data with a known ground truth — the same
blind-test discipline `HACK-03` already applies end to end, now applied at unit-test grain.
Everything else in this phase — PDF bytes, distribution math, the native file/share bridge — has a
mature, verified library; hand-rolling those would be the actual mistake.

## Common Pitfalls

### Pitfall 1: Non-seeded bootstrap breaks determinism
**What goes wrong:** Using `Math.random()` inside the bootstrap-resampling loop means the same
finding produces a different confidence interval on every run.
**Why it happens:** It is the path of least resistance — every bootstrap tutorial uses
unseeded randomness because reproducibility usually doesn't matter for a one-off analysis.
**How to avoid:** Use a seeded PRNG (Code Example 4) and store the seed alongside the finding, so
"how do you know that?" can, in principle, reproduce the exact interval shown.
**Warning signs:** A finding's stated confidence interval changes between app sessions with no new
data logged.

### Pitfall 2: Conflating statistical significance with effect size
**What goes wrong:** FR-404's own example text — "12 observations, weak signal" — mixes an
observation count (a power/significance proxy) with "weak" (an effect-size word). If the engine's
`surfaced`/`still-learning` gate is implemented by checking `strength` instead of the FDR-adjusted
p-value, a *large* but statistically insignificant correlation from a handful of coincidental
observations could surface as a confident-looking "strong signal."
**Why it happens:** The two concepts sound similar in plain language.
**How to avoid:** Keep them as two separate fields on the `Finding` type (Code Example 5):
`fdrAdjustedPValue` (or a boolean derived from it) is the *only* thing the confidence gate reads;
`strength` is a *label* computed from `|r|` and shown only once a finding has already cleared the
gate.
**Warning signs:** A "still learning" pattern with a huge headline `|r|`, or a "strong signal" label
on a pattern with very few observations.

### Pitfall 3: Pearson correlation on ordinal severity data
**What goes wrong:** Symptom severity in this product is a small ordinal scale (per
`product/04-data-model.md`'s `SYMPTOM_ENTRY.severity: int` `[VERIFIED:
product/04-data-model.md:44-47]`), not a continuous measurement. Naive Pearson correlation assumes
roughly interval-scaled, linearly-related data, which a 1–5 severity rating does not strictly
satisfy.
**Why it happens:** Pearson's `r` is the default correlation everyone reaches for first.
**How to avoid:** Rank-transform both series and run Pearson on the ranks — this *is* Spearman's
rank correlation and needs no extra dependency (Code Example 2). `jstat` also exposes
`spearmancoeff` natively as a cross-check.
**Warning signs:** A "finding" driven by one or two extreme severity spikes that dominate a Pearson
`r` but would not survive a rank-based test.

### Pitfall 4: Multiple-testing scale explodes without a clear correction unit
**What goes wrong:** With CHK-02's ~15 curated symptom dimensions `[VERIFIED:
REQUIREMENTS.md:103-104]`, testing every pair at every one of 14 lags independently is
C(15,2) × 14 ≈ 1,470 simultaneous hypotheses. Applying FDR correction across that whole grid, versus
across one summary-per-pair (its best lag only), produces materially different suppression
behavior.
**Why it happens:** It's ambiguous by default which "family" of tests the correction should be
computed over.
**How to avoid:** This research recommends correcting across **one test per variable pair** — the
lag with maximum `|r|` for that pair (Code Example 2's `bestLag`) — which also matches the
product's own single-lag framing ("two to three days after"). Confirm this choice explicitly with
Dhodraj before implementation (Open Question 6); it is a genuine methodological decision, not a
settled fact.
**Warning signs:** "Still learning" appears far more (or far less) often than expected once real
usage data accumulates — cross-reference against `NFR-904`'s suppression-rate monitor.

### Pitfall 5: Sparse per-phase baselines for irregular cycles
**What goes wrong:** `CYCL-03` explicitly supports irregular, oligomenorrhea and amenorrhea cycle
states `[CITED: REQUIREMENTS.md:85-86]`. A user with very long or absent cycles may have very few
(or zero) days tagged with, say, a "luteal" phase for months, making a phase-specific baseline for
that phase statistically unstable or undefined.
**Why it happens:** `NOF1-01`'s "segmented by cycle phase" requirement implicitly assumes enough
data exists in every phase, which is not true for exactly the population this product serves.
**How to avoid:** Define a minimum-observations threshold per phase; below it, shrink to (fall back
on) the user's whole-history baseline rather than computing an unstable phase-specific one (Code
Example 1).
**Warning signs:** A baseline computed from 2–3 data points; wildly different baselines for
adjacent phases with no plausible physiological reason.

### Pitfall 6: `html2canvas` + jsPDF blows the 10-second budget
**What goes wrong:** Rendering a DOM section to a canvas image and embedding that image in the PDF
is the most commonly-tutorialized jsPDF pattern, but it is slow and memory-heavy on long documents.
**Why it happens:** It requires the least PDF-specific knowledge — "just screenshot what's on
screen."
**How to avoid:** Use jsPDF's native `text()`/`rect()`/`line()` drawing calls plus
`jspdf-autotable` for tables — this produces smaller, crisper, faster output `[CITED: multiple
jsPDF-focused sources found via WebSearch]`.
**Warning signs:** PDF generation time scaling noticeably with the number of on-screen elements
rather than with the amount of underlying data.

### Pitfall 7: Capacitor plugin version mismatch
**What goes wrong:** A plain `npm install @capacitor/filesystem` today resolves to the 8.x line
(even a `8.2.0-next.2` prerelease was observed on the registry), which declares a peer dependency
on `@capacitor/core ^8.0.0` — incompatible with ADR-001's locked Capacitor 6 shell `[VERIFIED: npm
registry `peerDependencies` for `@capacitor/filesystem@6.0.4` vs `latest`]`.
**Why it happens:** `npm install` without a version pin always takes `latest`.
**How to avoid:** Pin explicitly: `@capacitor/filesystem@6` and `@capacitor/share@6`.
**Warning signs:** A peer-dependency warning at install time, or a runtime plugin-not-registered
error on device.

### Pitfall 8: A stray exported PDF outside the encrypted health-data boundary
**What goes wrong:** `PRIV-05` requires data at rest to be AES-256-encrypted with keys in Secure
Enclave/Android Keystore `[VERIFIED: REQUIREMENTS.md:193-196 — "Data at rest is AES-256 with keys
in Secure Enclave or Android Keystore"]`, but that guarantee covers the IndexedDB store built in
Phase 3 — it does **not** automatically extend to a brand-new PDF file written via
`@capacitor/filesystem`. Writing it to a public/shared directory (e.g. Android's public
Downloads, iOS's Documents folder as exposed via Files) leaves a plaintext bundle of her health
history outside the app's own sandbox.
**Why it happens:** The export is a new artifact this phase introduces; the existing
data-at-rest guarantee doesn't automatically follow it without deliberate placement.
**How to avoid:** Write the PDF to the app's private cache/data directory, hand that file URI
directly to the share sheet, and delete (or apply a short TTL to) the file once sharing completes
or the export screen closes.
**Warning signs:** The exported file is still readable from a file manager or another app well
after the export flow has finished.

### Pitfall 9: Gemini phrasing drifts into causal or diagnostic language
**What goes wrong:** A phrase like "your sleep **causes** your skin to flare" overstates what a
correlation can say, and drifts toward the causal/diagnostic language this product is
contractually not allowed to produce.
**Why it happens:** LLMs default to confident, persuasive phrasing over calibrated accuracy unless
explicitly instructed otherwise `[CITED: cross-referenced prompt-engineering sources found via
WebSearch]`.
**How to avoid:** The system prompt must explicitly forbid causal language and require strictly
correlational framing ("tends to happen after," never "causes"), matching the phase description's
own framing verbatim: "without letting the model add unstated certainty or invent a causal claim."
Pair this with the numeric-echo guardrail (Pattern 3) as a second line of defense.
**Warning signs:** Any phrased sentence containing "causes," "because of," "triggered by," or a
degree of certainty (e.g. "will," "always") the underlying statistics do not support.

## Code Examples

### 1. Per-phase baseline with a sparse-phase fallback (NOF1-01)
```typescript
// Source: this research's synthesis, built on simple-statistics primitives
import * as ss from "simple-statistics";

interface PhaseBaseline { mean: number; sd: number; n: number; }

const MIN_PHASE_N = 8; // below this, shrink to the whole-history baseline — see Pitfall 5

function computePhaseBaselines(
  observations: { value: number; phaseTag: string }[]
): Record<string, PhaseBaseline> {
  const overall = describe(observations.map((o) => o.value));
  const byPhase = groupBy(observations, (o) => o.phaseTag);

  const baselines: Record<string, PhaseBaseline> = {};
  for (const [phase, obs] of Object.entries(byPhase)) {
    const values = obs.map((o) => o.value);
    baselines[phase] = values.length >= MIN_PHASE_N ? describe(values) : overall;
  }
  return baselines;
}

function describe(values: number[]): PhaseBaseline {
  return { mean: ss.mean(values), sd: ss.standardDeviation(values), n: values.length };
}

function groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const key = keyFn(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {});
}
```

### 2. Lagged cross-correlation via rank-transform (Spearman) + best-lag selection (NOF1-02)
```typescript
// Source: this research's synthesis, built on simple-statistics primitives
import { sampleCorrelation } from "simple-statistics";

// Rank-transform turns Pearson into Spearman's rank correlation — appropriate for
// ordinal 1-5 severity scales (see Pitfall 3). No extra dependency needed.
function rankTransform(values: number[]): number[] {
  const ranked = values.map((v, i) => [v, i] as const).sort((a, b) => a[0] - b[0]);
  const ranks = new Array<number>(values.length);
  ranked.forEach(([, originalIndex], rank) => { ranks[originalIndex] = rank + 1; });
  return ranks;
}

function spearman(x: number[], y: number[]): number {
  return sampleCorrelation(rankTransform(x), rankTransform(y));
}

interface LagResult { lagDays: number; r: number; n: number; }

// For each candidate lag 1..14, shift B forward by lagDays and correlate against A
// using only overlapping paired days.
function searchLags(
  seriesA: { day: number; value: number }[],
  seriesB: { day: number; value: number }[],
  maxLag = 14
): LagResult[] {
  const byDayB = new Map(seriesB.map((o) => [o.day, o.value]));
  const results: LagResult[] = [];

  for (let lag = 1; lag <= maxLag; lag++) {
    const pairedA: number[] = [];
    const pairedB: number[] = [];
    for (const a of seriesA) {
      const bValue = byDayB.get(a.day + lag);
      if (bValue !== undefined) { pairedA.push(a.value); pairedB.push(bValue); }
    }
    if (pairedA.length >= 3) {
      results.push({ lagDays: lag, r: spearman(pairedA, pairedB), n: pairedA.length });
    }
  }
  return results;
}

// Recommended: correct across ONE test per pair — its best lag — not all 14
// independently. See Common Pitfall 4 and Open Question 6.
function bestLag(results: LagResult[]): LagResult | null {
  return results.reduce<LagResult | null>(
    (best, cur) => (!best || Math.abs(cur.r) > Math.abs(best.r) ? cur : best),
    null
  );
}
```

### 3. P-value via jstat + Benjamini-Hochberg FDR correction (NOF1-02)
```typescript
// Source: this research's synthesis — the BH formula itself is cross-corroborated
// standard statistics (Benjamini & Hochberg, 1995); no npm package implements it.
import jStat from "jstat";

function correlationPValue(r: number, n: number): number {
  if (n <= 2) return 1;
  const t = r * Math.sqrt((n - 2) / (1 - r * r));
  return 2 * (1 - jStat.studentt.cdf(Math.abs(t), n - 2)); // two-tailed
}

interface Testable { pValue: number; }

// Benjamini-Hochberg step-up procedure. q = target false discovery rate (e.g. 0.05).
// Returns the subset of tests that clear the FDR-adjusted threshold.
function benjaminiHochberg<T extends Testable>(tests: T[], q = 0.05): Set<T> {
  const m = tests.length;
  const ranked = [...tests].sort((a, b) => a.pValue - b.pValue);
  let largestK = 0;
  ranked.forEach((test, i) => {
    const k = i + 1;
    if (test.pValue <= (k / m) * q) largestK = k;
  });
  return new Set(ranked.slice(0, largestK));
}
```

### 4. Seeded (deterministic) bootstrap confidence interval (NOF1-02)
```typescript
// Source: this research's synthesis. mulberry32 is a well-known, dependency-free
// seedable PRNG — reuse whatever seeded-RNG utility Phase 1/2 built for HACK-02's
// blind-test generator instead of introducing a second seeding scheme, if one exists.
function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface BootstrapCI { lower: number; upper: number; }

// Percentile bootstrap CI. MUST use a seeded RNG — Math.random() here would make
// the same finding produce a different CI on every run, breaking CON-BUILD-02's
// "deterministic" requirement. See Common Pitfall 1.
function bootstrapCorrelationCI(
  x: number[], y: number[], seed: number, iterations = 1000, alpha = 0.05
): BootstrapCI {
  const rng = mulberry32(seed);
  const n = x.length;
  const resampledRs: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const idx = Array.from({ length: n }, () => Math.floor(rng() * n));
    resampledRs.push(sampleCorrelation(idx.map((j) => x[j]), idx.map((j) => y[j])));
  }

  resampledRs.sort((a, b) => a - b);
  const lowerIdx = Math.floor((alpha / 2) * iterations);
  const upperIdx = Math.ceil((1 - alpha / 2) * iterations) - 1;
  return { lower: resampledRs[lowerIdx], upper: resampledRs[upperIdx] };
}
```

### 5. The confidence-gate / "still learning" type (NOF1-03, NOF1-04)
```typescript
// Source: this research's synthesis. Extends the frozen `finding` type from HACK-01
// (Phase 1) — field names follow product/04-data-model.md's INSIGHT entity shape
// (pattern, lag_days, strength, observations, surfaced) [VERIFIED:
// product/04-data-model.md:69-75] but the ACTUAL frozen src/types/ file does not
// exist in this repo yet — verify against it once Phase 1 has run (Open Question 2).
type SignalStrength = "weak" | "moderate" | "strong";

type Finding =
  | { status: "still-learning"; variableA: string; variableB: string; observations: number }
  | {
      status: "surfaced";
      variableA: string;
      variableB: string;
      lagDays: number;
      direction: "positive" | "negative";
      strength: SignalStrength;        // effect-size band from |r| — the LABEL only
      observations: number;             // n used in the test
      confidenceInterval: BootstrapCI;
      fdrAdjustedPValue: number;        // the gate's OWN basis — never `strength` (Pitfall 2)
    };

// Illustrative anchor from hackathon/proposal.md's own example text ("12
// observations, weak signal") — a product/engineering choice, not a derived
// statistical minimum. Tune per NFR-904's suppression-rate monitoring (Assumption A2).
const MIN_OBSERVATIONS = 12;

function toFinding(
  variableA: string, variableB: string, best: LagResult,
  ci: BootstrapCI, fdrAdjustedP: number, clearsFDR: boolean
): Finding {
  if (best.n < MIN_OBSERVATIONS || !clearsFDR) {
    return { status: "still-learning", variableA, variableB, observations: best.n };
  }
  return {
    status: "surfaced", variableA, variableB, lagDays: best.lagDays,
    direction: best.r >= 0 ? "positive" : "negative",
    strength: strengthBand(best.r), observations: best.n,
    confidenceInterval: ci, fdrAdjustedPValue: fdrAdjustedP,
  };
}

// Cohen's (1988) between-subjects convention, borrowed here for an n-of-1 context —
// no n-of-1-specific standard exists; treat as a tunable default (Assumption A1).
function strengthBand(r: number): SignalStrength {
  const abs = Math.abs(r);
  if (abs >= 0.5) return "strong";
  if (abs >= 0.3) return "moderate";
  return "weak";
}
```

### 6. Gemini Worker call with a deterministic-template fallback (Gemini proxy)
```typescript
// Source: this research's synthesis. Calls the Gemini REST endpoint directly via
// fetch() -- no @google/genai SDK dependency (sidesteps the unconfirmed Node>=20 /
// edge-runtime question — Open Question 4). CONFIRM the exact endpoint path and
// request-body field names against live ai.google.dev docs before implementing —
// two fetches in this same research session produced conflicting evidence (see
// State of the Art, Assumption A4). Treat the body shape below as illustrative only.
async function phraseFinding(
  finding: Extract<Finding, { status: "surfaced" }>,
  env: { GEMINI_API_KEY: string }
): Promise<string> {
  const prompt = buildPhrasingPrompt(finding); // system prompt forbids causal language
                                                 // and unstated certainty — Pitfall 9
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const data = await res.json();
    const sentence = extractText(data);
    // Guardrail: if the model's sentence doesn't echo the exact numbers we gave it,
    // don't trust it — fall back to the fixed template (Pattern 3).
    if (!sentence || !containsExpectedNumbers(sentence, finding)) {
      return templateFallback(finding);
    }
    return sentence;
  } catch {
    return templateFallback(finding); // network/quota failure — never block the reveal
  }
}

// Zero-LLM-improvisation fallback — same philosophy as the crisis-text path (SAFE-02).
function templateFallback(f: Extract<Finding, { status: "surfaced" }>): string {
  const direction = f.direction === "positive" ? "more" : "less";
  return `Your ${f.variableB} tends to be ${direction} ${f.lagDays} day(s) after your ` +
    `${f.variableA} changes, based on ${f.observations} observations (${f.strength} signal).`;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| `@google/generative-ai` (the older Gemini SDK package name many existing tutorials/training data reference) | `@google/genai` (unified SDK) | Before this research date; exact cutover not confirmed this session | Any code example or tutorial referencing `@google/generative-ai` should be treated as potentially stale — this research confirmed `@google/genai` as current via the official `ai.google.dev` docs and the `googleapis/js-genai` GitHub repo `[VERIFIED: WebFetch of both, npm registry existence + version]` |
| Gemini `generateContent()` + `generationConfig: { responseMimeType, responseSchema }` (camelCase — this researcher's pre-2026 training knowledge) | Possibly a newer "Interactions API" (`client.interactions.create()`) with a `response_format: { type, mime_type, schema }` (snake_case) shape | **Unconfirmed** — two direct fetches of the same official docs page in this session returned different answers | **Do not hard-code either field-name pattern.** Re-verify against live `ai.google.dev` docs immediately before writing this code (Assumption A4, Open Question 5) |
| Cloudflare Workers' original story of a hard, tiny CPU-time ceiling | Workers now polyfill many Node.js built-ins behind the `nodejs_compat` compatibility flag, and the Paid plan allows up to 5 minutes of CPU time per request (default 30s) | Rollout ongoing through 2025 into 2026 per Cloudflare's own blog `[CITED: developers.cloudflare.com blog, fetched via WebSearch]` | May resolve the `@google/genai`-in-Workers compatibility question directly — worth a 15-minute spike before committing to the raw-`fetch()`-only recommendation |
| `pdf-lib`'s older single-maintainer cadence | No `pdf-lib` release since **2021-11-06** `[VERIFIED: npm registry]`; the ecosystem's actively-maintained fork is `@cantoo/pdf-lib` (v2.8.1, adds SVG support) | Ongoing since ~2021 | If pixel-level PDF editing/embedding is ever needed beyond what jsPDF+autotable covers, prefer the fork over the original for anything requiring active maintenance |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Cohen's (1988) between-subjects effect-size bands (weak <0.3, moderate 0.3–0.5, strong ≥0.5) are an acceptable default for the n-of-1 `strength` label | Code Example 5, NOF1-04 | Bands may not match clinical/user expectations for a personal signal; `NFR-904` already anticipates tuning after real usage, so risk is moderate, not severe — but the planner should not treat these thresholds as fixed |
| A2 | 12 observations (from `hackathon/proposal.md`'s own illustrative example text) is treated as a starting engineering choice for the confidence floor, not a derived statistical minimum | Code Example 5, NOF1-03 | Wrong threshold shows patterns too early (false positives) or suppresses real ones too long ("still learning" persists past the point real signal exists) |
| A3 | Simple pairwise-complete-observations lag-shift (rather than a true irregular-sampling method like ZDCF) is an acceptable approximation for a daily check-in cadence with occasional gaps | Architecture Patterns, NOF1-02 | If gap rates are high (e.g. during extended pause mode, `CHK-04`), correlation estimates could be biased; a data-quality/gap-rate check before trusting a finding may be warranted, short of a full ZDCF rewrite |
| A4 | The Gemini API's exact structured-output request field names could not be confirmed — two fetches of the same official docs page in this session conflicted | Code Example 6, State of the Art | Wrong field names silently fail to constrain output, or throw a runtime error — **must** be re-verified against live docs before implementation, not trusted from this research |
| A5 | `@google/genai`'s Cloudflare Workers/edge-runtime compatibility is unconfirmed; this research recommends raw `fetch()` specifically to avoid needing an answer | Standard Stack, Open Questions | If the SDK is used anyway without confirming Workers compatibility, a Node-runtime-only dependency inside it could fail at Worker deploy time or first invocation, discovered late |
| A6 | "How do you know that?" is answered by a fixed methodology template plus already-computed structured numbers, **not** a second live Gemini call | Architecture Patterns (Pattern 4) | This is this researcher's synthesis of `CON-BUILD-02`/`CON-BUILD-03`'s stated philosophy, not a decision the team has explicitly locked for this specific UI moment — confirm with Dhodraj/Satheesh before planning, since a live follow-up Q&A UX may be the actual intent |
| A7 | The shape of the frozen `export payload` type (from `HACK-01`, Phase 1) is not yet defined anywhere in this repo | Open Questions, Recommended Project Structure | Phase 4 planning must read the actual `src/types/` file once Phase 1–3 have executed rather than assume a shape; this research could only reason from the `INSIGHT`/`MEASUREMENT` entities in `product/04-data-model.md`, which describe the general data model, not necessarily the literal frozen wire type |

**If this table is empty:** N/A — see entries above; all should be confirmed before or during
planning, several explicitly flagged for confirmation with specific team members.

## Open Questions

> **Resolution status (added during Phase 4 planning, revision 2):** all six questions below are
> resolved by the plan set. Each carries a `(RESOLVED)` line naming the plan and task that closes
> it. Questions 1, 3 and 6 are closed by blocking `checkpoint:decision` tasks rather than by a
> planner's assumption, because each is a decision with consequences the team has to own — and
> question 3 in particular was flagged in this research for team confirmation and had been silently
> assumed by the first planning pass.

1. **Does `PRIV-01`'s consent architecture (Phase 3) cover sending abstracted pattern data to
   Gemini?**
   - **(RESOLVED)** by Plan 04-04 Task 1, a blocking `checkpoint:decision` put to Dhodraj and
     Satheesh before any phrasing call is wired in. The plan implements a seventh consent class
     `ai_phrasing` with a first-use disclosure unless the checkpoint redirects it.
   - What we know: `PRIV-01` requires "purpose-bound granular consent... per data class," and lists
     exactly six data classes — cycle and symptom data, camera sensing, skin images, mental-health
     screeners, mycyclesafe import, microphone `[VERIFIED: REQUIREMENTS.md:181-184]`.
   - What's unclear: none of those six classes obviously names "send an abstracted numeric finding
     to a third-party LLM for phrasing."
   - Recommendation: confirm with the team whether this is already covered under "cycle and
     symptom data" consent, or needs its own consent class, before Phase 4 wires a default
     Gemini call into the reveal path.

2. **What is the exact shape of the frozen `finding` and `export payload` types?**
   - **(RESOLVED)** by Plan 04-01 Task 1 and Plan 04-03 Task 1, both of which read the real
     `src/types/finding.ts` and `src/types/export-payload.ts` from Phase 1 before writing anything,
     extend them additively only, and state in their `<interfaces>` blocks that the frozen file on
     disk wins over any shape written in this research.
   - What we know: `HACK-01` (Phase 1) freezes three types; the finding type must express "not
     enough data" as a value of the type. `product/04-data-model.md`'s `INSIGHT` entity
     (`pattern`, `lag_days`, `strength`, `observations`, `surfaced`) `[VERIFIED:
     product/04-data-model.md:69-75]` is the closest available reference.
   - What's unclear: neither type exists in this repo yet — no `src/` directory was found at all
     during this research session.
   - Recommendation: Phase 4 planning must read `src/types/` once Phase 1 has actually executed,
     and treat this research's Code Example 5 as illustrative, not authoritative.

3. **Is "how do you know that?" a static disclosure or a live follow-up Q&A?**
   - **(RESOLVED)** by Plan 04-04 Task 2, a blocking `checkpoint:decision` put to Satheesh and
     Dhodraj — the two people this research named — immediately before the panel is built in
     Plan 04-04 Task 4. Assumption A6 is therefore a recommendation carried into a checkpoint, not
     a design silently inherited. Worth recording why the checkpoint exists: the first Phase 4
     planning pass baked the static-panel design straight in, and a plan review caught that the
     team had never actually been asked. If the checkpoint selects a live Q&A, Task 4 is replanned
     rather than edited — it is a different schema, a different guard and a different threat model.
   - See Assumption A6. Recommendation carried into the checkpoint: the static panel, because a
     generated explanation of a deterministic method cannot be echo-guarded against anything and
     would be the only path in the phase where her free text crosses the network.

4. **Does `@google/genai` actually work inside a Cloudflare Worker with `nodejs_compat` enabled?**
   - **(RESOLVED — question retired rather than answered)** by Plan 04-04 Task 3: the route calls
     the Gemini REST endpoint with a plain `fetch`, the SDK is not installed, and an acceptance
     criterion asserts it is absent from `package.json`. The SDK's SUS legitimacy verdict and its
     unconfirmed edge-runtime story both stop mattering.
   - What we know: the SDK states a Node.js ≥20 requirement; Workers now polyfill many Node
     built-ins behind that compatibility flag.
   - What's unclear: no direct confirmation either way was found this session.
   - Recommendation: either spike this quickly (roughly 15 minutes — install the SDK in a Worker
     with the flag on, try one call) or skip the question entirely by using raw `fetch()` to the
     REST endpoint, which this research recommends as the default regardless.

5. **What is the current, correct Gemini structured-output request shape?**
   - **(RESOLVED procedurally — the answer is fetched, not stored)** by Plan 04-04 Task 3, which
     requires the live `ai.google.dev` shape to be confirmed at implementation time, treats this
     research's Code Example 6 as illustrative only, records the confirmation date at the top of
     `worker/routes/phrase-finding.ts`, and has a verify gate reading that date back. If the shape
     cannot be confirmed, the task stops rather than guesses.
   - See Assumption A4 and State of the Art. Recommendation: re-verify against live
     `ai.google.dev` docs immediately before implementation; do not trust either pattern surfaced
     in this research session without a fresh check on the day of coding.

6. **Should FDR correction apply per-pair (at its best lag) or per-pair-per-lag (the full grid)?**
   - **(RESOLVED)** by Plan 04-02 Task 1, a blocking `checkpoint:decision` put to Dhodraj and
     Satheesh, whose selected family is then implemented and named with its size in
     `docs/engine-methodology.md` by Plan 04-02 Task 2. The choice is marked one-way in that plan,
     because it fixes what `INSIGHT.surfaced` means for every finding already stored or exported.
   - What we know: with ~15 symptom dimensions `[VERIFIED: REQUIREMENTS.md:103-104]`, naively
     testing all pairs (~105) × 14 lags ≈ 1,470 tests, versus ~105 tests if corrected per-pair at
     the best lag.
   - What's unclear: which convention the team intends — both are statistically defensible, but
     produce different suppression behavior.
   - Recommendation: this research recommends per-pair-at-best-lag (matches the product's own
     single-lag framing). Confirm with Dhodraj before implementation — this has real,
     user-visible consequences for how often "still learning" appears (Common Pitfall 4).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js / npm (this research sandbox) | Build tooling, package verification | ✓ | Node v22.16.0 | — |
| npm registry reachability (this sandbox) | Version/legitimacy verification performed in this research | ✓ | — | — |
| Git repository | Committing this research and all Phase 4 work | ✓ (`git status` shows branch `main`, tracking `origin/main`) | — | — |
| Cloudflare account, Workers, D1, Gemini API key in Worker secrets | Gemini proxy route, doctor-summary generation | Assumed already provisioned by Phase 1/2 — `hackathon/build-plan.md` states these are set up before the hackathon weekend `[CITED: hackathon/build-plan.md — "Cloudflare account, Pages, Workers, D1 provisioned. Gemini key in Worker secrets"]` | — | If Phase 2 has not actually completed this provisioning by the time Phase 4 executes, the Gemini-phrasing path is blocked entirely — verify before planning tasks that assume it |
| Android/iOS toolchain on the team's four machines, demo phone | Building/testing the Capacitor app | **Not audited here** — explicitly owned by `HACK-12` (Phase 1) | — | — |

**Missing dependencies with no fallback:** none identified from this research sandbox's own
perspective. The one real dependency — Cloudflare/Gemini infra already provisioned — is a
cross-phase sequencing concern (confirm Phase 2 actually finished it), not a missing-tool concern.

**Note:** This audit reflects the research sandbox only, not the team's four build machines or the
demo phone, which are `HACK-12`'s (Phase 1) explicit responsibility and are not re-verified here.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected in this repo yet (no `package.json` at the project root, no `src/` directory). **Vitest 4.1.10 recommended** — Vite-native, Jest-compatible API, pairs directly with the existing Vite + TS + React stack from ADR-001 `[VERIFIED: npm registry — package-legitimacy verdict OK for `@testing-library/react`; `vitest`/`happy-dom` flagged SUS for "too-new" but with 87.8M/13.5M weekly downloads respectively, treated as false positives — see Package Legitimacy Audit]` |
| Config file | None — Wave 0 gap |
| Quick run command | `npx vitest run src/engine` (once configured) |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| NOF1-01 | Per-phase baseline uses only this user's own phase-tagged data, never population norms | unit | `npx vitest run src/engine/__tests__/baseline.test.ts` | ❌ Wave 0 |
| NOF1-02 | A planted lag is recovered within tolerance; a deliberately null pair is correctly suppressed (unit-level extension of HACK-03's blind test) | unit | `npx vitest run src/engine/__tests__/lag-correlation.test.ts` | ❌ Wave 0 |
| NOF1-03 | n below the floor (or FDR-unadjusted-significant) yields `status: "still-learning"`, never a surfaced pattern | unit | `npx vitest run src/engine/__tests__/confidence-gate.test.ts` | ❌ Wave 0 |
| NOF1-04 | A surfaced finding always carries `observations` + `strength`; the phrased or template-fallback sentence always echoes both | unit | `npx vitest run src/engine/__tests__/phrasing.test.ts` | ❌ Wave 0 |
| NOF1-05 | ≥1 reveal per active user per week once sufficient data exists | manual/monitoring — not unit-testable | N/A — cross-references the PRD's `NFR-904` ("monitor pattern-reveal suppression rate") | manual-only, justified: a population-level cadence property observable only over real usage time, not a single deterministic run |
| DOC-01 | PDF generation completes in ≤10s for an 18-month synthetic dataset | perf/smoke | `npx vitest run src/export/__tests__/pdf-perf.test.ts` (assert elapsed < 10000ms) | ❌ Wave 0 |
| DOC-02 | Compiled export payload contains symptom timeline, cycle history, medication log, guideline-cited tests | unit | `npx vitest run src/export/__tests__/compile-export-payload.test.ts` | ❌ Wave 0 |
| DOC-03 | Exactly "fasting insulin, free testosterone, DHEAS, 75g OGTT, AMH" `[VERIFIED: REQUIREMENTS.md:133-134]` appear verbatim when guideline conditions trigger | unit | `npx vitest run src/export/__tests__/named-tests.test.ts` | ❌ Wave 0 |
| DOC-04 | Every app-derived value's render includes the wellness-trend disclaimer | unit | `npx vitest run src/export/__tests__/wellness-trend-labels.test.ts` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npx vitest run <changed-file-glob>`
- **Per wave merge:** `npx vitest run` (full suite)
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] Install Vitest + `happy-dom` + `@testing-library/react` — nothing is installed yet; there is
  no `package.json` at the project root at all as of this research session
- [ ] `vitest.config.ts` — none exists
- [ ] `src/engine/__tests__/fixtures/` — synthetic planted-lag + null-pair series; reuse/extend
  whatever generator Phase 2's blind test (`HACK-02`) produces rather than writing a second one
- [ ] `src/export/__tests__/fixtures/` — an 18-month synthetic export dataset for the PDF
  performance test

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V1 Architecture | Yes | On-device engine boundary (ADR-004) — no raw health data crosses to the Worker; only abstracted finding statistics are sent to Gemini for phrasing |
| V5 Input Validation | Yes | Validate check-in/measurement values (numeric ranges, string lengths) before they enter the correlation engine, a PDF layout, or a Gemini prompt — an unbounded string could break PDF layout or bloat/derail a prompt |
| V6 Cryptography | Yes (extends `PRIV-05`, Phase 3) | Data at rest is AES-256 with keys in Secure Enclave/Android Keystore per `PRIV-05` `[VERIFIED: REQUIREMENTS.md:193-196]` — this phase's **new** artifact is the exported PDF file, which is not automatically covered by that existing guarantee once written via Capacitor Filesystem (Common Pitfall 8) |
| V9 Communications | Yes | The Gemini call is HTTPS by construction (Google's endpoint); the API key stays in a Worker secret binding, never shipped to the client (already locked, `CON-ARCH-02`) |
| V13 API and Web Service | Yes | The Worker's Gemini-proxy route should validate/shape its own input (the `Finding` object) before building a prompt — never let a malformed or unexpected object reach prompt-construction code unchecked |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Health-derived PDF left in a world-readable location after export/share | Information Disclosure | Write to the app's private sandbox directory (e.g. Capacitor Filesystem's cache/data directory, not a public Downloads/Documents location); delete after the share sheet completes or on a short TTL (Common Pitfall 8) |
| Prompt injection via a check-in free-text/voice-transcription field flowing into the Gemini prompt | Tampering | The object passed to Gemini should carry only pre-validated, engine-derived numeric/enum fields (lag, strength, observations, variable names from the fixed ~15-dimension symptom set) — never raw user free-text — so there is no user-controlled string an injected instruction could hide inside |
| Gemini output silently drifting into causal or diagnostic language | Tampering (of the stats/language trust boundary) | The numeric-echo guardrail (Code Example 6) plus the deterministic-template fallback (Pattern 3, Common Pitfall 9); never render raw model output unchecked |
| Worker CPU-time exhaustion / cost blowout from an unexpectedly large doctor-summary prompt | Denial of Service | Keep prompt construction to a bounded aggregate summary (interval statistics, not every raw daily row); the Free Workers plan's 10ms CPU budget (excluding `fetch()` wait time) is workable for a thin proxy but tight for heavy string assembly — the Paid plan (~$5/month) removes this concern almost entirely `[VERIFIED: developers.cloudflare.com/workers/platform/pricing, fetched directly]` |

## Sources

### Primary (HIGH confidence)

- `simple-statistics` official docs (simple-statistics.github.io/docs) + npm registry —
  `sampleCorrelation`/`sampleWithReplacement` API, v7.9.3
- `jstat` official docs (jstat.github.io/all.html) + npm registry — `studentt.cdf`/`spearmancoeff`
  API, v1.9.6
- jsPDF GitHub (github.com/parallax/jsPDF) + npm registry — v4.2.1, native drawing API vs.
  `html2canvas` tradeoff
- jsPDF-AutoTable GitHub (github.com/simonbengtsson/jsPDF-AutoTable) + npm registry — v5.0.8,
  `didDrawPage`/`willDrawPage` hooks
- `pdf-lib` npm registry (npmjs.com/package/pdf-lib) — v1.17.1, last-publish date confirmed
  directly
- Dexie.js official docs (dexie.org, dexie.github.io) + npm registry — v4.4.4, bulk-write and
  indexing guidance
- `@capacitor/filesystem`/`@capacitor/share` npm registry, including `peerDependencies` per version
  — Capacitor 6 compatibility pin
- Cloudflare Workers pricing (developers.cloudflare.com/workers/platform/pricing) — CPU-time
  limits, fetched directly from the official page
- `ai.google.dev/gemini-api/docs/structured-output` — official Gemini docs (results conflicted
  across two fetches — see State of the Art)
- `googleapis/js-genai` GitHub — official SDK repository, install/import confirmation
- `product/00-PRD.md`, `PROJECT.md`, `REQUIREMENTS.md`, `product/04-data-model.md`,
  `hackathon/proposal.md`, `hackathon/build-plan.md` — this project's own frozen decisions, all
  read directly this session

### Secondary (MEDIUM confidence)

- WebSearch: the Benjamini-Hochberg procedure (cross-corroborated across r-bloggers,
  statisticshowto.com, and multiple arxiv/Springer references)
- WebSearch: bootstrap confidence-interval methods for correlation coefficients (cross-corroborated
  across multiple statistics-methodology sources)
- WebSearch: lagged cross-correlation for irregularly-sampled time series (ZDCF, N2C2,
  Gaussian-kernel methods)
- WebSearch: prompt-engineering guardrails against hedging/unstated certainty
- WebSearch: Cloudflare AI Gateway features (caching, observability, rate limiting)
- WebSearch: UX patterns for trustworthy low-confidence/insufficient-data dashboard states
- WebSearch: Web Worker + Capacitor plugin-access caveat, including a specific GitHub issue report
  (ionic-team/capacitor#6309)

### Tertiary (LOW confidence)

- WebSearch: n-of-1 trial statistical-rigor review (no n-of-1-specific multiple-testing standard
  was found; flagged as this project's own methodological choice, not an external domain standard)
- WebFetch: Gemini structured-output exact field names — two fetches of the same official page
  conflicted; flagged for mandatory re-verification (Assumption A4, Open Question 5)
- WebSearch: `@google/genai` Cloudflare Workers compatibility — no direct confirmation found either
  way (Open Question 4)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every package version and maintenance-status claim was cross-checked
  against the live npm registry directly (`npm view`, `peerDependencies`) and the
  package-legitimacy gate, not read from training data alone
- Statistical methodology (BH-FDR, bootstrap CI, lag search): MEDIUM — the general methods are
  well-established and cross-corroborated across multiple sources, but their specific application
  to sparse n-of-1 self-tracking data (which grid to correct over, the minimum-n threshold, the
  effect-size bands) is this project's own synthesis, not a codified external standard
- Gemini API integration details (SDK choice, structured-output shape, Workers edge-compat):
  LOW-MEDIUM — genuinely unstable territory this session; explicitly flagged for mandatory
  re-verification at implementation time rather than presented as settled
- Architecture/patterns (on-device engine, Worker-only Gemini, client-side PDF): HIGH — sourced
  directly from this project's own locked decisions (ADR-001/ADR-004, CON-BUILD-02/CON-BUILD-03,
  `hackathon/proposal.md`'s "what runs where" table), not external inference
- Pitfalls: HIGH — each is either a verified library/version fact (the Capacitor version pin, the
  jsPDF/`html2canvas` tradeoff) or derived directly from this project's own stated design
  philosophy (determinism, zero LLM improvisation) applied consistently to a new surface

**Research date:** 2026-08-03
**Valid until:** 30 days for the statistical-methodology and architecture sections (stable
domains); **7 days** for anything touching the Gemini API's exact request shape, given the
conflicting evidence found this session and the pace of change in that API surface — re-verify
before writing any Gemini-calling code even if this document is only a few days old.
