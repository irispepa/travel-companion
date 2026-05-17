import { useNavigate } from 'react-router-dom'
import { CITY_VIEWS } from '../../config/cities'

const CITY_META: Record<string, {
  color: string; label: string; date: string; rotate: number; sub: string;
  start?: string; end?: string;
}> = {
  prague:    { color: '#c8442a', label: 'PRAHA', date: '3 · VI',  rotate: -6,  sub: 'June 3 – 5',   start: '2026-06-03', end: '2026-06-05' },
  vienna:    { color: '#d39327', label: 'WIEN',  date: '6 · VI',  rotate: 4,   sub: 'June 6 – 8',   start: '2026-06-06', end: '2026-06-08' },
  budapest:  { color: '#5a6b3b', label: 'BUDA',  date: '9 · VI',  rotate: -5,  sub: 'June 9 – 11',  start: '2026-06-09', end: '2026-06-11' },
  'philly-out': { color: '#1f3a5f', label: 'PHL', date: 'JUN 2',  rotate: 7,   sub: 'June 2 · departure' },
  'philly-in':  { color: '#1f3a5f', label: 'PHL', date: 'JUN 12', rotate: -9,  sub: 'June 12 · home' },
}

function getCurrentCityViewId(): string | null {
  const today = new Date().toISOString().slice(0, 10)
  for (const [id, meta] of Object.entries(CITY_META)) {
    if (meta.start && meta.end && today >= meta.start && today < meta.end) {
      return id
    }
  }
  return null
}

function Postmark({ color, label, date, rotate }: { color: string; label: string; date: string; rotate: number }) {
  return (
    <div style={{
      width: 56, height: 56, borderRadius: '50%',
      border: `1.5px solid ${color}`, color,
      display: 'grid', placeItems: 'center',
      transform: `rotate(${rotate}deg)`,
      fontFamily: 'var(--font-mono)', textAlign: 'center',
      position: 'relative', flexShrink: 0,
      opacity: 0.82,
    }}>
      <div style={{
        position: 'absolute', inset: 4, borderRadius: '50%',
        border: `1px dashed ${color}`, opacity: 0.5,
      }} />
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 7.5, letterSpacing: '0.18em', fontWeight: 600 }}>{label}</div>
        <div style={{ height: 1, background: color, margin: '2px 6px', opacity: 0.5 }} />
        <div style={{ fontSize: 7, letterSpacing: '0.08em' }}>{date}</div>
      </div>
    </div>
  )
}

export function CitySelector() {
  const navigate = useNavigate()
  const currentId = getCurrentCityViewId()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      padding: '0 22px 32px',
      background: 'var(--color-paper)',
    }}>
      {/* Status bar spacer */}
      <div style={{ height: 56 }} />

      {/* Header row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginTop: 8,
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.18em',
          color: 'var(--color-ink-soft)',
        }}>
          IRIS &amp; NIKO · SUMMER 2026
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.18em',
          color: 'var(--color-ink-soft)',
        }}>
          10 DAYS
        </div>
      </div>

      {/* Title */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 500,
        fontSize: 38,
        lineHeight: 1.0,
        margin: '20px 0 6px',
        letterSpacing: '-0.02em',
        color: 'var(--color-ink)',
      }}>
        Where to,<br />
        <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--color-stamp)' }}>
          today?
        </span>
      </h1>

      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        color: 'var(--color-ink-soft)',
        marginBottom: 22,
      }}>
        Pick a stop. The trip is yours.
      </p>

      {/* All stops in order */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CITY_VIEWS.map((city) => {
          const meta = CITY_META[city.cityViewId] ?? CITY_META[city.cityId]
          const isActive = city.cityViewId === currentId

          return (
            <button
              key={city.cityViewId}
              onClick={() => navigate(`/${city.cityViewId}`)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                background: isActive ? 'var(--color-white)' : 'transparent',
                border: `1px solid ${isActive ? 'var(--color-ink)' : 'var(--color-rule)'}`,
                borderRadius: 14,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                boxShadow: isActive ? '2px 3px 0 var(--color-ink)' : 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {meta && (
                <Postmark
                  color={meta.color}
                  label={meta.label}
                  date={meta.date}
                  rotate={meta.rotate}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 22,
                    fontWeight: 500,
                    lineHeight: 1.05,
                    letterSpacing: '-0.01em',
                    color: 'var(--color-ink)',
                  }}>
                    {city.label}
                  </div>
                  {isActive && (
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      letterSpacing: '0.16em',
                      color: 'var(--color-stamp)',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}>
                      NOW →
                    </div>
                  )}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  color: 'var(--color-ink-soft)',
                  marginTop: 4,
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {meta?.sub ?? ''}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Footer route line */}
      <div style={{
        marginTop: 22,
        paddingTop: 16,
        borderTop: `1px dashed var(--color-rule)`,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.18em',
        color: 'var(--color-ink-faint)',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>PHL → PRG → VIE → BUD → PHL</span>
        <span>v.1</span>
      </div>
    </div>
  )
}
