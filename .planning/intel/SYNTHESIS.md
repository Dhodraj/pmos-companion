# Synthesis

Entry point for downstream consumers (`gsd-roadmapper`). Mode: `new` — net-new bootstrap,
no existing `.planning/` context to merge against.

---

## Documents synthesized

7 of 7 classifications consumed. No UNKNOWN or low-confidence classifications.

| Precedence | Document | Type | Confidence |
|---|---|---|---|
| 0 | product/00-PRD.md | PRD | high |
| 1 | product/04-data-model.md | SPEC | high |
| 2 | product/03-complete-features-spec.md | SPEC | high |
| 3 | product/02-build-spec.md | SPEC | high |
| 4 | hackathon/proposal.md | DOC | high |
| 5 | hackathon/build-plan.md | DOC | high |
| 6 | product/01-product-definition.md | DOC | high |

All type assignments are manifest overrides and were honoured as authoritative.

Cross-ref cycle detection: directed graph of 5 edges (01→proposal; 03→01, 03→02; 04→00-PRD;
build-plan→proposal, build-plan→00-PRD; proposal→proposal-short). Max depth 3. **No cycles.**

---

## What is in the product

A daily well-being companion for Indian women aged 18 to 35 with PMOS (Polyendocrine Metabolic
Ovarian Syndrome, renamed from PCOS by a Monash-led global consensus published in The Lancet on
12 May 2026). It treats an irregular cycle as signal rather than error, learns each user's
personal lagged cause-and-effect patterns, and produces evidence a doctor accepts in a
seven-minute consultation. It runs on a ₹10,000 phone and requires no purchased hardware.

Two things are the spine of the project and must survive downstream planning intact:

1. **The correlation engine is the single component that must be working at the demo.** Everything
   else is built outward from it in rings and cut from the outside in. Ring 1 spine (check-in,
   engine, insight card, export) is never cut. This is a sequencing constraint from
   `hackathon/build-plan.md`, not a preference. See `constraints.md` CON-SEQ-01 through CON-SEQ-09.

2. **The product is NOT a medical device.** Screen and refer only: no diagnosis, no risk scores, no
   dosing. Health records never leave the device. Under-18s are excluded because DPDP prohibits
   profiling of children and the correlation engine is profiling. See `constraints.md` CON-REG-01
   through CON-REG-06.

---

## Decisions — `decisions.md`

**4 LOCKED** (all embedded in `product/00-PRD.md` §6, manifest-designated locked):

- ADR-001 Capacitor shell with native plugins
- ADR-002 Camera capture is always foreground and user-initiated
- ADR-003 No external devices
- ADR-004 On-device inference as the privacy position

**6 proposed / open** (PRD §14): D1 standalone vs module · D2 pricing and the freemium line ·
D3 product name (unresolved) · D4 how hard to lead with "PMOS" · D5 clinician portal timing ·
D6 Hindi and Tamil sequencing (dependency is unresolvable from current data — see INFO-01).

No LOCKED-vs-LOCKED contradiction exists. The four ADRs address disjoint scopes and reinforce
each other.

---

## Requirements — `requirements.md`

**13 requirement groups**, covering all functional requirements in PRD §9, preserved verbatim
with phase and priority:

REQ-cycle-engine (FR-101 to FR-109) · REQ-daily-checkin (FR-201 to FR-208) ·
REQ-camera-vitals (FR-301 to FR-312) · REQ-nof1-engine (FR-401 to FR-411) ·
REQ-doctor-advocacy (FR-501 to FR-509) · REQ-mental-health-safety (FR-601 to FR-609) ·
REQ-coaching-treatment (FR-701 to FR-711) · REQ-labs-screening (FR-801 to FR-807) ·
REQ-skin-visual (FR-901 to FR-906) · REQ-sleep (FR-1001 to FR-1004) ·
REQ-ai-companion (FR-1101 to FR-1104) · REQ-privacy-platform (FR-1201 to FR-1208) ·
REQ-notifications (FR-1301 to FR-1304).

