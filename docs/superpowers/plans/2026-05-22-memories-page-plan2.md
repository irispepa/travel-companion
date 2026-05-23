# Memories Page — Plan 2: Add Flow, Voice Recording & Weather

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the full Add Memory flow (picker sheet + four compose sheets), Web Audio voice recording with waveform capture, and weather fetching/caching.

**Prerequisite:** Plan 1 must be complete — schema, cards, DayHeader, and MemoriesSection rewrite are all in place.

**Architecture:** Replace the existing `AddMemorySheet` with a multi-step sheet (picker → compose). Each compose sheet is its own component. Voice recording uses `MediaRecorder` + Web Audio API. Weather uses `wttr.in` JSON API, cached in IndexedDB `dayWeather` store after first fetch per `(cityId, date)`.

**Tech Stack:** React 19, TypeScript, `MediaRecorder` API, Web Audio API, `wttr.in` free weather API, inline styles, `idb`.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Rewrite | `src/components/sections/memories/AddMemorySheet.tsx` | Becomes a router — renders picker or active compose sheet |
| Create | `src/components/sections/memories/add/AddPickerSheet.tsx` | Step 1 picker with mini card previews |
| Create | `src/components/sections/memories/add/AddNoteSheet.tsx` | Note compose |
| Create | `src/components/sections/memories/add/AddFoodSheet.tsx` | Food card compose |
| Create | `src/components/sections/memories/add/AddQuoteSheet.tsx` | Line of the day compose |
| Create | `src/components/sections/memories/add/AddTicketSheet.tsx` | Ticket compose |
| Create | `src/components/sections/memories/add/AddPhotoSheet.tsx` | Photo caption compose |
| Modify | `src/components/sections/memories/cards/VoiceCard.tsx` | Wire up MediaRecorder recording flow |
| Create | `src/hooks/useVoiceRecorder.ts` | MediaRecorder + waveform capture hook |
| Modify | `src/hooks/useDayWeather.ts` | Add wttr.in fetch on cache miss |
| Modify | `src/components/sections/memories/MemoriesSection.tsx` | Pass new `AddMemorySheet` props; wire voice card state |

---

### Task 1: Sheet layout shell and AddPickerSheet

**Goal:** Build the bottom-sheet chrome and the picker step with mini card previews for all six memory types.

**Files:**
- Rewrite: `src/components/sections/memories/AddMemorySheet.tsx`
- Create: `src/components/sections/memories/add/AddPickerSheet.tsx`

**Acceptance Criteria:**
- [ ] Sheet rises from bottom with scrim, grab handle, consistent height across all steps
- [ ] Picker shows six tiles: Photo, Note, Best thing ate, Voice memo, Ticket, Line of the day
- [ ] Each tile is a miniature preview of its card type (not a generic icon)
- [ ] Tiles have slight rotation (±2°–±3°), visually varied
- [ ] Tapping a tile calls `onSelect(kind)`
- [ ] Back link at bottom closes the sheet
- [ ] Sheet is accessible: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`

**Verify:** `npm run build` → no TypeScript errors

**Steps:**

- [ ] **Step 1: Rewrite `src/components/sections/memories/AddMemorySheet.tsx`**

This becomes a thin router — it holds the open/close animation and routes to the active step:

```tsx
import React, { useState } from 'react'
import { MemoryEntry, CityId } from '../../../db/schema'
import { AddPickerSheet } from './add/AddPickerSheet'
import { AddNoteSheet } from './add/AddNoteSheet'
import { AddFoodSheet } from './add/AddFoodSheet'
import { AddQuoteSheet } from './add/AddQuoteSheet'
import { AddTicketSheet } from './add/AddTicketSheet'
import { AddPhotoSheet } from './add/AddPhotoSheet'

type Step = 'picker' | 'note' | 'food' | 'quote' | 'ticket' | 'photo' | 'voice'

interface Props {
  cityId: CityId
  date: string            // current date YYYY-MM-DD for quote step
  onSave: (entry: Omit<MemoryEntry, 'id' | 'cityId'>) => void
  onClose: () => void
}

