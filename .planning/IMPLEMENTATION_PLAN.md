# Implementation Plan — Flashcard Learning App (Angular Rebuild)

**Created**: 2026-03-01
**Status**: Pending execution
**Milestone**: v1.0 — Full Angular rebuild from scratch

---

## Context

This is a ground-up rebuild of a previous React-based HSK flashcard PWA. The goal is a maintainable Angular app with full offline support, deployed to GitHub Pages.

**Key inputs confirmed before planning:**
- Starting point: empty repo (no existing Angular code)
- Backend: `https://flashcard-be-eight.vercel.app/` (currently has errors — must handle gracefully)
- UI library: TailwindCSS
- GitHub Pages deployment: root path (`/`) — no base href subdirectory needed

---

## Architecture Decisions

| Topic | Decision | Rationale |
|---|---|---|
| Framework | Angular v17+ standalone components | User preference for control and maintainability |
| Styling | TailwindCSS | Utility-first, minimal overhead, works well with Angular |
| Level IDs | `hsk3`, `hsk4`, `hsk5` | Matches API path param format (`GET /flashcards/:level`) |
| Language toggle modes | 4 modes: Chinese only / Pinyin only / Vietnamese only / All | Flexible study configuration |
| Swipe gestures | Custom `touchstart`/`touchend` handlers | No extra dependencies (Hammer.js not needed) |
| IndexedDB wrapper | `idb` library (tiny typed wrapper) | Avoids raw IDB boilerplate, keeps async handling clean |
| Backend error handling | Serve from IndexedDB silently; error shown only if cache is also empty | Offline-first philosophy |
| Spaced repetition | Local-only (localStorage), frequency sorting in `StateService` | No backend API expansion needed |
| Deployment | GitHub Actions → `dist/` pushed to GitHub Pages | Free, familiar, automated |

---

## Phase 1 — Project Scaffold

**Goal**: Runnable Angular app with TailwindCSS and PWA baseline.

- [ ] 1.1 Run `ng new flashcard-app` with options:
  - Standalone components: yes
  - Routing: no (single page, no routes needed)
  - Style format: CSS (Tailwind handles styling)
- [ ] 1.2 Install TailwindCSS:
  - `npm install -D tailwindcss postcss autoprefixer`
  - `npx tailwindcss init`
  - Configure `tailwind.config.js` content paths for `src/**/*.{html,ts}`
  - Add Tailwind directives to `src/styles.css`
- [ ] 1.3 Install Angular PWA:
  - `ng add @angular/pwa`
  - Generates `ngsw-config.json` and `manifest.webmanifest`
- [ ] 1.4 Set `baseHref: "/"` in `angular.json` build configuration
- [ ] 1.5 Install `idb` for IndexedDB: `npm install idb`

**Acceptance**: `ng serve` runs without errors, Tailwind styles apply.

---

## Phase 2 — Core Services

**Goal**: Data layer fully functional (API fetch, IndexedDB cache, localStorage state).

### 2.1 FlashcardService (`src/app/core/services/flashcard.service.ts`)
- Fetches cards: `GET https://flashcard-be-eight.vercel.app/flashcards/:level`
  - Level param format: `hsk3`, `hsk4`, `hsk5`
- On success: writes result to IndexedDB object store `flashcards`
- On failure: reads from IndexedDB cache silently
- If both fail: returns empty array, triggers error state in `StateService`
- Exposes: `getCards(level: string): Observable<Flashcard[]>`
- Also handles: `GET /health` check to detect API availability

**Flashcard interface:**
```typescript
interface Flashcard {
  chinese: string;
  pinyin: string;
  vietnamese: string;
  example: string;
  example_vi: string;
}
```

**IndexedDB schema:**
- DB name: `flashcard-db`
- Object store: `flashcards`
- Key: `[level, chinese]` (compound key)

