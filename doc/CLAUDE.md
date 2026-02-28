# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Flashcard Learning App (Chinese HSK)** — A PWA (Progressive Web App) for learning Mandarin Chinese vocabulary using HSK (Hanyu Shuiping Kaoshi) proficiency levels 3-5. Built with Angular, optimized for mobile devices.

### Core Purpose

- Personal learning tool for Vietnamese learner studying Mandarin Chinese
- Offline-first with cached backend data (IndexedDB)
- Local spaced repetition tracking (localStorage)
- Swipe-based Tinder-style UX for card interactions
- GitHub Pages deployment

### Key Constraints

- **Framework**: Angular (v17+) — chosen for control and maintainability
- **Hosting**: GitHub Pages with SPA routing
- **Backend**: Express.js API on Vercel (does NOT persist user progress — state is local-only)
- **Data Storage**: IndexedDB for card data caching, localStorage for spaced repetition state
- **No authentication**: Personal tool, no user accounts
- **Flashcard schema**: `{ chinese, pinyin, vietnamese, example, example_vi }`

## Architecture Overview

### Data Flow

```
Backend API (Vercel)
    ↓ (GET /flashcards/:level)
IndexedDB (persistent PWA cache)
    ↓ (read on app start)
Component State (RxJS)
    ↓ (user interactions)
localStorage (recall/remember counts)
    ↓ (manual sync check)
Backend API (GET /health to detect changes)
```

### Component Structure (to be implemented)

1. **App Shell**
   - Main layout container
   - Service worker integration
   - Offline indicator

2. **Controller Bar** (top section)
   - HSK Level Selector (3, 4, 5)
   - Language Display Toggle (Chinese, Vietnamese, Pinyin combos)
   - Reset State button

3. **Card Display** (main section)
   - Two-sided card with flip animation
   - Front: Chinese vocabulary
   - Back: Vietnamese meaning + Pinyin
   - Shows current card position in deck

4. **Control Area** (bottom section)
   - Swipe zone (left=recall, right=remembered)
   - Alternative buttons (Recall, Remember, Reset)
   - State visual feedback

### Data Management

**Three-tier storage strategy:**

1. **localStorage** — Spaced repetition state (recall/remember counts)
   - Key structure: `card:{level}:{chinese}` → `{ recalled: N, remembered: N }`
   - Reset clears all entries starting with `card:`

2. **IndexedDB** — Flashcard data cache
   - Object store: `flashcards` with index on `(level, chinese)`
   - Updated when API fetch completes
   - Queried first on app start (offline support)

3. **Session Memory** — Active card queue
   - Managed by component state (RxJS)
   - Sorted by spaced repetition frequency (cards marked "recall" appear more often)
   - Refreshed from IndexedDB on level/language change

### Service Worker Strategy

- **Static assets**: Cache on install, update on new version
- **Flashcard data**: Network-first, fallback to IndexedDB (users can manually check for updates)
- **API responses**: Cache API response with ETag/timestamp for manual sync detection
- No automatic cache invalidation — user triggers "check for updates" action

### Important Technical Decisions

| Decision | Why | Impact |
|----------|-----|--------|
| IndexedDB over localStorage for cards | Cards are large, numerous; localStorage has 5-10MB limit | Requires async IDB API calls, need proper error handling |
| Spaced repetition logic local-only | No backend API expansion needed yet | Frequency sorting happens in component, not on server |
| GitHub Pages SPA routing | Familiar, free hosting | Need to configure 404.html redirect for client-side routing |
| Swipe gestures in addition to buttons | Mobile-first UX, familiar to Tinder users | Accessibility: ensure keyboard/touch targets for buttons too |
| Manual "check for updates" instead of auto-sync | Offline-first philosophy, user control | Users must explicitly sync; stale data possible but controlled |

## Build and Development

### Setup

```bash
# Install dependencies (TBD - Angular project)
npm install
# or
yarn install

# Start development server
ng serve
# Runs on http://localhost:4200

# Build for production
ng build --configuration production

# Deploy to GitHub Pages
# (TBD - configuration depends on Angular build setup)
```

### Project Structure (TBD)

