# SignalGlass

A new evidence-first event handover prototype, started 17 November 2026. Built with OpenAI Codex assistance for Charli Myers. This does not reuse ScopeKit, Heliora or Substrate code.

## Run

Open https://cimmonster1-art.github.io/signalglass/ or serve this directory with any static web server. No dependencies, build step, account or API key. All initial records are synthetic. Reports remain in memory; export JSON before refreshing.

## Implemented

- Source-to-topic constellation with explicit conflicting states.
- Report replay; decisions apply only to the exact report set reviewed.
- Human decisions with a source and reason; new evidence reopens the decision.
- Traceable handover text with report IDs, source roles, times and uncertainty.
- Add reports; export/import validated JSON; copy brief.
- Text rendered using textContent, no user-generated HTML.
- Responsive layout and native keyboard-operable controls.

Different state strings flag possible conflicts. This is not semantic truth detection; a state may legitimately change over time. No independent verification or emergency-response suitability is claimed.

## Target competition — research, not a submitted entry

#BuildHybridAI 2026: https://firebasehybridaihackathon.devpost.com/
$30,000 cash pool; $3,000 Web/Chrome category. Deadline listed as November 30 at 14:00 PST (December 1 at 08:00 Brisbane).

This prototype is NOT yet eligible as a completed submission. It does NOT currently call Firebase AI Logic. Project creation failed in the Firebase console during setup; no billing was enabled. Required next steps: dedicated free-tier Firebase project, AI Logic configuration, production App Check, implemented and verified on-device/cloud inference, open-source repository license, recorded demo, registration and submission. Do not claim AI runtime or tests until observed.

## Intended hybrid feature

A cited handover brief from only the records selected for sharing. Device-only inference by default; explicit user consent for cloud fallback. Show actual inference source from SDK response, never infer it from network status. Preserve unresolved conflicts and validate all returned report citations before displaying a draft. Source texts are untrusted data, not instructions. Human decisions remain explicit. Keep deterministic evidence review available if inference fails.

Official docs: https://firebase.google.com/docs/ai-logic/hybrid/web/get-started

## Judge demo plan

1. Six contradictory festival reports produce two unresolved topics.
2. Replay before/after the conflicting report appears.
3. Inspect source and time, record a human decision with reason.
4. Add new evidence and show the decision reopening automatically.
5. Generate an AI handover, display actual inference location and linked citations (pending implementation).
6. Demonstrate unsupported-device and no-network behavior honestly (pending verification).

## Privacy

No analytics or AI calls in this initial version. Use synthetic data for demos. Export files may contain entered content; keep them appropriately private. This is a prototype without a security or accessibility audit.