### 2.2 StorageService (`src/app/core/services/storage.service.ts`)
- Reads/writes recall state from `localStorage`
- Key format: `card:{level}:{chinese}` → `{ recalled: number, remembered: number }`
- Methods:
  - `getState(level, chinese): CardState`
  - `incrementRecalled(level, chinese): void`
  - `incrementRemembered(level, chinese): void`
  - `resetAll(): void` — clears all keys starting with `card:`

### 2.3 StateService (`src/app/core/services/state.service.ts`)
- Central RxJS state:
  - `currentLevel$: BehaviorSubject<string>` — default `hsk3`
  - `languageMode$: BehaviorSubject<LanguageMode>` — default `all`
  - `cardQueue$: BehaviorSubject<Flashcard[]>` — sorted active deck
  - `currentCardIndex$: BehaviorSubject<number>`
  - `isOffline$: BehaviorSubject<boolean>`
- Frequency sorting: cards with higher `recalled` count appear more frequently (prepended to queue rotation)
- Exposes helpers: `nextCard()`, `setLevel(level)`, `setLanguageMode(mode)`

**LanguageMode type:**
```typescript
type LanguageMode = 'chinese' | 'pinyin' | 'vietnamese' | 'all';
```

**Acceptance**: Unit tests pass for all three services; IndexedDB read/write and localStorage round-trips work.

---

## Phase 3 — Components

**Goal**: All UI components built and wired to services.

### 3.1 ControllerBarComponent (`src/app/features/flashcard/components/controller-bar/`)
Responsibilities:
- HSK level picker: buttons for 3, 4, 5 (active state highlighted)
- Language display toggle: cycles through 4 modes
- Reset button: calls `StorageService.resetAll()`, reloads card queue
- Emits level/mode changes via `StateService`

Layout (mobile-first, top bar):
```
[ HSK 3 | HSK 4 | HSK 5 ]   [ 中 | Py | Vi | All ]   [ Reset ]
```

### 3.2 CardDisplayComponent (`src/app/features/flashcard/components/card-display/`)
Responsibilities:
- Renders current card from `StateService.cardQueue$`
- Two-sided flip animation (CSS 3D transform `rotateY`)
- Front face: Chinese character (large), card N/total shown
- Back face: Vietnamese meaning, Pinyin, example sentence + translation
- Flip triggered by tap/click on card
- Shows which fields based on `languageMode$`

Card position indicator: `Card 12 / 150`

### 3.3 ControlAreaComponent (`src/app/features/flashcard/components/control-area/`)
Responsibilities:
- Swipe zone covering card area:
  - Swipe left → Recall (`StorageService.incrementRecalled`)
  - Swipe right → Remembered (`StorageService.incrementRemembered`)
  - Threshold: 80px horizontal delta to register as swipe
- Fallback buttons: `[ Recall ]` `[ Remember ]`
- Visual feedback: card slides left/right on gesture
- After action: calls `StateService.nextCard()`

### 3.4 AppComponent (`src/app/app.component.ts`)
- Assembles all components
- Offline banner: shown when `StateService.isOffline$` is true
- Subscribes to `window.online` / `window.offline` events
- Injects `FlashcardService`, triggers initial card load on init

**Acceptance**: Full UI renders, cards flip, swipe and buttons work, level/language switching reloads queue.

---

## Phase 4 — PWA Configuration

**Goal**: App works offline, installable on mobile.

### 4.1 `ngsw-config.json`
```json
{
  "assetGroups": [
    {
      "name": "app-shell",
      "installMode": "prefetch",
      "updateMode": "prefetch",
      "resources": { "files": ["/favicon.ico", "/index.html", "/*.css", "/*.js"] }
    }
  ],
  "dataGroups": [
    {
      "name": "flashcard-api",
      "urls": ["https://flashcard-be-eight.vercel.app/flashcards/**"],
      "cacheConfig": {
        "strategy": "freshness",
        "maxSize": 10,
        "maxAge": "7d"
      }
    }
  ]
}
```

### 4.2 `manifest.webmanifest`
- `name`: "HSK Flashcard"
- `short_name`: "HSK Cards"
- `display`: "standalone"
- `theme_color`: match Tailwind primary color
- `start_url`: "/"
- Icons: 192x192, 512x512

