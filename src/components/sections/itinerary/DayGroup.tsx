import { useState } from 'react'
import { ItineraryDay, ItineraryItem } from '../../../db/schema'
import { ItineraryCard } from './ItineraryCard'

interface Props {
  day: ItineraryDay
  dayIndex: number
  totalDays: number
  currentTime: Date
  onUpdate: (item: ItineraryItem) => void
  onDelete: (id: string) => void
  onAdd: () => string
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
}

function isToday(date: string): boolean {
  const d = new Date(date + 'T12:00:00')
  const now = new Date()
  return d.toDateString() === now.toDateString()
}

function isPastItem(date: string, time: string, now: Date): boolean {
  if (!time) return false
  const [h, m] = time.split(':').map(Number)
  const itemDate = new Date(date + 'T12:00:00')
  itemDate.setHours(h, m, 0, 0)
  return itemDate < now
}

const dayLabel = (date: string) =>
  new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    .replace(',', ' ·')

export function DayGroup({ day, dayIndex, totalDays, currentTime, onUpdate, onDelete, onAdd, onMoveUp, onMoveDown }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const today = isToday(day.date)
  const isLast = dayIndex === totalDays - 1

  return (
    <div style={{ position: 'relative', paddingLeft: 22, paddingBottom: isLast ? 0 : 18 }}>
      {/* Dashed timeline spine */}
      {!isLast && (
        <div style={{
          position: 'absolute', left: 5, top: 22, bottom: 0,
          width: 0,
          borderLeft: '1.5px dashed var(--color-rule)',
        }} />
      )}

      {/* Day node */}
      <div style={{
        position: 'absolute', left: 0, top: 6,
        width: 11, height: 11, borderRadius: '50%',
        background: today ? 'var(--color-stamp)' : 'var(--color-paper)',
        border: `2px solid ${today ? 'var(--color-stamp)' : 'var(--color-ink)'}`,
      }} />

      {/* Day header */}
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 10,
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          fontWeight: 500,
          letterSpacing: '-0.01em',
          color: 'var(--color-ink)',
        }}>
          {dayLabel(day.date)}
        </div>
        {today && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.16em',
            color: 'var(--color-stamp)',
            fontWeight: 600,
          }}>
            TODAY
          </div>
        )}
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {day.items.map((item, ii) => (
          <ItineraryCard
            key={item.id}
            item={item}
            isPast={isPastItem(day.date, item.time, currentTime)}
            isEditing={editingId === item.id}
            onEdit={() => setEditingId(item.id)}
            onClose={() => setEditingId(null)}
            onUpdate={onUpdate}
            onDelete={() => { onDelete(item.id); setEditingId(null) }}
            onMoveUp={ii > 0 ? () => onMoveUp(item.id) : undefined}
            onMoveDown={ii < day.items.length - 1 ? () => onMoveDown(item.id) : undefined}
          />
        ))}

        {/* Add item */}
        <button
          onClick={() => { const id = onAdd(); setEditingId(id) }}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '8px 12px',
            border: '1px dashed var(--color-rule)',
            borderRadius: 10,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.16em',
            color: 'var(--color-ink-soft)',
            marginTop: 2,
          }}
        >
          + ADD ITEM
        </button>
      </div>
    </div>
  )
}
