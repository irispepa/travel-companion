import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CityViewId, CityId, MemoryEntry } from '../../../db/schema'
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

// ── Layout algorithm ──────────────────────────────────────────────────────────

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

function estimateCardHeight(entry: MemoryEntry, width: number): number {
  switch (entry.kind) {
    case 'photo':  return width + 32
    case 'note':   return 100 + Math.ceil(entry.body.length / 30) * 22
    case 'food':   return 100
    case 'voice':  return 110
    case 'ticket': return 90
  }
}

function layoutDay(items: MemoryEntry[], containerWidth: number): { placements: CardPlacement[]; totalHeight: number } {
  const CARD_W_LEFT = Math.floor(containerWidth * 0.52)
  const CARD_W_RIGHT = Math.floor(containerWidth * 0.48)
  const OVERLAP = 20
  const GAP = 8
  let leftY = 0
  let rightY = 30

  const placements: CardPlacement[] = []
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

// ── Day grouping ──────────────────────────────────────────────────────────────

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

// ── Card renderer ─────────────────────────────────────────────────────────────

function renderCard(entry: MemoryEntry, width: number): React.ReactNode {
  switch (entry.kind) {
    case 'photo':  return <PhotoCard  key={entry.id} entry={entry} width={width} />
    case 'note':   return <NoteCard   key={entry.id} entry={entry} width={width} />
    case 'food':   return <FoodCard   key={entry.id} entry={entry} width={width} />
    case 'voice':  return <VoiceCard  key={entry.id} entry={entry} width={width} state="recorded" />
    case 'ticket': return <TicketCard key={entry.id} entry={entry} width={width} />
  }
}

// ── Filter ────────────────────────────────────────────────────────────────────

type AuthorFilter = 'both' | 'iris' | 'niko'
type KindFilter = 'photos' | 'notes' | 'voice' | 'tickets'

const AUTHOR_STATES: { key: AuthorFilter; label: string }[] = [
  { key: 'iris',  label: 'Iris' },
  { key: 'niko',  label: 'Niko' },
  { key: 'both',  label: 'Both' },
]

const KIND_FILTERS: { key: KindFilter; label: string }[] = [
  { key: 'photos',  label: 'Photos' },
  { key: 'notes',   label: 'Notes' },
  { key: 'voice',   label: 'Voice' },
  { key: 'tickets', label: 'Tickets' },
]

function applyFilters(entries: MemoryEntry[], author: AuthorFilter, kind: KindFilter | null): MemoryEntry[] {
  let result = entries
  if (author === 'iris') result = result.filter(e => e.author === 'Iris')
  else if (author === 'niko') result = result.filter(e => e.author === 'Niko')
  if (kind === 'photos')  result = result.filter(e => e.kind === 'photo')
  else if (kind === 'notes')   result = result.filter(e => e.kind === 'note')
  else if (kind === 'voice')   result = result.filter(e => e.kind === 'voice')
  else if (kind === 'tickets') result = result.filter(e => e.kind === 'ticket')
  return result
}

// ── DaySection ────────────────────────────────────────────────────────────────

function DaySection({ date, items, cityId, containerWidth }: {
  date: string
  items: MemoryEntry[]
  cityId: CityId
  containerWidth: number
}) {
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

// ── MemoriesSection ───────────────────────────────────────────────────────────

export function MemoriesSection() {
  const { cityViewId } = useParams<{ cityViewId: CityViewId }>()
  const config = getCityView(cityViewId!)
  const { entries, addMemory, loading } = useMemories(config.cityId)
  const [showAdd, setShowAdd] = useState(false)
  const [showCalc, setShowCalc] = useState(false)
  const [authorFilter, setAuthorFilter] = useState<AuthorFilter>('both')
  const [kindFilter, setKindFilter] = useState<KindFilter | null>(null)

  const CONTAINER_WIDTH = Math.min(window.innerWidth, 390) - 36

  const filtered = applyFilters(entries, authorFilter, kindFilter)
  const days = groupByDate(filtered)

  return (
    <AppShell cityLabel={config.label} showBack={true} onCalculator={() => setShowCalc(true)}>
      <div style={{ padding: '0 18px', paddingBottom: 88, background: 'var(--color-paper)' }}>

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

        <div style={{
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          marginBottom: 'var(--space-md)',
          paddingBottom: 4,
          WebkitOverflowScrolling: 'touch',
        }}>
          {/* Author pill — cycles Iris → Niko → Both */}
          <button
            onClick={() => {
              const idx = AUTHOR_STATES.findIndex(s => s.key === authorFilter)
              setAuthorFilter(AUTHOR_STATES[(idx + 1) % AUTHOR_STATES.length].key)
            }}
            style={{
              flexShrink: 0,
              padding: '5px 12px',
              borderRadius: 20,
              border: '1px solid var(--color-ink)',
              background: authorFilter !== 'both' ? 'var(--color-ink)' : 'transparent',
              color: authorFilter !== 'both' ? 'var(--color-paper)' : 'var(--color-ink)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              minHeight: 44,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {AUTHOR_STATES.find(s => s.key === authorFilter)!.label}
          </button>

          {KIND_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setKindFilter(kindFilter === f.key ? null : f.key)}
              aria-pressed={kindFilter === f.key}
              style={{
                flexShrink: 0,
                padding: '5px 12px',
                borderRadius: 20,
                border: '1px solid var(--color-ink)',
                background: kindFilter === f.key ? 'var(--color-ink)' : 'transparent',
                color: kindFilter === f.key ? 'var(--color-paper)' : 'var(--color-ink)',
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
          cityId={config.cityId}
          date={new Date().toISOString().slice(0, 10)}
          onSave={entry => addMemory({ ...entry, id: crypto.randomUUID(), cityId: config.cityId } as MemoryEntry)}
          onClose={() => setShowAdd(false)}
        />
      )}
      {showCalc && <CalculatorOverlay cityViewId={cityViewId!} onClose={() => setShowCalc(false)} />}
    </AppShell>
  )
}
