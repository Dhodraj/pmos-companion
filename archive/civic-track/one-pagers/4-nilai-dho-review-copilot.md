# Nilai — DHO Review Copilot
**Track:** AI for Good — Health & Well-being · **Tag:** Safest Bet

**Pitch.** Drop a district's messy HMIS/RCH/stock exports in; get back a ranked, explained monthly-review agenda — which PHCs to fix first, why, and which numbers to distrust.

**Universal core vs Tamil launch locale.** *Generalizes:* a decision layer *above* any national health MIS — ingest heterogeneous exports, compute a composite facility score + data-quality flags, output a ranked, cited review agenda. The "trust these numbers, doubt those" sentinel over gamed field data is universal. *Locale only:* Tamil TTS briefs, TN HMIS/RCH schema, NHM indicator norms — a swappable skin.

**Pains it covers (breadth from one product).**
- Consumption/coverage monitoring incl. one stock item → surfaces stock-out risk
- Defaulter & low-coverage clusters ranked for follow-up
- Protocol-grounded decision support (root-cause narrative + data-distrust sentinel)

**Evidence (one hard point).** India's own HMIS routinely diverges from population surveys — NFHS-5 immunization/ANC coverage repeatedly contradicts administrative HMIS figures, and DPH data-quality reviews flag zero-reports and round-number entries. The gap officials already suspect is exactly what Nilai quantifies.

**Who uses it + core loop.** DHO/DDHS, Block Medical Officers, program officers prepping the monthly PHC review. Loop: export → ingest+normalize → score+flag → ranked top-5 agenda → drill-down to a concrete fix.

**AI stack.** Multimodal LLM (Gemini) for register-page OCR + schema/entity normalization; structured/function-calling for canonical indicator mapping; **deterministic** anomaly layer (z-score, Benford/round-number, MoM deltas) so flags are auditable, LLM only explains; RAG over NHM/RCH norms so every threshold cites an official number; Bhashini TTS/ASR for the Tamil audio brief.

**36hr MVP slice.** One district, ~15 PHCs, 3 indicators (immunization, ANC, one stock item). Hero flow: drop files → 15 PHCs self-rank → click top red PHC → see drivers + one Tamil talking point + playable audio brief. *Built:* single-district ranking + sentinel. *Vision:* multi-program, multi-district.

**90-sec wow.** Files in → live ranking → "why is Annur red?" → Tamil brief plays.

**Global scale path + TAM.** Buyers beyond TN: other Indian states (700+ districts), then any LMIC running DHIS2-class systems (WHO deploys DHIS2 in 70+ countries) — language-agnostic core, localized TTS.

**Pilot/incubation.** Read-only, PHI-free, aggregated → dodges procurement/security blockers. Pilot one TN block with a DDHS champion on 3 months of real exports; measure prep-time cut. TiE Kovai for DPH intros, GDG for enablement.

**Why it wins / risks.** Wins: zero-integration decision layer, not another dashboard; the distrust sentinel is the wedge. Risks: needs official data champion; handwritten-Tamil OCR needs human-in-loop; naming weak PHCs must read as supportive triage, not a league table.

*Note: intended evidence search was blocked (session web-search budget exhausted); the HMIS-vs-NFHS divergence point is from prior knowledge, not a fresh 2024-26 citation.*
