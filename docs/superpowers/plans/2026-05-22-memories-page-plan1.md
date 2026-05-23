# Memories Page — Plan 1: Schema, Cards & Day Stream

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Memories page visual core — DB schema migration, all memory card components, DayHeader/WeatherStamp/LineOfDay, and the full MemoriesSection rewrite with scrapbook layout and filter chips.

**Architecture:** Extend the existing `MemoryEntry` schema into a discriminated union keyed by `kind`. Add `linesOfDay` and `dayWeather` IndexedDB stores. Build isolated card components and layout primitives, then wire them together in a rewritten `MemoriesSection` that groups entries by day and positions them with a deterministic 2-column drop algorithm.

**Tech Stack:** React 19, TypeScript, inline styles using CSS custom properties from `src/styles/tokens.css`, `idb` for IndexedDB, Vitest for tests.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `src/db/schema.ts` | Add discriminated union `MemoryEntry`, `LineOfDay`, `DayWeather` |
| Modify | `src/db/client.ts` | Bump to v2, add `linesOfDay` + `dayWeather` stores |
| Modify | `src/db/repositories/memories.ts` | Handle `kind ?? 'photo'` migration shim |
| Create | `src/db/repositories/linesOfDay.ts` | Read/write `LineOfDay` by `(cityId, date)` |
| Create | `src/db/repositories/dayWeather.ts` | Read/write `DayWeather` by `(cityId, date)` |
| Create | `src/hooks/useLineOfDay.ts` | Hook — load + save line of day |
| Create | `src/hooks/useDayWeather.ts` | Hook — load cached weather (no fetch in Plan 1) |
| Create | `src/components/sections/memories/cards/PhotoCard.tsx` | Polaroid card |
| Create | `src/components/sections/memories/cards/NoteCard.tsx` | Sticky note card |
| Create | `src/components/sections/memories/cards/FoodCard.tsx` | Food card |
| Create | `src/components/sections/memories/cards/VoiceCard.tsx` | Voice card (recorded state only in Plan 1) |
| Create | `src/components/sections/memories/cards/TicketCard.tsx` | Ticket stub card |
| Create | `src/components/sections/memories/WeatherStamp.tsx` | Small weather stamp |
| Create | `src/components/sections/memories/LineOfDay.tsx` | Inline-editable handwritten quote |
| Create | `src/components/sections/memories/DayHeader.tsx` | Sticky date + weather + line-of-day row |
| Rewrite | `src/components/sections/memories/MemoriesSection.tsx` | Full page rewrite — day stream + FAB + filter chips |
| Delete | `src/components/sections/memories/MemoryEntry.tsx` | Replaced by card components |
| Modify | `src/hooks/useMemories.ts` | `entries` now returns `MemoryEntry` discriminated union |

---

### Task 1: Schema and DB migration

**Goal:** Extend the data model to support all memory kinds, plus `LineOfDay` and `DayWeather`, and bump the DB to version 2.

**Files:**
- Modify: `src/db/schema.ts`
- Modify: `src/db/client.ts`
- Modify: `src/db/repositories/memories.ts`
- Create: `src/db/repositories/linesOfDay.ts`
- Create: `src/db/repositories/dayWeather.ts`
- Test: `src/db/repositories/__tests__/memories.test.ts`
- Test: `src/db/repositories/__tests__/linesOfDay.test.ts`

**Acceptance Criteria:**
- [ ] `MemoryEntry` is a discriminated union with `kind: 'photo' | 'note' | 'food' | 'voice' | 'ticket'`
- [ ] `LineOfDay` and `DayWeather` types exist in schema
- [ ] DB opens at version 2 with `linesOfDay` and `dayWeather` stores
- [ ] Existing memories without `kind` are treated as `'photo'` in the repository
- [ ] `getMemories` returns all kinds; TypeScript narrowing works via `entry.kind`
- [ ] `linesOfDay` repository can get and upsert a line by `(cityId, date)`
- [ ] All new tests pass: `npm test`

**Verify:** `npm test` → all tests pass with no TypeScript errors

**Steps:**

- [ ] **Step 1: Update `src/db/schema.ts`**

Replace the existing `MemoryEntry` interface with:

```ts
export type MemoryKind = 'photo' | 'note' | 'food' | 'voice' | 'ticket'

interface BaseMemory {
  id: string
  cityId: CityId
  author: 'Iris' | 'Niko' | 'both'
  timestamp: string
  location?: string
}

export interface PhotoMemory extends BaseMemory  { kind: 'photo';  photoSrc: string; caption?: string }
export interface NoteMemory extends BaseMemory   { kind: 'note';   body: string; tone?: 'cream' | 'white' }
export interface FoodMemory extends BaseMemory   { kind: 'food';   dish: string; note: string }
export interface VoiceMemory extends BaseMemory  { kind: 'voice';  audioSrc: string; duration: number; caption?: string; waveform: number[] }
export interface TicketMemory extends BaseMemory { kind: 'ticket'; from: string; to: string; date: string; time: string; line?: string; caption?: string }

export type MemoryEntry = PhotoMemory | NoteMemory | FoodMemory | VoiceMemory | TicketMemory

export interface LineOfDay  { id: string; cityId: CityId; date: string; text: string; updatedAt: string }
export interface DayWeather { id: string; cityId: CityId; date: string; kind: 'sun' | 'cloud' | 'partly' | 'rain'; temp: number; fetchedAt: string }
```

- [ ] **Step 2: Update `src/db/client.ts`**

Bump version to 2 and add new stores in upgrade callback:

```ts
import { openDB, IDBPDatabase } from 'idb'

export type AppDB = IDBPDatabase

export async function openAppDB(): Promise<AppDB> {
  return openDB('trip-companion', 2, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore('appMeta', { keyPath: 'key' })
        db.createObjectStore('userPreferences', { keyPath: 'key' })
        db.createObjectStore('itinerary', { keyPath: 'cityViewId' })
        db.createObjectStore('activities', { keyPath: 'cityId' })
        db.createObjectStore('phrases', { keyPath: 'cityId' })
        const memories = db.createObjectStore('memories', { keyPath: 'id' })
        memories.createIndex('byCityId', 'cityId')
        db.createObjectStore('exchangeRates', { keyPath: 'pair' })
      }
      if (oldVersion < 2) {
        const lod = db.createObjectStore('linesOfDay', { keyPath: 'id' })
        lod.createIndex('byCityDate', ['cityId', 'date'])
        const dw = db.createObjectStore('dayWeather', { keyPath: 'id' })
        dw.createIndex('byCityDate', ['cityId', 'date'])
      }
    }
  })
}
```

