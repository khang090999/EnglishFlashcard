# Lexi — English–Vietnamese vocabulary

A responsive React app for students and teachers. Created in `english-flashcards` after inspecting the sibling `estm-frontend` boilerplate. It retains the React 18 + TypeScript + Vite + Lucide foundation, `src/app` organization, strict TypeScript, and the `@/` import alias. The estimation app, its configuration, and credentials were not copied or modified.

## Run locally

Use Node.js 22.6+ (Node 22 LTS recommended).

```bash
npm install
npm run dev
```

Open http://localhost:4200. To try it on a phone on the same Wi-Fi, use `http://YOUR_COMPUTER_LAN_IP:4200`. The dev command listens on all network interfaces. If port 4200 is occupied, use the URL Vite prints.

```bash
npm test          # Import/storage/ID regression tests
npm run typecheck
npm run build    # TypeScript validation + production output in dist/
npm run preview  # Serve the production build
npm run format   # Format source and tests
```

## First-version features

- 12 starter sets and 120 words across CEFR A1–C2, with English, British IPA, Vietnamese meanings, and example sentences.
- Search by set, topic, English word, or Vietnamese meaning; filter by level/topic; grid/list views and bookmarks.
- Flashcards with English/phonetics on the front and Vietnamese on the reverse, previous/next, shuffle, browser pronunciation, and “Got it” / “Still learning” grading.
- Session completion and persistent progress. Space activates a focused card. Space/arrow shortcuts also work when focus is outside interactive controls; all controls support normal Tab/Enter navigation.
- Teacher preparation: choose a level, select words, name and save a set.
- CSV/TSV/TXT upload or paste, validation, duplicate detection, preview, downloadable example, and export of custom vocabulary.
- Responsive desktop/phone layout, accessible dialog, mobile drawer focus management, reduced-motion support.

## Import format

UTF-8 CSV or tab-separated text, optionally with a header. Keep columns in this order:

```csv
english,phonetic,vietnamese
hello,/həˈləʊ/,xin chào
apple,/ˈæp.əl/,"quả táo, trái táo"
```

Two-column `english,vietnamese` lists are also accepted. Blank lines are ignored. Duplicate English words within one import are skipped (case-insensitive). Invalid rows must be corrected before the set can be saved. Maximum 1,000 words and 500 KB per file; 500 characters per field. Phonetics are optional and are not automatically generated.

## Storage and scope

Sets, bookmarks, and word progress are stored under `lexi-vocabulary-v1` in this browser's localStorage. Data persists on the same browser and origin. It does not sync between a laptop and phone, or between localhost and a LAN IP. Clearing site data removes it. Export custom words from **My sets** to keep a CSV copy (export contains vocabulary, not progress or deck metadata).

Teacher-selected words retain their source IDs, so learning the same starter word in a custom lesson also counts in the library. Independently imported words have their own progress.

This version has no server, accounts, classroom sharing, or spaced-repetition scheduling. CEFR labels are suggested teaching levels, not an official examination syllabus. Pronunciation uses browser speech synthesis; available voices depend on the browser/OS. The app works with system font fallbacks if Google Fonts is unavailable.

## Main files

- `src/data/vocabulary.ts`: starter sets and level labels.
- `src/app/App.tsx`: application shell, library, progress, and persistence.
- `src/app/components/`: study, preparation, import, dialog, and deck UI.
- `src/lib/`: shared types, import parser, saved-state validation, and local ID creation.
- `src/styles/index.css`: visual system and responsive layouts.
- `tests/`: regression tests run using Node's built-in test runner.
