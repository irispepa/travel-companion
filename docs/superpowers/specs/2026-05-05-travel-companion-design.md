# Travel Companion App — Design Spec
**Date:** 2026-05-05  
**Trip:** Philadelphia → Prague → Vienna → Budapest → Philadelphia

---

## Overview

A personal Progressive Web App (PWA) for two iPhones (Iris + Niko) to use during a Central European trip. The app serves as an offline-capable travel reference, itinerary manager, language guide, and memory capture tool. No App Store distribution — accessed via browser, installable as PWA.

---

## Platform & Architecture

- **Framework:** React (Vite)
- **Type:** Progressive Web App — installable on iPhone via Safari "Add to Home Screen"
- **Offline:** Service worker + IndexedDB. All content available without internet. Live data (exchange rates) fetched when online and cached.
- **Data layer:** Repository pattern separating storage from UI. IndexedDB per city, per section. Designed so adding a sync backend (NUC + Tailscale) in v2 only requires changes to the data layer.
- **Hosting v1:** Static files, self-hosted (NUC or any static host)
- **Hosting v2:** NUC via Tailscale with sync API

---

## Visual Style

- **Aesthetic:** Dark editorial — deep navy/charcoal backgrounds, warm cream text, serif accents
- **Typography:** Serif for headings and editorial elements; sans-serif for data/UI
- **Color palette:** Deep navy (`#0f1923`), warm cream (`#e8dcc8`), muted gold (`#a08060`), steel blue (`#8ab4c8`), dark card (`#1a2a3a`)
- **Cards:** Clean, no left-border accents. Subtle background contrast between card and page. Modern, no AI design anti-patterns.
- **Spacing:** Generous padding, mobile-first layout

---

## Navigation Structure

### Level 1 — City Selector
On app open, a selection screen shows 5 city views as cards:
- Philly (outbound travel day)
- Prague
- Vienna
- Budapest
- Philly (return travel day)

Philly appears twice — once for the outbound day, once for the return. Both Philly views share the same underlying city data (`cityId: "philly"`) for What to Do, What to Say, and Memories. Only Itinerary and the Today's Area map differ between them.

### Level 2 — City Dashboard
Each city has a dashboard showing:
- Large editorial city name header
- **Today's Area** block: a static Google Maps embed pre-configured per city view, plus an "Open in Maps" deep link to the shared Google Maps saved spots list. The embed URL and saved spots link are hardcoded in a per-city-view config file (`/src/config/cities.ts`).
  - Prague, Vienna, Budapest: shows the city's main area for the trip
  - Philly outbound: shows PHL airport area; travel context (Uber → PHL → layover → PRG) displayed as text below the map
  - Philly return: shows PHL airport area; travel context (BUD → layover → PHL → Uber) displayed as text below the map
- 2×2 grid of section cards: Itinerary, What to Do, What to Say, Memories
- Currency calculator icon in header (opens calculator overlay, visible on all city views)

### Level 3 — Sections
Tapping a section card navigates into it. Back arrow (top-left) returns to city dashboard. No persistent bottom tab bar.

---

## Sections

### Itinerary