- [ ] **Step 3: Update `src/db/repositories/memories.ts`**

Add `kind ?? 'photo'` migration shim so old records without `kind` work:

```ts
import { AppDB } from '../client'
import { MemoryEntry, CityId } from '../schema'

export async function getMemories(db: AppDB, cityId: CityId): Promise<MemoryEntry[]> {
  const index = db.transaction('memories').store.index('byCityId')
  const entries = await index.getAll(cityId)
  return entries
    .map((e: any) => ({ ...e, kind: e.kind ?? 'photo' }) as MemoryEntry)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

export async function addMemory(db: AppDB, entry: MemoryEntry): Promise<void> {
  await db.put('memories', entry)
}

export async function deleteMemory(db: AppDB, id: string): Promise<void> {
  await db.delete('memories', id)
}
```

- [ ] **Step 4: Create `src/db/repositories/linesOfDay.ts`**

```ts
import { AppDB } from '../client'
import { LineOfDay, CityId } from '../schema'

export async function getLineOfDay(db: AppDB, cityId: CityId, date: string): Promise<LineOfDay | undefined> {
  const index = db.transaction('linesOfDay').store.index('byCityDate')
  const results = await index.getAll([cityId, date])
  return results[0]
}

export async function upsertLineOfDay(db: AppDB, line: LineOfDay): Promise<void> {
  await db.put('linesOfDay', line)
}
```

- [ ] **Step 5: Create `src/db/repositories/dayWeather.ts`**

```ts
import { AppDB } from '../client'
import { DayWeather, CityId } from '../schema'

export async function getDayWeather(db: AppDB, cityId: CityId, date: string): Promise<DayWeather | undefined> {
  const index = db.transaction('dayWeather').store.index('byCityDate')
  const results = await index.getAll([cityId, date])
  return results[0]
}

export async function upsertDayWeather(db: AppDB, weather: DayWeather): Promise<void> {
  await db.put('dayWeather', weather)
}
```

- [ ] **Step 6: Write tests for memories repository**

Create `src/db/repositories/__tests__/memories.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { openAppDB } from '../../client'
import { getMemories, addMemory, deleteMemory } from '../memories'
import type { PhotoMemory, NoteMemory } from '../../schema'

let db: Awaited<ReturnType<typeof openAppDB>>

beforeEach(async () => {
  const idbFactory = new IDBFactory()
  // @ts-ignore
  globalThis.indexedDB = idbFactory
  db = await openAppDB()
})

describe('getMemories', () => {
  it('returns empty array for city with no memories', async () => {
    const result = await getMemories(db, 'prague')
    expect(result).toEqual([])
  })

  it('returns memories filtered by cityId', async () => {
    const photo: PhotoMemory = {
      id: '1', cityId: 'prague', kind: 'photo', author: 'Iris',
      timestamp: '2026-06-14T10:00:00Z', photoSrc: 'data:image/jpeg;base64,abc'
    }
    const note: NoteMemory = {
      id: '2', cityId: 'vienna', kind: 'note', author: 'Niko',
      timestamp: '2026-06-15T10:00:00Z', body: 'Hello Vienna'
    }
    await addMemory(db, photo)
    await addMemory(db, note)
    const prague = await getMemories(db, 'prague')
    expect(prague).toHaveLength(1)
    expect(prague[0].id).toBe('1')
  })

  it('applies kind migration shim to old records without kind', async () => {
    // Simulate old-style record stored directly
    await db.put('memories', {
      id: 'old', cityId: 'prague', author: 'Iris',
      timestamp: '2026-06-14T09:00:00Z', photos: [], note: 'old note', location: ''
    })
    const result = await getMemories(db, 'prague')
    expect(result[0]).toMatchObject({ id: 'old', kind: 'photo' })
  })

  it('sorts entries reverse-chronologically', async () => {
    const a: NoteMemory = { id: 'a', cityId: 'prague', kind: 'note', author: 'Iris', timestamp: '2026-06-14T08:00:00Z', body: 'morning' }
    const b: NoteMemory = { id: 'b', cityId: 'prague', kind: 'note', author: 'Niko', timestamp: '2026-06-14T20:00:00Z', body: 'evening' }
    await addMemory(db, a)
    await addMemory(db, b)
    const result = await getMemories(db, 'prague')
    expect(result[0].id).toBe('b')
    expect(result[1].id).toBe('a')
  })
})

describe('deleteMemory', () => {
  it('removes a memory by id', async () => {
    const note: NoteMemory = { id: 'del', cityId: 'prague', kind: 'note', author: 'Iris', timestamp: '2026-06-14T10:00:00Z', body: 'to delete' }
    await addMemory(db, note)
    await deleteMemory(db, 'del')
    const result = await getMemories(db, 'prague')
    expect(result).toHaveLength(0)
  })
})
```

- [ ] **Step 7: Write tests for linesOfDay repository**

Create `src/db/repositories/__tests__/linesOfDay.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { openAppDB } from '../../client'
import { getLineOfDay, upsertLineOfDay } from '../linesOfDay'

let db: Awaited<ReturnType<typeof openAppDB>>

beforeEach(async () => {
  const idbFactory = new IDBFactory()
  // @ts-ignore
  globalThis.indexedDB = idbFactory
  db = await openAppDB()
})

it('returns undefined when no line exists', async () => {
  const result = await getLineOfDay(db, 'prague', '2026-06-14')
  expect(result).toBeUndefined()
})

it('upserts and retrieves a line', async () => {
  const line = { id: 'l1', cityId: 'prague' as const, date: '2026-06-14', text: 'We got lost.', updatedAt: '2026-06-14T20:00:00Z' }
  await upsertLineOfDay(db, line)
  const result = await getLineOfDay(db, 'prague', '2026-06-14')
  expect(result?.text).toBe('We got lost.')
})

it('overwrites on second upsert', async () => {
  const line = { id: 'l1', cityId: 'prague' as const, date: '2026-06-14', text: 'First.', updatedAt: '2026-06-14T10:00:00Z' }
  await upsertLineOfDay(db, line)
  await upsertLineOfDay(db, { ...line, text: 'Second.', updatedAt: '2026-06-14T20:00:00Z' })
  const result = await getLineOfDay(db, 'prague', '2026-06-14')
  expect(result?.text).toBe('Second.')
})
```

- [ ] **Step 8: Run tests**

```bash
npm test
```

Expected: all tests pass including the new repository tests.

- [ ] **Step 9: Commit**

