# Travel Companion App Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers-extended-cc:subagent-driven-development (if subagents available) or superpowers-extended-cc:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal offline-capable PWA for two iPhones covering a Philadelphia → Prague → Vienna → Budapest → Philadelphia trip, with itinerary, activity list, language reference, memory capture, and currency conversion.

**Architecture:** React (Vite) SPA with a service worker for offline asset caching and IndexedDB for all data storage via a repository pattern. All content is seeded from a JSON file on first load. The currency calculator fetches live rates from frankfurter.app once per day and caches them. The app is structured around 5 city views sharing 4 city data scopes.

**Tech Stack:** React 18, Vite, TypeScript, Workbox (service worker), idb (IndexedDB wrapper), React Router v6, Vitest + React Testing Library

---

## File Structure

```
src/
  config/
    cities.ts              # City view config: maps iframe URLs, saved-spots links, language pairs, currency defaults
  data/
    seed.json              # All pre-loaded content: itinerary, activities, phrases per city
  db/
    schema.ts              # IndexedDB store definitions, types
    client.ts              # idb openDB call, exports typed db instance
    repositories/
      appMeta.ts           # initialized flag read/write
      itinerary.ts         # read/write itinerary per cityViewId
      activities.ts        # read activities per cityId
      phrases.ts           # read phrases per cityId
      memories.ts          # CRUD memories per cityId (one record per entry)
      exchangeRates.ts     # read/write cached rates
      userPreferences.ts   # read/write currency pair preferences
  seed/
    loader.ts              # imports seed.json into IndexedDB on first load
  hooks/
    useCity.ts             # provides active cityViewId/cityId from router context
    useItinerary.ts        # loads/saves itinerary for active city view
    useActivities.ts       # loads activities for active city
    usePhrases.ts          # loads phrases for active city
    useMemories.ts         # CRUD memories for active city
    useExchangeRate.ts     # fetches/caches rate, returns rate + status
    useUserPreferences.ts  # reads/writes currency pair preferences
  components/
    layout/
      AppShell.tsx         # persistent header (back button, calculator icon, city name)
      CitySelector.tsx     # Level 1 — 5 city view cards
      CityDashboard.tsx    # Level 2 — map block + 4 section cards
    map/
      CityMap.tsx          # Google Maps iframe + offline placeholder
    sections/
      itinerary/
        ItinerarySection.tsx      # section root
        DayGroup.tsx              # date header + item list
        ItineraryCard.tsx         # single item card (view mode)
        ItineraryCardEdit.tsx     # single item card (edit mode)
        LinkChip.tsx              # label+url chip
      activities/
        ActivitiesSection.tsx     # section root + sort control
        ActivityRow.tsx           # collapsed row
        ActivityDetail.tsx        # expanded detail
      phrases/
        PhrasesSection.tsx        # section root + search + translate link
        CategoryTabs.tsx          # Basic / Food / Travel / Getting Help / Other
        PhraseCard.tsx            # english + local + phonetic
        InfoCard.tsx              # title + body
      memories/
        MemoriesSection.tsx       # section root + feed
        MemoryEntry.tsx           # single feed entry
        AddMemorySheet.tsx        # capture bottom sheet
      calculator/
        CalculatorOverlay.tsx     # overlay/modal
        CurrencyInput.tsx         # two-way input pair
        CurrencyPicker.tsx        # currency selector
  pages/
    index.tsx              # mounts router
  router.tsx               # route definitions
  main.tsx                 # app entry, seed loader call
  service-worker.ts        # Workbox precache + runtime cache config
tests/
  db/
    repositories/          # unit tests per repository
  hooks/                   # hook tests with mock db
  components/              # component tests
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`

- [ ] **Step 1: Scaffold Vite + React + TypeScript project**

```bash
npm create vite@latest travel-companion -- --template react-ts
cd travel-companion
npm install
```

- [ ] **Step 2: Install core dependencies**

```bash
npm install react-router-dom idb
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

- [ ] **Step 3: Install Workbox**

```bash
npm install -D workbox-cli vite-plugin-pwa
```

- [ ] **Step 4: Configure vite.config.ts with PWA plugin**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Trip Companion',
        short_name: 'Trip',
        theme_color: '#0f1923',
        background_color: '#0f1923',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    })
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true
  }
})
```

- [ ] **Step 5: Create test setup file**

```typescript
// tests/setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```
Expected: Vite dev server running at http://localhost:5173

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Vite React TypeScript PWA"
```

---

## Task 2: Global Styles & Design Tokens

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/components.css`

- [ ] **Step 1: Write test — token CSS variables are applied to root**

```typescript
// tests/styles/tokens.test.ts
import { describe, it, expect } from 'vitest'

describe('design tokens', () => {
  it('token file exists and exports expected variable names', async () => {
    const css = await import('../src/styles/tokens.css?raw')
    expect(css.default).toContain('--color-bg')
    expect(css.default).toContain('--color-cream')
    expect(css.default).toContain('--color-gold')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- tokens.test.ts
```
Expected: FAIL — file not found

- [ ] **Step 3: Create tokens.css**

```css
/* src/styles/tokens.css */
:root {
  --color-bg: #0f1923;
  --color-bg-card: #1a2a3a;
  --color-bg-card-alt: #152030;
  --color-cream: #e8dcc8;
  --color-gold: #a08060;
  --color-blue: #8ab4c8;
  --color-muted: #5a6a7a;
  --color-dim: rgba(232, 220, 200, 0.35);

  --font-serif: 'Georgia', 'Times New Roman', serif;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
}
```

- [ ] **Step 4: Create global.css**

```css
/* src/styles/global.css */
@import './tokens.css';

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body, #root {
  height: 100%;
  background: var(--color-bg);
  color: var(--color-cream);
  font-family: var(--font-sans);
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 { font-family: var(--font-serif); }

a { color: var(--color-blue); text-decoration: none; }

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
  color: inherit;
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npm run test -- tokens.test.ts
```
Expected: PASS

- [ ] **Step 6: Import global.css in main.tsx**

```typescript
// src/main.tsx
import './styles/global.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 7: Commit**

```bash
git add src/styles/ src/main.tsx tests/styles/
git commit -m "feat: add design tokens and global styles"
```

---

## Task 3: Database Schema & Client

**Files:**
- Create: `src/db/schema.ts`, `src/db/client.ts`
- Test: `tests/db/client.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
// tests/db/client.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { openAppDB } from '../../src/db/client'

beforeEach(() => indexedDB.deleteDatabase('trip-companion'))
afterEach(() => indexedDB.deleteDatabase('trip-companion'))

