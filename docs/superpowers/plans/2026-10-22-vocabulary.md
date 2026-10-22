# Vocabulary App Implementation Plan

> Implement inline with executing-plans; use tests for data/import/persistence and browser validation for UI.

**Goal:** A functional responsive English–Vietnamese vocabulary app.
**Architecture:** React components consume typed starter data and browser-persisted sets and learning progress. Pure import/state validation lives in src/lib.
**Tech Stack:** React 18, TypeScript, Vite, Lucide, Node test runner.
**Spec:** docs/superpowers/specs/2026-10-22-vocabulary-design.md

## Global Constraints
- Preserve sibling estm-frontend; build in the current empty workspace.
- CEFR A1–C2; local browser storage; no server or accounts.
- English with phonetics on front, Vietnamese on back.
- Desktop and mobile accessible controls.

## Review Focus
- CSV quoting, BOM, commas and Vietnamese Unicode must survive import.
- Invalid import rows must not silently disappear; duplicates clearly reported.
- Corrupt or unavailable storage must not crash the app.
- Switching sets and shuffle must not mix card state.
- Small screens and keyboard users can complete every main flow.

## Tasks
- [x] 1. Foundation and data: create package/config, typed vocabulary, starter sets, import parser and storage validators. Write/run meaningful failing Node tests, implement, rerun.
- [x] 2. Library and preparation: build navigation, searchable/filterable sets, saved sets, word selection and import dialog. Verify empty states and selection behavior.
- [x] 3. Study and progress: implement flipping, keyboard navigation, shuffle, pronunciation, mastery and persisted progress. Verify known/review and completion.
- [x] 4. Responsive polish and verification: production build, typecheck, tests and browser QA. Document startup and import format.

## Execution notes
- New project has no usable Git repository; do not create worktrees or commits.
- User requested implementation; continue within that authorized scope without additional approval gates.

## Verification record
- Production build and strict TypeScript validation passed.
- 11 regression tests passed (CSV/TSV, quoted and Vietnamese text, missing boundary fields, duplicate rows, corrupt saved state, and insecure-context ID fallback).
- Browser checked: A2 filtering, English/IPA to Vietnamese flip, ten-card session completion, known/review results, progress after reload, invalid import rejection, valid import preview/save, teacher B1 word selection/save, and custom sets after reload.
- Mobile checked at 390px and 320px: no horizontal overflow. Inspected study and import UI; verified closed navigation is hidden, Escape closes the drawer, and focus returns to its trigger.
- Browser console contained no errors or warnings during checks.
- Independent read-only review found four issues; all fixed: TSV boundary field loss, flashcard accessible labels, mobile hidden-navigation focus, and secure-context-only IDs.
- Final narrow-screen visual adjustment removes decorative artwork below 360px to preserve text space.
- Preview: http://localhost:4200/; setup and phone-access instructions in README.md.
