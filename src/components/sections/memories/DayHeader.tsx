import { WeatherStamp } from './WeatherStamp'
import { LineOfDay } from './LineOfDay'
import { DayWeather } from '../../../db/schema'

interface Props {
  date: string
  itemCount: number
  weather?: DayWeather
  lineText: string
  onSaveLine: (text: string) => void
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  const day = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const num = d.getDate()
  return `${day} · ${month} ${num}`
}

export function DayHeader({ date, itemCount, weather, lineText, onSaveLine }: Props) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 5,
        background: 'var(--color-paper)',
        paddingTop: 'var(--space-md)',
        paddingBottom: 'var(--space-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '3px 8px',
            background: 'var(--color-stamp)',
            borderRadius: 3,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--color-white)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            flexShrink: 0,
          }}
        >
          {formatDateLabel(date)}
        </div>

        <div
          aria-hidden
          style={{
            flex: 1,
            height: 0,
            borderTop: '1px dashed var(--color-rule)',
          }}
        />

        {weather && <WeatherStamp kind={weather.kind} temp={weather.temp} />}

        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--color-ink-faint)',
            letterSpacing: '0.08em',
            flexShrink: 0,
          }}
        >
          {itemCount}
        </span>
      </div>

      <div style={{ marginTop: 'var(--space-sm)', paddingLeft: 2 }}>
        <LineOfDay text={lineText} onSave={onSaveLine} />
      </div>
    </div>
  )
}
