# Feature 9 — Theme Customization

- **Status:** Phase 2 — on hold
- **Contract readiness:** Business scope only; not approved for implementation
- **User story:** [US-13 — Choose a quiz page theme](../business/user-stories.md#us-13-choose-a-quiz-page-theme)
- **Depends on:** Features 1–8 complete and deployed

## Objective

A creator can choose an approved visual preset for a quiz page after the MVP is
stable, without introducing a free-form page builder.

## Approved business scope

- Three or four Kuiska-approved visual presets.
- One selected preset applied to the quiz-taking page.
- Readable, accessible light and dark presentation.
- Consistent Kuiska identity across every preset.

## Explicitly out of scope

- A WordPress-style customizer, custom CSS, or arbitrary typography controls.
- Image upload, external media storage, and user-supplied backgrounds.
- Starting this work before the MVP delivery sequence is complete.

## Implementation gate

Before implementation, define and approve the presets in the design system,
then expand this file with persistence, validation, fallback behaviour,
accessibility checks, migration impact, and a technical Definition of Done.

## Handoff boundary

Do not implement Feature 9 until Features 1–8 are complete and this contract is
implementation-ready.
