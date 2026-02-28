# Session State — HSK Flashcard App

**Last updated**: 2026-03-01
**Build status**: ✅ Passing (179 KB bundle, 0 errors)
**Phase**: Initial implementation complete — not yet deployed

---

## What Was Built This Session

Full Angular v21 PWA from scratch. All phases from `IMPLEMENTATION_PLAN.md` are code-complete.

---

## Current File Map

```
src/
  main.ts                          ← bootstraps AppComponent (aliased from App)
  app/
    app.component.ts               ← shell: offline banner + assembles 3 components
    app.config.ts                  ← provideHttpClient() + provideServiceWorker()
    core/services/
      flashcard.service.ts         ← API fetch, IndexedDB cache, dev mock fallback
      storage.service.ts           ← localStorage recall/remember state
      state.service.ts             ← RxJS BehaviorSubjects, spaced repetition sort
    features/flashcard/components/
      controller-bar/              ← HSK level picker, language toggle, reset
      card-display/                ← 3D flip card, front/back faces
      control-area/                ← swipe zone + Recall/Remember buttons

ngsw-config.json                   ← service worker: prefetch assets, freshness API
public/manifest.webmanifest        ← HSK Flashcard, theme #4f46e5, standalone
.github/workflows/deploy.yml       ← push to main → build → GitHub Pages
.planning/
  IMPLEMENTATION_PLAN.md           ← full phase plan + completion checklist
  STATE.md                         ← this file
```

---

## Key Design Decisions (confirmed working)

### Language Mode
- Two modes only: `'chinese'` | `'vietnamese'`
- `'chinese'` (default): front = hanzi → back = Vietnamese + Pinyin + example
- `'vietnamese'`: front = Vietnamese + Pinyin → back = hanzi + example
- Toggle label shows direction: `中文 → Việt` or `Việt → 中文`

### Card Interaction
- Tap card → 3D flip animation (CSS `rotateY` + `preserve-3d`)
- Swipe left in control area → Recall
- Swipe right in control area → Remember
- After swipe/button → card flips back, advances to next card
- Swipe threshold: 80px horizontal delta

### Data Flow
```
API (Vercel) → IndexedDB cache → component state (RxJS BehaviorSubject)
                                                        ↓
                                            spaced-repetition sort
                                            (recalled-remembered weight)
```

### Dev Mock Fallback
- When API fails AND IndexedDB cache is empty AND `isDevMode()` is true:
  → serves 5 hardcoded cards per level (hsk3/hsk4/hsk5)
  → logs `console.warn("[DEV] API and cache failed...")` so it's visible
- In production build: mock data is never used (tree-shaken by `isDevMode()`)

### Spaced Repetition
- Sort weight = `recalled - remembered` (higher = shown sooner)
- Queue rebuilt on: level change, reset, initial load
- State persisted in localStorage: key = `card:{level}:{chinese}`

---

## Dependency Versions

| Package | Version |
|---|---|
| Angular | ^21.2.0 |
| TailwindCSS | ^4.1.12 |
| idb | ^8.0.3 |
| Node.js | 20.19.4 |
| Angular CLI | 21.2.0 |

---

## What Still Needs Doing

### Immediate (before first deploy)
- [ ] Enable GitHub Pages in repo settings (Settings → Pages → Source: GitHub Actions)
- [ ] Verify the GitHub Actions workflow path: `dist/flashcard/browser` is correct output dir
- [ ] Push to `main` to trigger first deploy

### Backend
- [ ] Backend at `https://flashcard-be-eight.vercel.app` is currently erroring
  - Until fixed: dev uses mock data, production shows empty state
  - Check `/health` endpoint first to confirm status

### Polish / Future Work
- [ ] The card `max-h-80` on card-scene may clip long Vietnamese text — may need to adjust height
- [ ] `CardDisplayComponent.cardState` re-reads localStorage on every change detection cycle — fine for now, optimize if laggy
- [ ] No confirmation dialog on Reset button — could accidentally wipe progress
- [ ] App does not re-sort queue after each recall/remember action — only after level change or explicit reset
  - Could add: call `sortByFrequency` and rebuild queue after each card action
- [ ] `AppComponent.isOffline` uses `.value` snapshot — does not reactively update the banner
  - Should use `AsyncPipe` with `isOffline$` observable for live updates

---

## How to Run

```bash
cd /d/project/self-project/flashcard

# Dev server (mock data active if API fails)
npx ng serve
# → http://localhost:4200

# Production build check
npx ng build
# → dist/flashcard/browser/

# Deploy (automated via GitHub Actions on push to main)
git push origin main
```

---

## Known Quirks

1. **Angular CLI v21 generates class `App` not `AppComponent`** — `main.ts` uses an import alias:
   ```ts
   import { AppComponent as App } from './app/app.component';
   ```
2. **TailwindCSS v4** is set up via `@import 'tailwindcss'` in `styles.css` (not the old `@tailwind` directives)
3. **`app.component.html` still exists** as an empty scaffold file — unused since `AppComponent` uses inline `template:`
4. **Prettier warnings during scaffold** — harmless, only affects `.editorconfig`/`.gitignore`/icon `.png` files
