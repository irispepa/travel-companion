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
  const { record, updateItem, addItem, deleteItem, reorderItems } = useItinerary(cityViewId!)
  const [showCalc, setShowCalc] = useState(false)
  const now = new Date()

  const showMap = record?.days.some(d => {
    const date = new Date(d.date + 'T12:00:00')
    const today = new Date(); today.setHours(0, 0, 0, 0)
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

  const totalDays = record?.days.length ?? 0

  return (
    <AppShell cityLabel={config.label} showBack={true} onCalculator={() => setShowCalc(true)}>
      <div style={{ minHeight: '100%', background: 'var(--color-paper)', paddingBottom: 80 }}>
        {showMap && (
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <CityMap embedUrl={config.mapEmbedUrl} cityLabel={config.label} />
          </div>
        )}

        {/* Header */}
        <div style={{ padding: '20px 22px 0' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.22em',
            color: 'var(--color-stamp)',
            fontWeight: 600,
            marginBottom: 4,
          }}>
            THE PLAN · {totalDays} DAYS
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 36,
            fontWeight: 500,
            margin: '0 0 4px',
            letterSpacing: '-0.02em',
            color: 'var(--color-ink)',
            lineHeight: 1.0,
          }}>
            Itinerary.
          </h1>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            color: 'var(--color-ink-soft)',
            fontStyle: 'italic',
          }}>
            Loose. Skip whatever doesn't suit the day.
          </div>
        </div>

        {/* Timeline */}
        <div style={{ padding: '20px 22px 0', position: 'relative' }}>
          {!record && (
            <p style={{ color: 'var(--color-ink-faint)', fontSize: 14 }}>Loading…</p>
          )}
          {record?.days.map((day, di) => (
            <DayGroup
              key={day.date}
              day={day}
              dayIndex={di}
              totalDays={record.days.length}
              currentTime={now}
              onUpdate={(item) => updateItem(day.date, item)}
              onDelete={(id) => deleteItem(day.date, id)}
              onAdd={() => {
                const id = crypto.randomUUID()
                addItem(day.date, { id, name: '', time: '12:00', duration: '', location: '', notes: '', links: [] })
                return id
              }}
              onMoveUp={(id) => handleMoveUp(day.date, id)}
              onMoveDown={(id) => handleMoveDown(day.date, id)}
            />
          ))}

          {/* End node */}
          {record && (
            <div style={{ paddingLeft: 22, position: 'relative', marginTop: 4 }}>
              <div style={{
                position: 'absolute', left: 0, top: 4,
                width: 11, height: 11, borderRadius: '50%',
                background: 'var(--color-ink)',
              }} />
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.18em',
                color: 'var(--color-ink-soft)',
              }}>
                → ON TO {config.label === 'Prague' ? 'VIENNA' : config.label === 'Vienna' ? 'BUDAPEST' : 'HOME'}
              </div>
            </div>
          )}
        </div>
      </div>

      {showCalc && <CalculatorOverlay cityViewId={cityViewId!} onClose={() => setShowCalc(false)} />}
    </AppShell>
  )
}
