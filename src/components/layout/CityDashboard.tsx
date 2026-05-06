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