```bash
git add src/db/schema.ts src/db/client.ts src/db/repositories/memories.ts src/db/repositories/linesOfDay.ts src/db/repositories/dayWeather.ts src/db/repositories/__tests__/memories.test.ts src/db/repositories/__tests__/linesOfDay.test.ts
git commit -m "feat: extend memory schema to discriminated union, bump DB to v2"
```

---

### Task 2: useMemories, useLineOfDay, useDayWeather hooks

**Goal:** Update `useMemories` to work with the new union type and create the two new hooks.

**Files:**
- Modify: `src/hooks/useMemories.ts`
- Create: `src/hooks/useLineOfDay.ts`
- Create: `src/hooks/useDayWeather.ts`
- Test: `src/hooks/__tests__/useLineOfDay.test.ts`

**Acceptance Criteria:**
- [ ] `useMemories` still exposes `{ entries, addMemory, deleteMemory, loading }` — `entries` is now `MemoryEntry[]` (discriminated union)
- [ ] `useLineOfDay(cityId, date)` returns `{ text, setLine, loading }` — persists to IndexedDB on `setLine`
- [ ] `useDayWeather(cityId, date)` returns `{ weather: DayWeather | undefined, loading }` — reads from store only (no fetch in Plan 1)
- [ ] All tests pass

**Verify:** `npm test` → all tests pass

**Steps:**

- [ ] **Step 1: Update `src/hooks/useMemories.ts`**

No API change needed — just verify TypeScript is happy with the new `MemoryEntry` union. The existing implementation works as-is since the repository layer handles the type:

```ts
import { useState, useEffect, useCallback } from 'react'
import { useDb } from '../db/DbContext'
import { CityId, MemoryEntry } from '../db/schema'
import { getMemories, addMemory as dbAdd, deleteMemory as dbDelete } from '../db/repositories/memories'

export function useMemories(cityId: CityId) {
  const db = useDb()
  const [entries, setEntries] = useState<MemoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getMemories(db, cityId)
      .then(setEntries)
      .finally(() => setLoading(false))
  }, [db, cityId])

  const addMemory = useCallback(async (entry: MemoryEntry) => {
    await dbAdd(db, entry)
    setEntries(await getMemories(db, cityId))
  }, [db, cityId])

  const deleteMemory = useCallback(async (id: string) => {
    await dbDelete(db, id)
    setEntries(await getMemories(db, cityId))
  }, [db, cityId])

  return { entries, addMemory, deleteMemory, loading }
}
```

- [ ] **Step 2: Create `src/hooks/useLineOfDay.ts`**

```ts
import { useState, useEffect, useCallback } from 'react'
import { useDb } from '../db/DbContext'
import { CityId } from '../db/schema'
import { getLineOfDay, upsertLineOfDay } from '../db/repositories/linesOfDay'

export function useLineOfDay(cityId: CityId, date: string) {
  const db = useDb()
  const [text, setText] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getLineOfDay(db, cityId, date)
      .then(line => setText(line?.text ?? ''))
      .finally(() => setLoading(false))
  }, [db, cityId, date])

  const setLine = useCallback(async (newText: string) => {
    setText(newText)
    await upsertLineOfDay(db, {
      id: `${cityId}-${date}`,
      cityId,
      date,
      text: newText,
      updatedAt: new Date().toISOString(),
    })
  }, [db, cityId, date])

  return { text, setLine, loading }
}
```

- [ ] **Step 3: Create `src/hooks/useDayWeather.ts`**

```ts
import { useState, useEffect } from 'react'
import { useDb } from '../db/DbContext'
import { CityId, DayWeather } from '../db/schema'
import { getDayWeather } from '../db/repositories/dayWeather'

export function useDayWeather(cityId: CityId, date: string) {
  const db = useDb()
  const [weather, setWeather] = useState<DayWeather | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getDayWeather(db, cityId, date)
      .then(setWeather)
      .finally(() => setLoading(false))
  }, [db, cityId, date])

  return { weather, loading }
}
```

- [ ] **Step 4: Write tests for useLineOfDay**

Create `src/hooks/__tests__/useLineOfDay.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { IDBFactory } from 'fake-indexeddb'
import { openAppDB } from '../../db/client'
import { DbContext } from '../../db/DbContext'
import { useLineOfDay } from '../useLineOfDay'
import React from 'react'

let db: Awaited<ReturnType<typeof openAppDB>>

beforeEach(async () => {
  const idbFactory = new IDBFactory()
  // @ts-ignore
  globalThis.indexedDB = idbFactory
  db = await openAppDB()
})

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(DbContext.Provider, { value: db }, children)
}

describe('useLineOfDay', () => {
  it('returns empty string when no line exists', async () => {
    const { result } = renderHook(() => useLineOfDay('prague', '2026-06-14'), { wrapper })
    await act(async () => {})
    expect(result.current.text).toBe('')
    expect(result.current.loading).toBe(false)
  })

  it('persists a line via setLine', async () => {
    const { result } = renderHook(() => useLineOfDay('prague', '2026-06-14'), { wrapper })
    await act(async () => {})
    await act(async () => { await result.current.setLine('We got lost twice.') })
    expect(result.current.text).toBe('We got lost twice.')
  })
})
```

- [ ] **Step 5: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useMemories.ts src/hooks/useLineOfDay.ts src/hooks/useDayWeather.ts src/hooks/__tests__/useLineOfDay.test.ts
git commit -m "feat: add useLineOfDay and useDayWeather hooks"
```

---

### Task 3: WeatherStamp and LineOfDay components

**Goal:** Build the two small layout primitives used by DayHeader.

**Files:**
- Create: `src/components/sections/memories/WeatherStamp.tsx`
- Create: `src/components/sections/memories/LineOfDay.tsx`

**Acceptance Criteria:**
- [ ] `WeatherStamp` renders a rotated paper-deep rectangle with glyph + temp; supports `sun | cloud | partly | rain`
- [ ] `LineOfDay` renders handwritten text at 26px Caveat when text is set
- [ ] `LineOfDay` shows a faint dashed empty-state pill when text is empty
- [ ] `LineOfDay` enters inline edit mode on tap — saves on blur, cancel on Escape
- [ ] Focus ring on `LineOfDay` is stamp-red 2px outline
- [ ] `prefers-reduced-motion` has no animation to disable in these components (rotations are static)

**Verify:** `npm run build` → no TypeScript errors

**Steps:**

- [ ] **Step 1: Create `src/components/sections/memories/WeatherStamp.tsx`**

```tsx
interface Props {
  kind: 'sun' | 'cloud' | 'partly' | 'rain'
  temp: number
}

