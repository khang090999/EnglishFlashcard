# Lexi vocabulary learning v1

Build a responsive React application for Vietnamese students learning English and teachers preparing word sets. The sibling estm-frontend was inspected: reuse its React 18.3.1, TypeScript, Vite, Lucide stack, src/app organization, strict compiler settings and @ alias. The current workspace is empty and has no usable Git metadata. The sibling application remains unchanged.

Default assumptions: CEFR A1–C2, browser-local persistence, no login/backend in v1. Seed levels are editorial teaching suggestions, not an official examination syllabus. Provide 12 starter sets with English, IPA, Vietnamese translations and example sentences.

Library: searchable sets, level/topic filters, bookmark sets, list/grid view, separate saved/imported sets. Teacher preparation: choose a level, search vocabulary, select words and save a named study set. Import: paste or upload CSV/TSV, optional header, columns English/phonetic/Vietnamese; accept two columns English/Vietnamese; preview valid rows, show errors, omit duplicate words, require fixing invalid rows before saving.

Study: English/IPA front and Vietnamese back, flip, previous/next, shuffle, speech when available, known/review tracking, completion summary. Persist known words and saved sets in localStorage. Storage failures must be visible. Progress page uses actual saved progress.

Visual direction: warm off-white background, deep ink typography, purple primary actions, pastel topic illustrations, sidebar on desktop and compact navigation on phone. Accessible native controls, focus rings, reduced motion, touch targets, semantic dialogs, Escape and keyboard support. No external imagery required.

Verification: parser/data/storage unit tests, TypeScript checking, production build, browser study/import/preparation checks and desktop/mobile layout inspection when a browser is available.
