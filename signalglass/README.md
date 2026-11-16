# SignalGlass

A new evidence-first event handover prototype, started 17 November 2026 for Charli Myers with OpenAI Codex assistance. No ScopeKit, Heliora or Substrate code reused. Reserved for #BuildHybridAI 2026 only, consistent with a distinct new project per contest.

## Run
https://cimmonster1-art.github.io/signalglass/
Static HTML; no build step. The evidence board needs no account. AI libraries load from Google's Firebase CDN only when requested. The deployed domain is registered with Firebase App Check; serving on another origin will not authorize cloud inference. All starting records are synthetic. Export before refresh; workspace is in memory.

## Implemented
- Source-to-topic constellation, replay and explicit differing reported states.
- Human decision plus source and reason, valid only for the exact evidence set reviewed.
- New evidence reopens prior decisions.
- Deterministic handover with original report IDs, roles and times.
- Add reports, JSON export/import validation, copy brief.
- Optional Firebase AI Logic drafts: ONLY_ON_DEVICE default; PREFER_ON_DEVICE with explicit cloud consent.
- Production App Check through a score-based reCAPTCHA Enterprise site key restricted to cimmonster1-art.github.io. No debug token published; enforcement retained.
- AI output requires exactly one item per topic, known citations belonging to each topic, bounded text and no duplicate topics. This verifies IDs, NOT factual entailment or completeness.
- Unresolved and human-decision labels come from application state, never the model.
- Stale AI output is discarded when evidence changes. Untrusted report text is identified as data in the prompt. Output uses textContent.
- Exact SDK inference source displayed; absence is reported honestly.

Different state strings flag possible conflicts, not truth. Conditions may change over time. This is not an emergency-response tool.

## Infrastructure
Firebase project signalglass-cf657, Spark $0/month, web app SignalGlass Web. Gemini Developer API and reCAPTCHA Enterprise enabled with explicit owner approval; App Check registration verified. No billing account or upgrade added. Optional AI monitoring and analytics not enabled.

## Target contest — not submitted
#BuildHybridAI 2026: https://firebasehybridaihackathon.devpost.com/
$30,000 cash pool; $3,000 Web/Chrome category. Deadline November 30 at 14:00 PST / December 1 at 08:00 Brisbane.
Outstanding: supported-device inference demonstration, broader validation, public source license/repository packaging, recorded demo, registration and submission. No win or eligibility guarantee.

## Observed tests, 17 November 2026 Brisbane
- Six reports/two conflicts rendered.
- Human reason for R01 -> one conflict/one decision.
- New West gate evidence -> seven reports/two conflicts/zero decisions.
- Replay Home -> empty frame.
- JSON export downloaded. Import roundtrip blocked by browser file-read permissions; unverified.
- Device-only AI: browser reported local LanguageModel API unavailable; evidence handover remained available.
- With explicit synthetic-data cloud consent: actual Firebase AI response produced three cited topic summaries, preserving both unresolved conflicts. SDK reported the exact source in_cloud. A subsequent model response overstated certainty as 'verified as ready'; added a conservative forbidden-certainty check and tightened attribution instructions. This is a limited guard, not semantic verification.
- Selecting another topic cleared the prior AI draft.
- JavaScript syntax checked.
No successful on-device inference, mobile, screen-reader or offline-reload tests claimed.

## Privacy
Cloud fallback sends visible records and decision reasons to Google Gemini only after the checkbox and Draft with AI action. App Check protection may contact Google when AI initializes. Use synthetic data for demos. Do not enter sensitive information. Export files contain workspace content. No security or accessibility audit claimed.

## Demo plan
Show conflicting sources, replay, human decision, new evidence reopening it, then an AI draft with cited sources and actual execution location. Demonstrate unsupported-device behavior honestly.

Official implementation docs:
https://firebase.google.com/docs/ai-logic/hybrid/web/get-started
https://firebase.google.com/docs/ai-logic/hybrid/web/configuration-options
https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider
