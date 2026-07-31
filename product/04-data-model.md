# PMOS Companion: Data Model

Companion document to the [PRD](./00-PRD.md). Entity relationships and the rules that govern them.

```mermaid
erDiagram
    USER ||--o{ CYCLE : has
    USER ||--o{ CHECKIN : logs
    USER ||--o{ MEASUREMENT : captures
    USER ||--o{ EXPERIMENT : runs
    USER ||--o{ LAB_RESULT : stores
    USER ||--o{ CONSENT : grants
    USER ||--o{ INSIGHT : receives
    USER ||--|| BASELINE_SET : owns

    CYCLE ||--o{ BLEED_EVENT : contains
    CHECKIN ||--o{ SYMPTOM_ENTRY : contains
    EXPERIMENT ||--o{ INTERVENTION : tracks
    EXPERIMENT ||--|| VERDICT : concludes
    MEASUREMENT }o--|| QUALITY_GATE : passes

    USER {
        uuid id PK
        int age_verified
        string locale
        enum cycle_state
        bool paused
    }
    CYCLE {
        uuid id PK
        date start
        int length_days
        enum type
        float phase_confidence
    }
    CHECKIN {
        uuid id PK
        datetime ts
        int mood
        int energy
        int sleep_hours
        time bed_time
    }
    SYMPTOM_ENTRY {
        string dimension
        int severity
    }
    MEASUREMENT {
        uuid id PK
        enum kind
        float value
        float confidence
        enum source
        string phase_tag
    }
    EXPERIMENT {
        uuid id PK
        string intervention
        string declared_outcome
        date baseline_start
        date washout_end
    }
    VERDICT {
        enum result
        float effect_size
        int n_observations
        string plain_language
    }
    INSIGHT {
        string pattern
        int lag_days
        float strength
        int observations
        bool surfaced
    }
    CONSENT {
        enum data_class
        bool granted
        datetime ts
        string purpose
    }
```

## Design rules

Four rules govern the schema. Every measurement carries confidence and source. Every insight carries an observation count, which the confidence gate reads. Consent is recorded per data class, never globally. Baselines are per user and per cycle phase.

## Field notes

| Entity | Note |
|---|---|
| USER | `age_verified` gates the 18+ requirement in REG-001. `paused` drives pause mode, FR-204 |
| CYCLE | `type` carries the named states from FR-103. `phase_confidence` keeps phase estimation probabilistic per FR-107 |
| MEASUREMENT | `confidence` and `source` are mandatory. The n-of-1 engine weights by confidence and never mixes sources silently |
| INSIGHT | `observations` feeds the confidence gate in FR-403. `surfaced` records whether it cleared the floor |
| VERDICT | `result` includes "no detectable change" as a first-class value, per FR-406 |
| CONSENT | One row per data class, never a global flag. Required by REG-005 |
| BASELINE_SET | Held per user and per cycle phase, so luteal variation is never read as an anomaly |