export function AddMemorySheet({ cityId, date, onSave, onClose }: Props) {
  const [step, setStep] = useState<Step>('picker')

  const sheetStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'var(--color-paper)',
    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
    paddingBottom: 'calc(var(--space-lg) + env(safe-area-inset-bottom, 0px))',
    maxHeight: '92vh',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    animation: 'sheetSlideUp var(--duration-sheet) var(--ease-out-expo) both',
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 'var(--z-sheet)',
        animation: 'backdropFadeIn var(--duration-base) var(--ease-out-expo) both',
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-memory-title"
        style={sheetStyle}
        onClick={e => e.stopPropagation()}
      >
        {/* Grab handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--color-rule)' }} />
        </div>

        {step === 'picker' && <AddPickerSheet onSelect={setStep} onClose={onClose} />}
        {step === 'note'   && <AddNoteSheet   onSave={onSave} onBack={() => setStep('picker')} />}
        {step === 'food'   && <AddFoodSheet   onSave={onSave} onBack={() => setStep('picker')} />}
        {step === 'quote'  && <AddQuoteSheet  date={date} cityId={cityId} onClose={onClose} onBack={() => setStep('picker')} />}
        {step === 'ticket' && <AddTicketSheet onSave={onSave} onBack={() => setStep('picker')} />}
        {step === 'photo'  && <AddPhotoSheet  onSave={onSave} onBack={() => setStep('picker')} />}
        {step === 'voice'  && (
          <div style={{ padding: 'var(--space-lg)' }}>
            {/* Voice recording is handled inline in the voice tile — this route is unused for now */}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update `MemoriesSection.tsx` to pass new required props**

Find the `<AddMemorySheet` usage and update props:

```tsx
{showAdd && (
  <AddMemorySheet
    cityId={config.cityId}
    date={new Date().toISOString().slice(0, 10)}
    onSave={entry => addMemory({ ...entry, id: crypto.randomUUID(), cityId: config.cityId })}
    onClose={() => setShowAdd(false)}
  />
)}
```

- [ ] **Step 3: Create `src/components/sections/memories/add/AddPickerSheet.tsx`**

```tsx
type Step = 'picker' | 'note' | 'food' | 'quote' | 'ticket' | 'photo' | 'voice'

interface Props {
  onSelect: (step: Step) => void
  onClose: () => void
}

const TILES: { step: Step; label: string; rotation: number; preview: React.ReactNode }[] = [
  { step: 'photo',  label: 'Photo',          rotation: -2, preview: <PhotoTile /> },
  { step: 'note',   label: 'Note',           rotation:  3, preview: <NoteTile /> },
  { step: 'food',   label: 'Best thing ate', rotation: -3, preview: <FoodTile /> },
  { step: 'voice',  label: 'Voice memo',     rotation:  2, preview: <VoiceTile /> },
  { step: 'ticket', label: 'Ticket',         rotation: -2, preview: <TicketTile /> },
  { step: 'quote',  label: 'Line of the day',rotation:  3, preview: <QuoteTile /> },
]

// Mini previews — simplified non-interactive renditions of each card
function PhotoTile() {
  return (
    <div style={{ width: 56, height: 56, background: 'var(--color-paper-deep)', border: '1px solid var(--color-ink)', padding: 4 }}>
      <div style={{ width: '100%', height: '100%', background: 'var(--color-rule)', display: 'grid', placeItems: 'center' }}>
        <span style={{ fontSize: 18 }}>📷</span>
      </div>
    </div>
  )
}
function NoteTile() {
  return (
    <div style={{ width: 60, padding: '6px 8px', background: 'var(--color-white)', border: '1px solid var(--color-ink)', borderRadius: 4 }}>
      {[80, 60, 40].map((w, i) => (
        <div key={i} style={{ height: 4, borderRadius: 2, background: 'var(--color-ink-faint)', opacity: 0.5, width: `${w}%`, marginBottom: 4 }} />
      ))}
    </div>
  )
}
function FoodTile() {
  return (
    <div style={{ width: 60, padding: '6px 8px', background: 'var(--color-white)', border: '1px solid var(--color-ink)', borderRadius: 4 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: 'var(--color-stamp)', letterSpacing: '0.12em' }}>🍴 BEST ATE</div>
    </div>
  )
}
function VoiceTile() {
  return (
    <div style={{ width: 60, padding: '6px 8px', background: 'var(--color-white)', border: '1px solid var(--color-ink)', borderRadius: 4 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: 'var(--color-ink-soft)', letterSpacing: '0.10em' }}>🎙 VOICE</div>
    </div>
  )
}
function TicketTile() {
  return (
    <div style={{ width: 60, padding: '6px 8px', background: 'var(--color-paper-deep)', border: '1px solid var(--color-ink)', borderRadius: 4 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700 }}>
        PRG<span style={{ color: 'var(--color-stamp)' }}>→</span>VIE
      </div>
    </div>
  )
}
function QuoteTile() {
  return (
    <div style={{ width: 72, padding: '4px 6px' }}>
      <span style={{ fontFamily: 'var(--font-hand)', fontSize: 14, color: 'var(--color-ink)' }}>"We got lost."</span>
    </div>
  )
}

export function AddPickerSheet({ onSelect, onClose }: Props) {
  return (
    <div style={{ padding: '0 var(--space-lg) var(--space-lg)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-stamp)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 4 }}>
        STEP 1 · ADD MEMORY
      </p>
      <h2 id="add-memory-title" style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 4 }}>
        What did you capture?
      </h2>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontStyle: 'italic', color: 'var(--color-ink-soft)', marginBottom: 'var(--space-lg)' }}>
        Pick a kind, or just drag a photo onto the day.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {TILES.map(t => (
          <button
            key={t.step}
            onClick={() => onSelect(t.step)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: 'var(--space-sm)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transform: `rotate(${t.rotation}deg)`,
              minWidth: 80,
              minHeight: 44,
            }}
          >
            {t.preview}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-ink-soft)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
              {t.label}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={onClose}
        style={{ marginTop: 'var(--space-lg)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-ink-faint)', letterSpacing: '0.08em', background: 'transparent', border: 'none', cursor: 'pointer', minHeight: 44, display: 'block' }}
      >
        ← back
      </button>
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
git add src/components/sections/memories/AddMemorySheet.tsx src/components/sections/memories/add/AddPickerSheet.tsx src/components/sections/memories/MemoriesSection.tsx
git commit -m "feat: add sheet shell and AddPickerSheet with card tile previews"
```

---

### Task 2: AddNoteSheet, AddFoodSheet, AddTicketSheet

**Goal:** Implement the three text-input compose sheets. All save buttons render as the PASTE IT IN stamp.

**Files:**
- Create: `src/components/sections/memories/add/AddNoteSheet.tsx`
- Create: `src/components/sections/memories/add/AddFoodSheet.tsx`
- Create: `src/components/sections/memories/add/AddTicketSheet.tsx`

**Acceptance Criteria:**
- [ ] All sheets share the same PASTE IT IN stamp button style (stamp-red, rotated -2°, paper text, hard shadow, mono caps)
- [ ] `AddNoteSheet`: textarea for body, author chips (Iris / Niko / Both), saves `NoteMemory`
- [ ] `AddFoodSheet`: live FoodCard preview updating as user types, dish field + note field, saves `FoodMemory`
- [ ] `AddTicketSheet`: FROM, TO, DATE, TIME, LINE fields; saves `TicketMemory`
- [ ] All sheets have a `← back` link calling `onBack`
- [ ] `npm run build` succeeds

**Verify:** `npm run build` → no TypeScript errors

**Steps:**

- [ ] **Step 1: Define the shared stamp button style**

In each sheet file, use this style for the save button:

```ts
const STAMP_BUTTON: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: 'var(--space-md)',
  background: 'var(--color-stamp)',
  color: 'var(--color-white)',
  fontFamily: 'var(--font-mono)',
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  border: '1px solid var(--color-ink)',
  borderRadius: 4,
  boxShadow: '2px 2px 0 var(--color-ink)',
  transform: 'rotate(-2deg)',
  cursor: 'pointer',
  marginTop: 'var(--space-md)',
  minHeight: 48,
}
```

- [ ] **Step 2: Create `src/components/sections/memories/add/AddNoteSheet.tsx`**

```tsx
import { useState } from 'react'
import { NoteMemory } from '../../../../db/schema'

type SaveArg = Omit<NoteMemory, 'id' | 'cityId'>

interface Props {
  onSave: (entry: SaveArg) => void
  onBack: () => void
}

const AUTHORS: Array<NoteMemory['author']> = ['Iris', 'Niko', 'both']

export function AddNoteSheet({ onSave, onBack }: Props) {
  const [body, setBody] = useState('')
  const [author, setAuthor] = useState<NoteMemory['author']>('Iris')
  const [tone, setTone] = useState<NoteMemory['tone']>('white')

  function handleSave() {
    if (!body.trim()) return
    onSave({ kind: 'note', author, body: body.trim(), tone, timestamp: new Date().toISOString() })
  }

  return (
    <div style={{ padding: '0 var(--space-lg) var(--space-lg)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-stamp)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 4 }}>
        NOTE
      </p>

      {/* Author chips */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--space-md)' }}>
        {AUTHORS.map(a => (
          <button
            key={a}
            onClick={() => setAuthor(a)}
            aria-pressed={author === a}
            style={{
              padding: '0 14px',
              height: 36,
              borderRadius: 20,
              border: '1px solid var(--color-ink)',
              background: author === a ? 'var(--color-ink)' : 'transparent',
              color: author === a ? 'var(--color-paper)' : 'var(--color-ink)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              minHeight: 44,
            }}
          >
            {a === 'both' ? 'Both' : a}
          </button>
        ))}
        <button
          onClick={() => setTone(t => t === 'cream' ? 'white' : 'cream')}
          style={{
            padding: '0 10px',
            height: 36,
            borderRadius: 20,
            border: '1px solid var(--color-rule)',
            background: tone === 'cream' ? '#f3e2c1' : 'var(--color-white)',
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--color-ink-soft)',
            cursor: 'pointer',
            minHeight: 44,
          }}
        >
          {tone === 'cream' ? '🟡 cream' : '⬜ white'}
        </button>
      </div>

      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="what happened?"
        rows={5}
        aria-label="Note body"
        style={{
          width: '100%',
          fontFamily: 'var(--font-hand)',
          fontSize: 20,
          color: 'var(--color-ink)',
          background: tone === 'cream' ? '#f3e2c1' : 'var(--color-white)',
          border: '1px solid var(--color-ink)',
          borderRadius: 4,
          padding: '10px 12px',
          resize: 'none',
          lineHeight: 1.4,
          boxSizing: 'border-box',
        }}
      />

      <button onClick={handleSave} disabled={!body.trim()} style={{ ...STAMP_BUTTON, opacity: body.trim() ? 1 : 0.5 }}>
        PASTE IT IN
      </button>

      <button onClick={onBack} style={{ marginTop: 'var(--space-md)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-ink-faint)', letterSpacing: '0.08em', background: 'transparent', border: 'none', cursor: 'pointer', minHeight: 44, display: 'block' }}>
        ← back
      </button>
    </div>
  )
}

const STAMP_BUTTON: React.CSSProperties = {
  display: 'block', width: '100%', padding: 'var(--space-md)',
  background: 'var(--color-stamp)', color: 'var(--color-white)',
  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
  letterSpacing: '0.18em', textTransform: 'uppercase',
  border: '1px solid var(--color-ink)', borderRadius: 4,
  boxShadow: '2px 2px 0 var(--color-ink)', transform: 'rotate(-2deg)',
  cursor: 'pointer', marginTop: 'var(--space-md)', minHeight: 48,
}
```

- [ ] **Step 3: Create `src/components/sections/memories/add/AddFoodSheet.tsx`**

```tsx
import { useState } from 'react'
import { FoodMemory } from '../../../../db/schema'
import { FoodCard } from '../cards/FoodCard'

type SaveArg = Omit<FoodMemory, 'id' | 'cityId'>

interface Props {
  onSave: (entry: SaveArg) => void
  onBack: () => void
}

export function AddFoodSheet({ onSave, onBack }: Props) {
  const [dish, setDish] = useState('')
  const [note, setNote] = useState('')
  const [author, setAuthor] = useState<FoodMemory['author']>('both')

  const previewEntry: FoodMemory = {
    id: 'preview', cityId: 'prague', kind: 'food',
    author, dish: dish || 'dish name…', note: note || '',
    timestamp: new Date().toISOString(),
  }

  function handleSave() {
    if (!dish.trim()) return
    onSave({ kind: 'food', author, dish: dish.trim(), note: note.trim(), timestamp: new Date().toISOString() })
  }

  const FIELD: React.CSSProperties = {
    width: '100%', fontFamily: 'var(--font-hand)', fontSize: 18, color: 'var(--color-ink)',
    background: 'transparent', border: 'none',
    borderBottom: '1px dashed var(--color-stamp)',
    padding: '4px 0', marginBottom: 12, boxSizing: 'border-box',
  }

  return (
    <div style={{ padding: '0 var(--space-lg) var(--space-lg)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-stamp)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 16 }}>
        BEST THING WE ATE
      </p>

      {/* Live preview */}
      <div style={{ marginBottom: 'var(--space-md)', transform: 'rotate(-1deg)', display: 'inline-block' }}>
        <FoodCard entry={previewEntry} width={220} />
      </div>

      <input value={dish} onChange={e => setDish(e.target.value)} placeholder="dish name" aria-label="Dish name" style={FIELD} />
      <input value={note} onChange={e => setNote(e.target.value)} placeholder="one-line note" aria-label="Note" style={FIELD} />

      <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--space-sm)' }}>
        {(['Iris', 'Niko', 'both'] as FoodMemory['author'][]).map(a => (
          <button key={a} onClick={() => setAuthor(a)} aria-pressed={author === a} style={{
            padding: '0 12px', height: 36, borderRadius: 20, border: '1px solid var(--color-ink)',
            background: author === a ? 'var(--color-ink)' : 'transparent',
            color: author === a ? 'var(--color-paper)' : 'var(--color-ink)',
            fontFamily: 'var(--font-mono)', fontSize: 10, cursor: 'pointer', minHeight: 44,
          }}>
            {a === 'both' ? 'Both' : a}
          </button>
        ))}
      </div>

      <button onClick={handleSave} disabled={!dish.trim()} style={{ ...STAMP_BUTTON, opacity: dish.trim() ? 1 : 0.5 }}>
        PASTE IT IN
      </button>
      <button onClick={onBack} style={{ marginTop: 'var(--space-md)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-ink-faint)', letterSpacing: '0.08em', background: 'transparent', border: 'none', cursor: 'pointer', minHeight: 44, display: 'block' }}>
        ← back
      </button>
    </div>
  )
}

const STAMP_BUTTON: React.CSSProperties = {
  display: 'block', width: '100%', padding: 'var(--space-md)',
  background: 'var(--color-stamp)', color: 'var(--color-white)',
  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
  letterSpacing: '0.18em', textTransform: 'uppercase',
  border: '1px solid var(--color-ink)', borderRadius: 4,
  boxShadow: '2px 2px 0 var(--color-ink)', transform: 'rotate(-2deg)',
  cursor: 'pointer', marginTop: 'var(--space-md)', minHeight: 48,
}
```

- [ ] **Step 4: Create `src/components/sections/memories/add/AddTicketSheet.tsx`**

```tsx
import { useState } from 'react'
import { TicketMemory } from '../../../../db/schema'

type SaveArg = Omit<TicketMemory, 'id' | 'cityId'>

interface Props {
  onSave: (entry: SaveArg) => void
  onBack: () => void
}

export function AddTicketSheet({ onSave, onBack }: Props) {
  const [from, setFrom]   = useState('')
  const [to, setTo]       = useState('')
  const [date, setDate]   = useState('')
  const [time, setTime]   = useState('')
  const [line, setLine]   = useState('')
  const [caption, setCaption] = useState('')

  function handleSave() {
    if (!from.trim() || !to.trim()) return
    onSave({ kind: 'ticket', author: 'both', from: from.trim().toUpperCase(), to: to.trim().toUpperCase(), date: date.trim(), time: time.trim(), line: line.trim() || undefined, caption: caption.trim() || undefined, timestamp: new Date().toISOString() })
  }

  const FIELD: React.CSSProperties = {
    width: '100%', fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--color-ink)',
    background: 'var(--color-paper-deep)', border: '1px solid var(--color-rule)',
    borderRadius: 3, padding: '8px 10px', marginBottom: 10, boxSizing: 'border-box',
    letterSpacing: '0.08em',
  }
  const LABEL: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-ink-soft)',
    letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4, display: 'block',
  }

  return (
    <div style={{ padding: '0 var(--space-lg) var(--space-lg)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-stamp)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 16 }}>
        TICKET STUB
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 4 }}>
        <div>
          <label style={LABEL}>From
            <input value={from} onChange={e => setFrom(e.target.value)} placeholder="PRG" aria-label="From" style={{ ...FIELD, marginBottom: 0 }} />
          </label>
        </div>
        <div>
          <label style={LABEL}>To
            <input value={to} onChange={e => setTo(e.target.value)} placeholder="VIE" aria-label="To" style={{ ...FIELD, marginBottom: 0 }} />
          </label>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 4 }}>
        <label style={LABEL}>Date
          <input type="date" value={date} onChange={e => setDate(e.target.value)} aria-label="Date" style={{ ...FIELD, marginBottom: 0 }} />
        </label>
        <label style={LABEL}>Time
          <input type="time" value={time} onChange={e => setTime(e.target.value)} aria-label="Time" style={{ ...FIELD, marginBottom: 0 }} />
        </label>
      </div>

      <label style={LABEL}>Line / operator (optional)
        <input value={line} onChange={e => setLine(e.target.value)} placeholder="RegioJet" aria-label="Line" style={FIELD} />
      </label>
      <label style={LABEL}>Caption (optional)
        <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="worth every crown" aria-label="Caption" style={FIELD} />
      </label>

      <button onClick={handleSave} disabled={!from.trim() || !to.trim()} style={{ ...STAMP_BUTTON, opacity: (from.trim() && to.trim()) ? 1 : 0.5 }}>
        PASTE IT IN
      </button>
      <button onClick={onBack} style={{ marginTop: 'var(--space-md)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-ink-faint)', letterSpacing: '0.08em', background: 'transparent', border: 'none', cursor: 'pointer', minHeight: 44, display: 'block' }}>
        ← back
      </button>
    </div>
  )
}

const STAMP_BUTTON: React.CSSProperties = {
  display: 'block', width: '100%', padding: 'var(--space-md)',
  background: 'var(--color-stamp)', color: 'var(--color-white)',
  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
  letterSpacing: '0.18em', textTransform: 'uppercase',
  border: '1px solid var(--color-ink)', borderRadius: 4,
  boxShadow: '2px 2px 0 var(--color-ink)', transform: 'rotate(-2deg)',
  cursor: 'pointer', marginTop: 'var(--space-md)', minHeight: 48,
}
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/memories/add/AddNoteSheet.tsx src/components/sections/memories/add/AddFoodSheet.tsx src/components/sections/memories/add/AddTicketSheet.tsx
git commit -m "feat: add AddNoteSheet, AddFoodSheet, AddTicketSheet compose steps"
```

---

### Task 3: AddPhotoSheet and AddQuoteSheet

**Goal:** Photo caption compose (post-picker, after native photo picker hands off a Blob URL) and Line of the Day compose.

**Files:**
- Create: `src/components/sections/memories/add/AddPhotoSheet.tsx`
- Create: `src/components/sections/memories/add/AddQuoteSheet.tsx`
- Modify: `src/components/sections/memories/add/AddPickerSheet.tsx` — photo tile opens native file picker, passes src to parent which routes to AddPhotoSheet

**Acceptance Criteria:**
- [ ] Tapping the Photo tile triggers a hidden `<input type="file" accept="image/*">`, compresses the image via existing `compressImage` utility, then transitions to `AddPhotoSheet` with the compressed src
- [ ] `AddPhotoSheet` shows the photo preview + caption textarea; saves `PhotoMemory`
- [ ] `AddQuoteSheet`: shows date-stamp context above, full-size Caveat input at 26px with tilt, char count (max 80), PASTE IT IN stamp
- [ ] Quote sheet saves by calling `useLineOfDay`'s `setLine` (not `onSave`) since it's a LineOfDay, not a MemoryEntry — calls `onClose` after saving
- [ ] `npm run build` succeeds

**Verify:** `npm run build` → no TypeScript errors

**Steps:**

- [ ] **Step 1: Update `AddMemorySheet.tsx` to handle photo src routing**

Add `photoSrc` state and pass it to `AddPhotoSheet`:

```tsx
// In AddMemorySheet
const [photoSrc, setPhotoSrc] = useState<string>('')

// Add to the step === 'photo' branch:
{step === 'photo' && <AddPhotoSheet src={photoSrc} onSave={onSave} onBack={() => setStep('picker')} />}
```

Export a setter as a prop from the picker so it can trigger the file input → compress → set src flow. The cleanest way: pass `onPhotoSelected` from `AddMemorySheet` to `AddPickerSheet`:

```tsx
// AddMemorySheet passes:
<AddPickerSheet
  onSelect={setStep}
  onClose={onClose}
  onPhotoSelected={(src) => { setPhotoSrc(src); setStep('photo') }}
/>
```

- [ ] **Step 2: Update `AddPickerSheet.tsx` to handle photo file input**

```tsx
import { useRef } from 'react'
import { compressImage } from '../../../../utils/imageCompressor'

interface Props {
  onSelect: (step: Step) => void
  onClose: () => void
  onPhotoSelected: (src: string) => void
}

export function AddPickerSheet({ onSelect, onClose, onPhotoSelected }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  async function handlePhotoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const src = await compressImage(file)
    onPhotoSelected(src)
  }

  // In the tile click handler for 'photo':
  // onClick={() => fileRef.current?.click()} instead of onSelect('photo')

  return (
    <>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoFile} />
      {/* rest of existing picker JSX, but photo tile onClick calls fileRef.current?.click() */}
    </>
  )
}
```

- [ ] **Step 3: Create `src/components/sections/memories/add/AddPhotoSheet.tsx`**

```tsx
import { useState } from 'react'
import { PhotoMemory } from '../../../../db/schema'

type SaveArg = Omit<PhotoMemory, 'id' | 'cityId'>

interface Props {
  src: string
  onSave: (entry: SaveArg) => void
  onBack: () => void
}

export function AddPhotoSheet({ src, onSave, onBack }: Props) {
  const [caption, setCaption] = useState('')
  const [author, setAuthor] = useState<PhotoMemory['author']>('both')

  function handleSave() {
    onSave({ kind: 'photo', author, photoSrc: src, caption: caption.trim() || undefined, timestamp: new Date().toISOString() })
  }

  return (
    <div style={{ padding: '0 var(--space-lg) var(--space-lg)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-stamp)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 12 }}>
        PHOTO
      </p>

      {src && (
        <div style={{ marginBottom: 'var(--space-md)', border: '1px solid var(--color-ink)', padding: 8, background: 'var(--color-white)', display: 'inline-block', transform: 'rotate(-1deg)' }}>
          <img src={src} alt="Selected photo" style={{ display: 'block', maxWidth: '100%', maxHeight: 200, objectFit: 'cover' }} />
        </div>
      )}

      <textarea
        value={caption}
        onChange={e => setCaption(e.target.value)}
        placeholder="add a caption…"
        rows={2}
        aria-label="Photo caption"
        style={{
          width: '100%', fontFamily: 'var(--font-hand)', fontSize: 18,
          color: 'var(--color-ink)', background: 'transparent',
          border: 'none', borderBottom: '1px dashed var(--color-rule)',
          padding: '4px 0', resize: 'none', boxSizing: 'border-box',
          marginBottom: 12,
        }}
      />

      <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--space-sm)' }}>
        {(['Iris', 'Niko', 'both'] as PhotoMemory['author'][]).map(a => (
          <button key={a} onClick={() => setAuthor(a)} aria-pressed={author === a} style={{
            padding: '0 12px', height: 36, borderRadius: 20,
            border: '1px solid var(--color-ink)',
            background: author === a ? 'var(--color-ink)' : 'transparent',
            color: author === a ? 'var(--color-paper)' : 'var(--color-ink)',
            fontFamily: 'var(--font-mono)', fontSize: 10, cursor: 'pointer', minHeight: 44,
          }}>
            {a === 'both' ? 'Both' : a}
          </button>
        ))}
      </div>

      <button onClick={handleSave} style={STAMP_BUTTON}>PASTE IT IN</button>
      <button onClick={onBack} style={{ marginTop: 'var(--space-md)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-ink-faint)', letterSpacing: '0.08em', background: 'transparent', border: 'none', cursor: 'pointer', minHeight: 44, display: 'block' }}>
        ← back
      </button>
    </div>
  )
}

const STAMP_BUTTON: React.CSSProperties = {
  display: 'block', width: '100%', padding: 'var(--space-md)',
  background: 'var(--color-stamp)', color: 'var(--color-white)',
  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
  letterSpacing: '0.18em', textTransform: 'uppercase',
  border: '1px solid var(--color-ink)', borderRadius: 4,
  boxShadow: '2px 2px 0 var(--color-ink)', transform: 'rotate(-2deg)',
  cursor: 'pointer', marginTop: 'var(--space-md)', minHeight: 48,
}
```

- [ ] **Step 4: Create `src/components/sections/memories/add/AddQuoteSheet.tsx`**

This sheet writes a `LineOfDay`, not a `MemoryEntry`. It calls `useLineOfDay` directly:

```tsx
import { useState } from 'react'
import { CityId } from '../../../../db/schema'
import { useLineOfDay } from '../../../../hooks/useLineOfDay'

interface Props {
  cityId: CityId
  date: string     // YYYY-MM-DD
  onClose: () => void
  onBack: () => void
}

const MAX = 80

export function AddQuoteSheet({ cityId, date, onClose, onBack }: Props) {
  const { text: existing, setLine } = useLineOfDay(cityId, date)
  const [draft, setDraft] = useState(existing)

  const d = new Date(date + 'T12:00:00')
  const dateLabel = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  async function handleSave() {
    await setLine(draft.trim())
    onClose()
  }

  return (
    <div style={{ padding: '0 var(--space-lg) var(--space-lg)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-stamp)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 4 }}>
        LINE OF THE DAY
      </p>

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-ink-faint)', letterSpacing: '0.08em', marginBottom: 'var(--space-lg)' }}>
        {dateLabel.toUpperCase()}
      </p>

      <textarea
        value={draft}
        onChange={e => setDraft(e.target.value.slice(0, MAX))}
        placeholder="one line from today…"
        rows={3}
        maxLength={MAX}
        aria-label="Line of the day"
        style={{
          width: '100%',
          fontFamily: 'var(--font-hand)',
          fontSize: 26,
          color: 'var(--color-ink)',
          background: 'transparent',
          border: 'none',
          outline: '2px solid var(--color-stamp)',
          borderRadius: 3,
          padding: '6px 8px',
          transform: 'rotate(-1.4deg)',
          transformOrigin: 'left center',
          lineHeight: 1.3,
          resize: 'none',
          boxSizing: 'border-box',
          marginBottom: 8,
        }}
        autoFocus
      />

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-ink-faint)', textAlign: 'right', marginBottom: 'var(--space-md)' }}>
        {draft.length}/{MAX}
      </p>

      <button onClick={handleSave} disabled={!draft.trim()} style={{ ...STAMP_BUTTON, opacity: draft.trim() ? 1 : 0.5 }}>
        PASTE IT IN
      </button>
      <button onClick={onBack} style={{ marginTop: 'var(--space-md)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-ink-faint)', letterSpacing: '0.08em', background: 'transparent', border: 'none', cursor: 'pointer', minHeight: 44, display: 'block' }}>
        ← back
      </button>
    </div>
  )
}

const STAMP_BUTTON: React.CSSProperties = {
  display: 'block', width: '100%', padding: 'var(--space-md)',
  background: 'var(--color-stamp)', color: 'var(--color-white)',
  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
  letterSpacing: '0.18em', textTransform: 'uppercase',
  border: '1px solid var(--color-ink)', borderRadius: 4,
  boxShadow: '2px 2px 0 var(--color-ink)', transform: 'rotate(-2deg)',
  cursor: 'pointer', marginTop: 'var(--space-md)', minHeight: 48,
}
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/memories/add/AddPhotoSheet.tsx src/components/sections/memories/add/AddQuoteSheet.tsx src/components/sections/memories/add/AddPickerSheet.tsx src/components/sections/memories/AddMemorySheet.tsx
git commit -m "feat: add AddPhotoSheet and AddQuoteSheet compose steps, wire photo file picker"
```

---

### Task 4: Voice recording hook and VoiceCard integration

**Goal:** Implement `useVoiceRecorder` using `MediaRecorder` + Web Audio API for waveform capture, and wire it into `VoiceCard` so recording works end-to-end.

**Files:**
- Create: `src/hooks/useVoiceRecorder.ts`
- Modify: `src/components/sections/memories/cards/VoiceCard.tsx`
- Modify: `src/components/sections/memories/MemoriesSection.tsx` — render VoiceCards with recording state from a new "add voice" trigger in the picker

**Acceptance Criteria:**
- [ ] `useVoiceRecorder` returns `{ state, duration, waveform, start, stop }` where `state` is `'idle' | 'recording' | 'done'`
- [ ] Calls `MediaRecorder` to capture audio, accumulates chunks, produces a Blob URL on stop
- [ ] Waveform: downsamples `AnalyserNode` to 30 bars at ~10fps during recording, normalises to `[0,1]`
- [ ] `VoiceCard` in `state='empty'` taps into `start()`, `state='recording'` taps into `stop()`
- [ ] After recording stops, produces a `VoiceMemory` object and calls `onSave`
- [ ] Breathing halo animation uses `@media (prefers-reduced-motion: reduce) { animation: none }` — check this is enforced via inline style check

**Verify:** `npm run build` → no TypeScript errors

**Steps:**

- [ ] **Step 1: Create `src/hooks/useVoiceRecorder.ts`**

```ts
import { useState, useRef, useCallback } from 'react'

export type RecordState = 'idle' | 'recording' | 'done'

interface RecordResult {
  audioSrc: string
  duration: number
  waveform: number[]
}

export function useVoiceRecorder(onDone: (result: RecordResult) => void) {
  const [state, setState] = useState<RecordState>('idle')
  const [duration, setDuration] = useState(0)
  const [waveform, setWaveform] = useState<number[]>([])

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const analyserRef = useRef<AnalyserNode | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const waveformFrameRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const liveWaveformRef = useRef<number[]>([])

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      chunksRef.current = []
      liveWaveformRef.current = []
      startTimeRef.current = Date.now()

      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.start(100)

      setState('recording')
      setDuration(0)
      setWaveform([])

      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)

      const dataArr = new Uint8Array(analyser.frequencyBinCount)
      waveformFrameRef.current = setInterval(() => {
        analyser.getByteFrequencyData(dataArr)
        const bins = 30
        const step = Math.floor(dataArr.length / bins)
        const bar = Array.from({ length: bins }, (_, i) => dataArr[i * step] / 255)
        liveWaveformRef.current = bar
        setWaveform([...bar])
      }, 100)
    } catch {
      // Microphone permission denied — silently bail
      setState('idle')
    }
  }, [])

  const stop = useCallback(() => {
    if (!mediaRecorderRef.current) return
    if (timerRef.current) clearInterval(timerRef.current)
    if (waveformFrameRef.current) clearInterval(waveformFrameRef.current)

    const finalDuration = Math.floor((Date.now() - startTimeRef.current) / 1000)
    const finalWaveform = liveWaveformRef.current

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      const audioSrc = URL.createObjectURL(blob)
      setState('done')
      onDone({ audioSrc, duration: finalDuration, waveform: finalWaveform })
    }
    mediaRecorderRef.current.stop()
    mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop())
  }, [onDone])

  return { state, duration, waveform, start, stop }
}
```

- [ ] **Step 2: Wire VoiceCard into recording in MemoriesSection**

In `MemoriesSection.tsx`, voice picker tile should directly start a new empty voice entry and add it. The simplest pattern: when the user taps the Voice tile in AddPickerSheet, instead of routing to a compose sheet, open an inline recording VoiceCard in the day stream.

Add state for an active recording entry to `MemoriesSection`:

```tsx
const [recordingId] = useState(() => crypto.randomUUID())
```

In `AddPickerSheet`, the voice tile calls `onSelect('voice')`. In `AddMemorySheet`, the `'voice'` step renders a `VoiceRecordSheet`:

Create `src/components/sections/memories/add/VoiceRecordSheet.tsx`:

```tsx
import { VoiceMemory } from '../../../../db/schema'
import { useVoiceRecorder } from '../../../../hooks/useVoiceRecorder'
import { VoiceCard } from '../cards/VoiceCard'

type SaveArg = Omit<VoiceMemory, 'id' | 'cityId'>

interface Props {
  onSave: (entry: SaveArg) => void
  onBack: () => void
}

export function VoiceRecordSheet({ onSave, onBack }: Props) {
  const { state, duration, waveform, start, stop } = useVoiceRecorder(({ audioSrc, duration: d, waveform: wf }) => {
    onSave({ kind: 'voice', author: 'both', audioSrc, duration: d, waveform: wf, timestamp: new Date().toISOString() })
  })

  const previewEntry: VoiceMemory = {
    id: 'preview', cityId: 'prague', kind: 'voice', author: 'both',
    audioSrc: '', duration, waveform,
    timestamp: new Date().toISOString(),
  }

  const cardState = state === 'idle' ? 'empty' : state === 'recording' ? 'recording' : 'recorded'

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-stamp)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 16 }}>
        VOICE MEMO
      </p>

      <div style={{ transform: 'rotate(-1deg)', display: 'inline-block', marginBottom: 'var(--space-lg)' }}>
        <VoiceCard
          entry={previewEntry}
          width={280}
          state={cardState}
          onStartRecord={start}
          onStopRecord={stop}
        />
      </div>

      <button onClick={onBack} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-ink-faint)', letterSpacing: '0.08em', background: 'transparent', border: 'none', cursor: 'pointer', minHeight: 44, display: 'block' }}>
        ← back
      </button>
    </div>
  )
}
```

Update `AddMemorySheet.tsx` to import and use `VoiceRecordSheet` for the `'voice'` step:

```tsx
import { VoiceRecordSheet } from './add/VoiceRecordSheet'
// ...
{step === 'voice' && <VoiceRecordSheet onSave={entry => { onSave(entry); onClose() }} onBack={() => setStep('picker')} />}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useVoiceRecorder.ts src/components/sections/memories/add/VoiceRecordSheet.tsx src/components/sections/memories/AddMemorySheet.tsx
git commit -m "feat: add useVoiceRecorder hook and voice recording compose step"
```

---

### Task 5: Weather fetching and caching

**Goal:** Fetch weather once per `(cityId, date)` from `wttr.in`, cache in IndexedDB, expose via `useDayWeather`.

**Files:**
- Modify: `src/hooks/useDayWeather.ts`
- Create: `src/utils/fetchWeather.ts`

**Acceptance Criteria:**
- [ ] `fetchWeather(cityId, date)` fetches `wttr.in` JSON for the city and parses into `DayWeather`
- [ ] `useDayWeather` checks the cache first; if no cached value exists for `(cityId, date)`, fetches and writes to store
- [ ] Does not refetch if cache already has an entry (regardless of `fetchedAt` age)
- [ ] Supported city → wttr.in location mapping: `prague → Prague`, `vienna → Vienna`, `budapest → Budapest`, `philly → Philadelphia`
- [ ] On fetch failure, weather remains undefined (no error thrown to UI)
- [ ] `npm run build` succeeds

**Verify:** `npm run build` → no TypeScript errors

**Steps:**

- [ ] **Step 1: Create `src/utils/fetchWeather.ts`**

```ts
import { CityId, DayWeather } from '../db/schema'

const CITY_LOCATIONS: Record<CityId, string> = {
  prague: 'Prague',
  vienna: 'Vienna',
  budapest: 'Budapest',
  philly: 'Philadelphia',
}

const WTTR_KIND_MAP: Record<number, DayWeather['kind']> = {
  113: 'sun',
  116: 'partly',
  119: 'cloud',
  122: 'cloud',
  143: 'cloud',
  176: 'rain',
  179: 'rain',
  182: 'rain',
  185: 'rain',
  200: 'rain',
  227: 'cloud',
  230: 'cloud',
  248: 'cloud',
  260: 'cloud',
  263: 'rain',
  266: 'rain',
  281: 'rain',
  284: 'rain',
  293: 'rain',
  296: 'rain',
  299: 'rain',
  302: 'rain',
  305: 'rain',
  308: 'rain',
  311: 'rain',
  314: 'rain',
  317: 'rain',
  320: 'rain',
  323: 'cloud',
  326: 'cloud',
  329: 'cloud',
  332: 'cloud',
  335: 'cloud',
  338: 'cloud',
  350: 'rain',
  353: 'rain',
  356: 'rain',
  359: 'rain',
  362: 'rain',
  365: 'rain',
  368: 'cloud',
  371: 'cloud',
  374: 'rain',
  377: 'rain',
  386: 'rain',
  389: 'rain',
  392: 'rain',
  395: 'cloud',
}

function mapWttrCode(code: number): DayWeather['kind'] {
  return WTTR_KIND_MAP[code] ?? 'cloud'
}

export async function fetchWeather(cityId: CityId, date: string): Promise<{ kind: DayWeather['kind']; temp: number } | null> {
  const location = CITY_LOCATIONS[cityId]
  if (!location) return null

  try {
    const res = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`)
    if (!res.ok) return null
    const json = await res.json()
    const weather = json?.weather?.[0]
    if (!weather) return null
    const code = Number(weather.hourly?.[4]?.weatherCode ?? weather.hourly?.[0]?.weatherCode ?? 113)
    const temp = Math.round(Number(weather.avgtempC ?? weather.maxtempC ?? 20))
    return { kind: mapWttrCode(code), temp }
  } catch {
    return null
  }
}
```

- [ ] **Step 2: Update `src/hooks/useDayWeather.ts`**

```ts
import { useState, useEffect } from 'react'
import { useDb } from '../db/DbContext'
import { CityId, DayWeather } from '../db/schema'
import { getDayWeather, upsertDayWeather } from '../db/repositories/dayWeather'
import { fetchWeather } from '../utils/fetchWeather'

