# Flashcard Learning App (Chinese HSK)

## What This Is

A PWA (Progressive Web App) flashcard application for learning Chinese HSK vocabulary, optimized for mobile. Users can study flashcards with a Tinder-like swipe interface, filter by HSK level, customize what's displayed (Chinese/Vietnamese/Pinyin), and track their learning progress locally with spaced repetition logic.

## Core Value

Users can learn Chinese vocabulary efficiently with intuitive swipe interactions and offline access, tracking progress across study sessions without external dependencies.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Fetch HSK vocabulary flashcards from backend API and cache persistently
- [ ] Display flashcards with two-sided UI (Chinese front, Vietnamese + Pinyin back)
- [ ] Implement card flip animation
- [ ] Allow users to swipe right (remembered) and left (recall) to control card frequency
- [ ] Provide recall/remember buttons as alternative to swipe
- [ ] Filter flashcards by HSK level (3, 4, 5)
- [ ] Control display language (Chinese, Vietnamese, Pinyin combinations)
- [ ] Store recall/remember state locally in localStorage
- [ ] Implement reset all state functionality
- [ ] Cache card data for offline access (IndexedDB for PWA)
- [ ] Deploy as PWA with service worker
- [ ] Host on GitHub Pages
- [ ] Mobile-first responsive design

### Out of Scope

- Backend API state persistence (user progress doesn't sync to server yet — will require future backend expansion)
- OAuth/authentication (not needed for personal learning tool)
- Multiple user profiles
- Spaced repetition algorithm on backend (algorithm is local only)
- Real-time sync notifications
- Video/audio pronunciation (text-based only)

## Context

**Personal Project:** This is a rebuild of a previous React version. The goal is to regain full control over the codebase and implementation choices using Angular, which the user is more familiar with and can review thoroughly.

**Backend:** Express.js API deployed on Vercel with endpoints:
- `GET /flashcards/:level` — retrieve all cards for a level
- `POST /flashcards/:level` — add cards to a level
- `GET /health` — health check

Flashcard schema: `{ chinese, pinyin, vietnamese, example, example_vi }`

**Use Case:** Personal learning tool for Vietnamese learner studying Mandarin Chinese at HSK levels 3-5.

## Constraints

- **Framework**: Angular (user preference for control and maintainability)
- **Hosting**: GitHub Pages (free, familiar deployment)
- **Backend**: Existing Express API on Vercel (may have current issues, but stable enough for data fetching)
- **Mobile-first**: Primary use case is mobile devices
- **No Server State**: User progress stored locally only (avoids backend dependency)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Angular over React | User wants full control, familiar with Angular | — Pending (architecture rebuild) |
| GitHub Pages hosting | Free, supports SPA routing, familiar | — Pending (deployment setup) |
| Local storage for progress | No backend API expansion needed, works offline | — Pending (implementation) |
| IndexedDB for card cache | Persistent PWA storage, supports offline access, handles large datasets | — Pending (implementation) |

---
*Last updated: 2026-02-28 after initialization*