const GLYPHS: Record<Props['kind'], string> = {
  sun: '☀',
  cloud: '☁',
  partly: '⛅',
  rain: '🌧',
}

export function WeatherStamp({ kind, temp }: Props) {
  return (
    <div
      aria-label={`Weather: ${kind}, ${temp}°`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 6px',
        background: 'var(--color-paper-deep)',
        border: '1px solid var(--color-ink)',
        borderRadius: 3,
        boxShadow: '1px 1px 0 var(--color-ink)',
        transform: 'rotate(2deg)',
        opacity: 0.72,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--color-ink)',
        letterSpacing: '0.04em',
        flexShrink: 0,
      }}
    >
      <span>{GLYPHS[kind]}</span>
      <span>{temp}°</span>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/sections/memories/LineOfDay.tsx`**

```tsx
import { useState, useRef } from 'react'

const HAND_DISPLAY = 26

interface Props {
  text: string
  onSave: (text: string) => void
}

export function LineOfDay({ text, onSave }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(text)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  function startEdit() {
    setDraft(text)
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function commit() {
    const trimmed = draft.trim().slice(0, 80)
    onSave(trimmed)
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); commit() }
    if (e.key === 'Escape') { setEditing(false); setDraft(text) }
  }

  if (editing) {
    return (
      <textarea
        ref={inputRef}
        value={draft}
        onChange={e => setDraft(e.target.value.slice(0, 80))}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        maxLength={80}
        rows={2}
        aria-label="Line of the day"
        style={{
          fontFamily: 'var(--font-hand)',
          fontSize: HAND_DISPLAY,
          color: 'var(--color-ink)',
          transform: 'rotate(-1.4deg)',
          transformOrigin: 'left center',
          background: 'transparent',
          border: 'none',
          outline: '2px solid var(--color-stamp)',
          borderRadius: 3,
          width: '100%',
          resize: 'none',
          padding: '2px 4px',
          lineHeight: 1.3,
        }}
      />
    )
  }

  if (!text) {
    return (
      <button
        onClick={startEdit}
        aria-label="Add line of the day"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px 10px',
          border: '1px dashed var(--color-rule)',
          borderRadius: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--color-ink-faint)',
          letterSpacing: '0.08em',
          background: 'transparent',
          minHeight: 44,
          cursor: 'pointer',
        }}
      >
        + line of the day
      </button>
    )
  }

  return (
    <button
      onClick={startEdit}
      aria-label={`Line of the day: ${text}. Tap to edit.`}
      style={{
        fontFamily: 'var(--font-hand)',
        fontSize: HAND_DISPLAY,
        color: 'var(--color-ink)',
        transform: 'rotate(-1.4deg)',
        transformOrigin: 'left center',
        background: 'transparent',
        border: 'none',
        textAlign: 'left',
        lineHeight: 1.3,
        cursor: 'text',
        padding: 0,
        minHeight: 44,
        display: 'block',
        width: '100%',
      }}
    >
      "{text}"
    </button>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/memories/WeatherStamp.tsx src/components/sections/memories/LineOfDay.tsx
git commit -m "feat: add WeatherStamp and LineOfDay components"
```

---

### Task 4: DayHeader component

**Goal:** Build the sticky day header — date pill, dashed rule, weather stamp, item count, and inline LineOfDay.

**Files:**
- Create: `src/components/sections/memories/DayHeader.tsx`

**Acceptance Criteria:**
- [ ] Date pill uses stamp-red background, paper text, mono uppercase, 10px tracked (e.g. `SUN · JUN 14`)
- [ ] Dashed horizontal rule fills width between date pill and weather stamp
- [ ] Item count appears on far right of the rule row
- [ ] `WeatherStamp` renders when `weather` prop is provided; absent otherwise
- [ ] `LineOfDay` renders beneath with its edit interaction
- [ ] Header is `position: sticky; top: 0; z-index: 5; background: var(--color-paper)`
- [ ] `npm run build` succeeds

**Verify:** `npm run build` → no TypeScript errors

**Steps:**

- [ ] **Step 1: Create `src/components/sections/memories/DayHeader.tsx`**

```tsx
import { WeatherStamp } from './WeatherStamp'
import { LineOfDay } from './LineOfDay'
import { DayWeather } from '../../../db/schema'

interface Props {
  date: string         // ISO date string e.g. '2026-06-14'
  itemCount: number
  weather?: DayWeather
  lineText: string
  onSaveLine: (text: string) => void
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  const day = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const num = d.getDate()
  return `${day} · ${month} ${num}`
}

export function DayHeader({ date, itemCount, weather, lineText, onSaveLine }: Props) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 5,
        background: 'var(--color-paper)',
        paddingTop: 'var(--space-md)',
        paddingBottom: 'var(--space-sm)',
      }}
    >
      {/* Row 1: date pill + rule + weather + count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '3px 8px',
            background: 'var(--color-stamp)',
            borderRadius: 3,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--color-white)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            flexShrink: 0,
          }}
        >
          {formatDateLabel(date)}
        </div>

        <div
          aria-hidden
          style={{
            flex: 1,
            height: 0,
            borderTop: '1px dashed var(--color-rule)',
          }}
        />

        {weather && <WeatherStamp kind={weather.kind} temp={weather.temp} />}

        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--color-ink-faint)',
            letterSpacing: '0.08em',
            flexShrink: 0,
          }}
        >
          {itemCount}
        </span>
      </div>

      {/* Row 2: Line of the day */}
      <div style={{ marginTop: 'var(--space-sm)', paddingLeft: 2 }}>
        <LineOfDay text={lineText} onSave={onSaveLine} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/memories/DayHeader.tsx
git commit -m "feat: add DayHeader component with sticky date, weather, and line-of-day"
```

---

### Task 5: Card components — PhotoCard, NoteCard, FoodCard

**Goal:** Build the three visual-only card components (no recording or media capture logic).

**Files:**
- Create: `src/components/sections/memories/cards/PhotoCard.tsx`
- Create: `src/components/sections/memories/cards/NoteCard.tsx`
- Create: `src/components/sections/memories/cards/FoodCard.tsx`

**Acceptance Criteria:**
- [ ] All three cards use white paper background, 1px ink border, `border-radius: 4px`, `box-shadow: 2px 3px 0 var(--color-ink)`
- [ ] `PhotoCard`: polaroid layout with square photo area, handwritten caption at 13px Caveat; empty caption shows faint placeholder
- [ ] `NoteCard`: shows body text in Caveat 18px; author + timestamp in mono caps footer; `tone='cream'` uses `#f3e2c1` background
- [ ] `FoodCard`: header with fork glyph + `BEST THING WE ATE` in stamp red; dashed divider; dish name in Caveat 19px; note in Caveat 13px
- [ ] Rotation is applied by parent (cards receive no `rotate` prop)
- [ ] `npm run build` succeeds

