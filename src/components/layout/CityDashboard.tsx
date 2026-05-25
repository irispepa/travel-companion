import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCityView } from '../../config/cities'
import { CityViewId } from '../../db/schema'
import { useItinerary } from '../../hooks/useItinerary'
import { useDayWeather } from '../../hooks/useDayWeather'
import { useExchangeRate } from '../../hooks/useExchangeRate'
import { CalculatorOverlay } from '../calculator/CalculatorOverlay'

// ── City data ──────────────────────────────────────────────────────────────
const CITY_DATA: Record<string, {
  stampColor: string
  stampLabel: string
  stampDate: string
  coords: string
  tag: string
  pins: string
  riverColor: string
  riverShadow: string
  riverPath: string
  landmarks: Array<{ x: number; y: number; c: string }>
}> = {
  prague: {
    stampColor: '#c8442a',
    stampLabel: 'PRAHA',
    stampDate: '3 · VI',
    coords: '50.0755° N · 14.4378° E',
    tag: 'Stone city, slow river, cheap pivo.',
    pins: '6 SAVED PINS',
    riverColor: '#9bbcd1',
    riverShadow: '#7aa3bd',
    riverPath: 'M-10 80 C 60 60, 100 110, 160 80 S 280 50, 340 90',
    landmarks: [
      { x: 92, y: 58, c: '#c8442a' },
      { x: 178, y: 48, c: '#c8442a' },
      { x: 142, y: 92, c: '#1f3a5f' },
      { x: 232, y: 78, c: '#d39327' },
    ],
  },
  vienna: {
    stampColor: '#d39327',
    stampLabel: 'WIEN',
    stampDate: '6 · VI',
    coords: '48.2082° N · 16.3738° E',
    tag: 'Imperial cake, late-night opera, perfect coffee.',
    pins: '8 SAVED PINS',
    riverColor: '#7fb6c8',
    riverShadow: '#5e94a6',
    riverPath: 'M-10 50 C 60 55, 120 70, 200 78 S 320 90, 340 95',
    landmarks: [
      { x: 88, y: 90, c: '#d39327' },
      { x: 162, y: 100, c: '#d39327' },
      { x: 210, y: 110, c: '#c8442a' },
      { x: 130, y: 38, c: '#1f3a5f' },
    ],
  },
  budapest: {
    stampColor: '#5a6b3b',
    stampLabel: 'BUDA',
    stampDate: '9 · VI',
    coords: '47.4979° N · 19.0402° E',
    tag: 'Two cities, one river, ruin-bar nights.',
    pins: '7 SAVED PINS',
    riverColor: '#9bbcd1',
    riverShadow: '#7aa3bd',
    riverPath: 'M155 -10 C 145 30, 165 70, 155 110 S 145 150, 160 170',
    landmarks: [
      { x: 70, y: 50, c: '#5a6b3b' },
      { x: 90, y: 95, c: '#5a6b3b' },
      { x: 220, y: 60, c: '#c8442a' },
      { x: 240, y: 105, c: '#d39327' },
    ],
  },
  philly: {
    stampColor: '#1f3a5f',
    stampLabel: 'PHL',
    stampDate: 'JUN · 2026',
    coords: '39.9526° N · 75.1652° W',
    tag: 'Home base.',
    pins: '',
    riverColor: '#9bbcd1',
    riverShadow: '#7aa3bd',
    riverPath: 'M-10 70 C 80 60, 160 80, 340 75',
    landmarks: [],
  },
}

// ── Sub-components ─────────────────────────────────────────────────────────
function Postmark({ color, label, date }: { color: string; label: string; date: string }) {
  return (
    <div style={{
      width: 62, height: 62, borderRadius: '50%',
      border: `1.5px solid ${color}`, color,
      display: 'grid', placeItems: 'center',
      transform: 'rotate(-9deg)',
      fontFamily: 'var(--font-mono)', textAlign: 'center',
      position: 'relative', flexShrink: 0,
      opacity: 0.82,
    }}>
      <div style={{ position: 'absolute', inset: 4, borderRadius: '50%', border: `1px dashed ${color}`, opacity: 0.5 }} />
      <div>
        <div style={{ fontSize: 8, letterSpacing: '0.18em', fontWeight: 600 }}>{label}</div>
        <div style={{ height: 1, background: color, margin: '2px 6px', opacity: 0.5 }} />
        <div style={{ fontSize: 7, letterSpacing: '0.1em' }}>{date}</div>
      </div>
    </div>
  )
}

function Pin({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <path d="M0 0 C -6 -4, -6 -14, 0 -14 C 6 -14, 6 -4, 0 0 Z" fill={color} stroke="#1d1c1a" strokeWidth="0.6" />
      <circle cy={-9} r={2} fill="#fbf7ee" />
    </g>
  )
}

