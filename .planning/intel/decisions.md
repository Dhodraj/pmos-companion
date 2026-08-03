# Decisions

Architecture and product decisions extracted from the ingest set.

The four ADRs below are embedded in `product/00-PRD.md` §6 (manifest precedence 0). Per the
ingest manifest they are treated as **LOCKED** decisions: they cannot be auto-overridden by any
lower-precedence source. The six open decisions from PRD §14 are recorded as `proposed`.

---

## ADR-001: Capacitor shell with native plugins
- source: product/00-PRD.md §6 (ADR-001)
- status: locked
- decision: Ship a Capacitor shell wrapping the React web application, with native plugins (Swift/Kotlin) for every sensing capability. Roughly 85% of the product lives in the web layer; only sensing crosses the bridge. A Capacitor native plugin runs the same Swift and Kotlin code a fully native app would run, so for the PPG pipeline there is no capability or performance difference.
- scope: application architecture, platform shell, sensing core, camera PPG, HealthKit / Health Connect access, on-device ML, secure storage
- rejected alternatives: pure PWA (cannot deliver the sensing core — no web API for HealthKit or Health Connect, `getUserMedia` unreliable inside WKWebView, documented WebKit defect blanks camera preview when torch is enabled); React Native (workable, `react-native-vision-camera` frame processors suit PPG, but requires rebuilding the interface layer); separate Swift and Kotlin codebases (buy nothing native plugins do not already provide, cost two codebases for a four-person team)
- consequences: one codebase, React skills retained, native performance where it matters, any screen replaceable with native later, store distribution which health-data permissions require regardless

## ADR-002: Camera capture is always foreground and user-initiated
- source: product/00-PRD.md §6 (ADR-002)
- status: locked
- decision: Every camera measurement is a foreground, user-initiated session. Interaction model: notification → tap → foreground capture screen → 30 to 60 seconds → result. There is no passive, background or on-unlock capture on any platform.
- scope: all camera sensing, fingertip PPG, respiratory rate, face rPPG, skin capture
- rationale: iOS exposes no unlock event API and `AVCaptureSession` interrupts with `videoDeviceNotAvailableInBackground` when the app backgrounds; the green recording indicator cannot be suppressed. Android has blocked background camera since API 28, and Android 14+ throws `SecurityException` when a camera foreground service starts from the background because `CAMERA` is while-in-use. Web is more restricted than either. Google's PHRM works only because Google owns the OS face-unlock hook; no PHRM SDK, API, ML Kit feature or Health Connect type exists, and the released model is licensed non-commercial/non-clinical under IRB approval. Every commercial rPPG SDK (Binah.ai, NuraLogix, VitalLens) requires a foreground, user-held, still session.

## ADR-003: No external devices
- source: product/00-PRD.md §6 (ADR-003)
- status: locked
- decision: No feature may require the user to buy hardware. No watch, no sensor, no strips, no cuff. The claim is: works on a ₹10,000 phone. Laboratory tests are explicitly NOT a device dependency (a one-off service, guideline-mandated regardless, ~₹800 for fasting insulin), but the constraint that follows is that no insight, pattern, verdict, coaching action or export may be gated behind a laboratory value.
- scope: CGM sync (Dexcom Stelo, Abbott Libre), wearable dependency, glucometer, BP cuff, lab values
- rationale: Stelo is not sold in India; Libre publishes no third-party API so every working integration violates LibreView terms; CGM costs ~₹8,400/month, roughly half average per-capita monthly income; the 2023 Guideline names the OGTT at ₹100–300 as the accurate glycaemic test. India's wearables market contracted 4.0% in 2025 with smartwatches down 17.6%, and budget brands holding over half the market often ship no Health Connect integration.

## ADR-004: On-device inference as the privacy position
- source: product/00-PRD.md §6 (ADR-004)
- status: locked
- decision: Inference moves onto the device. PPG signal processing (native), skin scoring (TFLite or Core ML), sleep audio analysis (raw audio discarded), and the n-of-1 correlation engine all run on device. Companion question answering uses an on-device LLM where hardware allows, with cloud RAG fallback. Encrypted sync carries derived numbers only, never raw video, audio or images.
- scope: inference location, privacy architecture, sync payload, camera/audio/image processing
- rationale: PMOS Vera runs with no servers; we cannot claim stronger privacy while sending data to a cloud model.

---

## D1: Standalone application or a module inside mycyclesafe
- source: product/00-PRD.md §14
- status: proposed
- decision: Recommendation is standalone with a deep bridge — cleaner consent, PMOS-native identity, app-store search presence. Options considered: standalone, embedded.
- scope: product packaging, consent flow, app-store presence

## D2: Pricing and the freemium line
- source: product/00-PRD.md §14
- status: proposed
- decision: Not set. Recommendation is to anchor at ₹200 to ₹500 monthly, safety paths always free, monetise personalisation never safety.
- scope: pricing, monetisation, free tier boundary

## D3: Product name
- source: product/00-PRD.md §14
- status: proposed
- decision: Unresolved. Options: Cyster, PMOS-forward, condition-neutral. Condition-neutral scales to other conditions later; PMOS-forward wins search.
- scope: product naming, store metadata, SEO

## D4: How hard to lead with "PMOS"
- source: product/00-PRD.md §14
- status: proposed
- decision: Not set. Recommendation is to dual-name for three years and own both search surfaces.
- scope: branding, in-market naming, store metadata

## D5: Clinician portal timing
- source: product/00-PRD.md §14
- status: proposed
- decision: Recommendation is to defer until after NICE publishes (December 2026) for format alignment. Options: year one, or after NICE publishes.
- scope: clinician portal, roadmap sequencing

## D6: Hindi and Tamil together at v1, or Hindi first
- source: product/00-PRD.md §14
- status: proposed
- decision: Unresolved. Stated as depending on where mycyclesafe's Indian users concentrate. NOTE: the underlying user-distribution data does not exist at usable scale (see INGEST-CONFLICTS.md INFO-01); treat this dependency as unresolvable from current data.
- scope: localisation sequencing, Hindi, Tamil