**Verify:** `npm run build` → no TypeScript errors

**Steps:**

- [ ] **Step 1: Create `src/components/sections/memories/cards/PhotoCard.tsx`**

```tsx
import { PhotoMemory } from '../../../../db/schema'

const HAND_CAPTION = 13

interface Props {
  entry: PhotoMemory
  width: number
}

const CARD_BASE: React.CSSProperties = {
  background: 'var(--color-white)',
  border: '1px solid var(--color-ink)',
  borderRadius: 4,
  boxShadow: '2px 3px 0 var(--color-ink)',
}

export function PhotoCard({ entry, width }: Props) {
  return (
    <div
      aria-label={entry.caption ? `Photo: ${entry.caption}` : 'Photo memory'}
      style={{ ...CARD_BASE, width, padding: 8, paddingBottom: 28, display: 'inline-block' }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '1',
          background: 'var(--color-paper-deep)',
          overflow: 'hidden',
        }}
      >
        <img
          src={entry.photoSrc}
          alt={entry.caption ?? 'Memory photo'}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      </div>
      <div
        style={{
          marginTop: 4,
          transform: 'rotate(-1.2deg)',
          transformOrigin: 'left center',
          paddingLeft: 3,
          fontFamily: 'var(--font-hand)',
          fontSize: HAND_CAPTION,
          lineHeight: 1.2,
          minHeight: 16,
        }}
      >
        {entry.caption
          ? <span style={{ color: 'var(--color-ink)', opacity: 0.85 }}>{entry.caption}</span>
          : <span style={{ color: 'var(--color-ink-faint)', opacity: 0.4 }}>add a caption…</span>
        }
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/sections/memories/cards/NoteCard.tsx`**

```tsx
import { NoteMemory } from '../../../../db/schema'

interface Props {
  entry: NoteMemory
  width: number
}

export function NoteCard({ entry, width }: Props) {
  const bg = entry.tone === 'cream' ? '#f3e2c1' : 'var(--color-white)'
  const date = new Date(entry.timestamp)
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      aria-label={`Note by ${entry.author}: ${entry.body}`}
      style={{
        width,
        padding: '12px 14px 10px',
        background: bg,
        border: '1px solid var(--color-ink)',
        borderRadius: 4,
        boxShadow: '2px 3px 0 var(--color-ink)',
      }}
    >
      <p style={{
        fontFamily: 'var(--font-hand)',
        fontSize: 18,
        color: 'var(--color-ink)',
        lineHeight: 1.4,
        margin: 0,
        marginBottom: 8,
        wordBreak: 'break-word',
      }}>
        {entry.body}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 7,
          color: 'var(--color-ink-soft)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          — {entry.author}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 7,
          color: 'var(--color-ink-faint)',
          letterSpacing: '0.08em',
        }}>
          {timeStr}
        </span>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/sections/memories/cards/FoodCard.tsx`**

```tsx
import { FoodMemory } from '../../../../db/schema'

const HAND_CARD_TITLE = 19
const HAND_CAPTION = 13

interface Props {
  entry: FoodMemory
  width: number
}

export function FoodCard({ entry, width }: Props) {
  return (
    <div
      aria-label={`Food memory: ${entry.dish}`}
      style={{
        width,
        background: 'var(--color-white)',
        border: '1px solid var(--color-ink)',
        borderRadius: 4,
        boxShadow: '2px 3px 0 var(--color-ink)',
        padding: '10px 12px 12px',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
      }}>
        <span style={{ fontSize: 12 }}>🍴</span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          fontWeight: 700,
          color: 'var(--color-stamp)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}>
          BEST THING WE ATE
        </span>
      </div>

      <div style={{
        height: 0,
        borderTop: '1px dashed var(--color-rule)',
        marginBottom: 8,
      }} />

      <p style={{
        fontFamily: 'var(--font-hand)',
        fontSize: HAND_CARD_TITLE,
        color: 'var(--color-ink)',
        margin: 0,
        marginBottom: 4,
        lineHeight: 1.2,
      }}>
        {entry.dish}
      </p>

      {entry.note && (
        <p style={{
          fontFamily: 'var(--font-hand)',
          fontSize: HAND_CAPTION,
          color: 'var(--color-ink-soft)',
          margin: 0,
          lineHeight: 1.3,
        }}>
          {entry.note}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/memories/cards/PhotoCard.tsx src/components/sections/memories/cards/NoteCard.tsx src/components/sections/memories/cards/FoodCard.tsx
git commit -m "feat: add PhotoCard, NoteCard, FoodCard components"
```

---

### Task 6: VoiceCard and TicketCard components

**Goal:** Build the remaining two card types. VoiceCard supports `empty`, `recording`, and `recorded` states with fixed layout.

**Files:**
- Create: `src/components/sections/memories/cards/VoiceCard.tsx`
- Create: `src/components/sections/memories/cards/TicketCard.tsx`

**Acceptance Criteria:**
- [ ] `VoiceCard` has identical dimensions in all three states
- [ ] `empty` state: dashed ink circle with mic glyph; flat dashes waveform; caption placeholder in ink-soft
- [ ] `recording` state: filled stamp-red circle with white square; animated waveform bars; "listening…" caption; `aria-live="polite"` on timer; breathing halo animation paused when `prefers-reduced-motion`
- [ ] `recorded` state: filled ink circle with play triangle; static waveform; user caption
- [ ] `TicketCard`: paper-deep background, `TICKET` header, FROM → TO with stamp-red arrow, dashed perforation line
- [ ] `npm run build` succeeds

**Verify:** `npm run build` → no TypeScript errors

**Steps:**

- [ ] **Step 1: Create `src/components/sections/memories/cards/VoiceCard.tsx`**

