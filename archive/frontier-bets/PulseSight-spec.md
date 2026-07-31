# PulseSight — Build-Ready Spec
### Tech for Good 2026 · Track: AI for Good Health & Well-being
*Zero-to-one: turn the video stream itself into a contactless vital-signs monitor — no device touches the patient.*

---

## 1. The one-line pitch
**Point the phone camera at a face for 30 seconds → live heart rate, heart-rate variability, respiration rate, SpO₂ trend, and stress — no wearable, no cuff, no touch.** During a teleconsult it runs silently on the video the doctor is already seeing.

---

## 2. Why this is zero-to-one (not another app)
- **Every teleconsultation in India is blind.** a telemedicine company, Practo, Apollo 24|7 — the doctor sees a *face* and zero objective vitals. PulseSight makes **the video call itself the measurement device.** That's a new capability layer under an entire industry, not a better app.
- **Contactless = screening at a billion-person scale with zero hardware.** No cuff, no oximeter, no wearable to buy or charge. A phone front camera becomes a vitals scanner for OPD queues, pharmacies, camps, schools.
- **Your unfair fit:** you build telemedicine. This is the missing objective-data layer your exact product needs — capture vitals passively while the patient just… talks to the doctor.

---

## 3. The hard technical core — remote photoplethysmography (rPPG)
Genuinely hard signal + ML, not an API call:

1. **The physical signal:** with each heartbeat, blood volume in facial skin changes, altering how much light the skin absorbs — a **sub-perceptual color fluctuation** (mostly in the green channel) invisible to the eye but present in video. rPPG extracts it.
2. **Face & ROI tracking:** detect face, pick stable skin regions (forehead, cheeks), track them frame-to-frame, exclude eyes/mouth/hair/shadows.
3. **Signal extraction:** per-frame spatial averaging of skin pixels → raw RGB traces → **CHROM / POS projection** (motion-robust color-space methods) → a pulse waveform.
4. **Denoising the killers — motion & lighting:** the whole difficulty is rejecting head movement, flicker, and changing light. Bandpass (0.7–4 Hz ≈ 42–240 bpm), detrending, ICA, and a **signal-quality gate** that refuses a bad clip and coaches "hold still / face the light."
5. **Derived vitals:**
   - **Heart rate** — frequency peak of the pulse wave (solid).
   - **HR variability / stress** — beat-to-beat interval variation (solid).
   - **Respiration rate** — respiratory sinus arrhythmia + subtle head/chest motion (good).
   - **SpO₂ trend** — ratio of red/blue vs green pulsatility (research-grade → report as *trend*, not clinical %).
   - **Blood-pressure trend** — from pulse-wave features (**experimental** — trend/relative only, never a clinical mmHg claim).
6. **On-device / real-time** — runs on the live camera feed; nothing leaves the phone (privacy = DPDP-friendly).

---

## 4. Feasibility — real, with honest capability tiers
rPPG is established science; the discipline is **claiming only what's defensible:**

| Vital | Maturity | How to present it |
|---|---|---|
| Heart rate | Strong (FDA-cleared apps exist globally) | Report as a number |
| HR variability / stress | Strong | Report as a number/index |
| Respiration rate | Good | Report as a number |
| SpO₂ | Research-grade on phones | Report as **trend**, flag "not a medical oximeter" |
| Blood pressure | Experimental | **Trend/relative only**, never mmHg |

Global proxies prove the model works (Binah.ai, Nuralogix — but tuned for Western contexts and often SDK-locked). The open wedge: **India skin-tone-calibrated, low-end-camera, teleconsult-integrated.**

---

## 5. The 36-hour MVP (cut ruthlessly)
**Build:** heart rate + HRV + respiration from a 30 s face capture — done *well*.
- Camera → face/ROI tracking → POS/CHROM extraction → live pulse waveform → HR + HRV + respiration + a signal-quality gate that rejects bad clips.
- Show the **live pulse waveform pulsing** next to the face (the wow).
- "Teleconsult mode": vitals panel appears beside a mock video-call UI.

**Cut to slideware:** SpO₂/BP trends, on-device optimization, longitudinal tracking, EHR/ABHA write.

**Demo reliability:** controlled hackathon lighting *helps* rPPG. Validate HR live against a cheap pulse-oximeter or smartwatch on stage for the "it's accurate" proof.

---

## 6. The 90-second demo
1. "Every video consult in India is blind — the doctor sees a face, not one vital sign."
2. Point the phone at a judge's face. In ~10 s a **pulse waveform starts beating on screen**, HR appears: "72 bpm."
3. Ask them to hold their breath / do 10 squats — **HR visibly climbs**, respiration changes. Judges watch their own body read off a camera.
4. Put a smartwatch on the same wrist — numbers match. "Contactless. No device. This turns every teleconsult and every OPD queue into a vitals station."

---

## 7. Moat / why hard to clone
- **Motion/lighting robustness on cheap cameras + skin-tone calibration** is the hard part — a weekend clone gets a number that's right only on a still face in good light.
- **India-recorded rPPG dataset** (varied skin tones, low-end front cameras, real lighting) compounds and can't be scraped.
- Teleconsult integration + the accuracy-validation slog filters fast-followers.

---

## 8. Real impact + market (India)
- Contactless vitals for **OPD triage queues, pharmacies, health camps, school screening**, and every **teleconsultation** (your world).
- Especially valuable where oximeters/cuffs are scarce or a contact device is impractical.
- **Buyers:** telemedicine platforms (B2B2C SDK — the natural first customer), hospital OPD triage, insurers/corporate wellness, government screening. Scales as pure software.

---

## 9. Regulatory & honest risks
- **Regulatory:** wellness/screening framing; HR/HRV/respiration are defensible; **do NOT make clinical SpO₂ or BP claims** (SaMD/CDSCO risk). DPDP: on-device, consent for any video retention.
- **Risks (say them in the pitch):**
  - Motion & lighting are the accuracy killers — the quality-gate is essential; demo a *slightly* imperfect real capture, not only ideal conditions.
  - Dark skin tones + low light reduce signal → must be in the training/calibration or you'll fail exactly the users who matter.
  - Over-claiming BP/SpO₂ is the credibility trap — tier your claims honestly and judges will trust you more.

---

## 10. Registration answers
- **Role:** Full-Stack Developer (Health-Tech) — React/PWA, computer vision / on-device ML, telemedicine.
- **Team:** 2–4. Split: 1 CV/signal (rPPG pipeline), 1 mobile/PWA (camera + real-time UI + waveform), 1 for validation + demo + clinical framing + deck.

**"Anything else you'd like us to know?"**
> We're building PulseSight — contactless vital signs from a plain phone camera. Every heartbeat changes the color of facial skin by an amount too small to see but present in video; using remote photoplethysmography (rPPG) with motion- and lighting-robust signal extraction and a signal-quality gate, PulseSight reads heart rate, heart-rate variability, respiration, and stress from a 30-second face capture — no wearable, no cuff, no touch. Every teleconsultation in India today is blind: the doctor sees a face and zero objective vitals. PulseSight turns the video stream itself into a vitals station — for teleconsults, OPD triage queues, pharmacies, and school camps. On-device and private. We tier our claims honestly: heart rate, HRV and respiration as measurements; SpO₂ and blood-pressure as trends, never clinical values.
