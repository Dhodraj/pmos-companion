# Phase 1: Pre-event readiness and frozen contracts - Research

**Researched:** 2026-08-03
**Domain:** TypeScript contract design (discriminated unions), synthetic time-series generation for a blind statistical test, project scaffolding (Vite + React + Capacitor 6 + Dexie), and repo-wide documentation correction
**Confidence:** MEDIUM (HIGH on everything verified directly in this repo's files and via CLI tools; MEDIUM on library docs cross-checked against official sources; LOW/tertiary on general statistical and PRNG background pulled from open web search — see Sources)

---

## Locked Decisions (from PROJECT.md / doc-ingest bootstrap)

No phase-level `CONTEXT.md` exists for this phase — it was never run through `/gsd:discuss-phase`. The
project instead has a **doc-ingest bootstrap**: `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md` and
`.planning/STATE.md` carry the locked decisions that would normally live in CONTEXT.md, produced by
ingesting seven source documents (PRD, specs, proposal, build-plan) on 2026-08-03. This section copies
forward everything from that bootstrap that constrains this phase's planning. Treat every item below with
the same authority CONTEXT.md decisions would carry.

### Locked (do not re-research alternatives)

- **ADR-001 to ADR-004 are LOCKED** [VERIFIED: PROJECT.md:196-277]: React + TypeScript + Vite in a
  Capacitor 6 shell (Android/iOS), native Swift/Kotlin plugins for all sensing; camera capture always
  foreground and user-initiated; no external devices/wearables/CGM; **inference — including the n-of-1
  correlation engine itself — runs on-device**, not on a server. Cloudflare Pages + Workers + D1 exist
  only for accounts and anonymised metrics; the Worker's only job with the AI is phrasing (Gemini is
  "language only," per CON-BUILD-03 [VERIFIED: PROJECT.md:176-178] — "It never computes a pattern,
  scores a risk, or suggests a dose. The engine finds the association numerically; Gemini phrases it
  while preserving the uncertainty.").
- **WARN-01 resolved in favour of the PRD** [VERIFIED: STATE.md:59]: camera vitals stay P0 on the
  product axis, clinical objection unanswered, gated on PPG-07. **Camera vitals are Phase 6, not in the
  weekend rings, and Phase 1 must not treat them as cut.**
- **WARN-02 resolved in favour of the proposal** [VERIFIED: STATE.md:60-61]: voice entry is in the 8-9
  August build, English only, on-device, owned by Belson, H22-H28, still cut-list item 2.
- **WARN-03 resolved in favour of the proposal** [VERIFIED: STATE.md:62]: no direct sleep-apnoea
  headline comparison anywhere in the repo. This is exactly DOCFIX-01's target.
- **The "500,000+ users across 120 countries" claim is retracted and may never reappear** as a goal,
  metric, advantage, or context anywhere [VERIFIED: STATE.md:84-85, REQUIREMENTS.md:351]. Verified real
  figures: ~63 unique visitors/day, 52 countries, 2.8% India traffic, 2 registered users.
- **Three phase axes must not be conflated** [VERIFIED: PROJECT.md:316-329]: the PRD release plan, the
  build-plan's rings 1-5 + cut list (weekend only), and the proposal's own module phases are three
  different sequencing schemes. This GSD roadmap is a fourth. Phase 1 belongs to the "pre-event" window
  only (through Friday 7 August evening) — it is not the hackathon weekend itself (that is Phase 2).

### Claude's discretion (no explicit lock — recommend, don't just list options)

- Exact TypeScript shape of the three frozen types (structure is dictated by HACK-01's constraints, but
  field naming, exact literal-tag values, and helper-type patterns are open).
- Choice of seeded-PRNG library for the synthetic generator (no ADR names one).
- Whether to add a lightweight test framework / typecheck harness now, given none exists yet in the
  build repo.

### Deferred / out of scope for this phase

- The correlation engine's actual statistical implementation (lagged cross-correlation, FDR correction)
  is Phase 2 (HACK-03) and Phase 4 (NOF1-02) work. Phase 1 only needs to (a) freeze the `Finding` type
  the engine will emit into, and (b) generate a dataset shaped so that a reasonable implementation of
  that statistic *can* recover the planted lag within tolerance — Phase 1 does not write the engine.
- Camera/OCR, cycle engine UI, safety layer, coaching, companion, PPG — all later phases. Nothing in
  Phase 1 should scaffold these.

---

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HACK-01 | `src/types/` frozen Fri 7 Aug evening: log entry, finding (must express *not enough data* as a value), export payload | Discriminated-union pattern with `never`-exhaustiveness (Architecture Patterns, Pattern 1); concrete field-grounded sketches for all three types (Code Examples), built from verbatim quotes in build-plan.md and the PRD, not invented from scratch |
| HACK-02 | 14 months of demo-user history, blind-test protocol, sealed parameter file | Generator architecture pattern (pure, parameterised function; custody separation), seeded-PRNG options, and five concrete pitfalls specific to planted-lag + null-pair design (Common Pitfalls) |
| HACK-12 | Pre-event blockers closed: start time, pre-event-code ruling, repo visibility, invites, Android toolchain x4, demo phone | Environment Availability audit (this machine specifically verified); repo-visibility technical finding; role-scope drift evidence from `registration.md` vs `build-plan.md` |
| DOCFIX-01 | PRD §2.2/§15.2 sleep-apnoea phrasing corrected, no direct headline comparison | Complete verified location map — PRD has 2 instances, plus 3 more locations outside the named sections (below) |
| DOCFIX-02 | `hackathon/proposal.md` no longer states camera heart rate was cut | Complete verified location map — 4 more locations beyond the one file named in the requirement, **including the team's separate public build repo** |
| DOCFIX-03 | "Day 47" framing and "Building My Case" label renamed everywhere | Complete verified location map distinguishing our-own-copy violations from legitimate competitor-quote mentions that should stay as-is |

</phase_requirements>

---

## Summary

This phase is almost entirely non-code: it freezes three TypeScript interfaces, produces one sealed
synthetic dataset, closes a short list of yes/no organizational questions, and corrects specific
sentences across a documentation repository. The two genuinely technical questions — how to make a
TypeScript type say "not enough data" as a value, and how to build a synthetic time series with a
planted signal and a genuine null control — both have well-established patterns, verified below.

Three findings materially change how this phase should be planned, and none of them come from the
phase description alone — they came from actually reading the repo and the machine it runs on:

1. **The code these types get frozen into does not exist yet.** The team's actual build repository
   (`health-team-311-war-room`, a sibling directory on this machine, separate git remote) has an empty
   `src/` folder and no `package.json` — no Vite, no TypeScript config, no Capacitor scaffold. HACK-01
   cannot "freeze `src/types/`" in a repo that has no toolchain to typecheck against. Scaffolding is a
   Phase 1 prerequisite, not an assumed-done precondition.
2. **The documentation-correction scope is larger than the three named files.** Grepping the full repo
   (both the planning repo and the separate public build repo) surfaces the same false or borrowed
   claims in at least 8 additional locations the requirements text does not name, including the team's
   own public-facing build-repo `PROPOSAL.md` — the actual document a judge is most likely to open.
3. **One day of the pre-event schedule has already elapsed.** `hackathon/build-plan.md` calls Sunday 2
   August "the only full day before the event" and front-loads it with the heaviest prep work (engine
   algorithm on paper, Vite/Capacitor building to a phone, Cloudflare provisioning, the six candidate
   pairs). Today is **Monday 3 August, 12:37 IST** [VERIFIED: `date` command output] — Sunday has passed
   with no evidence in the repo that its tasks happened. Phase 1 planning must either compress Sunday's
   work into the remaining four days or explicitly replan.

**Primary recommendation:** Treat this phase as three parallel tracks — (a) freeze contracts against a
scaffolded-from-scratch project, using a `status`-discriminated union with a `never`-exhaustiveness
check for `Finding`; (b) build the generator as a pure, parameterised, seed-in/rows-out function so the
custody split (Satheesh runs it, Dhodraj never sees the parameters) is mechanically enforced, not just
promised; (c) run one repo-wide sweep for the three banned claims across *both* git repositories before
declaring DOCFIX-01/02/03 done.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| `LogEntry` / `Finding` / `ExportPayload` type contracts | Browser/Client (on-device) | API/Backend (Worker touches `ExportPayload`-derived numbers only, for Gemini phrasing) | ADR-004 locks the correlation engine itself on-device — it is not a server process. The Worker only ever receives structured numbers for language phrasing, never raw log rows [VERIFIED: PROJECT.md:176-178, CON-BUILD-03]. |
| 14-month synthetic dataset generator | Build/dev tooling — outside the five standard tiers | Database/Storage (client) | A Node/TS script run once by Satheesh; its output is loaded into the on-device Dexie store. It never ships inside the app bundle and has no production runtime role. |
| On-device data store | Database/Storage (IndexedDB via Dexie, on-device) | — | Per ADR-004, health records never leave the device; Cloudflare D1 (server-side DB tier) holds only accounts and anonymised metrics, never log entries or findings [VERIFIED: PROJECT.md:155-157, 261-276]. |
| Documentation corrections (DOCFIX-01/02/03) | N/A — prose/content, no architectural tier | — | Text edits across Markdown files in two separate git repositories; no runtime component. |
| Pre-event logistics (HACK-12) | N/A — organizational/process | — | External facts to confirm (event start time, repo visibility) and human commitments to verify; no code involved. |

---

## Standard Stack

### Core (ADR-001-locked; versions verified against the live npm registry this session, not training memory)

| Library | Locked by ADR | Latest verified version | Why Standard |
|---------|---------------|--------------------------|--------------|
| `typescript` | ADR-001 | **7.0.2** [VERIFIED: `npm view typescript version`] | Locked stack |
| `vite` | ADR-001 | **8.2.0** [VERIFIED: `npm view vite version`] | Locked stack |
| `react` / `react-dom` | ADR-001 | **19.2.8** [VERIFIED: `npm view react version`] | Locked stack |
| `dexie` | ADR-001 | **4.4.4** [VERIFIED: `npm view dexie version`] | Locked stack; ships its own TS typings, no `@types` package needed [CITED: dexie.org/docs/Typescript] |
| `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/ios` | ADR-001 ("Capacitor 6") | **8.5.0** on all four [VERIFIED: `npm view @capacitor/core version` etc.] | Locked stack — **see version-drift flag below** |

**Version-drift flag — needs a decision, not a silent pin.** ADR-001 names "**Capacitor 6**"
[VERIFIED: PROJECT.md:168-171, and restated in this task's own brief]. The live registry's latest
stable is **8.5.0**, with a **9.0.0-alpha** channel already active
[VERIFIED: `npm view @capacitor/android versions --json`, full version list inspected]. This is a two
major-version gap, not a rounding difference. Two readings are possible and the team should pick one
explicitly before Rahul scaffolds anything:
  - (a) ADR-001 means "Capacitor" as the *architectural choice* (vs. React Native, vs. dual-native), and
    "6" was simply the current major version when the ADR was written — in which case scaffold on
    current stable (8.5.0) like any new project would.
  - (b) The team has a real reason to pin major version 6 specifically (e.g. a plugin dependency, prior
    experience, tutorial material written against v6) — in which case pin `@capacitor/core@^6` explicitly
    in `package.json`, and say so, rather than getting v8 by accident from an unpinned `npm install`.
  A silent `npm install @capacitor/core` today installs v8.5.0, not v6. Training-era assumptions about
  "current" Capacitor are stale by roughly two major versions; this is exactly the drift the
  verification protocol warns about — confirmed by tool, not by memory.

### Supporting (new, discretionary — not covered by any ADR)

| Library | Verified version | Purpose | When to Use |
|---------|-------------------|---------|-------------|
| `rand-seed` or `seedrandom` | rand-seed **3.0.0**, seedrandom **3.0.5** [VERIFIED: `npm view` both] | Deterministic seeded PRNG for the synthetic generator | HACK-02's generator must be reproducible from a stored seed — hand-rolling a PRNG risks a low-quality generator with visible short-period artefacts in 420+ days of output |
| `zod` | **4.4.3** [VERIFIED: `npm view zod version`] | Optional runtime validation of the three frozen types at the IndexedDB read/write boundary | Recommended, not mandatory, given hackathon time pressure — see Common Pitfalls, "compile-time-only contracts" |
| `vitest` | **4.1.10** [VERIFIED: `npm view vitest version`] | Test runner, if the team wants automated typecheck/determinism tests (see Validation Architecture) | Zero extra config cost since Vite is already the locked bundler |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `rand-seed` / `seedrandom` (library) | Hand-rolled `mulberry32` (a well-known ~5-line function) [LOW confidence, see Sources] | Zero install, zero supply-chain surface, but the team owns correctness of the RNG itself during a time-pressured weekend — a library that's already been fuzz-tested by a large user base is the safer default for something the blind-test's credibility depends on |
| `zod` runtime validation | No runtime validation, compile-time types only | Faster to ship; accept the risk that a malformed row can still be written to Dexie and silently break the engine or the export — see Common Pitfalls |

**Installation (once the build repo is scaffolded):**
```bash
npm install dexie
npm install -D rand-seed   # or seedrandom
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
```

---

## Package Legitimacy Audit

All packages below are the ADR-locked stack or direct, obvious supporting choices — none were
"discovered" via speculative web search; all are checked against the live npm registry and the
project's `package-legitimacy` seam this session.

| Package | Registry | Age / Downloads | Source Repo | Verdict | Disposition |
|---------|----------|------------------|--------------|---------|-------------|
| `typescript` | npm | 259M/wk | github.com/microsoft/TypeScript | **SUS** ("too-new") | See note below — Approved |
| `vite` | npm | 161M/wk | github.com/vitejs/vite | **SUS** ("too-new") | See note below — Approved |
| `react` / `react-dom` | npm | 162M/wk, 154M/wk | github.com/react/react | **SUS** ("too-new") | See note below — Approved |
| `dexie` | npm | 2.1M/wk | github.com/dexie/Dexie.js | OK | Approved |
| `@capacitor/core`, `/cli`, `/android`, `/ios` | npm | 2.7-3.8M/wk each | github.com/ionic-team/capacitor | **SUS** ("too-new") | See note below — Approved |
| `seedrandom` | npm | 8.4M/wk, published 2019 | github.com/davidbau/seedrandom | OK | Approved |
| `rand-seed` | npm | 76K/wk | github.com/michaeldzjap/rand-seed | OK | Approved |
| `zod` | npm | 251M/wk | github.com/colinhacks/zod | OK | Approved (optional) |
| `vitest` | npm | 88M/wk | github.com/vitest-dev/vitest | **SUS** ("too-new") | See note below — Approved (optional) |

**Note on every "SUS / too-new" verdict above:** the legitimacy check's "too-new" signal fires on the
*publish date of the latest version*, not on the package's trustworthiness — every flagged package here
has a multi-year history, tens to hundreds of millions of weekly downloads, and an official,
well-known source repository (Microsoft, the Vite/Vitest/Capacitor/React orgs). This is the expected
signature of a fast-releasing, actively-maintained, extremely popular package, not a supply-chain risk.
Per protocol this is still recorded as SUS and the planner should still add a `checkpoint:human-verify`
before install — the pragmatic action to take at that checkpoint is **not** "investigate for
slopsquatting" but "pin to a specific recent-but-not-hours-old patch version rather than a floating
`latest`," which is good hackathon practice anyway (a version published minutes before the team installs
it has had zero soak time).

**Packages removed due to `[SLOP]` verdict:** none.
**Packages flagged as suspicious `[SUS]`:** all of the above, for the reason explained — no action beyond
a version-pin checkpoint is warranted.

---

## Architecture Patterns

### System Architecture Diagram — what Phase 1 actually touches

```
                    ┌─────────────────────────────────────────────┐
                    │   Satheesh's machine (dev tooling only)      │
                    │                                               │
                    │   generate(seed, pairIndex, lagDays, strength)│
                    │        │                                      │
                    │        ▼                                      │
                    │   LogEntry[]  (~426 daily rows)                │
                    │        │              sealed-params.json ─────┼──▶ kept by Satheesh
                    │        │              (seed, pair, lag,        │    only, until after
                    │        │               strength — NOT the      │    the H10 blind test
                    │        │               generated rows)         │
                    └────────┼─────────────────────────────────────┘
                             │  hands over ONLY the generated rows
                             ▼
        ┌───────────────────────────────────────────────────────────────┐
        │  Phone / Capacitor shell (Browser/Client tier — on-device)     │
        │                                                                 │
        │   IndexedDB (Dexie) ◀── seeded with LogEntry[] above            │
        │        │                                                        │
        │        ▼                                                        │
        │   Correlation engine (Phase 2 — not built in Phase 1,           │
        │   but the Finding type it emits into IS frozen in Phase 1)      │
        │        │                                                        │
        │        ▼                                                        │
        │   Finding  ──────────────▶  Insight card (Belson, Phase 2)      │
        │        │                                                        │
        │        ▼                                                        │
        │   ExportPayload  ─────────▶  Doctor PDF (client-side render)    │
        └──────────────────────────┬──────────────────────────────────────┘
                                    │ structured numbers only, never raw rows
                                    ▼
                    ┌───────────────────────────────────────┐
                    │  Cloudflare Worker (API/Backend tier)   │
                    │  — accounts, anonymised metrics,        │
                    │    Gemini phrasing proxy (language only)│
                    │    NOT part of Phase 1's scope           │
                    └───────────────────────────────────────┘
```

The only two boxes Phase 1 actually builds are the generator (top) and the three frozen type
definitions that the rest of the diagram will be typed against. Everything downstream of "Correlation
engine" is Phase 2+; it is drawn here only to show why the `Finding` type has the dependents it has
(build-plan.md: "This has the most dependents, so it gets written first" [VERIFIED: build-plan.md:92]).

### Recommended Project Structure (inside `health-team-311-war-room`, once scaffolded)
```
src/
├── types/
│   ├── log-entry.ts       # HACK-01: what a check-in writes, the engine reads
│   ├── finding.ts         # HACK-01: discriminated union, "still learning" is a value
│   ├── export-payload.ts  # HACK-01: everything the doctor PDF renders from
│   └── index.ts           # barrel re-export — this is the frozen surface Belson codes against
├── core/                  # Dhodraj's directory per build-plan.md §2 — engine, Dexie schema
├── app/ , ui/              # Belson's directory per build-plan.md §2
tools/
└── generate-history.ts    # HACK-02: the synthetic generator (dev tooling, not shipped)
```
Directory ownership (`src/core/` = Dhodraj, `src/app/`+`src/ui/` = Belson, `ops/` = Rahul) is already
decided in build-plan.md §2 [VERIFIED: build-plan.md:44] — Phase 1 tasks should respect it rather than
inventing a new layout.

### Pattern 1: Discriminated union with `never`-exhaustiveness for "not enough data as a value"

**What:** A union type where every variant shares one literal "discriminant" field (commonly `status` or
`kind`). TypeScript narrows automatically on that field inside a `switch`. Compile-time exhaustiveness is
enforced by giving the `switch`'s `default` branch a variable of type `never` — if a new variant is added
to the union later and a `switch` isn't updated to handle it, that assignment fails to compile
[LOW confidence, general web synthesis — see Sources]:

```typescript
// Source: general TypeScript discriminated-union / exhaustiveness pattern
// (community consensus across multiple sources — see Sources, tertiary confidence)
function assertNever(x: never): never {
  throw new Error(`Unhandled variant: ${JSON.stringify(x)}`);
}

switch (finding.status) {
  case 'pattern-found': /* ... */ break;
  case 'still-learning': /* ... */ break;
  default:
    return assertNever(finding); // compile error if a variant is ever added and missed here
}
```

**Important caveat, verified this session:** this exhaustiveness check is **not automatic** — `tsc` does
not warn on a non-exhaustive `switch` by default. The check only fires where a developer has actually
written the `never`-typed `default` branch, or where the team enables the opt-in ESLint rule
`@typescript-eslint/switch-exhaustiveness-check`
[LOW confidence, general web synthesis — see Sources]. **For a type the team is deliberately freezing so
"nobody changes these without Dhodraj agreeing out loud"** [VERIFIED: build-plan.md:88], this matters:
without either the manual pattern or the lint rule turned on, a future edit that adds a third `Finding`
variant can silently pass `tsc --noEmit` while leaving old `switch` statements unaware of it. Recommend
enabling the lint rule as part of the Phase 1 scaffold, not leaving it to be added later.

**When to use:** Any time a "no value" state needs its own data (here: an observation count, so the UI
can say "not enough data yet — 4 observations" rather than a bare `null`) — a plain nullable field cannot
carry that.

### Pattern 2: Generator as a pure, parameterised function (custody-separation for the blind test)

**What:** build-plan.md is explicit about the two roles: Dhodraj writes the generator code; Satheesh
chooses and holds the parameters and is the one who actually runs it
[VERIFIED: build-plan.md:25, "Satheesh picks the planted pair from a list of six candidates, rolls for
the lag and the strength, runs the generator with a random seed, and hands Dhodraj the dataset alone"].
For that split to be more than a verbal promise, the generator's *code shape* should make it mechanically
true:

```typescript
// Source: synthesized from hackathon/build-plan.md:25 and :90-96 (custody + field list),
// product/00-PRD.md FR-201/FR-403/FR-404 (fields, "still learning" copy — see Code Examples)
interface BlindTestParams {
  seed: number;
  candidatePairIndex: 0 | 1 | 2 | 3 | 4 | 5; // Satheesh's choice, from a fixed list of 6
  lagDays: number;                            // Satheesh rolls this
  strength: number;                            // Satheesh rolls this
  nullPairIndex: 0 | 1 | 2 | 3 | 4 | 5;        // a second, different candidate — deliberately null
}

// Dhodraj writes and can unit-test this with HIS OWN placeholder params.
// Satheesh is the only one who ever calls it with the REAL sealed params.
export function generateHistory(params: BlindTestParams): LogEntry[] {
  /* ... */
}
```

Dhodraj can freely test this function against parameters *he* invents (to verify the code works before
handoff); the blindness guarantee comes entirely from Satheesh being the only person who ever invokes it
with the real, sealed values — not from Dhodraj being kept away from the source code, which build-plan.md
explicitly says is unnecessary ("Blindness needs the author not to know the parameters. It does not need
him to not know the code." [VERIFIED: build-plan.md:27]).

### Anti-Patterns to Avoid
- **Modeling "still learning" as `lagDays: null`:** keeps a single object shape with optional fields,
  which means every consumer (insight card, export renderer) has to remember to null-check every field
  even when `status` already told them the finding has no lag/direction/strength yet. A discriminated
  union makes the impossible states (e.g. "status is still-learning but direction is 'positive'")
  unrepresentable, not just unlikely.
- **Letting the generator's output schema vary by which pair was chosen:** if column names, presence, or
  ordering differ depending on the real candidate pair, Dhodraj can potentially infer the sealed
  parameters just from the shape of the file handed to him — see Common Pitfalls.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reproducible randomness for the generator | A custom RNG (e.g. `Math.random()` wrapped with a home-made seed hack) | `rand-seed` or `seedrandom` | `Math.random()` cannot be seeded at all in JS — it is unusable for "hand Dhodraj the same dataset if it needs regenerating." A hand-rolled seeded RNG risks short periods or visible patterns across 420+ days of daily output that a naive implementation wouldn't catch under time pressure. |
| Exhaustiveness checking | Manually re-reading every `switch` after each edit | The `never`-default pattern, or the `@typescript-eslint/switch-exhaustiveness-check` rule | Manual review is exactly the kind of thing that fails at 3am under the H20 judgement-degradation build-plan.md itself warns about [VERIFIED: build-plan.md:72-73]. |

**Key insight:** everything Phase 1 needs to "not hand-roll" is small and well-trodden (a PRNG, a
compiler check) — this phase's real risk is organizational (scaffolding not started, docs not swept,
schedule slippage), not technical. Don't over-invest engineering effort here; the type contracts and
generator are both small, focused pieces of code.

---

## "Runtime State" analogue for the documentation-rename requirements (DOCFIX-01/02/03)

This is not a database/service migration, so the standard five categories (stored data, live service
config, OS-registered state, secrets, build artifacts) mostly don't apply — but two of them do, in a
form worth flagging explicitly rather than skipping the check:

| Category | Finding | Action Required |
|----------|---------|------------------|
| Stored data | None — this is a prose correction, no database/collection/user-id carries these strings. | — |
| **Live service config** | `hackathon/form-fill.md` documents answers **already submitted** to the hackathon organizers' platform [VERIFIED: hackathon/form-fill.md:43, contains the same false "clinician killed... camera heart rate" claim]. That platform is outside this git repo and cannot be edited by fixing the local file. | Edit the local copy for consistency, but treat the actual submitted record as unchangeable — decide whether the team needs to address this verbally with organizers/judges, since the written submission and the pitch will otherwise disagree. |
| OS-registered state | None. | — |
| Secrets/env vars | None. | — |
| **Build artifacts / duplicated copies** | The team's **separate, public build repository** (`health-team-311-war-room`, sibling directory, remote `github.com/Build-with-AI-Code-for-Communities/health-team-311-war-room`) has its own independently-committed `PROPOSAL.md` with the same false claim, verbatim: *"A practising clinician killed an eleventh. We planned camera-based heart rate, and they asked what it would actually tell a woman with PMOS. It would not change her care, so it is gone."* [VERIFIED: `~/Documents/Personal/health-team-311-war-room/PROPOSAL.md:159`]. Fixing `hackathon/proposal.md` in **this** repo does nothing to that file. | A separate edit task in the **build repo**, not just the planning repo — this is the document most likely to actually be read by a judge, since it's what "Code is built in the team repo" points to. |

**Nothing found in category** is stated explicitly above for the three that don't apply, per the
verification protocol's requirement not to leave categories blank.

---

## Common Pitfalls

### Pitfall 1: DOCFIX scope is bigger than the three named files — full verified location map

The requirements text names one file per DOCFIX item. Grepping both repositories this session found
materially more locations. All of the following were opened and read (not just grepped) this session.

**DOCFIX-01 — sleep-apnoea "37% against/vs 6%" direct headline comparison** [VERIFIED, all 5 locations]:
| Location | Verbatim text found |
|---|---|
| `product/00-PRD.md:95` (§2.2, the section named in the requirement) | "Sleep apnoea undetected \| 37% prevalence in PMOS against 6% general population. No app screens for it \| High" |
| `product/00-PRD.md:851` (§15.2, the section named in the requirement) | "Sleep apnoea prevalence of 37% against 6%, odds ratio 9.52, in [Frontiers in Endocrinology]" |
| `product/01-product-definition.md:67` (not named in the requirement) | "OSA at 37% vs 6% — an enormous undetected metabolic driver no app screens for." |
| `product/03-complete-features-spec.md:145` (not named) | "Sleep apnea underdetected \| OSA prevalence ~37% in PMOS vs ~6% general; no app screens for it \| High" |
| `product/03-complete-features-spec.md:1136` (Sources section, not named) | "OSA prevalence in PCOS/PMOS (37% vs 6%; OR 9.52)" |

The clinician-approved replacement phrasing already exists verbatim in `hackathon/proposal.md` and is
quoted in REQUIREMENTS.md: *"substantially more common than in women without PMOS, pooled prevalence
around 37%, odds ratio 9.52, and no direct headline comparison, because OSA prevalence varies by age,
BMI, sex, ethnicity and diagnostic method."* [VERIFIED: REQUIREMENTS.md:35-38] — every location above
needs that phrasing, not a rewrite from scratch.

*Judgment call flagged, not resolved:* `hackathon/clinician-review-brief.md:23,26` also contains the old
"37% against 6%" framing, but as **the literal question that was put to the clinician** ("Is the 37%
sleep apnoea figure sound, and is the 6% general-population comparator fair?"). This document is a
historical review-request record, not a current claim — recommend leaving it as-is with an optional
one-line addendum noting it was since corrected, rather than editing history. This is a call for the
person actually doing DOCFIX-01, not something to silently decide here.

**DOCFIX-02 — "camera heart rate was cut"** [VERIFIED, all 5 locations, 2 of them in the **build repo**]:
| Location | Verbatim text found |
|---|---|
| `hackathon/proposal.md:227` (named in the requirement) | "The active version we did plan was removed after clinical review, because resting heart rate is not a PMOS marker and would not change her care." |
| `hackathon/proposal.md:258` (same file, second instance) | "camera heart rate was cut after they asked what a resting heart rate would actually tell a woman with PMOS" |
| `README.md:41` (repo root, not named) | "killing a feature we liked: camera-based heart rate, because a resting heart rate would not change a woman's care" |
| `hackathon/form-fill.md:43` (not named — see the "Runtime State" section above for why this one is special) | "A practising clinician killed an eleventh: we planned camera heart rate... It would not change her care." |
| **`health-team-311-war-room/PROPOSAL.md:159`** (separate repo, not named) | "A practising clinician killed an eleventh. We planned camera-based heart rate... It would not change her care, so it is gone." |

The corrected position is already decided (WARN-01, above): camera vitals stay P0, clinical objection
unanswered, gated on PPG-07 for release. Every location needs to say that, not that the feature is gone.

**DOCFIX-03 — "Day 47" framing and "Building My Case" label** [VERIFIED]. This one has both real
violations (our own copy) and legitimate mentions (quoting a competitor for comparison, which should
stay as-is) — conflating them would over-edit:

| Location | Status | Verbatim text |
|---|---|---|
| `product/03-complete-features-spec.md:189` | **Violation — our own MVP feature row** | "day-count framing (\"Day 47 of your usual 30–60 range\")" describing *our* Irregular-native cycle engine feature |
| `product/03-complete-features-spec.md:351` (§3.10, named in the requirement) | **Violation — our own feature name** | `**"Building My Case" mode**` ✅ \| For undiagnosed users... |
| `product/03-complete-features-spec.md:507, 829, 938` | **Violation — same label reused** | "Full doctor advocacy kit + specialist reports + 'Building My Case'"; a Mermaid node `"Building My Case pack"`; a comparison-table row header |
| `hackathon/proposal.md:74` | **Violation — our own pitch copy** | "day 47 of your usual 30 to 60 range" |
| `hackathon/proposal-short.md:31` | **Violation — our own pitch copy** | "'Day 47 of your usual 30 to 60 range', never 'late'" |
| `product/03-complete-features-spec.md:925` | **Leave as-is — explicitly quoting the competitor** | "*'Day 47 sits inside your own usual range'* — near-identical to our copy" (this is PMOS Vera's line, cited for comparison) |
| `product/03-complete-features-spec.md:920, 967` and `research/05-feasibility-audit/README.md:29,44` | **Leave as-is — these are the audit notes flagging the rename**, not the violation itself | e.g. "Rewrite the near-verbatim copy... before anything ships publicly" |
| PRD `FR-507` (`product/00-PRD.md:479`) | **Already fixed** | "Provide evidence-pack mode for undiagnosed users... Rename from the earlier label, per section 5.3" — the PRD's own requirement text already completed its rename; `03-complete-features-spec.md` has not caught up to it |

**Minor/optional, not a hard violation:** `README.md:15`, `hackathon/proposal-short.md:13`, and
`health-team-311-war-room/PROPOSAL.md:16` all use the identical phrase "tells her she is 47 days late" —
this describes what a *bad incumbent app* does (the antagonist), not our own day-count framing, so it is
not technically the banned construction. Flagging only because the same number appears verbatim in three
places; worth a glance, not a required edit.

### Pitfall 2: The blind-test null pair can fail for a reason that has nothing to do with the engine

A pair is only a genuine negative control if it shares **no common driver**, not just "no lag I coded in
on purpose." Many symptom variables in this product's own field list (mood, energy, skin, cravings) are
independently plausible as *all* varying with cycle phase. If the generator ties several symptoms to the
same underlying cycle-phase process without deliberately decorrelating the null pair's shared phase
-dependence, a same-day (lag-0) association can appear between two "unrelated" variables for a reason the
team never intended — and the H10 gate would read that as a false positive on the null pair through no
fault of the actual engine. When Satheesh picks the null pair, "genuinely null" needs to mean null of any
shared confound the generator models, not just null of a directly-authored lag [LOW confidence, general
synthesis from synthetic-null-validation literature — see Sources].

### Pitfall 3: The six-candidate list, if drawn only from the PRD's own illustrative examples, weakens the "blind" claim in spirit

The product's own public materials already give worked examples of the *expected* kind of finding — "sleep
→ skin," "supplement → mood," "food → cycle" [VERIFIED: PROJECT.md:15-19, REQUIREMENTS.md:117-118]. The
blind-test protocol is procedurally sound either way (Satheesh chooses, Dhodraj doesn't), but if the
actual planted pair turns out to be exactly the headline example everyone on the team has already read in
the PRD, the demo's strongest line — "the person who wrote the engine did not know what was in the data"
— is undercut in spirit, since it was also the single most guessable pair. Worth Satheesh including at
least one less-obvious pair (e.g. cravings→energy, medication-timing→sleep) among the six candidates.

### Pitfall 4: Frozen TypeScript types are a compile-time guarantee only — IndexedDB enforces nothing at runtime

"Frozen contract" can be misread as "the data is now safe." Dexie/IndexedDB has no schema validation —
nothing stops a bug (or the generator, if it has one) from writing a `Finding`-shaped object missing a
required field, and `tsc` cannot catch that once the data has round-tripped through IndexedDB or JSON.
The type freeze protects compile-time code written against `src/types/`; it does not protect the data
itself. `zod` (Standard Stack, above) is the standard, low-effort way to close that gap at the read/write
boundary if the team has time; if not, this is a known, accepted risk worth naming rather than assuming
away.

### Pitfall 5: `cap init`'s default `webDir` assumes CRA, not Vite — a classic blank-screen build break

Capacitor's own init flow defaults `webDir` based on framework detection, historically defaulting to
`build` (Create React App's output folder); Vite's actual production output directory is `dist`
[CITED: capacitorjs.com/docs/config, capacitorjs.com/docs/getting-started]. If `webDir` in
`capacitor.config.ts` ends up pointing at the wrong folder, `npx cap sync` copies a stale or empty
directory into the native shell — the app still installs and launches, but shows a blank/white screen,
which is exactly the kind of "twenty minutes, six times, and the engine loses four hours" failure mode
build-plan.md worries about [VERIFIED: build-plan.md:54]. Verify `webDir: 'dist'` explicitly during
scaffolding rather than trusting the CLI wizard's default.

### Pitfall 6: One day of the pre-event schedule has already elapsed

`hackathon/build-plan.md` §7 assigns Sunday 2 August the heaviest load of the six-day pre-week and calls
it explicitly "the only full day before the event and carries more weight than any other day on this
plan" [VERIFIED: build-plan.md:129]. That day's assigned work: engine algorithm on paper and types
drafted (Dhodraj); Vite/React/Capacitor building to a real phone (Belson); Cloudflare account, Pages,
Workers, D1 provisioned (Rahul); the six candidate pairs for the blind test chosen (Satheesh)
[VERIFIED: build-plan.md:137]. The system clock on this machine reads **Monday, 3 August 2026, 12:37 PM
IST** [VERIFIED: `date` command], and this GSD project's own `.planning/STATE.md` records that planning
only started today. There is no artefact anywhere in either repository (no scaffold, no drafted types
file, no candidate-pairs list, no Cloudflare config) suggesting Sunday's work happened. Phase 1 planning
needs to either compress Sunday's items into the remaining four days (today through Friday) or the team
needs to explicitly acknowledge and replan the six-day schedule down to five.

---

## Code Examples

The three field lists below are not invented — each is grounded in a specific verbatim source, quoted
next to the field it justifies, per this session's verification requirements. These are **sketches
for Dhodraj's Friday freeze**, not a substitute for the team agreeing on them "out loud"
[VERIFIED: build-plan.md:88].

### `Finding` — the type with the most dependents, per build-plan.md

Fields required: *"the two variables, the lag in days, the direction, the strength, the observation
count, and a confidence band that can fall below the floor"*
[VERIFIED: build-plan.md:92]. The floor-suppressed state's product-facing label is **"still learning"**,
an existing MVP P0 requirement, not a name invented for this research:
*"Suppress any pattern below threshold and display 'still learning'. SHALL NOT surface a pattern from
insufficient observations"* [VERIFIED: product/00-PRD.md:439, FR-403]. The plain-language strength
example already exists too: *"State observation count and signal strength in plain language on every
reveal, for example '12 observations, weak signal'"* [VERIFIED: product/00-PRD.md:440, FR-404].

```typescript
// Source: synthesized from hackathon/build-plan.md:92-96 and product/00-PRD.md FR-403/FR-404
type SymptomDimension =
  | 'bleeding' | 'sleep' | 'movement' | 'mood' | 'energy'
  | 'skin' | 'cravings' | 'pain' | 'medication'; // FR-201's ~15-dimension set, hackathon subset

type ConfidenceLabel = 'weak' | 'moderate' | 'strong'; // maps FR-404's "weak signal" wording

type Finding =
  | {
      status: 'pattern-found';
      variableA: SymptomDimension;
      variableB: SymptomDimension;
      lagDays: number;                 // 1-14, per NOF1-02's window
      direction: 'positive' | 'negative';
      strength: number;                // raw statistic (e.g. correlation coefficient)
      confidenceLabel: ConfidenceLabel; // plain-language rendering of `strength`, FR-404
      observationCount: number;
    }
  | {
      status: 'still-learning';        // FR-403's exact product copy, not a generic name
      variableA: SymptomDimension;
      variableB: SymptomDimension;
      observationCount: number;
      // deliberately no lagDays/direction/strength — they are not trustworthy values yet,
      // whether because there isn't enough data OR because the effect fell below the
      // confidence floor. FR-403 treats both causes identically in the UI.
    };
```

**Open design question — RESOLVED as one variant (Open Question 1; plan 01-05 recorded assumption 1
and task 1's freeze checkpoint):** FR-403's wording ("suppress any pattern below threshold") reads as
one unified gate covering both "too few observations" and "enough observations but a weak/absent
effect." The sketch above treats these as the *same* `still-learning` variant for that reason. The
three-way alternative — distinguishing "we don't know yet" from "we checked thoroughly and found
nothing" — was raised explicitly before the freeze and declined, so it is a decision rather than a
default. It was cheap to decide then and expensive to change after Friday's freeze, which is why it
was decided then.

### `LogEntry` — grounded in `product/04-data-model.md`'s existing CHECKIN/SYMPTOM_ENTRY entities

```typescript
// Source: synthesized from product/04-data-model.md:36-47 (CHECKIN, SYMPTOM_ENTRY) and
// product/00-PRD.md:334 (FR-201 field list)
interface LogEntry {
  id: string;           // uuid
  timestamp: string;    // ISO 8601 — data-model.md's `ts`
  mood: number;
  energy: number;
  sleepHours: number;
  bedTime: string;      // data-model.md's `bed_time`
  symptoms: Array<{ dimension: SymptomDimension; severity: number }>; // data-model.md's SYMPTOM_ENTRY
}
```

**Note:** `product/04-data-model.md`'s existing `INSIGHT` entity (`pattern: string, lag_days, strength,
observations, surfaced: bool`) [VERIFIED: product/04-data-model.md:69-75] **predates** and does **not**
satisfy HACK-01's stricter mandate — `surfaced: bool` is a boolean flag bolted onto an otherwise-always
-present shape, exactly the "null/undefined special case" HACK-01 explicitly rules out. Do not carry that
shape forward unmodified; the `Finding` union above is the corrected design. (For contrast, this same data
model's `VERDICT.result` entity already treats *"no detectable change" as a first-class value*
[VERIFIED: product/04-data-model.md:96] for Experiment Mode — that precedent, not `INSIGHT`, is the right
one to extend.)

### `ExportPayload` — grounded in FR-501/502/504 (MVP, P0 requirements)

```typescript
// Source: synthesized from product/00-PRD.md:473-476 (FR-501, FR-502, FR-504)
interface ExportPayload {
  cycleHistoryMonths: 18;
  intervalStats: { meanDays: number; medianDays: number; bleedsPerYear: number };
  bleedingLog: Array<{ date: string; flow: 'spotting' | 'light' | 'moderate' | 'heavy' }>;
  symptomTimeline: LogEntry[];
  medicationLog: Array<{ name: string; startDate: string }>;
  suggestedTests: string[]; // FR-503: fasting insulin, free testosterone, DHEAS, 75g OGTT, AMH
  disclaimer: 'wellness-trend-not-clinical-measurement'; // FR-504 is MVP/P0 — do not lose this in the freeze
}
```

FR-504 (*"Label all app-derived physiological values in exports explicitly as wellness trends, not
clinical measurements"* [VERIFIED: product/00-PRD.md:476]) is easy to drop when a type is frozen quickly
under time pressure — it is a single required literal field above specifically so it cannot be typed
around.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | General discriminated-union / `never`-exhaustiveness pattern description is standard, uncontested TypeScript practice | Architecture Patterns, Pattern 1 | Low — this is widely-documented community consensus; risk is only in exact phrasing, not correctness |
| A2 | Synthetic-null-validation methodology (surrogate/block-permutation, shared-confound risk) generalizes cleanly to this project's specific data shape | Common Pitfalls 2 | Medium — if the real generator's variable model doesn't actually share a cycle-phase confound the way assumed, the specific null-pair risk described may not apply; still worth Satheesh's explicit check |
| A3 | Mulberry32 / seedrandom / rand-seed are adequate PRNG quality for ~426 days of daily synthetic values | Standard Stack, Don't Hand-Roll | Low — any of these is far better than a hand-rolled alternative; the specific library choice barely matters here |
| A4 | Benjamini-Hochberg independence-assumption violation across adjacent lag-tests is a real concern for whatever statistic Phase 2's engine ends up using | Standard Stack (websearch findings) | Medium — this is Phase 2/4 engine-design territory, included here only as calibration context for how conservatively Satheesh should set the planted effect size; does not block any Phase 1 task |

**If this table is empty:** it is not — the four items above are the general technical/statistical
background pulled from open web search this session (not cross-checked against one authoritative primary
source). Everything else in this document that carries a `[VERIFIED: ...]` tag was confirmed by directly
reading the cited file or running the cited command this session, and is not in this table.

---

## Open Questions (RESOLVED)

All five were carried into the Phase 1 plan set and closed there. Each carries a `**RESOLVED —**`
line naming the plan and task that closed it. The question text above each resolution is left exactly
as it was written during research, so the record shows what was unclear at the time rather than a
retrofit.

1. **Should "still learning" cover both "too few observations" and "enough observations, weak effect" as
   one variant, or two?**
   - What we know: FR-403's literal wording treats both causes as one unified suppression behavior.
   - What's unclear: whether Dhodraj wants the type itself to preserve the distinction internally even
     if the UI renders them the same way.
   - Recommendation: ship the two-variant design in Code Examples above (matches FR-403 literally); raise
     the three-way alternative explicitly before Friday's freeze so it's a choice, not a default.
   - **RESOLVED — one variant.** Recorded as a decision rather than a default in plan 01-04 recorded
     assumption 1 and plan 01-05 recorded assumption 1, with FR-403's wording as the authority. The
     three-way alternative is explicitly declined and closed. Plan 01-05 task 1 (the freeze
     checkpoint) is where it could still have been reopened; plan 01-04's Gaps mechanism was the
     route for any screen that needed the distinction to say so before Friday. If the engine later
     needs it internally, it lives in the engine's working types, not the frozen surface.

2. **Is "Capacitor 6" in ADR-001 a hard version pin or shorthand for "current Capacitor"?**
   - What we know: the registry's current stable is 8.5.0, two majors ahead.
   - What's unclear: whether the team has an unstated reason to want v6 specifically.
   - Recommendation: confirm explicitly with whoever owns ADR-001 before Rahul scaffolds; default to
     current stable (8.5.0) absent a stated reason otherwise, since this is a brand-new scaffold with no
     existing v6 investment to protect.
   - **RESOLVED — literal pin, 6.2.1.** Plan 01-01 recorded assumption 1 reads ADR-001's "Capacitor 6"
     as a hard pin, and plan 01-01 task 1 is a blocking human checkpoint that makes Rahul confirm that
     down-pin by name before any install runs. Plan 01-01's task 2 verify asserts the installed
     `@capacitor/core` matches `^6\.` (T-01-04), so drift to 8.x or a 9.x alpha fails the tracer
     rather than surfacing on demo day. Two sibling down-pins were resolved the same way at the same
     checkpoint: React 18.3.1 and TypeScript 5.9.3.

3. **Repo visibility (HACK-12, OPEN-12) — additional technical wrinkle found this session.** The `gh`
   CLI on this machine is authenticated as two accounts (`work-account`, active; `Dhodraj`, inactive).
   The active account's API/GraphQL calls **cannot resolve**
   `Build-with-AI-Code-for-Communities/health-team-311-war-room` at all (`Could not resolve to a
   Repository`) [VERIFIED: `gh repo view` output this session], while the same account **can** see
   `Dhodraj/pmos-companion` (public) without issue. This suggests the org repo's visibility/membership
   is tied to the *other* logged-in identity, or the org repo is private and this account isn't a member.
   - Recommendation: resolve repo visibility and the three pending collaborator invites using whichever
     account actually has org access (`gh auth switch`), rather than assuming the currently-active
     account's view is authoritative — it visibly is not, for this repo.
   - **RESOLVED — routed to plan 01-02, identity first.** Task 3 step 1 records the active account,
     step 2 switches to `Dhodraj` and proves org-repo resolution before any mutating call (T-02-01),
     and step 4 closes the three invites by chasing the existing links rather than re-issuing them.
     Visibility itself is a one-way act, so it sits behind the task 2 `checkpoint:decision`
     (T-02-02) rather than being decided by research. The related question of whether the scaffold
     may be published at all is the same checkpoint's second axis, and the mechanics of that push —
     explicit refspec, asserted commit range, no checkout — are fixed by
     `ops/branch-protocol.md`, written by plan 01-01 task 4.

4. **Hackathon start time** — not stated anywhere in either repository (checked `registration.md`,
   `track-analysis.md`, `form-fill.md`, `README.md`, `build-plan.md`). Genuinely unresolved; must be
   asked of organizers, exactly as HACK-12 already states.
   - **RESOLVED as a process, not as a value.** Plan 01-02 task 1 is a `checkpoint:human-action` that
     asks the organizers and records the verbatim reply; task 4 step 1 writes it into
     `hackathon/pre-event-answers.md` and step 3 reshifts every clock in build-plan.md section 8 from
     it. The plan forbids a guessed time and requires a named chaser if no answer has come back.
     Nothing in the phase proceeds on an assumed 09:00.

5. **Role-scope drift between the submitted registration and the current build-plan** — concrete
   evidence, not speculation, for why HACK-12's "confirm four scopes with all four people" matters:

   | Person | `hackathon/registration.md` (submitted) [VERIFIED:registration.md:8-13] | `hackathon/build-plan.md` (current) [VERIFIED:build-plan.md:38-42] |
   |---|---|---|
   | Rahul | "Evidence base, coaching content, escalation logic" | "DevOps only. Build, deploy, device, CI, secrets, seeding, backups" |
   | Satheesh | "UX and dignity review, demo, pitch" | "Dhodraj's second. Pairs on the engine... holds the sealed parameters, runs the demo" |

   Whatever Rahul and Satheesh last saw in writing (the registration) says something materially different
   from what they're actually being asked to do now. Recommend HACK-12's confirmation task literally show
   each person `build-plan.md` §2, not assume they've independently converged on the same understanding.
   - **RESOLVED — plan 01-02 task 4 step 5.** Adopted verbatim: the Role Scopes section quotes
     build-plan.md section 2's Scope and "one rule" cells for each of the four people, shows each
     person their own row rather than assuming convergence, and records a dated confirmation from
     that person. The acceptance criteria require four rows with ISO dates, and the plan forbids
     Rahul answering on anyone else's behalf. The two drifts this question surfaced — Rahul's
     evidence-base description versus DevOps-only, and Satheesh's UX description versus engine
     second and sealed-parameter custodian — are named in the task text so neither is glossed.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All scaffolding | ✓ [VERIFIED: `node --version`] | v22.16.0 | — |
| npm | Package install | ✓ [VERIFIED: `npm --version`] | 10.9.2 | — |
| Java (OpenJDK) | Android/Gradle builds | ✓ [VERIFIED: `java -version`] | 17.0.19 | — |
| Android SDK / `adb` | HACK-12 "Android toolchain on all four machines" | **✗ on this machine** [VERIFIED: `command -v adb` empty, `$ANDROID_HOME`/`$ANDROID_SDK_ROOT` unset] | — | Install Android Studio or standalone command-line tools + platform-tools before Friday; this is a concrete, verified gap on at least one of the four machines, not a hypothetical risk |
| `gh` CLI | HACK-12 repo-visibility/collaborator checks | ✓, but see Open Question 3 | authenticated, two accounts | Use the account with actual org access, or ask the org owner directly |
| `git` (both repos present locally) | All of Phase 1 | ✓ [VERIFIED: both repos cloned, `git log`/`git remote -v` succeed] | — | — |
| `@capacitor/cli` / Capacitor project | HACK-01, HACK-12 | **✗ — no scaffold exists yet** in `health-team-311-war-room` [VERIFIED: empty `src/`, no `package.json`] | — | This is a Phase 1 task, not a pre-existing condition — see Summary finding 1 |

**Missing dependencies with no fallback:** none — the Android SDK gap has a clear install path, and the
missing scaffold is itself a Phase 1 deliverable, not a blocker external to this phase.

**Missing dependencies with fallback:** Android SDK on this machine (install before Friday); `gh`
account-resolution ambiguity (switch accounts or use browser/org-owner directly).

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed yet in either repository — recommend `vitest` **4.1.10** [VERIFIED: `npm view vitest version`], zero extra config cost since Vite is already the locked bundler |
| Config file | none — see Wave 0 Gaps |
| Quick run command | `npx vitest run --dir src/types` (once scaffolded) |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HACK-01 | Three types compile; every `Finding` variant is exhaustively handled in at least one sample `switch` | typecheck + unit | `tsc --noEmit && npx vitest run src/types` | ❌ Wave 0 |
| HACK-02 | Generator is deterministic (same seed ⇒ identical output) | unit | `npx vitest run tools/generate-history.test.ts` | ❌ Wave 0 |
| HACK-02 | Generator output schema is identical regardless of which candidate pair/lag is passed (no leakage — Pitfall re: schema shape) | unit | `npx vitest run tools/generate-history.test.ts` | ❌ Wave 0 |
| DOCFIX-01/02/03 | None of the retired phrases reappear anywhere in either repo | smoke / CI grep guard | `! grep -rniE "against 6%|camera heart rate was cut|day 47 of your usual|building my case" --include=*.md .` | ❌ Wave 0 |
| HACK-12 | Manual-only — organizational confirmations | manual-only | — (checklist, not automatable) | n/a |

### Sampling Rate
- **Per task commit:** `tsc --noEmit` on every commit touching `src/types/`.
- **Per wave merge:** full `vitest run` plus the DOCFIX grep guard.
- **Phase gate:** grep guard green, `tsc --noEmit` green, generator determinism test green, before this
  phase is declared done.

### Wave 0 Gaps
- [ ] `package.json` / Vite+TS scaffold in `health-team-311-war-room` — nothing exists yet
- [ ] `src/types/*.ts` — the three frozen files themselves
- [ ] `tools/generate-history.test.ts` — determinism + schema-non-leakage tests
- [ ] A one-line CI/local grep guard script for the three retired DOCFIX phrases, run across both
      repositories
- [ ] `vitest` install and minimal config, if the team adopts automated testing here at all

---

## Security Domain

`security_enforcement` config key is absent from `.planning/config.json` (the file does not exist), so
per protocol this defaults to enabled — but this phase does not touch authentication, session handling,
user input surfaces, or data storage of real user data (the generator produces synthetic fixtures for a
demo persona, not real health records). ASVS categories are assessed for completeness rather than
depth:

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No auth surface exists in Phase 1's deliverables |
| V3 Session Management | No | Same |
| V4 Access Control | No | Same |
| V5 Input Validation | Marginal | The `Finding`/`LogEntry` type freeze is the input-validation-relevant artefact — see Pitfall 4 (compile-time-only guarantee, `zod` recommended for the runtime gap) |
| V6 Cryptography | No | Not touched until Phase 3 (`ADR-004`'s AES-256/Keystore requirements are PRIV-05, Phase 3) |

No PMOS-specific threat patterns (crisis-path generation, consent inheritance, etc.) apply to this
phase's actual deliverables — those first become live in Phase 3 onward. Recorded here as "assessed, not
applicable," per protocol, rather than silently omitted.

---

## Sources

### Primary (HIGH confidence — read directly this session)
- `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/STATE.md`, `.planning/ROADMAP.md`,
  `.planning/INGEST-CONFLICTS.md` — locked decisions, requirement text, traceability
- `product/00-PRD.md` (§2.2, §5.3, §9.2, §9.5, §15.2, FR-201/403/404/501-509) — verbatim field lists and
  the exact retired/corrected phrasing
- `product/04-data-model.md` — existing entity shapes (CHECKIN, INSIGHT, VERDICT) and why `INSIGHT`'s
  existing shape does not satisfy HACK-01
- `hackathon/build-plan.md` — the frozen-contracts mandate, the blind-test protocol, custody separation,
  team ownership boundaries
- `hackathon/proposal.md`, `hackathon/proposal-short.md`, `hackathon/form-fill.md`, `README.md`,
  `hackathon/registration.md`, `hackathon/clinician-review-brief.md` — full DOCFIX location sweep
- `~/Documents/Personal/health-team-311-war-room/PROPOSAL.md`, `README.md` — the team's
  separate public build repository, checked for the same claims
- Live tool output this session: `npm view` (all package versions), `gsd-tools query
  package-legitimacy check`, `gh repo view` / `gh auth status`, `date`, `node`/`java`/`adb` version
  probes, `git log`/`git remote -v` in both repositories

### Secondary (MEDIUM confidence — websearch cross-checked against the library's own official docs)
- [Dexie.js TypeScript guide](https://dexie.org/docs/Typescript) — schema/versioning pattern
- [Capacitor Configuration docs](https://capacitorjs.com/docs/config) and
  [Getting Started](https://capacitorjs.com/docs/getting-started) — scaffold order, `webDir` pitfall

### Tertiary (LOW confidence — general web search, not cross-checked against one primary source)
- [Discriminated Unions and Exhaustiveness Checking in TypeScript](https://www.fullstory.com/blog/discriminated-unions-and-exhaustiveness-checking-in-typescript/)
- [TypeScript issue #17448 on nested-switch exhaustiveness](https://github.com/Microsoft/TypeScript/issues/17448)
- [Mulberry32 deterministic RNG](https://www.4rknova.com/blog/2026/03/01/mulberry32-rng)
- [seedrandom on npm](https://www.npmjs.com/package/seedrandom), [rand-seed on npm](https://www.npmjs.com/package/rand-seed)
- [Dependence-Aware Lag-Resolved Correlation Analysis in Multi-Sensor Stochastic Systems](https://www.mdpi.com/1999-4893/19/7/606) — surrogate/block-permutation null testing
- [Controlling false discoveries: a guide to BH correction](https://www.statsig.com/perspectives/controlling-false-discoveries-guide) and the [Biostathandbook multiple-comparisons chapter](https://www.biostathandbook.com/multiplecomparisons.html) — independence assumption, Benjamini-Yekutieli alternative

---

## Metadata

**Confidence breakdown:**
- DOCFIX location map, locked decisions, environment facts: HIGH — every claim was read from a file or
  produced by a command this session, not recalled from training data
- Discriminated-union / generator architecture patterns: MEDIUM — the patterns themselves are standard
  and the field lists are grounded in verbatim in-repo quotes, but the general TypeScript-community
  framing around them is LOW/tertiary per the source hierarchy
- Package versions and legitimacy: HIGH — verified against the live npm registry this session;
  explicitly flagged where this diverges from what training-era knowledge would have assumed (Capacitor,
  TypeScript, Vite major versions)
- Statistical background (FDR correction, synthetic-null methodology): LOW — general web synthesis,
  included as calibration context for Phase 2/4, not load-bearing for any Phase 1 task

**Research date:** 2026-08-03
**Valid until:** For the organizational/schedule findings (Sunday's elapsed day, role-scope drift, repo
visibility) — valid only until the team acts on them, effectively this week. For the technical patterns
(discriminated unions, Dexie, Capacitor scaffolding) — stable, ~90 days. For the exact package version
numbers — re-verify before Friday's freeze if more than a few days pass, since this session already found
the ecosystem has moved further/faster than training-era assumptions would predict.