**Acceptance**: Lighthouse PWA score ≥ 90, app installs on Android Chrome, works fully offline after first load.

---

## Phase 5 — GitHub Actions Deploy

**Goal**: Automated deploy on push to `main`.

### 5.1 `.github/workflows/deploy.yml`
- Trigger: `push` to `main`
- Steps:
  1. Checkout
  2. Setup Node.js
  3. `npm ci`
  4. `ng build --configuration production`
  5. Deploy `dist/flashcard-app/browser/` to GitHub Pages using `actions/deploy-pages`

**Acceptance**: Push to `main` auto-deploys; app is live at GitHub Pages URL.

---

## Spaced Repetition Logic

Cards are sorted in the active queue so that cards marked "recall" (= not yet remembered) appear more frequently:

```
weight = recalled_count - remembered_count
// Higher weight = higher priority in queue rotation
```

Queue is rebuilt each time:
- Level changes
- Language mode changes
- After reset

---

## API Reference (Production)

Base URL: `https://flashcard-be-eight.vercel.app`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/flashcards/hsk3` | Fetch all HSK 3 cards |
| GET | `/flashcards/hsk4` | Fetch all HSK 4 cards |
| GET | `/flashcards/hsk5` | Fetch all HSK 5 cards |
| GET | `/health` | API health check |

**Note**: Backend currently has errors. App must handle API failure gracefully by serving from IndexedDB cache.

---

## File Structure (Target)

```
src/
  app/
    core/
      services/
        flashcard.service.ts
        storage.service.ts
        state.service.ts
    features/
      flashcard/
        components/
          controller-bar/
            controller-bar.component.ts
            controller-bar.component.html
          card-display/
            card-display.component.ts
            card-display.component.html
          control-area/
            control-area.component.ts
            control-area.component.html
    app.component.ts
    app.component.html
  styles.css            ← Tailwind directives
  index.html
  main.ts
ngsw-config.json
manifest.webmanifest
tailwind.config.js
angular.json
.github/
  workflows/
    deploy.yml
```

---

## Completion Checklist

### Phase 1 — Scaffold
- [x] Angular project created (Angular CLI v21, standalone, TailwindCSS)
- [x] TailwindCSS configured and working (`@import 'tailwindcss'` in styles.css)
- [x] PWA baseline added (`ng add @angular/pwa`)
- [x] `idb` library installed

### Phase 2 — Services
- [x] `FlashcardService` — API fetch + IndexedDB read/write
- [x] `StorageService` — localStorage recall/remember state
- [x] `StateService` — RxJS state, frequency-sorted queue

### Phase 3 — Components
- [x] `ControllerBarComponent` — level, language, reset
- [x] `CardDisplayComponent` — flip animation, content
- [x] `ControlAreaComponent` — swipe + buttons
- [x] `AppComponent` — shell, offline banner, wiring

### Phase 4 — PWA
- [x] `ngsw-config.json` configured (added `dataGroups` for API freshness strategy)
- [x] `manifest.webmanifest` filled in (name, theme color, icons)
- [ ] App passes Lighthouse PWA check (pending live deploy)

### Phase 5 — Deploy
- [x] GitHub Actions workflow created (`.github/workflows/deploy.yml`)
- [ ] Successful deploy to GitHub Pages (pending push to main)

---

## Deviations from Plan

| Item | Plan | Actual | Reason |
|------|------|--------|--------|
| File name style | 2016 style (app.component.ts) | Used same — but CLI v21 generates class `App` not `AppComponent` | Fixed in main.ts import alias |
| Component HTML files | Separate `.html` files | Inline templates used | Simpler for standalone components, no separate file needed |
| `dist/` output path | `dist/flashcard-app/browser/` | `dist/flashcard/browser/` | CLI uses project name from `ng new` |

*Last updated: 2026-03-01 — Initial implementation complete, build passes (175KB)*
