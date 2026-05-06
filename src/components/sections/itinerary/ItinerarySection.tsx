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
          {isEditMode ? 'Done' : 'Edit'}
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
