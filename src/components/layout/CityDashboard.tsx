import { useParams, useNavigate } from 'react-router-dom'
import { getCityView } from '../../config/cities'
import { CityViewId } from '../../db/schema'
import { AppShell } from './AppShell'
import { CityMap } from '../map/CityMap'
import { InlineCurrencyConverter } from '../calculator/InlineCurrencyConverter'

const SECTIONS = [
  { key: 'itinerary', label: 'Itinerary', description: 'Day by day' },
  { key: 'activities', label: 'What to Do', description: 'Places & things' },
  { key: 'phrases', label: 'What to Say', description: 'Language & culture' },
  { key: 'memories', label: 'Memories', description: 'Photos & notes' },
]

export function CityDashboard() {
  const { cityViewId } = useParams<{ cityViewId: CityViewId }>()
  const navigate = useNavigate()
  const config = getCityView(cityViewId!)

  return (
    <AppShell cityLabel={config.label} showBack={true}>
      <div style={{ padding: 'var(--space-md) var(--space-md) var(--space-lg)' }}>
        <CityMap embedUrl={config.mapEmbedUrl} cityLabel={config.label} />

        {config.travelNote && (
          <p style={{
            fontSize: 'var(--text-caption)',
            color: 'var(--color-muted)',
            marginTop: 'var(--space-sm)',
            letterSpacing: '0.02em',
            lineHeight: 'var(--leading-normal)',
          }}>
            {config.travelNote}
          </p>
        )}

        <div style={{ marginTop: 'var(--space-lg)' }}>
          <InlineCurrencyConverter cityViewId={cityViewId!} />
        </div>

        <div style={{ marginTop: 'var(--space-md)' }}>
          <p style={{
            fontSize: 'var(--text-caption)',
            color: 'var(--color-gold)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-md)',
          }}>
            Explore
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {SECTIONS.map((s, index) => (
              <button
                key={s.key}
                onClick={() => navigate(`/${cityViewId}/${s.key}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'transparent',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-md) var(--space-sm)',
                  textAlign: 'left',
                  width: '100%',
                  borderBottom: index < SECTIONS.length - 1 ? '1px solid var(--color-bg-card)' : 'none',
                  transition: `background var(--duration-fast) var(--ease-out-expo)`,
                }}
              >
                <div>
                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'var(--text-title)',
                    fontWeight: 400,
                    color: 'var(--color-cream)',
                  }}>
                    {s.label}
                  </div>
                  {s.description && (
                    <div style={{
                      fontSize: 'var(--text-caption)',
                      color: 'var(--color-muted)',
                      marginTop: 2,
                    }}>
                      {s.description}
                    </div>
                  )}
                </div>
                <span style={{
                  color: 'var(--color-gold)',
                  fontSize: 16,
                  opacity: 0.6,
                  flexShrink: 0,
                  marginLeft: 'var(--space-md)',
                }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