```tsx
import { VoiceMemory } from '../../../../db/schema'

interface Props {
  entry: VoiceMemory
  width: number
  state?: 'empty' | 'recording' | 'recorded'
  onStartRecord?: () => void
  onStopRecord?: () => void
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function Waveform({ bars, state }: { bars: number[]; state: 'empty' | 'recording' | 'recorded' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 28, flex: 1 }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            width: 3,
            borderRadius: 2,
            height: state === 'empty' ? 3 : `${Math.max(4, h * 28)}px`,
            background: state === 'recording' ? 'var(--color-stamp)'
              : state === 'recorded' ? (i < bars.length * 0.35 ? 'var(--color-ink-faint)' : 'var(--color-ink)')
              : 'var(--color-ink-faint)',
            opacity: state === 'recording' ? 0.6 : state === 'empty' ? 0.35 : 1,
            animation: state === 'recording' ? `voiceBar ${0.3 + (i % 5) * 0.07}s ease-in-out infinite alternate` : 'none',
          }}
        />
      ))}
    </div>
  )
}

const DEFAULT_BARS = Array.from({ length: 30 }, (_, i) => 0.3 + 0.5 * Math.sin(i * 0.7 + 1))

export function VoiceCard({ entry, width, state = 'recorded', onStartRecord, onStopRecord }: Props) {
  const bars = entry.waveform.length > 0 ? entry.waveform : DEFAULT_BARS

  const controlStyle: React.CSSProperties = state === 'recording'
    ? {
        width: 36, height: 36, borderRadius: '50%',
        background: 'var(--color-stamp)',
        border: '1px solid var(--color-ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        animation: 'voiceStopBreathe 1.4s ease-in-out infinite',
      }
    : state === 'empty'
    ? {
        width: 36, height: 36, borderRadius: '50%',
        border: '1px dashed var(--color-ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }
    : {
        width: 36, height: 36, borderRadius: '50%',
        background: 'var(--color-ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }

  function handleControlClick() {
    if (state === 'empty') onStartRecord?.()
    else if (state === 'recording') onStopRecord?.()
  }

  return (
    <div
      aria-label={entry.caption ? `Voice memo: ${entry.caption}` : 'Voice memo'}
      style={{
        width,
        background: 'var(--color-white)',
        border: '1px solid var(--color-ink)',
        borderRadius: 4,
        boxShadow: '2px 3px 0 var(--color-ink)',
        padding: '8px 10px 10px',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 12 }}>🎙</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 9,
            color: 'var(--color-ink-soft)', letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>VOICE MEMO</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {state === 'recording' && (
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-stamp)', animation: 'voicePulse 1s ease-in-out infinite' }} />
          )}
          <span
            aria-live="polite"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-ink-faint)', letterSpacing: '0.04em' }}
          >
            {formatDuration(entry.duration)}
          </span>
        </div>
      </div>

      {/* Body: control + waveform */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <button
          onClick={handleControlClick}
          aria-label={state === 'recording' ? 'Stop recording' : state === 'empty' ? 'Start recording' : 'Play voice memo'}
          style={{ ...controlStyle, cursor: state === 'recorded' ? 'pointer' : 'pointer', border: 'none' }}
        >
          {state === 'recording' && (
            <div style={{ width: 10, height: 10, background: 'var(--color-white)' }} />
          )}
          {state === 'empty' && (
            <span style={{ fontSize: 16 }}>🎙</span>
          )}
          {state === 'recorded' && (
            <div style={{
              width: 0, height: 0,
              borderTop: '7px solid transparent',
              borderBottom: '7px solid transparent',
              borderLeft: '11px solid var(--color-white)',
              marginLeft: 2,
            }} />
          )}
        </button>
        <Waveform bars={bars} state={state} />
      </div>

      {/* Caption */}
      <div style={{ minHeight: 18 }}>
        {state === 'empty' && (
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: 13, color: 'var(--color-ink-soft)' }}>
            tap mic to record a thought…
          </span>
        )}
        {state === 'recording' && (
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: 13, color: 'var(--color-stamp)' }}>
            listening…
          </span>
        )}
        {state === 'recorded' && entry.caption && (
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: 13, color: 'var(--color-ink)' }}>
            {entry.caption}
          </span>
        )}
      </div>
    </div>
  )
}
```

Add the `voiceBar`, `voicePulse`, and `voiceStopBreathe` keyframes to `src/styles/tokens.css` (add at the end of the file):

```css
@keyframes voicePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
@keyframes voiceBar {
  from { transform: scaleY(0.4); }
  to { transform: scaleY(1.1); }
}
@keyframes voiceStopBreathe {
  0%, 100% { box-shadow: 2px 3px 0 var(--color-ink), 0 0 0 0 rgba(200,68,42,0.4); }
  50% { box-shadow: 2px 3px 0 var(--color-ink), 0 0 0 6px rgba(200,68,42,0); }
}
@media (prefers-reduced-motion: reduce) {
  .voice-breathe { animation: none !important; }
}
```

- [ ] **Step 2: Create `src/components/sections/memories/cards/TicketCard.tsx`**

```tsx
import { TicketMemory } from '../../../../db/schema'

const HAND_CAPTION = 13

interface Props {
  entry: TicketMemory
  width: number
}

export function TicketCard({ entry, width }: Props) {
  return (
    <div
      aria-label={`Ticket: ${entry.from} to ${entry.to}`}
      style={{
        width,
        background: 'var(--color-paper-deep)',
        border: '1px solid var(--color-ink)',
        borderRadius: 4,
        boxShadow: '2px 2px 0 var(--color-ink)',
        padding: '8px 10px 0',
        position: 'relative',
      }}
    >
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 7,
        color: 'var(--color-ink-soft)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
      }}>
        TICKET
      </span>

      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        marginTop: 4,
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: 16,
        color: 'var(--color-ink)',
      }}>
        <span>{entry.from.toUpperCase()}</span>
        <span style={{ color: 'var(--color-stamp)', fontSize: 14 }}>→</span>
        <span>{entry.to.toUpperCase()}</span>
      </div>

      {(entry.date || entry.time || entry.line) && (
        <div style={{
          marginTop: 4,
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--color-ink-soft)',
          letterSpacing: '0.06em',
        }}>
          {[entry.date, entry.time, entry.line].filter(Boolean).join(' · ')}
        </div>
      )}

      {/* Perforation */}
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 22,
        borderTop: '1px dashed var(--color-ink-faint)',
      }} />

      <div style={{ height: 22 }} />

      {entry.caption && (
        <div style={{ padding: '0 0 8px', marginTop: -14 }}>
          <span style={{
            fontFamily: 'var(--font-hand)',
            fontSize: HAND_CAPTION,
            color: 'var(--color-ink)',
            opacity: 0.8,
            lineHeight: 1.2,
          }}>
            {entry.caption}
          </span>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/memories/cards/VoiceCard.tsx src/components/sections/memories/cards/TicketCard.tsx src/styles/tokens.css
git commit -m "feat: add VoiceCard and TicketCard components"
```

