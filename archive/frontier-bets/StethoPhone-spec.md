# StethoPhone — Build-Ready Spec
### Tech for Good 2026 · Track: AI for Good Health & Well-being
*Zero-to-one: turn a bare smartphone into an AI screening stethoscope — no hardware.*

---

## 1. The one-line pitch
**Press your phone to the chest for 20 seconds → it detects heart murmurs and abnormal lung sounds and tells you "this needs a doctor" — no stethoscope, no device, no internet.**

A ₹300 toy stethoscope earpiece or a paper cone is the *only* physical part. Everything else is signal processing + AI on a phone everyone already owns.

---

## 2. Why this is zero-to-one (not another app)
- **The instrument doesn't exist at scale.** AI stethoscopes are real (Eko in the US) but need a **$300+ hardware stethoscope**. Nobody has shipped a *bare-phone-mic + AI* screening stethoscope calibrated for India's low-end phones. The measurement capability itself is new to the mass market.
- **The screening gap is enormous and specific.** India has one of the world's highest **Rheumatic Heart Disease (RHD)** burdens — it starts in children, is *detectable by murmur years before symptoms*, and there is no scalable auscultation-screening program because it needs a trained ear + a stethoscope in every school/PHC. StethoPhone puts that ear in every teacher's/ASHA's/parent's pocket. Same engine screens **COPD/asthma/pneumonia** from lung crackles & wheezes (India = huge respiratory burden).
- **It fits you.** You're a telemedicine engineer — this is the objective diagnostic layer telehealth is missing. During a video consult, the patient presses the phone to their chest and the doctor gets a real phonocardiogram, not just "breathe for me."

---

