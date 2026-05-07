import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CityViewId, ActivityItem } from '../../../db/schema'
import { getCityView } from '../../../config/cities'
import { useActivities } from '../../../hooks/useActivities'
import { AppShell } from '../../layout/AppShell'
import { CalculatorOverlay } from '../../calculator/CalculatorOverlay'
import { ActivityRow } from './ActivityRow'
import { SkeletonList } from '../../layout/SkeletonList'

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
  const { items, loading } = useActivities(config.cityId)
  const [sortKey, setSortKey] = useState<SortKey>('priority')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showCalc, setShowCalc] = useState(false)

  const sorted = sortActivities(items, sortKey)

  return (
    <AppShell cityLabel={config.label} showBack={true} onCalculator={() => setShowCalc(true)}>
      <div style={{ padding: 'var(--space-lg) var(--space-md) var(--space-3xl)', background: 'var(--color-paper)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-lg)',
        }}>
          <div>
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
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--color-ink)',
              letterSpacing: '-0.01em',
            }}>
              What to Do
            </h2>
          </div>
          <select
            value={sortKey}
            onChange={e => setSortKey(e.target.value as SortKey)}
            aria-label="Sort activities"
            style={{
              background: 'var(--color-white)',
              border: '1px solid var(--color-rule)',
              color: 'var(--color-ink-soft)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.06em',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 10px',
              WebkitAppearance: 'none',
              appearance: 'none',
              minHeight: 36,
              cursor: 'pointer',
            }}
          >
            <option value="priority">Priority</option>
            <option value="cost">Cost</option>
            <option value="timeEstimate">Time</option>
          </select>
        </div>
        {loading && <SkeletonList rows={5} rowHeight={60} />}
        {!loading && items.length === 0 && (
          <p style={{ color: 'var(--color-ink-faint)', fontSize: 'var(--text-body)', textAlign: 'center', paddingTop: 'var(--space-xl)' }}>
            Nothing here yet
          </p>
        )}
        {!loading && sorted.map((item, idx) => (
          <ActivityRow key={item.id} item={item} index={idx}
            expanded={expandedId === item.id}
            onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)} />
        ))}
      </div>
      {showCalc && <CalculatorOverlay cityViewId={cityViewId!} onClose={() => setShowCalc(false)} />}
    </AppShell>
  )
}
