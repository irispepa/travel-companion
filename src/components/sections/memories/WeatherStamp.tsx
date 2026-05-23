interface Props {
  kind: 'sun' | 'cloud' | 'partly' | 'rain'
  temp: number
}

const GLYPHS: Record<Props['kind'], string> = {
  sun: '☀',
  cloud: '☁',
  partly: '⛅',
  rain: '🌧',
}

export function WeatherStamp({ kind, temp }: Props) {
  return (
    <div
      aria-label={`Weather: ${kind}, ${temp}°`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 6px',
        background: 'var(--color-paper-deep)',
        border: '1px solid var(--color-ink)',
        borderRadius: 3,
        boxShadow: '1px 1px 0 var(--color-ink)',
        transform: 'rotate(2deg)',
        opacity: 0.72,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--color-ink)',
        letterSpacing: '0.04em',
        flexShrink: 0,
      }}
    >
      <span>{GLYPHS[kind]}</span>
      <span>{temp}°</span>
    </div>
  )
}
