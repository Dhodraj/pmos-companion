# Feasibility Audit — PMOS complete-features spec

Adversarial audit of `product/03-complete-features-spec.md` against platform policy,
sensing science, device dependencies and citation accuracy.

**Status: 4 of 6 audits completed.** The workflow process died before the
`citations` and `clinical-regulatory` agents finished. Their findings are NOT here.

| Audit | Status | Headline |
|---|---|---|
| platform-policy | ✅ complete | Passive capture is an OS-vendor privilege; both iOS and Android hard-block third-party background/on-unlock camera |
| sensing-science | ✅ complete | Exactly two camera signals are validated and shippable (fingertip PPG HR, front-camera respiratory rate); App Store 1.4.1 bans SpO2/BP outright |
| phrm-third-party | ✅ complete | The Nature paper is genuine, but PHRM has no SDK and its model is licensed non-commercial-research-only; free-living valid-measurement rate was 43% overall, 25% for darkest skin tones |
| device-dependencies | ✅ complete | Only 2 of 23 "innovative" features are hard hardware deps; the real casualty is v1 wearable import, which was silently load-bearing |
| citations | ✅ complete (done manually) | **Competitors VERIFIED — both real, both ship "our" differentiators. NICE + OSA epidemiology verified.** |
| clinical-regulatory | ✅ complete (done manually) | **DPDP forces 18+ only at launch; OSA instruments are not free for commercial use; PHQ/GAD are free; CDSCO non-clinical position holds** |

Files: `audit-findings.json` (structured findings), `journal.jsonl` (raw agent returns),
`workflow.mjs` (re-runnable — resume run ID `wf_a1ddc455-95c`).

To finish the two missing audits, re-run the workflow; completed agents replay from cache.


## Competitor verification (done manually, 29 Jul)

Fetched directly rather than via the failed agent:

**PMOS Vera** (pmosvera.com) — **REAL and shipped.** iPhone-only, $5.99/mo or $39.99/yr.
Ships: irregular-native framing ("Day 47 sits inside your own usual range"), symptom/mood logging,
lab tracking (HOMA-IR, LH:FSH, vitamin D), Apple Health read-only, photo journal for skin/hair,
doctor PDF export, explicit weight-neutral stance, and a *stronger* privacy architecture than ours
(no servers, no accounts, no cloud, AES-256 on-device).

**Josie** (josie.care) — **REAL but not shipped** (waitlist, "beta coming soon").
Claims: 50+ symptoms/8 categories, pattern recognition, "specialist-specific prep reports",
"Building My Case mode", and four cycle states (irregular, oligomenorrhea, amenorrhea,
medically regulated) matching our §3.1 exactly.

**Impact:** the spec's competitive matrix was materially wrong and has been rewritten (§7).
Several claimed differentiators are parity features. Six genuine edges remain: Experiment Mode,
camera vitals, clinical safety depth, India-native, zero-commerce evidence grading, mycyclesafe funnel.

**Action items raised:** (1) close or stop claiming the privacy advantage — Vera has no servers at all;
(2) rewrite near-verbatim copy ("Day 47…", "Building My Case") before anything ships publicly;
(3) verify Vitalix and pmos-pcos.com.

## Clinical-regulatory findings (done manually, 29 Jul)

**🚨 DPDP forces 18+ only at launch.** Under-18 = "child"; requires verifiable parental consent
(age + parent identity) and the Act **prohibits tracking, behavioural monitoring and profiling of
children**. The Rule 11 healthcare exemption covers "clinical establishment / mental health
establishment / healthcare professional" restricted to providing health services — a non-clinical
wellness app cannot claim it while also claiming non-SaMD status. And the n-of-1 engine *is*
profiling. → "Teen-safe mode" replaced by an 18+ age gate. Real product loss (PMOS presents in
adolescence; 29% adolescent OSA prevalence), taken for legal reasons.

**⚠️ OSA instruments are not free.** Epworth = paid commercial licence via Mapi Research Trust.
STOP-BANG = CC BY-NC-ND, non-commercial only, no derivatives without permission. Berlin unclear.
→ Ship unbranded symptom questions, or license properly.

**✅ PHQ-9 / GAD-7 / PHQ-4 are free.** Pfizer released 2010, no copyright restriction, commercial
use and translation permitted without permission. (Still confirm which Hindi/Tamil translations are
formally *validated*.)

**✅ CDSCO position holds.** Final MDSW guidance issued; risk-based Class A–D; wellness/informational
software held to a lower standard. Class A NSNM exempt from full licensing (G.S.R. 777(E)) but
registration + post-market surveillance still required; ISO 13485 practical prerequisite.

**✅ Epidemiology verified.** OSA in PMOS 37% (29% adolescents, 40% adults) vs 6% non-PCOS; OR 9.52.

**✅ NICE citation verified.** GID-NG10436 "Polyendocrine Metabolic Ovarian Syndrome (PMOS)".
Draft consultation 1 Jul – 11 Aug 2026; publication expected 9 Dec 2026; already uses "PMOS" in
title and recommendations; an adaptation of the 2023 international guideline.

## Still open
- Which Hindi/Tamil PHQ-9/GAD-7 translations are formally validated (vs merely available)
- Berlin Questionnaire licensing status
- Vitalix (vitalix.health) and pmos-pcos.com competitor verification
- Flo FTC settlement / $56M class action exact figures