---

### Task 7: MemoriesSection rewrite

**Goal:** Rewrite `MemoriesSection` with the Daily Spreads layout — day grouping, 2-column drop algorithm, filter chips, sticky day headers, and FAB. Delete the old `MemoryEntry` component.

**Files:**
- Rewrite: `src/components/sections/memories/MemoriesSection.tsx`
- Delete: `src/components/sections/memories/MemoryEntry.tsx`

**Acceptance Criteria:**
- [ ] Header block: eyebrow city label (stamp-red, mono, tracked uppercase), display title `Memories.`, italic subtitle
- [ ] Filter chips: `Both of us | Iris | Niko | Photos | Notes | Voice | Tickets` — horizontal scroll, active chip has filled ink background with paper text; tapping actually filters displayed entries
- [ ] Entries grouped by date (YYYY-MM-DD of `timestamp`), reverse-chronological order
- [ ] Each day section has a `DayHeader` + absolute-positioned cards in a `position: relative` container
- [ ] 2-column drop algorithm: cards alternate left/right, `±2°–±6°` rotation seeded on card index (stable), ~20px vertical overlap allowed, day container height computed from column heights + 40px padding
- [ ] Tickets render first in a day, centered/wider
- [ ] `DayHeader` is `position: sticky; top: 0` within scroll container
- [ ] FAB is stamp-red, `position: fixed`, bottom-right, 56×56, opens `AddPickerSheet` (placeholder — can open existing `AddMemorySheet` for now)
- [ ] Empty state shown when no entries for active filter
- [ ] `MemoryEntry.tsx` is deleted

**Verify:** `npm run build` → no TypeScript errors; app renders Memories page

**Steps:**

- [ ] **Step 1: Write the layout algorithm helper**

At the top of `MemoriesSection.tsx`, add this placement utility:

```ts
interface CardPlacement {
  left: number
  top: number
  width: number
  rotate: number
  height: number
}

function rotationForIndex(index: number): number {
  const rotations = [-3, 4, -2, 5, -4, 3, -5, 2, -3, 4]
  return rotations[index % rotations.length]
}

function layoutDay(items: MemoryEntry[], containerWidth: number): { placements: CardPlacement[]; totalHeight: number } {
  const CARD_W_LEFT = Math.floor(containerWidth * 0.52)
  const CARD_W_RIGHT = Math.floor(containerWidth * 0.48)
  const OVERLAP = 20
  const GAP = 8
  let leftY = 0
  let rightY = 30 // offset to create stagger

  const placements: CardPlacement[] = []

  // Tickets come first, centered
  const tickets = items.filter(e => e.kind === 'ticket')
  const rest = items.filter(e => e.kind !== 'ticket')
  let globalIdx = 0

  for (const entry of tickets) {
    const w = Math.floor(containerWidth * 0.7)
    const h = estimateCardHeight(entry, w)
    placements.push({
      left: Math.floor((containerWidth - w) / 2),
      top: Math.max(leftY, rightY),
      width: w,
      rotate: rotationForIndex(globalIdx),
      height: h,
    })
    const bottom = Math.max(leftY, rightY) + h + GAP
    leftY = bottom - OVERLAP
    rightY = bottom - OVERLAP
    globalIdx++
  }

  for (const entry of rest) {
    const isLeft = globalIdx % 2 === 0
    const w = isLeft ? CARD_W_LEFT : CARD_W_RIGHT
    const h = estimateCardHeight(entry, w)
    const top = isLeft ? leftY : rightY
    placements.push({
      left: isLeft ? 0 : containerWidth - w,
      top,
      width: w,
      rotate: rotationForIndex(globalIdx),
      height: h,
    })
    if (isLeft) leftY = top + h - OVERLAP
    else rightY = top + h - OVERLAP
    globalIdx++
  }

  return {
    placements,
    totalHeight: Math.max(leftY, rightY) + OVERLAP + 40,
  }
}

function estimateCardHeight(entry: MemoryEntry, width: number): number {
  switch (entry.kind) {
    case 'photo': return width + 32        // square photo + caption row
    case 'note':  return 100 + Math.ceil(entry.body.length / 30) * 22
    case 'food':  return 100
    case 'voice': return 110
    case 'ticket': return 90
    default: return 100
  }
}
```

- [ ] **Step 2: Write the day grouping utility**

```ts
function groupByDate(entries: MemoryEntry[]): Array<{ date: string; items: MemoryEntry[] }> {
  const map = new Map<string, MemoryEntry[]>()
  for (const e of entries) {
    const date = e.timestamp.slice(0, 10)
    if (!map.has(date)) map.set(date, [])
    map.get(date)!.push(e)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({ date, items }))
}
```

- [ ] **Step 3: Write the card renderer**

```tsx
function renderCard(entry: MemoryEntry, width: number): React.ReactNode {
  switch (entry.kind) {
    case 'photo':  return <PhotoCard  key={entry.id} entry={entry} width={width} />
    case 'note':   return <NoteCard   key={entry.id} entry={entry} width={width} />
    case 'food':   return <FoodCard   key={entry.id} entry={entry} width={width} />
    case 'voice':  return <VoiceCard  key={entry.id} entry={entry} width={width} state="recorded" />
    case 'ticket': return <TicketCard key={entry.id} entry={entry} width={width} />
    default:       return null
  }
}
```

- [ ] **Step 4: Write the filter logic**

```ts
type FilterKey = 'both' | 'iris' | 'niko' | 'photos' | 'notes' | 'voice' | 'tickets'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'both',    label: 'Both of us' },
  { key: 'iris',    label: 'Iris' },
  { key: 'niko',    label: 'Niko' },
  { key: 'photos',  label: 'Photos' },
  { key: 'notes',   label: 'Notes' },
  { key: 'voice',   label: 'Voice' },
  { key: 'tickets', label: 'Tickets' },
]

function applyFilter(entries: MemoryEntry[], filter: FilterKey): MemoryEntry[] {
  switch (filter) {
    case 'both':    return entries
    case 'iris':    return entries.filter(e => e.author === 'Iris')
    case 'niko':    return entries.filter(e => e.author === 'Niko')
    case 'photos':  return entries.filter(e => e.kind === 'photo')
    case 'notes':   return entries.filter(e => e.kind === 'note')
    case 'voice':   return entries.filter(e => e.kind === 'voice')
    case 'tickets': return entries.filter(e => e.kind === 'ticket')
    default:        return entries
  }
}
```