## 3. Feasibility — the physics is on your side (verified)
- Heart sounds **S1 (10–180 Hz)** and **S2 (50–250 Hz)**, plus murmurs up to ~600–2000 Hz, all sit inside a phone mic's 44.1 kHz sampling range. ([EHJ Digital Health — smartphone heart-sound feasibility](https://academic.oup.com/ehjdh/article/doi/10.1093/ehjdh/ztaf007/8006140))
- Built-in smartphone mics have already detected **aortic stenosis** in a clinical study. ([European Heart Journal 2023](https://academic.oup.com/eurheartj/article/44/Supplement_2/ehad655.2983/7390790))
- Consumer apps (iStethoscope, Echoes) prove non-experts can capture usable heart sound at home. ([EHJ-DH: smartphone as electronic stethoscope](https://academic.oup.com/ehjdh/article/3/3/473/6675713))
- **The real challenge = lower SNR** than a true stethoscope. That's exactly what the coupler + denoising + ML pipeline below is for — and it's the moat, because getting it robust is hard.

---

## 4. The hard technical core (what makes judges say "how?!")
This is a genuine signal-processing + ML achievement, not a Gemini call:

1. **Acoustic coupling** — a passive cone (paper cup / 3D-printed bell / cheap stethoscope chestpiece taped over the phone's bottom mic) mechanically couples low-frequency chest vibration into the mic and blocks ambient noise. Cheap, but the design is what makes weak S1/S2 readable.
2. **Signal pipeline** — record 44.1 kHz WAV → bandpass (heart 20–600 Hz / lung 100–2000 Hz) → spike & friction-noise removal → **Shannon-energy envelope** to segment S1/S2 heartbeats → a **Signal Quality Index** that *rejects* a bad recording and coaches "press harder / quieter room" (this quality gate is what separates a real tool from a toy).
3. **AI classifier** — log-mel spectrogram → **CNN (ResNet-style, 1D on raw PCG or 2D on spectrogram)**:
   - Heart: murmur present/absent → likely lesion (aortic stenosis / mitral regurg / innocent) + confidence.
   - Lung: crackle / wheeze detection → asthma / COPD / pneumonia flag.
4. **On-device inference (TFLite)** — runs offline, audio never leaves the phone (privacy = DPDP-friendly, and a wow in itself).
5. **Explainable output** — highlight *where* on the spectrogram the murmur is, mark the cardiac cycle, and always output a **screening referral**, never a diagnosis.

---

## 5. Public data so you can demo a REAL model in 36hr
- **PhysioNet/CinC 2016** — thousands of labelled normal/abnormal heart-sound recordings.
- **CirCor DigiScope 2022** — pediatric murmur dataset (with murmur grading) — perfect for the RHD story.
- **ICBHI 2017 Respiratory Sound DB** — crackle/wheeze labelled lung sounds.
- **HLS-CMDS 2024** — manikin heart+lung sounds at multiple chest positions ([arXiv](https://arxiv.org/abs/2410.03280)) — ideal for a *reproducible live demo* on a manikin/speaker.

Pretrain on these; the fine-tune-on-India-phone-recordings is the roadmap moat.

---

## 6. The 36-hour MVP (cut ruthlessly)
**Build:** heart-murmur screening only, one great flow.
- PWA/Android records 20 s via the coupler → pipeline → TFLite CNN trained on CinC 2016 + CirCor → output: **murmur / no murmur + confidence + live spectrogram with S1/S2 marked + "Refer to a doctor."**
- Signal Quality gate that visibly rejects a noisy take and coaches the user.
- A "during teleconsult" mode mock: the doctor's screen shows the incoming phonocardiogram.

**Cut to slideware:** lung module, lesion sub-classification, on-device model optimization, real EHR/ABHA write, multi-position guidance.

**Demo reliability trick:** drive the wow with a **Bluetooth speaker or manikin playing known normal vs murmur recordings** (from HLS-CMDS) so it works every time on stage — then do one *live* capture on a teammate's chest for the "it's real" moment.

---

## 7. The 90-second demo
1. "A stethoscope costs ₹2,000 and needs a trained ear. India can't screen millions of kids for rheumatic heart disease with that." Hold up a phone + a paper cup.
2. Tape the cup over the mic, press to a teammate's chest. Live on screen: a **pulsing phonocardiogram, S1/S2 auto-marked** — "no murmur, normal." Judges see the heartbeat drawn from sound.
3. Now press it to the speaker playing a real aortic-stenosis recording. Screen flashes **"Systolic murmur detected — suggestive of aortic stenosis. Refer."** with the murmur highlighted on the spectrogram.
4. "Offline. On a ₹7,000 phone. No stethoscope. This is a cardiology screening tool for every school, PHC, and teleconsult in India."

---

## 8. Moat / why hard to clone
- **The robustness + coupler + quality-gate pipeline** is genuinely hard — a weekend clone gets a jittery waveform in a silent room; the real thing works in a noisy clinic on a cheap phone.
- **A self-recorded India corpus** (phone + coupler, real chests, low-end mics) compounds and can't be scraped — it's the fine-tuning data no one else has.
- Deep-tech + regulatory slog = schlep blindness that filters out fast-followers.

---

## 9. Real impact + market (India)
- **RHD:** among the highest global burden; murmur-detectable; no scalable school screening today → StethoPhone = the screening rail.
- **Respiratory:** COPD/asthma/pneumonia — massive, and lung auscultation is the same engine.
- **Buyers:** state school-health & Ayushman programs (B2G), PHC/ASHA rails, telemedicine platforms (B2B2C — your world), rural clinics. Scales as software; hardware is a paper cup.

---

## 10. Regulatory & honest risks
- **Regulatory:** position as **screening / decision-support with mandatory human referral**, not diagnosis (Software-as-Medical-Device caution; CDSCO). DPDP: on-device audio, nothing stored without consent.
- **Risks (be honest in the pitch):**
  - SNR on the cheapest phones + noisy real clinics — the quality-gate mitigates but is the core risk; demo on a messy real capture, not just curated audio.
  - Coupler dependency — ship the cone design; without it low-freq S1 is weak.
  - Clinical validation is a long road — hackathon proves the *signal + model*, not clinical-grade accuracy; say so.
  - Don't overclaim lesion sub-typing in 36hr — murmur/no-murmur + refer is the honest, winnable claim.

---

## 11. Registration answers
- **Role:** Full-Stack Developer (Health-Tech) — React/PWA, on-device ML (TFLite), telemedicine.
- **Preferred track:** **AI for Good Health & Well-being**
- **Team:** 2–4. Split: 1 signal-processing/ML (pipeline + CNN), 1 mobile/PWA (audio capture + on-device inference + UI), 1 for the coupler + demo + clinical framing + deck.

**"Anything else you'd like us to know?"**
> We're building StethoPhone — an AI screening stethoscope that runs on a bare smartphone, no hardware. Heart sounds live in the frequency range a phone mic already captures; with a passive paper-cone coupler, a denoising + segmentation pipeline, and a CNN trained on open phonocardiogram datasets, the phone detects heart murmurs and abnormal lung sounds and hands back a "see a doctor" screening result — offline, on a ₹7,000 phone. India has one of the world's highest rheumatic-heart-disease burdens; it's detectable by murmur years early, but there's no scalable way to auscultate millions of children. StethoPhone puts a screening ear in every teacher's, ASHA's, and parent's pocket, and gives telemedicine the objective diagnostic layer it's missing today. Screening, not diagnosis — always with human referral.