```
src/
  app/
    core/                 # Singleton services (API, storage, state)
      services/
        flashcard.service.ts      # API calls, IndexedDB operations
        storage.service.ts        # localStorage for spaced repetition state
        state.service.ts          # RxJS observable state management
    features/
      flashcard/            # Main feature module
        components/
          card-display/
          controller-bar/
          control-area/
        pages/
          flashcard.page.ts  # Main container component
    shared/               # Reusable components, pipes, directives
    app.config.ts         # Standalone app configuration
  index.html              # Entry point (with PWA meta tags)
  main.ts                 # Bootstrap
  styles.css              # Global styles
ngsw-config.json          # Service worker configuration
manifest.json             # Web app manifest
```

### Service Worker Configuration (ngsw-config.json)

**Key groups to configure:**
- `assetGroups`: Static assets (JS, CSS, images) — cache on install
- `dataGroups`: API responses (`/flashcards/*`) — network-first, fallback to cache

**GitHub Pages specific:** Ensure service worker works under `/flashcard/` base href if deployed to repo subdirectory.

### Environment Variables

None needed currently. Backend URL can be hardcoded or fetched from `API_DOCUMENTATION.md`:
- Base: `https://your-vercel-api.vercel.app` (TBD - user will provide)
- Endpoints: `GET /flashcards/{level}`, `GET /health`

## API Integration

### Backend API (Express.js on Vercel)

Reference: `API_DOCUMENTATION.md`

**Key endpoints:**
- `GET /flashcards/:level` → Returns `Flashcard[]`
- `GET /health` → `{ status: "OK", timestamp }`

**Flashcard shape:**
```typescript
interface Flashcard {
  chinese: string;
  pinyin: string;
  vietnamese: string;
  example: string;
  example_vi: string;
}
```

**Caching flow:**
1. App loads → check IndexedDB for cards
2. Fetch fresh from API in background
3. If API succeeds → update IndexedDB
4. User can click "check for updates" to manually trigger sync
5. If offline → serve from IndexedDB, no error

## Testing (TBD)

```bash
ng test                    # Run unit tests
ng test --code-coverage   # With coverage report
ng e2e                    # Run e2e tests
```

**Important to test:**
- IndexedDB CRUD operations (add, read, clear)
- localStorage state persistence (recall/remember counts)
- Service worker offline behavior
- Card sorting by spaced repetition frequency
- Swipe gesture detection and direction
- GitHub Pages routing (spa-based)

## Deployment (GitHub Pages)

### Prerequisites

- GitHub repository with gh-pages branch or GitHub Pages enabled
- Angular app configured with base href for `/flashcard/` or `/` depending on setup

### Deployment Steps (TBD)

```bash
# Build with production configuration
ng build --configuration production

# Push dist/ to GitHub Pages (gh-pages branch or Actions)
# Ensure service worker cache busting is configured
```

**Known issues to avoid:**
- Service worker caching forever (configure update strategy)
- SPA routing redirects (404.html fallback)
- GitHub Pages base href (set in angular.json or index.html)

## Planning and State Management

Project planning documents live in `.planning/`:

- **PROJECT.md** — Project vision, requirements, constraints, decisions
- **ROADMAP.md** — Phase breakdown (TBD - will be created during planning)
- **config.json** — Workflow configuration
- **STATE.md** — Session continuity and progress tracking

These files are tracked in git and document the "why" behind implementation decisions.

## Common Tasks (TBD after code scaffolding)

```bash
# Generate a new component
ng generate component features/flashcard/components/card-display

# Add a service to core
ng generate service core/services/flashcard

# Format code (if prettier/ESLint configured)
npm run format
npm run lint

# Clear IndexedDB during development
# (In browser DevTools > Application > IndexedDB)
```

## Notes for Future Work

1. **Service Worker Cache Busting**: Implement strategy to detect backend changes without automatic cache invalidation
2. **Accessibility**: Ensure swipe gestures have keyboard alternatives (arrow keys)
3. **Mobile Testing**: Test on actual devices (iOS Safari, Android Chrome) for PWA install prompt
4. **Performance**: Monitor card list rendering performance (virtual scrolling if many cards)
5. **Error Boundaries**: Handle IndexedDB quota errors gracefully
6. **Offline Indicators**: Show visual cues when offline or when cache is stale

---

**Last Updated**: 2026-03-01 (Project initialization - rebuilding from React to Angular)
