# Kanakku — Build Spec

**Pitch:** A voice-first back-office that turns every logged sale, purchase and udhaar a micro-enterprise generates into a compounding "data passport" — then auto-assembles it into invoices, credit statements, and insurance claims that make thin-file borrowers bankable.

**Universal core vs Tamil launch locale**
*Generalizes:* the thin-file-to-bankable engine — voice/photo transaction capture → one structured financial-identity record → auto-generated billing + credit + claim artefacts. Informal economies exist everywhere; the passport mechanism is language- and regime-agnostic.
*Locale wiring (swappable):* Tamil ASR/TTS, GST HSN codes, PMFBY insurance rules, Agmarknet mandi feed, Indian scheme-eligibility logic. Each is a pluggable adapter, not the product.

**Pains it covers (breadth from ONE product)**
- Paper-and-cash back-office: can't bill, can't handle GST, can't see per-item profit
- Captured records go nowhere: no structured proof for loans, insurance, or schemes — the same data stream simultaneously bills, insures, and underwrites

**Evidence (one hard point):** India's MSME formal-credit gap is estimated near USD 530B (IFC), with ~85% of small enterprises un/under-served — precisely because they're "thin-file." The daily data that would fix this is generated and discarded.

**Who uses it + core loop:** Women-led SHGs, kiranas, smallholders (secondary: extension officers, NBFC/co-op loan officers). Loop: *speak/snap a transaction → confirm via TTS readback → ledger + profit update live → tap to emit invoice/loan-statement.*

**AI stack:** Bhashini Tamil ASR (IndicConformer) for voice-in; Gemini 2.0 Flash structured-output as reasoner (Tamil→ledger JSON, profit math, HSN classification, form-fill); Bhashini/Google TTS for readback; RAG over GST/scheme/mandi tables to ground codes and prices; Gemini vision for paper-bill photo capture. Reasoner and vision layers are locale-independent.

**36hr MVP slice (one hero flow):** *Tamil voice-in → money-out.* Speak a sale/udhaar → Gemini parses to a ledger line with TTS confirm → live receivables + per-item profit → one tap emits a GST-grounded invoice. *Built:* this slice. *Vision-shown:* offline sync, WhatsApp reminders, PMFBY.

**90-sec demo wow:** After a handful of spoken entries, tap "loan-ready" — Gemini drafts a 6-month cash-flow PDF from the same voice data. Private Tamil speech in, bankable artefact out.

**Global scale path + TAM:** Swap adapters for other Indian states/languages, then any informal economy (Southeast Asia, Africa, LatAm) — a billion+ thin-file micro-enterprises. Revenue: consented, aggregated cash-flow data licensed for thin-file underwriting — never charging the enterprise.

**Pilot/incubation:** Coimbatore SHG federation + kirana association via TiE Kovai; GDG for Bhashini/MeitY access; wire one co-op bank/NBFC to accept the artefact for Rs.50k–2L loans — the adoption proof.

**Why it wins / risks:** Cross-integration is the moat — the same proprietary voice stream bills, insures, and underwrites; a UI clone starts at zero history. *Risks:* ASR noise (mitigated by confirm-before-commit), HSN misclassification (RAG + review-flagged), and lender acceptance being a partnership — not tech — problem.