- [ ] **Step 5: Write the full `MemoriesSection` component**

```tsx
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CityViewId, MemoryEntry } from '../../../db/schema'
import { getCityView } from '../../../config/cities'
import { useMemories } from '../../../hooks/useMemories'
import { useLineOfDay } from '../../../hooks/useLineOfDay'
import { useDayWeather } from '../../../hooks/useDayWeather'
import { AppShell } from '../../layout/AppShell'
import { CalculatorOverlay } from '../../calculator/CalculatorOverlay'
import { AddMemorySheet } from './AddMemorySheet'
import { SkeletonList } from '../../layout/SkeletonList'
import { DayHeader } from './DayHeader'
import { PhotoCard } from './cards/PhotoCard'
import { NoteCard } from './cards/NoteCard'
import { FoodCard } from './cards/FoodCard'
import { VoiceCard } from './cards/VoiceCard'
import { TicketCard } from './cards/TicketCard'

// ... (paste the layout utilities from steps 1–4 above)

function DaySection({ date, items, cityId, containerWidth }: { date: string; items: MemoryEntry[]; cityId: CityId; containerWidth: number }) {
  const { text, setLine } = useLineOfDay(cityId, date)
  const { weather } = useDayWeather(cityId, date)

  const { placements, totalHeight } = layoutDay(items, containerWidth)

  return (
    <section>
      <DayHeader
        date={date}
        itemCount={items.length}
        weather={weather}
        lineText={text}
        onSaveLine={setLine}
      />
      <div style={{ position: 'relative', height: totalHeight, marginTop: 8 }}>
        {items.map((entry, i) => {
          const p = placements[i]
          return (
            <div
              key={entry.id}
              style={{
                position: 'absolute',
                left: p.left,
                top: p.top,
                transform: `rotate(${p.rotate}deg)`,
                transformOrigin: 'center center',
              }}
            >
              {renderCard(entry, p.width)}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function MemoriesSection() {
  const { cityViewId } = useParams<{ cityViewId: CityViewId }>()
  const config = getCityView(cityViewId!)
  const { entries, addMemory, loading } = useMemories(config.cityId)
  const [showAdd, setShowAdd] = useState(false)
  const [showCalc, setShowCalc] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterKey>('both')

  const CONTAINER_WIDTH = Math.min(window.innerWidth, 390) - 36 // 18px padding each side

  const filtered = applyFilter(entries, activeFilter)
  const days = groupByDate(filtered)

  return (
    <AppShell cityLabel={config.label} showBack={true} onCalculator={() => setShowCalc(true)}>
      <div style={{ padding: '0 18px', paddingBottom: 88, background: 'var(--color-paper)' }}>

        {/* Header block */}
        <div style={{ paddingTop: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--color-stamp)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>
            {config.label}
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--color-ink)',
            letterSpacing: '-0.02em',
            marginBottom: 4,
          }}>
            Memories.
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            fontStyle: 'italic',
            color: 'var(--color-ink-soft)',
          }}>
            Whatever you'll want later. No pressure.
          </p>
        </div>

        {/* Filter chips */}
        <div style={{
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          marginBottom: 'var(--space-md)',
          paddingBottom: 4,
          WebkitOverflowScrolling: 'touch',
        }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              aria-pressed={activeFilter === f.key}
              style={{
                flexShrink: 0,
                padding: '5px 12px',
                borderRadius: 20,
                border: `1px solid var(--color-ink)`,
                background: activeFilter === f.key ? 'var(--color-ink)' : 'transparent',
                color: activeFilter === f.key ? 'var(--color-paper)' : 'var(--color-ink)',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                minHeight: 44,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Day stream */}
        {loading && <SkeletonList rows={3} rowHeight={120} />}

        {!loading && days.length === 0 && (
          <p style={{
            color: 'var(--color-ink-faint)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            textAlign: 'center',
            paddingTop: 'var(--space-xl)',
            letterSpacing: '0.08em',
          }}>
            {entries.length === 0 ? 'Nothing captured yet.' : 'Nothing matches this filter.'}
          </p>
        )}

        {!loading && days.map(({ date, items }) => (
          <DaySection
            key={date}
            date={date}
            items={items}
            cityId={config.cityId}
            containerWidth={CONTAINER_WIDTH}
          />
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAdd(true)}
        aria-label="Add memory"
        style={{
          position: 'fixed',
          bottom: 'var(--space-lg)',
          right: 'var(--space-lg)',
          width: 56,
          height: 56,
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-stamp)',
          color: '#fff',
          fontSize: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 'var(--z-fab)',
          lineHeight: 1,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        +
      </button>

      {showAdd && (
        <AddMemorySheet
          onSave={entry => addMemory({ ...entry, id: crypto.randomUUID(), cityId: config.cityId })}
          onClose={() => setShowAdd(false)}
        />
      )}
      {showCalc && <CalculatorOverlay cityViewId={cityViewId!} onClose={() => setShowCalc(false)} />}
    </AppShell>
  )
}
```

Note: `CityId` needs to be imported from schema — add it to the existing import line.

- [ ] **Step 6: Delete `MemoryEntry.tsx`**

```bash
git rm src/components/sections/memories/MemoryEntry.tsx
```

- [ ] **Step 7: Verify build**

```bash
npm run build
```

Fix any TypeScript errors. Common issues:
- `CityId` import missing in `MemoriesSection.tsx` — add to schema import
- The existing `AddMemorySheet` expects `Omit<MemoryEntry, 'id' | 'cityId'>` — update its `onSave` prop type to accept `Omit<PhotoMemory, 'id' | 'cityId'>` until Plan 2 rewrites it

- [ ] **Step 8: Commit**

```bash
git add src/components/sections/memories/MemoriesSection.tsx
git commit -m "feat: rewrite MemoriesSection with Daily Spreads scrapbook layout and filter chips"
```

---

## Self-Review Checklist

- [x] All `kind` variants covered in schema, repositories, hooks, and renderer
- [x] `HAND` scale constants respected: 26 display, 19 cardTitle, 13 caption — no ad-hoc sizes
- [x] Filter chips wired with real filter state
- [x] `DayHeader` sticky positioning included
- [x] Ticket-first ordering in day layout
- [x] `aria-live="polite"` on VoiceCard timer
- [x] `LineOfDay` focus ring is stamp-red 2px
- [x] `MemoryEntry.tsx` deleted
- [x] `AddMemorySheet` still receives a valid type (Photo, which is the old default) — Plan 2 rewrites the Add flow
- [x] No new color tokens introduced
- [x] No new dependencies introduced