function MapDoodle({ city }: { city: typeof CITY_DATA[string] }) {
  return (
    <svg viewBox="0 0 320 140" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <defs>
        <pattern id="paper-bg" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#dfd6c2" />
          <circle cx="1" cy="1" r="0.4" fill="#c8bfa8" />
        </pattern>
      </defs>
      <rect width="320" height="140" fill="url(#paper-bg)" />
      {/* River */}
      <path d={city.riverPath} stroke={city.riverColor} strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d={city.riverPath} stroke={city.riverShadow} strokeWidth="1" fill="none" strokeDasharray="2 3" opacity="0.6" />
      {/* Streets */}
      <g stroke="#a89e85" strokeWidth="1" fill="none" opacity="0.6">
        <path d="M40 20 L80 60 L120 40 L150 70" />
        <path d="M180 20 L220 50 L260 30 L300 60" />
        <path d="M30 110 L90 130 L140 115 L200 130" />
        <path d="M210 110 L260 125 L300 115" />
      </g>
      {/* Pins */}
      {city.landmarks.map((p, i) => (
        <Pin key={i} cx={p.x} cy={p.y} color={p.c} />
      ))}
      {/* North arrow */}
      <g transform="translate(290 110)" opacity="0.7">
        <circle r="10" fill="none" stroke="#1d1c1a" strokeWidth="0.8" />
        <path d="M0 -7 L3 4 L0 1 L-3 4 Z" fill="#1d1c1a" />
        <text y="-12" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6" fill="#1d1c1a">N</text>
      </g>
    </svg>
  )
}

function StubCard({ label, value, sub, highlight }: { label: string; value: string; sub: string; highlight?: boolean }) {
  return (
    <div style={{
      background: highlight ? '#1d1c1a' : '#fbf7ee',
      color: highlight ? '#f4ede1' : '#1d1c1a',
      border: '1px solid #1d1c1a',
      borderRadius: 10,
      padding: '10px 12px',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', opacity: 0.7 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, lineHeight: 1, marginTop: 4, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{sub}</div>
    </div>
  )
}

function PlanRow({ time, name, loc, done, active }: { time: string; name: string; loc?: string; done?: boolean; active?: boolean }) {
  return (
    <div style={{
      display: 'flex', gap: 12, padding: '12px 14px',
      background: active ? '#fbf7ee' : 'transparent',
      border: `1px solid ${active ? '#1d1c1a' : '#d6cdb9'}`,
      borderRadius: 10,
      opacity: done ? 0.55 : 1,
      boxShadow: active ? '2px 3px 0 #1d1c1a' : 'none',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
        color: active ? '#c8442a' : '#5b5751',
        paddingTop: 2, minWidth: 42, flexShrink: 0,
      }}>
        {time}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 500, textDecoration: done ? 'line-through' : 'none' }}>
          {name}
        </div>
        {loc && (
          <div style={{ fontSize: 12, color: '#5b5751', marginTop: 2 }}>{loc}</div>
        )}
      </div>
    </div>
  )
}

const TABS = [
  { id: 'activities', label: 'What to do' },
  { id: 'phrases',    label: 'What to say' },
  { id: 'itinerary',  label: 'Itinerary' },
  { id: 'memories',   label: 'Memories' },
]

