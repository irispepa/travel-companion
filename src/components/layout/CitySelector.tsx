import { useNavigate } from 'react-router-dom'
import { CITY_VIEWS } from '../../config/cities'

export function CitySelector() {
  const navigate = useNavigate()
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: 'var(--space-lg)',
    }}>
      <div style={{ marginBottom: 'var(--space-xl)', paddingTop: 'var(--space-lg)' }}>
        <p style={{
          fontSize: 'var(--text-caption)',
          color: 'var(--color-gold)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: 'var(--space-sm)',
        }}>
          Spring 2026
        </p>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-display)',
          fontWeight: 400,
          lineHeight: 'var(--leading-tight)',
          color: 'var(--color-cream)',
        }}>
          Your Trip
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        {CITY_VIEWS.map((city, index) => (
          <button
            key={city.cityViewId}
            onClick={() => navigate(`/${city.cityViewId}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'transparent',
              borderRadius: 'var(--radius-md)',
              padding: `var(--space-md) var(--space-sm)`,
              textAlign: 'left',
              width: '100%',
              borderBottom: index < CITY_VIEWS.length - 1 ? '1px solid var(--color-bg-card)' : 'none',
              transition: `background var(--duration-fast) var(--ease-out-expo)`,
            }}
          >
            <div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-headline)',
                fontWeight: 400,
                color: 'var(--color-cream)',
                lineHeight: 'var(--leading-snug)',
              }}>
                {city.label}
              </div>
              {city.travelNote && (
                <div style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-muted)',
                  marginTop: 3,
                  letterSpacing: '0.02em',
                }}>
                  {city.travelNote}
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
  )
}
