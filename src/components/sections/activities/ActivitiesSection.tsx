import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CityViewId, ActivityItem } from '../../../db/schema'
import { getCityView } from '../../../config/cities'
import { useActivities } from '../../../hooks/useActivities'
import { AppShell } from '../../layout/AppShell'
import { CalculatorOverlay } from '../../calculator/CalculatorOverlay'
import { ActivityRow } from './ActivityRow'

type SortKey = 'priority' | 'cost' | 'timeEstimate'

export function sortActivities(items: ActivityItem[], key: SortKey): ActivityItem[] {
  return [...items].sort((a, b) => {
    if (key === 'priority') return b.priority - a.priority
    return String(a[key]).localeCompare(String(b[key]))
  })
}

export function ActivitiesSection() {
  const { cityViewId } = useParams<{ cityViewId: CityViewId }>()
  const config = getCityView(cityViewId!)
  const { items } = useActivities(config.cityId)
  const [sortKey, setSortKey] = useState<SortKey>('priority')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showCalc, setShowCalc] = useState(false)

  const sorted = sortActivities(items, sortKey)

  return (
    <AppShell cityLabel={config.label} showBack={true} onCalculator={() => setShowCalc(true)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 12px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 18 }}>What to Do</h2>
        <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}
          style={{ background: 'var(--color-bg-card)', border: 'none', color: 'var(--color-cream)', fontSize: 12, borderRadius: 'var(--radius-sm)', padding: '4px 8px' }}>
          <option value="priority">By Priority</option>
          <option value="cost">By Cost</option>
          <option value="timeEstimate">By Time</option>
        </select>
      </div>
      {sorted.map(item => (
        <ActivityRow key={item.id} item={item}
          expanded={expandedId === item.id}
          onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)} />
      ))}
      {showCalc && <CalculatorOverlay cityViewId={cityViewId!} onClose={() => setShowCalc(false)} />}
    </AppShell>
  )
}
