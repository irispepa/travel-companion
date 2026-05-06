import { useState } from 'react'

interface Props { embedUrl: string; cityLabel: string }

export function CityMap({ embedUrl, cityLabel }: Props) {
  const [failed, setFailed] = useState(false)

  if (failed || !navigator.onLine) {
    return (
      <div style={{
        background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)',
        height: 180, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 8,
        color: 'var(--color-muted)'
      }}>
        <span style={{ fontSize: 24 }}>📍</span>
        <span style={{ fontSize: 13 }}>{cityLabel}</span>
        <span style={{ fontSize: 11 }}>Map unavailable offline</span>
      </div>
    )
  }

  return (
    <iframe
      src={embedUrl}
      style={{ width: '100%', height: 180, border: 'none', borderRadius: 'var(--radius-md)' }}
      onError={() => setFailed(true)}
      loading="lazy"
      title={`Map of ${cityLabel}`}
    />
  )
}
