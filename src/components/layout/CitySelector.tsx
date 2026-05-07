import { useNavigate } from 'react-router-dom'
import { CITY_VIEWS } from '../../config/cities'

const CITY_STAMP: Record<string, { color: string; label: string; date: string; rotate: number }> = {
  prague:   { color: '#c8442a', label: 'PRAHA',   date: '14 · VI · 2026',  rotate: -6 },
  vienna:   { color: '#d39327', label: 'WIEN',    date: '18 · VI · 2026',  rotate: 4  },
  budapest: { color: '#5a6b3b', label: 'BUDAPEST',date: '21 · VI · 2026',  rotate: -5 },
  philly:   { color: '#1f3a5f', label: 'PHL',     date: 'JUN · 2026',      rotate: 7  },
}

function Postmark({ color, label, date, rotate }: { color: string; label: string; date: string; rotate: number }) {
  return (
    <div style={{
      width: 64, height: 64, borderRadius: '50%',
      border: `1.5px solid ${color}`, color,
      display: 'grid', placeItems: 'center',
      transform: `rotate(${rotate}deg)`,
      fontFamily: 'var(--font-mono)', textAlign: 'center',
      position: 'relative', flexShrink: 0,
      opacity: 0.75,
    }}>
      <div style={{ position: 'absolute', inset: 4, borderRadius: '50%', border: `1px dashed ${color}`, opacity: 0.5 }} />
      <div>
        <div style={{ fontSize: 8, letterSpacing: '0.18em', fontWeight: 600 }}>{label}</div>
        <div style={{ height: 1, background: color, margin: '2px 6px', opacity: 0.5 }} />
        <div style={{ fontSize: 7, letterSpacing: '0.08em' }}>{date}</div>
      </div>
    </div>
  )
}

export function CitySelector() {
  const navigate = useNavigate()

  const trips = CITY_VIEWS.filter(c => !c.cityViewId.includes('philly'))
  const travel = CITY_VIEWS.filter(c => c.cityViewId.includes('philly'))

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      padding: 'var(--space-lg) var(--space-md) var(--space-3xl)',
      background: 'var(--color-paper)',
    }}>
      <div style={{ marginBottom: 'var(--space-xl)', paddingTop: 'var(--space-lg)' }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--color-stamp)',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          marginBottom: 'var(--space-sm)',
        }}>
          June 2026
        </p>
        <h1 style={{
          fontSize: 26,
          fontWeight: 700,
          lineHeight: 1.15,
          color: 'var(--color-ink)',
          letterSpacing: '-0.02em',
        }}>
          Iris & Niko's<br />European Trip
        </h1>
        <p style={{
          fontFamily: 'var(--font-hand)',
          fontSize: 16,
          color: 'var(--color-ink-soft)',
          marginTop: 6,
        }}>
          Prague · Vienna · Budapest
        </p>
      </div>

      <div>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--color-ink-faint)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: 'var(--space-md)',
        }}>
          Destinations
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {trips.map((city, index) => {
            const stamp = CITY_STAMP[city.cityId]
            return (
              <button
                key={city.cityViewId}
                onClick={() => navigate(`/${city.cityViewId}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'transparent',
                  borderRadius: 'var(--radius-md)',
                  padding: `14px var(--space-sm)`,
                  textAlign: 'left',
                  width: '100%',
                  borderBottom: index < trips.length - 1 ? '1px solid var(--color-rule)' : 'none',
                  transition: `background var(--duration-fast) var(--ease-out-expo)`,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: 'var(--color-ink)',
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                  }}>
                    {city.label}
                  </div>
                  {city.travelNote && (
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--color-ink-faint)',
                      marginTop: 4,
                      letterSpacing: '0.04em',
                    }}>
                      {city.travelNote}
                    </div>
                  )}
                </div>
                {stamp && (
                  <Postmark color={stamp.color} label={stamp.label} date={stamp.date} rotate={stamp.rotate} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {travel.length > 0 && (
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--color-ink-faint)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-md)',
          }}>
            Travel days
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {travel.map((city, index) => (
              <button
                key={city.cityViewId}
                onClick={() => navigate(`/${city.cityViewId}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'transparent',
                  borderRadius: 'var(--radius-md)',
                  padding: `12px var(--space-sm)`,
                  textAlign: 'left',
                  width: '100%',
                  borderBottom: index < travel.length - 1 ? '1px solid var(--color-rule)' : 'none',
                }}
              >
                <div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-ink-soft)' }}>
                    {city.label}
                  </div>
                  {city.travelNote && (
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--color-ink-faint)',
                      marginTop: 3,
                    }}>
                      {city.travelNote}
                    </div>
                  )}
                </div>
                <span style={{ color: 'var(--color-ink-faint)', fontSize: 14 }}>→</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