Plus goals G1 to G5, non-goals, the metrics table with counter-metrics, the release plan with
MVP definition of done, and the user/persona set.

Three requirement groups carry contest notes: REQ-camera-vitals (WARN-01), REQ-daily-checkin
(WARN-02), REQ-labs-screening (INFO-05). REQ-privacy-platform FR-1204 carries the retraction
annotation (INFO-01).

---

## Constraints — `constraints.md`

**55 entries** across eight groups:

| Group | Count | Type breakdown |
|---|---|---|
| Sequencing (build-plan) | 9 | 8 protocol, 1 api-contract |
| Regulatory (PRD §11) | 6 | 6 nfr |
| Clinician review (proposal) | 8 | 7 protocol, 1 nfr |
| Feasibility rulings (03-spec §0) | 10 | 7 protocol, 2 nfr, 1 api-contract |
| Data model (04-data-model) | 4 | 4 schema |
| Non-functional (PRD §10) | 9 | 9 nfr |
| Build spec (02-build-spec) | 6 | 6 protocol |
| Architecture (proposal, 03-spec) | 3 | 3 protocol |

Type totals: 31 protocol · 18 nfr · 4 schema · 2 api-contract.

Highest-leverage entries: CON-SEQ-01 (correlation engine is the one thing that must work),
CON-SEQ-02/03 (ring order and cut list), CON-SEQ-07 (three frozen types, including that a
finding must be able to say *not enough data* as a value of the type), CON-REG-01 (18+ gate),
CON-REG-02 (screen-and-refer, App Store 1.4.1), CON-FEAS-02 (ten permanently cut features).

---

## Context — `context.md`

**16 topics**: the problem · evidence base and sourced figures · why now (the PMOS rename) ·
what she asks for · retention ladder · module set and phasing (proposal) · expected Sunday state ·
competitive position · differentiator stack (non-retracted entries only) · anti-features ·
evidence-graded coaching levers · mycyclesafe.ai verified position · business model ·
team and ownership · demo scripts on record · risks on record · open items before the build.

---

## Conflicts — see `../INGEST-CONFLICTS.md`

**0 blockers · 3 competing variants · 10 auto-resolved.**

Blockers: none. Safe to route.

Competing variants requiring a human decision before routing:
- **WARN-01** camera heart rate is simultaneously a P0 MVP critical-path feature (PRD) and a
  feature cut on clinical review (proposal), and is absent from every hackathon ring. Both
  variants preserved; do not let precedence silently restore it.
- **WARN-02** voice entry is v2/P2 in the PRD and Phase 1 in the proposal, and appears on the
  hackathon cut list without appearing in the hackathon schedule.
- **WARN-03** the sleep-apnoea prevalence claim: the PRD reinstates the direct headline
  comparison the clinician review removed.

Auto-resolved, recorded for transparency: INFO-01 (retracted mycyclesafe traction claim and its
six dependent claims, excluded everywhere, not open for resolution) · INFO-02 (ADR-004 beats the
build-spec's cloud skin-vision path) · INFO-03 (build-plan supersedes build-spec on demo
mechanics) · INFO-04 (18+ gate beats the 16–35 and teen-safe framings) · INFO-05 (three
non-equivalent phase axes must not be conflated) · INFO-06 (PWA fallback is a demo contingency,
not an architecture position) · INFO-07 (product naming) · INFO-08 (community out of scope,
support circle survives) · INFO-09 (five proposal modules with no PRD requirement — unrouted
scope, not conflict) · INFO-10 (near-verbatim competitor copy flagged for rewrite).

---

## Files

- `.planning/intel/decisions.md` — 4 locked ADRs, 6 open decisions
- `.planning/intel/requirements.md` — 13 requirement groups, goals, metrics, release plan, users
- `.planning/intel/constraints.md` — 55 constraints across sequencing, regulatory, clinician, feasibility, data model, NFR, build and architecture
- `.planning/intel/context.md` — 16 topics from the three DOC sources
- `.planning/INGEST-CONFLICTS.md` — full conflict report