// ── Main component ─────────────────────────────────────────────────────────
export function CityDashboard() {
  const { cityViewId } = useParams<{ cityViewId: CityViewId }>()
  const navigate = useNavigate()
  const config = getCityView(cityViewId!)
  const city = CITY_DATA[config.cityId] ?? CITY_DATA['philly']
  const [activeTab, setActiveTab] = useState('activities')
  const [showCalc, setShowCalc] = useState(false)
  const [fxFlipped, setFxFlipped] = useState(false)
  const { record } = useItinerary(cityViewId!)

  const fxFrom = fxFlipped ? config.defaultCurrencyTo : config.defaultCurrencyFrom
  const fxTo   = fxFlipped ? config.defaultCurrencyFrom : config.defaultCurrencyTo
  const { rate, isOffline } = useExchangeRate(fxFrom, fxTo)
  const fxValue = rate === null ? '—' : rate >= 10 ? rate.toFixed(0) : rate >= 1 ? rate.toFixed(1) : rate.toFixed(2)
  const fxSub = isOffline ? `${fxTo} · cached` : `${fxTo} · live`

  const today = new Date().toISOString().slice(0, 10)

  // Clamp today to the city's itinerary date range so the dashboard
  // shows the first day before the trip starts and the last day after it ends.
  const sortedDates = record?.days.map(d => d.date).sort() ?? []
  const firstDate = sortedDates[0] ?? today
  const lastDate  = sortedDates[sortedDates.length - 1] ?? today
  const activeDate = today < firstDate ? firstDate : today > lastDate ? lastDate : today

  const { weather } = useDayWeather(config.cityId, activeDate)
  const weatherValue = weather ? `${weather.temp}°` : '—'
  const weatherSub = weather
    ? ({ sun: 'sunny', cloud: 'cloudy', partly: 'partly cloudy', rain: 'rainy' } as const)[weather.kind] ?? ''
    : ''

  const activeDayIndex = sortedDates.indexOf(activeDate)
  const activeDayLabel = activeDayIndex >= 0
    ? `DAY ${String(activeDayIndex + 1).padStart(2, '0')} / ${sortedDates.length}`
    : '—'
  const activeDayDate = new Date(activeDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })

  const todayDay = record?.days.find(d => d.date === activeDate)
  const todayItems = todayDay?.items ?? []
  const nowTime = new Date().toTimeString().slice(0, 5)
  const undoneItems = todayItems.filter(i => !i.done)
  const nextItem = undoneItems.find(i => i.time >= nowTime) ?? undoneItems[undoneItems.length - 1] ?? null
  const nextValue = nextItem ? nextItem.time : '—'
  const nextSub = nextItem ? (nextItem.name.length > 16 ? nextItem.name.slice(0, 16) + '…' : nextItem.name) : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-paper)', overflowY: 'auto' }}>

      {/* Header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 18px 0', flexShrink: 0,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em',
            color: 'var(--color-ink-soft)', minHeight: 44,
          }}
        >
          ← TRIP
        </button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--color-ink-soft)' }}>
          {activeDayLabel}
        </div>
        <button
          onClick={() => setShowCalc(true)}
          aria-label="Currency calculator"
          style={{ color: 'var(--color-ink)', minHeight: 44, minWidth: 44, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>
          </svg>
        </button>
      </div>

      {/* City title block */}
      <div style={{ padding: '14px 22px 14px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em', color: city.stampColor, fontWeight: 600 }}>
          {city.coords}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 4 }}>
          <div>
            <h1 style={{
              fontWeight: 500, fontSize: 56, lineHeight: 0.95,
              letterSpacing: '-0.03em', color: 'var(--color-ink)',
            }}>
              {config.label}.
            </h1>
            <div style={{ fontSize: 13, color: 'var(--color-ink-soft)', fontStyle: 'italic', marginTop: 8 }}>
              {city.tag}
            </div>
          </div>
          <Postmark color={city.stampColor} label={city.stampLabel} date={city.stampDate} />
        </div>
      </div>

      {/* Map doodle */}
      <div style={{ padding: '0 18px' }}>
        <div style={{
          height: 140, borderRadius: 12, overflow: 'hidden',
          border: '1px solid #1d1c1a', position: 'relative',
        }}>
          <MapDoodle city={city} />
          <button
            onClick={() => window.open(config.mapsUrl, '_blank')}
            style={{
              position: 'absolute', left: 10, bottom: 10,
              background: '#fbf7ee', padding: '6px 10px', borderRadius: 999,
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em',
              display: 'flex', alignItems: 'center', gap: 6,
              border: '1px solid #1d1c1a', color: '#1d1c1a',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>
            OPEN IN MAPS
          </button>
          {city.pins && (
            <div style={{
              position: 'absolute', right: 10, top: 10,
              background: city.stampColor, color: '#fbf7ee',
              padding: '4px 8px', borderRadius: 4,
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', fontWeight: 600,
            }}>
              {city.pins}
            </div>
          )}
        </div>
      </div>

      {/* Tab pills */}
      <div style={{ padding: '18px 18px 6px', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0 }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTab(t.id); navigate(`/${cityViewId}/${t.id}`) }}
            style={{
              padding: '7px 14px',
              borderRadius: 999,
              border: '1px solid #1d1c1a',
              background: activeTab === t.id ? '#1d1c1a' : 'transparent',
              color: activeTab === t.id ? '#f4ede1' : '#1d1c1a',
              fontSize: 13, fontWeight: 500,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Stub cards: Weather / FX / Next up */}
      <div style={{ padding: '12px 18px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <StubCard label="WEATHER" value={weatherValue} sub={weatherSub} />
        <button
          onClick={() => { navigator.vibrate?.(8); setFxFlipped(f => !f) }}
          style={{ all: 'unset', cursor: 'pointer', display: 'block' }}
        >
          <StubCard label={`1 ${fxFrom} =`} value={fxValue} sub={fxSub} highlight />
        </button>
        <StubCard label="NEXT UP" value={nextValue} sub={nextSub} />
      </div>

      {/* Today section */}
      <div style={{ padding: '20px 18px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em' }}>Today</div>
            {activeDayDate && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--color-ink-soft)', marginTop: 2 }}>
                {activeDayDate.toUpperCase()}
              </div>
            )}
          </div>
          <button
            onClick={() => navigate(`/${cityViewId}/itinerary`)}
            style={{ fontSize: 13, color: 'var(--color-stamp)', fontWeight: 500 }}
          >
            Edit →
          </button>
        </div>

        {todayItems.length === 0 && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-ink-faint)', textAlign: 'center', paddingTop: 16 }}>
            NOTHING PLANNED YET
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {todayItems.map(it => (
            <PlanRow
              key={it.id}
              time={it.time}
              name={it.name}
              loc={it.location}
              done={false}
              active={false}
            />
          ))}
        </div>

        {todayItems.length > 0 && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--color-ink-faint)', textAlign: 'center', marginTop: 16 }}>
            EDIT IN ITINERARY ↗
          </div>
        )}
      </div>

      {showCalc && <CalculatorOverlay cityViewId={cityViewId!} onClose={() => setShowCalc(false)} />}
    </div>
  )
}