describe('openAppDB', () => {
  it('opens the database with all required stores', async () => {
    const db = await openAppDB()
    expect(db.objectStoreNames.contains('appMeta')).toBe(true)
    expect(db.objectStoreNames.contains('userPreferences')).toBe(true)
    expect(db.objectStoreNames.contains('itinerary')).toBe(true)
    expect(db.objectStoreNames.contains('activities')).toBe(true)
    expect(db.objectStoreNames.contains('phrases')).toBe(true)
    expect(db.objectStoreNames.contains('memories')).toBe(true)
    expect(db.objectStoreNames.contains('exchangeRates')).toBe(true)
    db.close()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- client.test.ts
```
Expected: FAIL — module not found

- [ ] **Step 3: Create schema.ts**

```typescript
// src/db/schema.ts
export type CityViewId = 'philly-out' | 'prague' | 'vienna' | 'budapest' | 'philly-in'
export type CityId = 'philly' | 'prague' | 'vienna' | 'budapest'

export interface ItineraryLink { label: string; url: string }
export interface ItineraryItem { id: string; name: string; time: string; duration: string; location: string; notes: string; links: ItineraryLink[] }
export interface ItineraryDay { date: string; items: ItineraryItem[] }
export interface ItineraryRecord { cityViewId: CityViewId; days: ItineraryDay[] }

export interface ActivityItem { id: string; name: string; location: string; timeEstimate: string; cost: string; priority: number; notes: string; link: string }
export interface ActivitiesRecord { cityId: CityId; items: ActivityItem[] }

export interface PhraseWord { english: string; local: string; phonetic?: string }
export interface InfoCard { title: string; body: string }
export interface PhraseCategory { name: string; words: PhraseWord[]; info: InfoCard[] }
export interface PhrasesRecord { cityId: CityId; categories: PhraseCategory[] }

export interface MemoryEntry { id: string; cityId: CityId; author: string; timestamp: string; location: string; photos: string[]; note: string }

export interface ExchangeRate { pair: string; rate: number; fetchedAt: string }

export interface CurrencyPref { from: string; to: string }
export interface UserPreferences { key: 'data'; currencyPairs: Partial<Record<CityViewId, CurrencyPref>> }

export interface AppMeta { key: 'data'; initialized: boolean }
```

- [ ] **Step 4: Create client.ts**

```typescript
// src/db/client.ts
import { openDB, IDBPDatabase } from 'idb'

export type AppDB = IDBPDatabase

export async function openAppDB(): Promise<AppDB> {
  return openDB('trip-companion', 1, {
    upgrade(db) {
      db.createObjectStore('appMeta', { keyPath: 'key' })
      db.createObjectStore('userPreferences', { keyPath: 'key' })
      db.createObjectStore('itinerary', { keyPath: 'cityViewId' })
      db.createObjectStore('activities', { keyPath: 'cityId' })
      db.createObjectStore('phrases', { keyPath: 'cityId' })
      const memories = db.createObjectStore('memories', { keyPath: 'id' })
      memories.createIndex('byCityId', 'cityId')
      db.createObjectStore('exchangeRates', { keyPath: 'pair' })
    }
  })
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npm run test -- client.test.ts
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/db/ tests/db/client.test.ts
git commit -m "feat: add IndexedDB schema and client"
```

---

## Task 4: Repositories

**Files:**
- Create: `src/db/repositories/appMeta.ts`, `activities.ts`, `itinerary.ts`, `phrases.ts`, `memories.ts`, `exchangeRates.ts`, `userPreferences.ts`
- Test: `tests/db/repositories/*.test.ts`

- [ ] **Step 1: Write failing tests for appMeta repository**

```typescript
// tests/db/repositories/appMeta.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { openAppDB } from '../../../src/db/client'
import { isInitialized, setInitialized } from '../../../src/db/repositories/appMeta'

beforeEach(() => indexedDB.deleteDatabase('trip-companion'))

describe('appMeta repository', () => {
  it('returns false when not initialized', async () => {
    const db = await openAppDB()
    expect(await isInitialized(db)).toBe(false)
    db.close()
  })

  it('returns true after setInitialized', async () => {
    const db = await openAppDB()
    await setInitialized(db)
    expect(await isInitialized(db)).toBe(true)
    db.close()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- appMeta.test.ts
```
Expected: FAIL

- [ ] **Step 3: Implement appMeta repository**

```typescript
// src/db/repositories/appMeta.ts
import { AppDB } from '../client'

export async function isInitialized(db: AppDB): Promise<boolean> {
  const record = await db.get('appMeta', 'data')
  return record?.initialized === true
}

export async function setInitialized(db: AppDB): Promise<void> {
  await db.put('appMeta', { key: 'data', initialized: true })
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- appMeta.test.ts
```
Expected: PASS

- [ ] **Step 5: Write and implement remaining repositories (itinerary, activities, phrases, memories, exchangeRates, userPreferences)**

Follow the same TDD pattern for each. Key implementations:

```typescript
// src/db/repositories/memories.ts
import { AppDB } from '../client'
import { MemoryEntry, CityId } from '../schema'

export async function getMemories(db: AppDB, cityId: CityId): Promise<MemoryEntry[]> {
  const index = db.transaction('memories').store.index('byCityId')
  const entries = await index.getAll(cityId)
  return entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

export async function addMemory(db: AppDB, entry: MemoryEntry): Promise<void> {
  await db.put('memories', entry)
}

export async function deleteMemory(db: AppDB, id: string): Promise<void> {
  await db.delete('memories', id)
}
```

```typescript
// src/db/repositories/exchangeRates.ts
import { AppDB } from '../client'
import { ExchangeRate } from '../schema'

export async function getCachedRate(db: AppDB, pair: string): Promise<ExchangeRate | undefined> {
  return db.get('exchangeRates', pair)
}

export async function setCachedRate(db: AppDB, rate: ExchangeRate): Promise<void> {
  await db.put('exchangeRates', rate)
}
```

```typescript
// src/db/repositories/userPreferences.ts
import { AppDB } from '../client'
import { CityViewId, CurrencyPref } from '../schema'

export async function getCurrencyPref(db: AppDB, cityViewId: CityViewId): Promise<CurrencyPref | undefined> {
  const prefs = await db.get('userPreferences', 'data')
  return prefs?.currencyPairs?.[cityViewId]
}

export async function setCurrencyPref(db: AppDB, cityViewId: CityViewId, pref: CurrencyPref): Promise<void> {
  const existing = await db.get('userPreferences', 'data') ?? { key: 'data', currencyPairs: {} }
  existing.currencyPairs[cityViewId] = pref
  await db.put('userPreferences', existing)
}
```

- [ ] **Step 6: Run all repository tests**

```bash
npm run test -- tests/db/repositories/
```
Expected: all PASS

- [ ] **Step 7: Commit**

```bash
git add src/db/repositories/ tests/db/repositories/
git commit -m "feat: add IndexedDB repositories"
```

---

## Task 5: City Config & Seed Data

**Files:**
- Create: `src/config/cities.ts`, `src/data/seed.json`, `src/seed/loader.ts`
- Test: `tests/seed/loader.test.ts`

- [ ] **Step 1: Create city config**

```typescript
// src/config/cities.ts
import { CityViewId, CityId } from '../db/schema'

export interface CityViewConfig {
  cityViewId: CityViewId
  cityId: CityId
  label: string
  mapEmbedUrl: string
  savedSpotsUrl: string
  translateFrom?: string
  translateTo?: string
  defaultCurrencyFrom: string
  defaultCurrencyTo: string
  travelNote?: string
}

export const CITY_VIEWS: CityViewConfig[] = [
  {
    cityViewId: 'philly-out',
    cityId: 'philly',
    label: 'Philadelphia',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!...PHL', // fill before trip
    savedSpotsUrl: 'https://maps.google.com/maps/...', // fill before trip
    defaultCurrencyFrom: 'CZK',
    defaultCurrencyTo: 'USD',
    travelNote: 'Uber → PHL → layover → PRG'
  },
  {
    cityViewId: 'prague',
    cityId: 'prague',
    label: 'Prague',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!...PRG', // fill before trip
    savedSpotsUrl: 'https://maps.google.com/maps/...', // fill before trip
    translateFrom: 'en',
    translateTo: 'cs',
    defaultCurrencyFrom: 'CZK',
    defaultCurrencyTo: 'USD'
  },
  {
    cityViewId: 'vienna',
    cityId: 'vienna',
    label: 'Vienna',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!...VIE',
    savedSpotsUrl: 'https://maps.google.com/maps/...',
    translateFrom: 'en',
    translateTo: 'de',
    defaultCurrencyFrom: 'EUR',
    defaultCurrencyTo: 'USD'
  },
  {
    cityViewId: 'budapest',
    cityId: 'budapest',
    label: 'Budapest',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!...BUD',
    savedSpotsUrl: 'https://maps.google.com/maps/...',
    translateFrom: 'en',
    translateTo: 'hu',
    defaultCurrencyFrom: 'HUF',
    defaultCurrencyTo: 'USD'
  },
  {
    cityViewId: 'philly-in',
    cityId: 'philly',
    label: 'Philadelphia',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!...PHL',
    savedSpotsUrl: 'https://maps.google.com/maps/...',
    defaultCurrencyFrom: 'HUF',
    defaultCurrencyTo: 'USD',
    travelNote: 'BUD → layover → PHL → Uber'
  }
]

export function getCityView(id: CityViewId): CityViewConfig {
  return CITY_VIEWS.find(c => c.cityViewId === id)!
}
```

- [ ] **Step 2: Create seed.json with placeholder structure**

```json
// src/data/seed.json
{
  "itinerary": {
    "philly-out": { "cityViewId": "philly-out", "days": [] },
    "prague": { "cityViewId": "prague", "days": [
      { "date": "2026-06-14", "items": [
        { "id": "prg-1", "name": "Arrive at Václav Havel Airport", "time": "10:00", "duration": "1h", "location": "PRG Airport", "notes": "", "links": [] }
      ]}
    ]},
    "vienna": { "cityViewId": "vienna", "days": [] },
    "budapest": { "cityViewId": "budapest", "days": [] },
    "philly-in": { "cityViewId": "philly-in", "days": [] }
  },
  "activities": {
    "philly": { "cityId": "philly", "items": [] },
    "prague": { "cityId": "prague", "items": [
      { "id": "act-prg-1", "name": "Prague Castle", "location": "Hradčany", "timeEstimate": "3h", "cost": "Free", "priority": 5, "notes": "St. Vitus Cathedral inside", "link": "" }
    ]},
    "vienna": { "cityId": "vienna", "items": [] },
    "budapest": { "cityId": "budapest", "items": [] }
  },
  "phrases": {
    "philly": { "cityId": "philly", "categories": [
      { "name": "Basic", "words": [
        { "english": "How are you?", "local": "How you doin'?", "phonetic": "How ya doo-in" }
      ], "info": [
        { "title": "Cheesesteaks", "body": "Say 'wit' for onions, 'witout' for none. At Pat's or Geno's, know your order before you step up." }
      ]}
    ]},
    "prague": { "cityId": "prague", "categories": [
      { "name": "Basic", "words": [
        { "english": "Thank you", "local": "Děkuji", "phonetic": "dyeh-koo-yee" },
        { "english": "Please", "local": "Prosím", "phonetic": "pro-seem" }
      ], "info": [
        { "title": "Tipping", "body": "Round up the bill or tip 10%. Not mandatory but appreciated." }
      ]}
    ]},
    "vienna": { "cityId": "vienna", "categories": [] },
    "budapest": { "cityId": "budapest", "categories": [] }
  }
}
```

- [ ] **Step 3: Write failing test for seed loader**

```typescript
// tests/seed/loader.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { openAppDB } from '../../src/db/client'
import { loadSeedIfNeeded } from '../../src/seed/loader'
import { isInitialized } from '../../src/db/repositories/appMeta'

beforeEach(() => indexedDB.deleteDatabase('trip-companion'))

describe('loadSeedIfNeeded', () => {
  it('loads seed data on first call and sets initialized', async () => {
    const db = await openAppDB()
    await loadSeedIfNeeded(db)
    expect(await isInitialized(db)).toBe(true)
    const prague = await db.get('itinerary', 'prague')
    expect(prague).toBeDefined()
    db.close()
  })

  it('does not overwrite on second call', async () => {
    const db = await openAppDB()
    await loadSeedIfNeeded(db)
    // Simulate an on-device edit
    const record = await db.get('itinerary', 'prague')
    record.days[0].items[0].name = 'EDITED'
    await db.put('itinerary', record)
    await loadSeedIfNeeded(db)
    const after = await db.get('itinerary', 'prague')
    expect(after.days[0].items[0].name).toBe('EDITED')
    db.close()
  })
})
```

- [ ] **Step 4: Run test to verify it fails**

```bash
npm run test -- loader.test.ts
```
Expected: FAIL

- [ ] **Step 5: Implement seed loader**

```typescript
// src/seed/loader.ts
import { AppDB } from '../db/client'
import { isInitialized, setInitialized } from '../db/repositories/appMeta'
import seed from '../data/seed.json'

export async function loadSeedIfNeeded(db: AppDB): Promise<void> {
  if (await isInitialized(db)) return

  const tx = db.transaction(['itinerary', 'activities', 'phrases'], 'readwrite')
  for (const record of Object.values(seed.itinerary)) {
    await tx.objectStore('itinerary').put(record)
  }
  for (const record of Object.values(seed.activities)) {
    await tx.objectStore('activities').put(record)
  }
  for (const record of Object.values(seed.phrases)) {
    await tx.objectStore('phrases').put(record)
  }
  await tx.done

  await setInitialized(db)
}
```

- [ ] **Step 6: Run test to verify it passes**

```bash
npm run test -- loader.test.ts
```
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/config/ src/data/ src/seed/ tests/seed/
git commit -m "feat: add city config, seed data, and seed loader"
```

---

## Task 6: Custom Hooks

**Files:**
- Create: `src/hooks/useCity.ts`, `useItinerary.ts`, `useActivities.ts`, `usePhrases.ts`, `useMemories.ts`, `useExchangeRate.ts`, `useUserPreferences.ts`
- Create: `src/db/DbContext.tsx` — React context providing a shared db instance
- Test: `tests/hooks/*.test.ts`

- [ ] **Step 1: Create DbContext**

```typescript
// src/db/DbContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { openAppDB, AppDB } from './client'
import { loadSeedIfNeeded } from '../seed/loader'

const DbContext = createContext<AppDB | null>(null)

export function DbProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<AppDB | null>(null)

  useEffect(() => {
    openAppDB().then(async (db) => {
      await loadSeedIfNeeded(db)
      setDb(db)
    })
  }, [])

  if (!db) return <div style={{ color: '#e8dcc8', padding: 32 }}>Loading…</div>
  return <DbContext.Provider value={db}>{children}</DbContext.Provider>
}

export function useDb(): AppDB {
  const db = useContext(DbContext)
  if (!db) throw new Error('useDb must be used within DbProvider')
  return db
}
```

- [ ] **Step 2: Write failing test for useMemories**

```typescript
// tests/hooks/useMemories.test.ts
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
// Use a mock db wrapper — see implementation notes below
import { makeTestWrapper } from '../helpers/testWrapper'
import { useMemories } from '../../src/hooks/useMemories'

beforeEach(() => indexedDB.deleteDatabase('trip-companion'))

describe('useMemories', () => {
  it('adds and retrieves a memory', async () => {
    const { result } = renderHook(() => useMemories('prague'), { wrapper: makeTestWrapper() })
    await act(async () => {
      await result.current.addMemory({
        id: '1', cityId: 'prague', author: 'Iris',
        timestamp: '2026-06-14T10:00:00Z', location: 'Prague Castle',
        photos: [], note: 'Amazing view'
      })
    })
    expect(result.current.entries).toHaveLength(1)
    expect(result.current.entries[0].note).toBe('Amazing view')
  })
})
```

- [ ] **Step 3: Create test helper**

```typescript
// tests/helpers/testWrapper.tsx
import React from 'react'
import { DbProvider } from '../../src/db/DbContext'

export function makeTestWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <DbProvider>{children}</DbProvider>
  }
}
```

- [ ] **Step 4: Run test to verify it fails**

```bash
npm run test -- useMemories.test.ts
```
Expected: FAIL

- [ ] **Step 5: Implement useMemories**

```typescript
// src/hooks/useMemories.ts
import { useState, useEffect, useCallback } from 'react'
import { useDb } from '../db/DbContext'
import { CityId, MemoryEntry } from '../db/schema'
import { getMemories, addMemory as dbAdd, deleteMemory as dbDelete } from '../db/repositories/memories'

export function useMemories(cityId: CityId) {
  const db = useDb()
  const [entries, setEntries] = useState<MemoryEntry[]>([])

  useEffect(() => {
    getMemories(db, cityId).then(setEntries)
  }, [db, cityId])

  const addMemory = useCallback(async (entry: MemoryEntry) => {
    await dbAdd(db, entry)
    setEntries(await getMemories(db, cityId))
  }, [db, cityId])

  const deleteMemory = useCallback(async (id: string) => {
    await dbDelete(db, id)
    setEntries(await getMemories(db, cityId))
  }, [db, cityId])

  return { entries, addMemory, deleteMemory }
}
```

- [ ] **Step 6: Implement remaining hooks**

```typescript
// src/hooks/useCity.ts
import { useParams } from 'react-router-dom'
import { CityViewId, CityId } from '../db/schema'

const CITY_ID_MAP: Record<CityViewId, CityId> = {
  'philly-out': 'philly', 'philly-in': 'philly',
  'prague': 'prague', 'vienna': 'vienna', 'budapest': 'budapest'
}

export function useCity() {
  const { cityViewId } = useParams<{ cityViewId: CityViewId }>()
  const id = cityViewId as CityViewId
  return { cityViewId: id, cityId: CITY_ID_MAP[id] }
}
```

```typescript
// src/hooks/useItinerary.ts
import { useState, useEffect, useCallback } from 'react'
import { useDb } from '../db/DbContext'
import { CityViewId, ItineraryRecord, ItineraryItem } from '../db/schema'
import { getItinerary, saveItinerary } from '../db/repositories/itinerary'

export function useItinerary(cityViewId: CityViewId) {
  const db = useDb()
  const [record, setRecord] = useState<ItineraryRecord | null>(null)

  useEffect(() => {
    getItinerary(db, cityViewId).then(setRecord)
  }, [db, cityViewId])

  const updateItem = useCallback(async (date: string, item: ItineraryItem) => {
    if (!record) return
    const updated = {
      ...record,
      days: record.days.map(d =>
        d.date === date
          ? { ...d, items: d.items.map(i => i.id === item.id ? item : i) }
          : d
      )
    }
    await saveItinerary(db, updated)
    setRecord(updated)
  }, [db, record])

  const addItem = useCallback(async (date: string, item: ItineraryItem) => {
    if (!record) return
    const updated = {
      ...record,
      days: record.days.map(d =>
        d.date === date ? { ...d, items: [...d.items, item] } : d
      )
    }
    await saveItinerary(db, updated)
    setRecord(updated)
  }, [db, record])

  const reorderItems = useCallback(async (date: string, items: ItineraryItem[]) => {
    if (!record) return
    const updated = {
      ...record,
      days: record.days.map(d => d.date === date ? { ...d, items } : d)
    }
    await saveItinerary(db, updated)
    setRecord(updated)
  }, [db, record])

  return { record, updateItem, addItem, reorderItems }
}
```

```typescript
// src/hooks/useActivities.ts
import { useState, useEffect } from 'react'
import { useDb } from '../db/DbContext'
import { CityId, ActivityItem } from '../db/schema'
import { getActivities } from '../db/repositories/activities'

type SortKey = 'priority' | 'cost' | 'timeEstimate'

export function useActivities(cityId: CityId) {
  const db = useDb()
  const [items, setItems] = useState<ActivityItem[]>([])
  const [sortKey, setSortKey] = useState<SortKey>('priority')

  useEffect(() => {
    getActivities(db, cityId).then(r => setItems(r?.items ?? []))
  }, [db, cityId])

  return { items, sortKey, setSortKey }
}
```

```typescript
// src/hooks/usePhrases.ts
import { useState, useEffect } from 'react'
import { useDb } from '../db/DbContext'
import { CityId, PhrasesRecord } from '../db/schema'
import { getPhrases } from '../db/repositories/phrases'

export function usePhrases(cityId: CityId) {
  const db = useDb()
  const [record, setRecord] = useState<PhrasesRecord | null>(null)

  useEffect(() => {
    getPhrases(db, cityId).then(setRecord)
  }, [db, cityId])

  return { categories: record?.categories ?? [] }
}
```

```typescript
// src/hooks/useUserPreferences.ts
import { useState, useEffect, useCallback } from 'react'
import { useDb } from '../db/DbContext'
import { CityViewId, CurrencyPref } from '../db/schema'
import { getCurrencyPref, setCurrencyPref } from '../db/repositories/userPreferences'

export function useUserPreferences(cityViewId: CityViewId) {
  const db = useDb()
  const [pref, setPrefState] = useState<CurrencyPref | undefined>(undefined)

  useEffect(() => {
    getCurrencyPref(db, cityViewId).then(setPrefState)
  }, [db, cityViewId])

  const setPref = useCallback(async (p: CurrencyPref) => {
    await setCurrencyPref(db, cityViewId, p)
    setPrefState(p)
  }, [db, cityViewId])

  return { pref, setPref }
}
```

Also add the missing repository implementations:

```typescript
// src/db/repositories/itinerary.ts
import { AppDB } from '../client'
import { CityViewId, ItineraryRecord } from '../schema'

export async function getItinerary(db: AppDB, cityViewId: CityViewId): Promise<ItineraryRecord | undefined> {
  return db.get('itinerary', cityViewId)
}

export async function saveItinerary(db: AppDB, record: ItineraryRecord): Promise<void> {
  await db.put('itinerary', record)
}
```

```typescript
// src/db/repositories/activities.ts
import { AppDB } from '../client'
import { CityId, ActivitiesRecord } from '../schema'

export async function getActivities(db: AppDB, cityId: CityId): Promise<ActivitiesRecord | undefined> {
  return db.get('activities', cityId)
}
```

```typescript
// src/db/repositories/phrases.ts
import { AppDB } from '../client'
import { CityId, PhrasesRecord } from '../schema'

export async function getPhrases(db: AppDB, cityId: CityId): Promise<PhrasesRecord | undefined> {
  return db.get('phrases', cityId)
}
```

**useExchangeRate** — key behavior:

```typescript
// src/hooks/useExchangeRate.ts
import { useState, useEffect } from 'react'
import { useDb } from '../db/DbContext'
import { getCachedRate, setCachedRate } from '../db/repositories/exchangeRates'

const TODAY = new Date().toISOString().slice(0, 10)

export function useExchangeRate(from: string, to: string) {
  const db = useDb()
  const pair = `${from}-${to}`
  const [rate, setRate] = useState<number | null>(null)
  const [isOffline, setIsOffline] = useState(false)
  const [rateDate, setRateDate] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const cached = await getCachedRate(db, pair)
      if (cached && cached.fetchedAt === TODAY) {
        setRate(cached.rate); setRateDate(cached.fetchedAt); return
      }
      try {
        const res = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`)
        const data = await res.json()
        const r = data.rates[to]
        await setCachedRate(db, { pair, rate: r, fetchedAt: TODAY })
        setRate(r); setRateDate(TODAY); setIsOffline(false)
      } catch {
        if (cached) { setRate(cached.rate); setRateDate(cached.fetchedAt); setIsOffline(true) }
      }
    }
    load()
  }, [db, pair, from, to])

  return { rate, isOffline, rateDate }
}
```

- [ ] **Step 7: Run all hook tests**

```bash
npm run test -- tests/hooks/
```
Expected: all PASS

- [ ] **Step 8: Commit**

```bash
git add src/hooks/ src/db/DbContext.tsx tests/hooks/ tests/helpers/
git commit -m "feat: add custom hooks for all data operations"
```

---

## Task 7: Router & App Shell

**Files:**
- Create: `src/router.tsx`, `src/App.tsx`, `src/components/layout/AppShell.tsx`

- [ ] **Step 1: Write failing test for AppShell**

```typescript
// tests/components/AppShell.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { AppShell } from '../../src/components/layout/AppShell'

describe('AppShell', () => {
  it('renders city name in header', () => {
    render(
      <MemoryRouter>
        <AppShell cityLabel="Prague" showBack={false} onCalculator={() => {}}>
          <div>content</div>
        </AppShell>
      </MemoryRouter>
    )
    expect(screen.getByText('Prague')).toBeInTheDocument()
  })

  it('renders back button when showBack is true', () => {
    render(
      <MemoryRouter>
        <AppShell cityLabel="Prague" showBack={true} onCalculator={() => {}}>
          <div>content</div>
        </AppShell>
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
  })

  it('renders calculator icon button', () => {
    render(
      <MemoryRouter>
        <AppShell cityLabel="Prague" showBack={false} onCalculator={() => {}}>
          <div>content</div>
        </AppShell>
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: /calculator/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- AppShell.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Implement AppShell**

```typescript
// src/components/layout/AppShell.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  cityLabel: string
  showBack: boolean
  onCalculator: () => void
  children: React.ReactNode
}

export function AppShell({ cityLabel, showBack, onCalculator, children }: Props) {
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-bg-card)'
      }}>
        {showBack
          ? <button aria-label="back" onClick={() => navigate(-1)} style={{ fontSize: 20, color: 'var(--color-gold)' }}>←</button>
          : <span />}
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--color-cream)', letterSpacing: 1 }}>
          {cityLabel}
        </h1>
        <button aria-label="calculator" onClick={onCalculator} style={{ fontSize: 20, color: 'var(--color-gold)' }}>
          ₿
        </button>
      </header>
      <main style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-md)' }}>
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Implement router**

```typescript
// src/router.tsx
import { createBrowserRouter } from 'react-router-dom'
import { CitySelector } from './components/layout/CitySelector'
import { CityDashboard } from './components/layout/CityDashboard'
import { ItinerarySection } from './components/sections/itinerary/ItinerarySection'
import { ActivitiesSection } from './components/sections/activities/ActivitiesSection'
import { PhrasesSection } from './components/sections/phrases/PhrasesSection'
import { MemoriesSection } from './components/sections/memories/MemoriesSection'

export const router = createBrowserRouter([
  { path: '/', element: <CitySelector /> },
  { path: '/:cityViewId', element: <CityDashboard /> },
  { path: '/:cityViewId/itinerary', element: <ItinerarySection /> },
  { path: '/:cityViewId/activities', element: <ActivitiesSection /> },
  { path: '/:cityViewId/phrases', element: <PhrasesSection /> },
  { path: '/:cityViewId/memories', element: <MemoriesSection /> },
])
```

- [ ] **Step 5: Run test to verify AppShell passes**

```bash
npm run test -- AppShell.test.tsx
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/router.tsx src/App.tsx src/components/layout/AppShell.tsx tests/components/AppShell.test.tsx
git commit -m "feat: add router and AppShell layout"
```

---

## Task 8: City Selector & Dashboard

**Files:**
- Create: `src/components/layout/CitySelector.tsx`, `src/components/layout/CityDashboard.tsx`
- Create: `src/components/map/CityMap.tsx`

- [ ] **Step 1: Write failing test for CitySelector**

```typescript
// tests/components/CitySelector.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { CitySelector } from '../../src/components/layout/CitySelector'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate
}))

describe('CitySelector', () => {
  it('renders all 5 city view cards', () => {
    render(<MemoryRouter><CitySelector /></MemoryRouter>)
    expect(screen.getAllByRole('button')).toHaveLength(5)
  })

  it('navigates to city view on click', async () => {
    render(<MemoryRouter><CitySelector /></MemoryRouter>)
    await userEvent.click(screen.getByText('Prague'))
    expect(mockNavigate).toHaveBeenCalledWith('/prague')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- CitySelector.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Implement CitySelector**

```typescript
// src/components/layout/CitySelector.tsx
import { useNavigate } from 'react-router-dom'
import { CITY_VIEWS } from '../../config/cities'

export function CitySelector() {
  const navigate = useNavigate()
  return (
    <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--color-cream)', marginBottom: 'var(--space-md)' }}>
        Your Trip
      </h1>
      {CITY_VIEWS.map((city) => (
        <button
          key={city.cityViewId}
          onClick={() => navigate(`/${city.cityViewId}`)}
          style={{
            background: 'var(--color-bg-card)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-lg)',
            textAlign: 'left',
            color: 'var(--color-cream)',
            fontSize: 20,
            fontFamily: 'var(--font-serif)',
          }}
        >
          {city.label}
          {city.travelNote && (
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>
              {city.travelNote}
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Implement CityMap with offline fallback**

```typescript
// src/components/map/CityMap.tsx
import { useState } from 'react'

interface Props { embedUrl: string; cityLabel: string }

export function CityMap({ embedUrl, cityLabel }: Props) {
  const [failed, setFailed] = useState(false)

  if (failed || !navigator.onLine) {
    return (
      <div style={{
        background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)',
        height: 180, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 8,
        color: 'var(--color-muted)'
      }}>
        <span style={{ fontSize: 24 }}>📍</span>
        <span style={{ fontSize: 13 }}>{cityLabel}</span>
        <span style={{ fontSize: 11 }}>Map unavailable offline</span>
      </div>
    )
  }

  return (
    <iframe
      src={embedUrl}
      style={{ width: '100%', height: 180, border: 'none', borderRadius: 'var(--radius-md)' }}
      onError={() => setFailed(true)}
      loading="lazy"
      title={`Map of ${cityLabel}`}
    />
  )
}
```

- [ ] **Step 5: Implement CityDashboard**

```typescript
// src/components/layout/CityDashboard.tsx
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getCityView } from '../../config/cities'
import { CityViewId } from '../../db/schema'
import { AppShell } from './AppShell'
import { CityMap } from '../map/CityMap'
import { CalculatorOverlay } from '../calculator/CalculatorOverlay'

const SECTIONS = [
  { key: 'itinerary', label: 'Itinerary' },
  { key: 'activities', label: 'What to Do' },
  { key: 'phrases', label: 'What to Say' },
  { key: 'memories', label: 'Memories' },
]

export function CityDashboard() {
  const { cityViewId } = useParams<{ cityViewId: CityViewId }>()
  const navigate = useNavigate()
  const [showCalc, setShowCalc] = useState(false)
  const config = getCityView(cityViewId!)

  return (
    <AppShell cityLabel={config.label} showBack={false} onCalculator={() => setShowCalc(true)}>
      <CityMap embedUrl={config.mapEmbedUrl} cityLabel={config.label} />
      {config.travelNote && (
        <p style={{ fontSize: 12, color: 'var(--color-muted)', margin: '8px 0' }}>{config.travelNote}</p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
        {SECTIONS.map(s => (
          <button key={s.key}
            onClick={() => navigate(`/${cityViewId}/${s.key}`)}
            style={{
              background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)',
              padding: 'var(--space-lg)', fontFamily: 'var(--font-serif)',
              fontSize: 16, color: 'var(--color-cream)', textAlign: 'left'
            }}>
            {s.label}
          </button>
        ))}
      </div>
      {showCalc && <CalculatorOverlay cityViewId={cityViewId!} onClose={() => setShowCalc(false)} />}
    </AppShell>
  )
}
```

- [ ] **Step 6: Run tests**

```bash
npm run test -- CitySelector.test.tsx
```
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/CityDashboard.tsx src/components/layout/CitySelector.tsx src/components/map/ tests/components/
git commit -m "feat: add city selector, dashboard, and map"
```

---

## Task 9: Currency Calculator

**Files:**
- Create: `src/components/calculator/CalculatorOverlay.tsx`, `CurrencyInput.tsx`, `CurrencyPicker.tsx`
- Test: `tests/components/calculator/`

- [ ] **Step 1: Write failing test for two-way conversion**

```typescript
// tests/components/calculator/CurrencyInput.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { CurrencyInput } from '../../../src/components/calculator/CurrencyInput'

describe('CurrencyInput', () => {
  it('calls onFromChange when from field edited', async () => {
    const onFromChange = vi.fn()
    render(<CurrencyInput from="CZK" to="USD" rate={0.045} fromValue="" toValue="" onFromChange={onFromChange} onToChange={vi.fn()} />)
    await userEvent.type(screen.getByLabelText('CZK amount'), '100')
    expect(onFromChange).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- CurrencyInput.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Implement CurrencyInput**

```typescript
// src/components/calculator/CurrencyInput.tsx
interface Props {
  from: string; to: string; rate: number | null
  fromValue: string; toValue: string
  onFromChange: (v: string) => void; onToChange: (v: string) => void
}

export function CurrencyInput({ from, to, rate, fromValue, toValue, onFromChange, onToChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4, color: 'var(--color-gold)', fontSize: 12, letterSpacing: 1 }}>
        {from}
        <input aria-label={`${from} amount`} type="number" value={fromValue}
          onChange={e => onFromChange(e.target.value)}
          style={{ background: 'var(--color-bg-card-alt)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 12px', color: 'var(--color-cream)', fontSize: 24 }} />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4, color: 'var(--color-gold)', fontSize: 12, letterSpacing: 1 }}>
        {to}
        <input aria-label={`${to} amount`} type="number" value={toValue}
          onChange={e => onToChange(e.target.value)}
          style={{ background: 'var(--color-bg-card-alt)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 12px', color: 'var(--color-cream)', fontSize: 24 }} />
      </label>
    </div>
  )
}
```

- [ ] **Step 4: Implement CurrencyPicker**

```typescript
// src/components/calculator/CurrencyPicker.tsx
// A simple select showing common currencies. frankfurter.app supports all ISO 4217 codes.
const COMMON = ['USD', 'EUR', 'CZK', 'HUF', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD']

interface Props { value: string; onChange: (v: string) => void; label: string }

export function CurrencyPicker({ value, onChange, label }: Props) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, color: 'var(--color-muted)', fontSize: 11, letterSpacing: 1 }}>
      {label}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ background: 'var(--color-bg-card-alt)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '6px 10px', color: 'var(--color-cream)', fontSize: 14 }}>
        {COMMON.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </label>
  )
}
```

- [ ] **Step 5: Implement CalculatorOverlay with two-way logic and currency switching**

```typescript
// src/components/calculator/CalculatorOverlay.tsx
import { useState } from 'react'
import { CityViewId } from '../../db/schema'
import { getCityView } from '../../config/cities'
import { useExchangeRate } from '../../hooks/useExchangeRate'
import { useUserPreferences } from '../../hooks/useUserPreferences'
import { CurrencyInput } from './CurrencyInput'

interface Props { cityViewId: CityViewId; onClose: () => void }

export function CalculatorOverlay({ cityViewId, onClose }: Props) {
  const config = getCityView(cityViewId)
  const { pref, setPref } = useUserPreferences(cityViewId)
  const [from, setFrom] = useState(pref?.from ?? config.defaultCurrencyFrom)
  const [to, setTo] = useState(pref?.to ?? config.defaultCurrencyTo)
  const { rate, isOffline, rateDate } = useExchangeRate(from, to)
  const [fromVal, setFromVal] = useState('')
  const [toVal, setToVal] = useState('')

  function handleFromChange(v: string) {
    setFromVal(v)
    if (rate && v) setToVal((parseFloat(v) * rate).toFixed(2))
    else setToVal('')
  }

  function handleToChange(v: string) {
    setToVal(v)
    if (rate && v) setFromVal((parseFloat(v) / rate).toFixed(2))
    else setFromVal('')
  }

  function handleFromCurrencyChange(c: string) {
    setFrom(c); setFromVal(''); setToVal('')
    setPref({ from: c, to })
  }

  function handleToCurrencyChange(c: string) {
    setTo(c); setFromVal(''); setToVal('')
    setPref({ from, to: c })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'flex-end', zIndex: 100
    }} onClick={onClose}>
      <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', padding: 'var(--space-lg)', width: '100%' }}
        onClick={e => e.stopPropagation()}>
        <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: 'var(--space-md)' }}>Currency</h2>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
          <CurrencyPicker value={from} onChange={handleFromCurrencyChange} label="From" />
          <CurrencyPicker value={to} onChange={handleToCurrencyChange} label="To" />
        </div>
        <CurrencyInput from={from} to={to} rate={rate} fromValue={fromVal} toValue={toVal}
          onFromChange={handleFromChange} onToChange={handleToChange} />
        {isOffline && rateDate && (
          <p style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 8 }}>rate from {rateDate}</p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Run tests**

```bash
npm run test -- tests/components/calculator/
```
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/calculator/ tests/components/calculator/
git commit -m "feat: add currency calculator with live rates, offline fallback, and currency picker"
```

---

## Task 10: Itinerary Section

**Files:**
- Create: `src/components/sections/itinerary/ItinerarySection.tsx`, `DayGroup.tsx`, `ItineraryCard.tsx`, `ItineraryCardEdit.tsx`, `LinkChip.tsx`
- Test: `tests/components/itinerary/`

- [ ] **Step 1: Write failing test for ItineraryCard**

```typescript
// tests/components/itinerary/ItineraryCard.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ItineraryCard } from '../../../src/components/sections/itinerary/ItineraryCard'

const item = {
  id: '1', name: 'Prague Castle', time: '9:00', duration: '2h',
  location: 'Hradčany', notes: 'St. Vitus Cathedral',
  links: [{ label: 'Maps', url: 'https://maps.google.com' }]
}

describe('ItineraryCard', () => {
  it('renders item name and time', () => {
    render(<ItineraryCard item={item} isPast={false} />)
    expect(screen.getByText('Prague Castle')).toBeInTheDocument()
    expect(screen.getByText('9:00')).toBeInTheDocument()
  })

  it('applies reduced opacity for past items', () => {
    const { container } = render(<ItineraryCard item={item} isPast={true} />)
    expect(container.firstChild).toHaveStyle({ opacity: '0.4' })
  })

  it('renders link chips', () => {
    render(<ItineraryCard item={item} isPast={false} />)
    expect(screen.getByText('Maps')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- ItineraryCard.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Implement ItineraryCard and LinkChip**

```typescript
// src/components/sections/itinerary/LinkChip.tsx
interface Props { label: string; url: string }
export function LinkChip({ label, url }: Props) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      style={{ fontSize: 11, background: 'var(--color-bg)', borderRadius: 20, padding: '3px 10px', color: 'var(--color-blue)', whiteSpace: 'nowrap' }}>
      {label}
    </a>
  )
}
```

```typescript
// src/components/sections/itinerary/ItineraryCard.tsx
import { ItineraryItem } from '../../../db/schema'
import { LinkChip } from './LinkChip'

interface Props { item: ItineraryItem; isPast: boolean }

export function ItineraryCard({ item, isPast }: Props) {
  return (
    <div style={{
      background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)',
      padding: 'var(--space-md)', marginBottom: 'var(--space-sm)',
      opacity: isPast ? 0.4 : 1
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 16 }}>{item.name}</span>
        <span style={{ fontSize: 12, color: 'var(--color-gold)' }}>{item.time}</span>
      </div>
      {item.duration && <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{item.duration} · {item.location}</div>}
      {item.notes && <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4 }}>{item.notes}</div>}
      {item.links.length > 0 && (
        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          {item.links.map(l => <LinkChip key={l.url} label={l.label} url={l.url} />)}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Implement DayGroup, ItineraryCardEdit, and ItinerarySection**

```typescript
// src/components/sections/itinerary/DayGroup.tsx
import { ItineraryDay, ItineraryItem } from '../../../db/schema'
import { ItineraryCard } from './ItineraryCard'
import { ItineraryCardEdit } from './ItineraryCardEdit'

interface Props {
  day: ItineraryDay
  isEditMode: boolean
  isPastDay: boolean
  currentTime: Date
  onUpdate: (item: ItineraryItem) => void
  onAdd: () => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
}

function isPastItem(date: string, time: string, now: Date): boolean {
  const [h, m] = time.split(':').map(Number)
  const itemDate = new Date(date)
  itemDate.setHours(h, m, 0, 0)
  return itemDate < now
}

export function DayGroup({ day, isEditMode, currentTime, onUpdate, onAdd, onMoveUp, onMoveDown }: Props) {
  return (
    <div style={{ marginBottom: 'var(--space-lg)' }}>
      <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 'var(--space-sm)' }}>
        {new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
      {day.items.map((item, idx) =>
        isEditMode
          ? <ItineraryCardEdit key={item.id} item={item} onUpdate={onUpdate}
              onMoveUp={idx > 0 ? () => onMoveUp(item.id) : undefined}
              onMoveDown={idx < day.items.length - 1 ? () => onMoveDown(item.id) : undefined} />
          : <ItineraryCard key={item.id} item={item} isPast={isPastItem(day.date, item.time, currentTime)} />
      )}
      {isEditMode && (
        <button onClick={onAdd} style={{ width: '100%', padding: 'var(--space-sm)', background: 'var(--color-bg-card-alt)', borderRadius: 'var(--radius-sm)', color: 'var(--color-gold)', fontSize: 13, marginTop: 'var(--space-xs)' }}>
          + Add item
        </button>
      )}
    </div>
  )
}
```

```typescript
// src/components/sections/itinerary/ItineraryCardEdit.tsx
import { useState } from 'react'
import { ItineraryItem } from '../../../db/schema'

interface Props {
  item: ItineraryItem
  onUpdate: (item: ItineraryItem) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}

export function ItineraryCardEdit({ item, onUpdate, onMoveUp, onMoveDown }: Props) {
  const [local, setLocal] = useState(item)
  const field = (key: keyof ItineraryItem) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...local, [key]: e.target.value }
    setLocal(updated)
    onUpdate(updated)
  }
  return (
    <div style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
        {onMoveUp && <button onClick={onMoveUp} aria-label="move up">↑</button>}
        {onMoveDown && <button onClick={onMoveDown} aria-label="move down">↓</button>}
      </div>
      {(['name', 'time', 'duration', 'location', 'notes'] as const).map(k => (
        <input key={k} value={String(local[k])} onChange={field(k)} placeholder={k}
          style={{ display: 'block', width: '100%', marginBottom: 6, background: 'var(--color-bg)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '6px 10px', color: 'var(--color-cream)', fontSize: 13 }} />
      ))}
    </div>
  )
}
```

```typescript
// src/components/sections/itinerary/ItinerarySection.tsx
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CityViewId } from '../../../db/schema'
import { getCityView } from '../../../config/cities'
import { useItinerary } from '../../../hooks/useItinerary'
import { AppShell } from '../../layout/AppShell'
import { CityMap } from '../../map/CityMap'
import { DayGroup } from './DayGroup'
import { CalculatorOverlay } from '../../calculator/CalculatorOverlay'

export function ItinerarySection() {
  const { cityViewId } = useParams<{ cityViewId: CityViewId }>()
  const config = getCityView(cityViewId!)
  const { record, updateItem, addItem, reorderItems } = useItinerary(cityViewId!)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showCalc, setShowCalc] = useState(false)
  const now = new Date()

  const showMap = record?.days.some(d => {
    const date = new Date(d.date + 'T12:00:00')
    const today = new Date(); today.setHours(0,0,0,0)
    return date.toDateString() === today.toDateString()
  }) ?? false

  function handleMoveUp(date: string, id: string) {
    const day = record?.days.find(d => d.date === date)
    if (!day) return
    const idx = day.items.findIndex(i => i.id === id)
    if (idx <= 0) return
    const items = [...day.items]
    ;[items[idx - 1], items[idx]] = [items[idx], items[idx - 1]]
    reorderItems(date, items)
  }

  function handleMoveDown(date: string, id: string) {
    const day = record?.days.find(d => d.date === date)
    if (!day) return
    const idx = day.items.findIndex(i => i.id === id)
    if (idx >= day.items.length - 1) return
    const items = [...day.items]
    ;[items[idx], items[idx + 1]] = [items[idx + 1], items[idx]]
    reorderItems(date, items)
  }

  return (
    <AppShell cityLabel={config.label} showBack={true} onCalculator={() => setShowCalc(true)}>
      {showMap && <CityMap embedUrl={config.mapEmbedUrl} cityLabel={config.label} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 8px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 18 }}>Itinerary</h2>
        <button onClick={() => setIsEditMode(e => !e)} style={{ color: 'var(--color-gold)', fontSize: 13 }}>
          {isEditMode ? 'Done' : '✏️ Edit'}
        </button>
      </div>
      {record?.days.map(day => (
        <DayGroup key={day.date} day={day} isEditMode={isEditMode} currentTime={now}
          isPastDay={new Date(day.date + 'T23:59:59') < now}
          onUpdate={(item) => updateItem(day.date, item)}
          onAdd={() => addItem(day.date, { id: crypto.randomUUID(), name: '', time: '', duration: '', location: '', notes: '', links: [] })}
          onMoveUp={(id) => handleMoveUp(day.date, id)}
          onMoveDown={(id) => handleMoveDown(day.date, id)} />
      ))}
      {showCalc && <CalculatorOverlay cityViewId={cityViewId!} onClose={() => setShowCalc(false)} />}
    </AppShell>
  )
}
```

All other section components (`ActivitiesSection`, `PhrasesSection`, `MemoriesSection`) follow the same pattern: wrap in `AppShell` with `showBack={true}` and `onCalculator={() => setShowCalc(true)}`, and render a `CalculatorOverlay` when triggered.

- [ ] **Step 5: Run tests**

```bash
npm run test -- tests/components/itinerary/
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/itinerary/ tests/components/itinerary/
git commit -m "feat: add itinerary section with edit mode"
```

---

## Task 11: What to Do Section

**Files:**
- Create: `src/components/sections/activities/ActivitiesSection.tsx`, `ActivityRow.tsx`, `ActivityDetail.tsx`
- Test: `tests/components/activities/`

- [ ] **Step 1: Write failing test for sort behavior**

```typescript
// tests/components/activities/ActivitiesSection.test.tsx
import { describe, it, expect } from 'vitest'
import { sortActivities } from '../../../src/components/sections/activities/ActivitiesSection'

const items = [
  { id: '1', priority: 3, cost: '€20', timeEstimate: '2h', name: 'B', location: '', notes: '', link: '' },
  { id: '2', priority: 5, cost: '€5', timeEstimate: '1h', name: 'A', location: '', notes: '', link: '' },
]

describe('sortActivities', () => {
  it('sorts by priority descending by default', () => {
    const sorted = sortActivities(items, 'priority')
    expect(sorted[0].priority).toBe(5)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- ActivitiesSection.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Implement sort logic and components**

```typescript
// src/components/sections/activities/ActivitiesSection.tsx (excerpt)
type SortKey = 'priority' | 'cost' | 'timeEstimate'

export function sortActivities(items: ActivityItem[], key: SortKey): ActivityItem[] {
  return [...items].sort((a, b) => {
    if (key === 'priority') return b.priority - a.priority
    return String(a[key]).localeCompare(String(b[key]))
  })
}
```

Each activity row shows collapsed info; tap to expand `ActivityDetail` inline.

- [ ] **Step 4: Run tests**

```bash
npm run test -- tests/components/activities/
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/activities/ tests/components/activities/
git commit -m "feat: add What to Do section with sorting"
```

---

## Task 12: What to Say Section

**Files:**
- Create: `src/components/sections/phrases/PhrasesSection.tsx`, `CategoryTabs.tsx`, `PhraseCard.tsx`, `InfoCard.tsx`
- Test: `tests/components/phrases/`

- [ ] **Step 1: Write failing test for search across categories**

```typescript
// tests/components/phrases/PhrasesSection.test.tsx
import { describe, it, expect } from 'vitest'
import { searchPhrases } from '../../../src/components/sections/phrases/PhrasesSection'

const categories = [
  { name: 'Basic', words: [{ english: 'Thank you', local: 'Děkuji', phonetic: 'dyeh-koo-yee' }], info: [{ title: 'Tipping', body: '10% is standard' }] },
  { name: 'Food', words: [{ english: 'Water', local: 'Voda', phonetic: 'vo-da' }], info: [] }
]

describe('searchPhrases', () => {
  it('returns matching words across all categories', () => {
    const results = searchPhrases(categories, 'thank')
    expect(results.words).toHaveLength(1)
    expect(results.words[0].english).toBe('Thank you')
  })

  it('returns matching info cards', () => {
    const results = searchPhrases(categories, 'tipping')
    expect(results.info).toHaveLength(1)
  })

  it('returns all when query is empty', () => {
    const results = searchPhrases(categories, '')
    expect(results.words).toHaveLength(2)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- PhrasesSection.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Implement search logic and components**

```typescript
// src/components/sections/phrases/PhrasesSection.tsx (excerpt)
export function searchPhrases(categories: PhraseCategory[], query: string) {
  const q = query.toLowerCase()
  if (!q) return {
    words: categories.flatMap(c => c.words),
    info: categories.flatMap(c => c.info)
  }
  return {
    words: categories.flatMap(c => c.words).filter(w =>
      w.english.toLowerCase().includes(q) || w.local.toLowerCase().includes(q) || w.phonetic?.toLowerCase().includes(q)
    ),
    info: categories.flatMap(c => c.info).filter(i =>
      i.title.toLowerCase().includes(q) || i.body.toLowerCase().includes(q)
    )
  }
}
```

Google Translate deep link format: `https://translate.google.com/?sl=${from}&tl=${to}&op=translate`

- [ ] **Step 4: Run tests**

```bash
npm run test -- tests/components/phrases/
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/phrases/ tests/components/phrases/
git commit -m "feat: add What to Say section with search and translate link"
```

---

## Task 13: Memories Section

**Files:**
- Create: `src/components/sections/memories/MemoriesSection.tsx`, `MemoryEntry.tsx`, `AddMemorySheet.tsx`
- Create: `src/utils/imageCompressor.ts`
- Test: `tests/components/memories/`, `tests/utils/imageCompressor.test.ts`

- [ ] **Step 1: Write failing test for image compressor**

```typescript
// tests/utils/imageCompressor.test.ts
import { describe, it, expect } from 'vitest'
import { compressImage } from '../../src/utils/imageCompressor'

describe('compressImage', () => {
  it('returns a base64 string', async () => {
    // Create a minimal valid image blob
    const canvas = document.createElement('canvas')
    canvas.width = 10; canvas.height = 10
    const blob = await new Promise<Blob>(r => canvas.toBlob(b => r(b!), 'image/jpeg'))
    const result = await compressImage(blob)
    expect(result).toMatch(/^data:image\/jpeg;base64,/)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- imageCompressor.test.ts
```
Expected: FAIL

- [ ] **Step 3: Implement imageCompressor**

```typescript
// src/utils/imageCompressor.ts
const TARGET_BYTES = 500 * 1024

export async function compressImage(file: Blob): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  const scale = Math.min(1, Math.sqrt(TARGET_BYTES / file.size))
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.8)
}
```

- [ ] **Step 4: Write test for AddMemorySheet**

```typescript
// tests/components/memories/AddMemorySheet.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AddMemorySheet } from '../../../src/components/sections/memories/AddMemorySheet'

describe('AddMemorySheet', () => {
  it('calls onSave with author and note', async () => {
    const onSave = vi.fn()
    render(<AddMemorySheet onSave={onSave} onClose={vi.fn()} />)
    await userEvent.type(screen.getByLabelText(/note/i), 'Great view')
    await userEvent.click(screen.getByText('Iris'))
    await userEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ author: 'Iris', note: 'Great view' }))
  })
})
```

- [ ] **Step 5: Run test to verify it fails**

```bash
npm run test -- AddMemorySheet.test.tsx
```
Expected: FAIL

- [ ] **Step 6: Implement Memories section components**

`AddMemorySheet` — bottom sheet with author toggle (Iris/Niko), photo picker (up to 5, compressed via `compressImage`), text note, location tag, save button.

`MemoryEntry` — shows author, timestamp, location, photos (horizontal scroll if multiple), note.

`MemoriesSection` — loads via `useMemories`, groups entries by date, shows `+ Add memory` FAB, renders `AddMemorySheet` when open. Storage warning check via `navigator.storage.estimate()` on mount — show banner if usage > 80%.

- [ ] **Step 7: Run tests**

```bash
npm run test -- tests/components/memories/ tests/utils/imageCompressor.test.ts
```
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/components/sections/memories/ src/utils/ tests/components/memories/ tests/utils/
git commit -m "feat: add Memories section with photo capture and compression"
```

---

## Task 14: PWA & Offline Polish

**Files:**
- Modify: `vite.config.ts` (verify Workbox config)
- Create: `public/manifest.json` (auto-generated by vite-plugin-pwa), placeholder icons

- [ ] **Step 1: Generate placeholder PWA icons**

```bash
# Generate minimal placeholder PNGs using canvas via Node
node -e "
const { createCanvas } = require('canvas');
const fs = require('fs');
for (const size of [192, 512]) {
  const c = createCanvas(size, size);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0f1923';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#a08060';
  ctx.font = \`bold \${size * 0.4}px serif\`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✈', size/2, size/2);
  fs.writeFileSync(\`public/icon-\${size}.png\`, c.toBuffer('image/png'));
}
" 2>/dev/null || echo "canvas not available — create placeholder PNGs manually or use an online favicon generator (e.g. favicon.io) and place icon-192.png and icon-512.png in public/"
```

If the node canvas module is not available, create two PNG files of any kind at `public/icon-192.png` and `public/icon-512.png` — they will be replaced with real artwork before installing on devices.

- [ ] **Step 2: Build and verify service worker is generated**

```bash
npm run build
ls dist/sw.js  # should exist
```
Expected: `dist/sw.js` present

- [ ] **Step 3: Serve build locally and verify offline behavior**

```bash
npm run preview
# Open in Safari, use Dev Tools > Network > Offline, reload
```
Expected: App loads from cache, maps show offline placeholder

- [ ] **Step 4: Verify PWA installability in Safari**

Open http://localhost:4173 in Safari on iPhone or Desktop Safari, check that "Add to Home Screen" is available.

- [ ] **Step 5: Commit**

```bash
git add public/ vite.config.ts
git commit -m "feat: configure PWA manifest and service worker"
```

---

## Task 15: End-to-End Smoke Test & Seed Prep

**Files:**
- Modify: `src/data/seed.json` — fill in real trip dates, activities, phrases
- Modify: `src/config/cities.ts` — fill in real Google Maps embed URLs and saved spots links

- [ ] **Step 1: Fill in seed.json with real trip content**

Add actual itinerary dates and items for each city view. Add activities for Prague, Vienna, Budapest. Add phrases for Prague (Czech), Vienna (German), Budapest (Hungarian), and Philly (slang).

- [ ] **Step 2: Fill in cities.ts with real Google Maps embed URLs**

Get embed URLs from Google Maps: share → embed a map → copy iframe src. Fill in `mapEmbedUrl` for each city view. Fill in `savedSpotsUrl` with your shared saved spots list URL.

- [ ] **Step 3: Smoke test full flow on device**

```
1. Open app on iPhone Safari
2. Select Prague → verify dashboard, map, all 4 sections accessible
3. Itinerary — add an item, verify it persists on reload
4. What to Do — verify sort works
5. What to Say — search a phrase, verify results across categories
6. Memories — add a memory with photo and note, verify feed
7. Currency — open calculator, change values both directions, verify conversion
8. Go offline (airplane mode), reload — verify all content still accessible
```

- [ ] **Step 4: Final commit**

```bash
git add src/data/seed.json src/config/cities.ts
git commit -m "feat: populate seed data and city config for trip"
```

---

## Testing Strategy

- **Unit tests:** All repositories, hooks, utility functions, and pure logic (sort, search, compress)
- **Component tests:** Key interactive components (ItineraryCard, CurrencyInput, AddMemorySheet, CitySelector)
- **No E2E tests in v1** — manual smoke test on device covers the golden path

Run all tests:
```bash
npm run test
```

---

## Notes for Implementer

- **Google Maps embed URLs** — you must fill these in before the trip. Get them from Google Maps → Share → Embed a map → copy the `src` attribute of the iframe.
- **Seed data** — the seed JSON is the source of truth for all pre-trip content. Fill it in on laptop before departure. No in-app editing for activities/phrases.
- **Icons** — replace placeholder `icon-192.png` and `icon-512.png` with real artwork before installing on devices.
- **IndexedDB in Safari** — Safari has a storage quota (~1GB typically). With base64 photos at ≤500KB each, 5 per entry, you'd need ~1000 entries to hit quota. Storage warning fires at 80%.
- **frankfurter.app** — completely free, no API key. Endpoint: `https://api.frankfurter.app/latest?from=CZK&to=USD`