export function useDayWeather(cityId: CityId, date: string) {
  const db = useDb()
  const [weather, setWeather] = useState<DayWeather | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    async function load() {
      const cached = await getDayWeather(db, cityId, date)
      if (cached) {
        if (!cancelled) { setWeather(cached); setLoading(false) }
        return
      }

      // No cache — fetch
      const result = await fetchWeather(cityId, date)
      if (!cancelled && result) {
        const entry: DayWeather = {
          id: `${cityId}-${date}`,
          cityId, date,
          kind: result.kind,
          temp: result.temp,
          fetchedAt: new Date().toISOString(),
        }
        await upsertDayWeather(db, entry)
        if (!cancelled) setWeather(entry)
      }
      if (!cancelled) setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [db, cityId, date])

  return { weather, loading }
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Run all tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/utils/fetchWeather.ts src/hooks/useDayWeather.ts
git commit -m "feat: add weather fetch from wttr.in with IndexedDB cache"
```

---

## Self-Review Checklist

- [x] All six memory types have a compose sheet (Note, Food, Ticket, Photo, Quote, Voice)
- [x] PASTE IT IN stamp style consistent across all sheets (stamp-red, -2° rotation, hard shadow, mono caps)
- [x] Voice recording: `MediaRecorder` + `AnalyserNode` waveform, 30 bars, normalised `[0,1]`
- [x] Weather: cache-first, fetch once per `(cityId, date)`, failure silently returns `undefined`
- [x] `AddQuoteSheet` writes `LineOfDay`, not `MemoryEntry` — calls `onClose` not `onSave`
- [x] Photo tile triggers native file picker before routing to compose step
- [x] No new color tokens or external dependencies introduced
- [x] `prefers-reduced-motion` note applied to VoiceCard breathing halo