- Scrollable list of days, grouped by date header
- Each day shows full-width cards per item:
  - Name, time, duration, location notes
  - Inline link chips (Maps, Tickets, Website, etc.)
  - Past items (items whose `time` on a past date, or earlier than current wall-clock time on today's date) render at reduced opacity. Current and upcoming items render at full opacity. "Current travel day" is determined by matching device date against the date range of the selected city view's itinerary days.
- **Today's area map** appears at the top of the Itinerary section as a shared component (same embed as dashboard). Shown only when (a) the city view has itinerary days defined in the seed, and (b) the device date falls within those dates. Not shown otherwise.
- **Edit mode:** Pencil icon toggles edit mode. Fields per item: name, time, duration, location, notes, links (each link has a label and URL). Reorder via up/down arrows (no drag in v1). An "Add item" button appears at the bottom of each day's item list in edit mode. Adding items to days not already in the seed is not supported — the trip dates are fixed.
- **Data population:** All itinerary data is pre-loaded via a JSON seed file. On first app load, the seed is imported into IndexedDB. On-device edits update IndexedDB directly and persist. The seed is never re-applied after initialization.

### What to Do

- Header + sort control
- Default sort: priority descending (highest first)
- Sort options: priority, cost, estimated time
- Each activity shows: name, location, estimated time, cost, priority (1–5 stars), notes, link
- Tap to expand inline for full detail
- Read-only on phone
- **Data population:** Pre-loaded via JSON seed file

### What to Say

- **Google Translate deep link** in section header, pre-set to city language pair. Not shown on Philly views.
  - Prague: en → cs
  - Vienna: en → de
  - Budapest: en → hu
- Prominent search bar (searches across all categories simultaneously — both Words and Info content)
- Category buttons: Basic, Food, Travel, Getting Help, Other
- Each category has two sub-sections:
  - **Words:** Curated phrase list. Each card shows:
    - English phrase (or Philly expression)
    - Local language translation (or humorous Philly gloss)
    - Phonetic pronunciation (omitted for Philly entries where not applicable)
  - **Info:** Cultural/contextual notes as a list of cards, each with a title and body
- All content pre-loaded, fully offline
- **Data population:** Pre-loaded via JSON seed file. Philly (`cityId: "philly"`) gets its own phrase entries in the seed — English/slang focused, no translation needed.

### Memories

- Chronological feed, newest entry at top
- Grouped by day with date dividers
- Memories are city-scoped — entries always save to the currently active `cityId`. Both Philly views share `cityId: "philly"`, so their memories are in the same feed.
- Each entry shows: author (Iris or Niko), timestamp, optional location tag (free text), optional photo(s), optional text note — any combination valid
- **+ Add memory** button always visible — opens capture sheet:
  - Select author (Iris or Niko)
  - Add photo(s) from camera roll (up to 5 per entry)
  - Type note
  - Tag location (free text)
- Existing entries can be deleted in v1. No editing of existing entries (delete and re-add).
- v1: local storage only, per-device. Each phone maintains its own feed.
- v2: sync via NUC backend
- No export or output in v1 — pure capture
- **Photo storage:** Photos are compressed client-side using the Canvas API before storage (target: ≤500KB per photo, JPEG output). If a photo cannot be compressed below 500KB, it is stored as-is with no error. Photos stored as base64 strings in IndexedDB. Maximum 5 photos per memory entry enforced in the UI. A storage warning is shown when IndexedDB usage exceeds 80% of the browser-reported quota (`navigator.storage.estimate()`).

### Currency Calculator

- Accessible via icon in the app-level header (overlay/modal). The icon appears persistently on both the city dashboard (Level 2) and all section screens (Level 3) — it is always reachable regardless of which screen is active.
- Default currency pair per city view (applied on first open; user selection persists per city thereafter):
  - Prague: CZK ↔ USD
  - Vienna: EUR ↔ USD
  - Budapest: HUF ↔ USD
  - Philly outbound: CZK ↔ USD
  - Philly return: HUF ↔ USD
- User can change either currency to any currency supported by frankfurter.app. The selected pair is saved per `cityViewId` in `userPreferences` and restored on next open. Currency preferences are independent between `philly-out` and `philly-in` — not shared. No explicit "reset to default" in v1.
- Two-way conversion: edit either field, the other updates instantly
- Live rates via **frankfurter.app** (no auth, no API key, free, open)
  - One fetch per currency pair per calendar day
  - Rate cached in IndexedDB, keyed by pair string (format: `"CZK-USD"`)
  - Falls back to cached rate when offline; shows "rate from [date]" label when using a cached rate

---

## Data Model (IndexedDB)

```
// IDs: all `id` fields are generated as UUIDs (crypto.randomUUID()).
// Singleton stores use a fixed primary key of "data".

// Store: appMeta — primary key: "data"
appMeta: { key: "data", initialized: boolean }
// Set to { initialized: true } after seed import. Never overwritten.

// Store: userPreferences — primary key: "data"
userPreferences: { key: "data", currencyPairs: { [cityViewId]: { from, to } } }
// cityViewId: philly-out, prague, vienna, budapest, philly-in

// Store: itinerary — primary key: cityViewId (one record per city view)
itinerary: { cityViewId, days: [{ date, items: [{ id, name, time, duration, location, notes, links: [{ label, url }] }] }] }
// Philly views have their own separate itinerary records. If a Philly view has no itinerary days,
// the Today's Area map in the Itinerary section is simply not shown.

// Store: activities — primary key: cityId (one record per city, shared between Philly views)
activities: { cityId, items: [{ id, name, location, timeEstimate, cost, priority: number (1–5), notes, link }] }

// Store: phrases — primary key: cityId
phrases: { cityId, categories: [{ name, words: [{ english, local, phonetic?: string }], info: [{ title, body }] }] }
// phonetic is optional — omitted for Philly slang entries where not applicable

// Store: memories — primary key: cityId
// One record per memory entry (not a single embedded array) to avoid large reads/writes as photos accumulate
memories: { id, cityId, author, timestamp, location, photos: string[], note }
// photos: array of base64-encoded JPEG strings
// Primary key: id (UUID). cityId used as an index for querying by city.

// Store: exchangeRates — primary key: pair (format "CZK-USD")
exchangeRates: { pair, rate, fetchedAt }  // fetchedAt: ISO date string e.g. "2026-06-14"
```

**City scope clarification:**
- `cityViewId` values: `philly-out`, `prague`, `vienna`, `budapest`, `philly-in`
- `cityId` values (shared content scope): `philly`, `prague`, `vienna`, `budapest`
- Itinerary uses `cityViewId` (separate per direction). Activities, phrases, and memories use `cityId` (shared between both Philly views).

---

## Seed Data

All pre-loaded content (itinerary, activities, phrases) lives in `/src/data/seed.json`, structured by city. On first app load (detected via `appMeta.initialized`), the seed is imported into IndexedDB and `appMeta` is set to `{ initialized: true }`. Subsequent loads use IndexedDB directly. On-device itinerary edits persist in IndexedDB and are never overwritten by the seed. There is no reset or re-seed mechanism in v1 — if the seed needs to be corrected, update the seed file and clear app storage manually.

---

## Offline Strategy

- Service worker caches all app assets on install
- IndexedDB stores all user data and pre-loaded content
- Exchange rates cached after first fetch; stale cache used when offline with a "rate from [date]" label
- Google Maps iframe degrades gracefully when offline — the iframe area shows a CSS-only placeholder with the city/area name as text and a muted map-pin icon
- Google Translate deep link opens native Translate app — works offline if Translate app is installed

---

## Out of Scope (v1)

- Real-time sync between phones
- Export / memory processing
- Audio pronunciations
- Backend / authentication
- Push notifications
- User accounts
- Filtering activities (sort only)
- Editing existing memory entries (delete and re-add)
- Drag-to-reorder in itinerary edit mode
- Reset currency pair to default

---

## Future (v2)

- NUC-hosted sync API (REST or WebSocket)
- Tailscale for secure remote access
- Shared memory feed between Iris and Niko
- Memory export / artifact generation
- Live collaboration on itinerary
