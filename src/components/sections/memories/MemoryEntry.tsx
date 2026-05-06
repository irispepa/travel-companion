import { MemoryEntry as MemoryEntryType } from '../../../db/schema'

interface Props { entry: MemoryEntryType; onDelete: (id: string) => void }

export function MemoryEntry({ entry, onDelete }: Props) {
  const date = new Date(entry.timestamp)
  return (
    <div style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <span style={{ fontSize: 13, color: 'var(--color-gold)', fontWeight: 600 }}>{entry.author}</span>
          {entry.location && <span style={{ fontSize: 11, color: 'var(--color-muted)', marginLeft: 8 }}>📍 {entry.location}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>
            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button onClick={() => onDelete(entry.id)} style={{ fontSize: 14, color: 'var(--color-muted)' }} aria-label="delete memory">×</button>
        </div>
      </div>
      {entry.photos.length > 0 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 8 }}>
          {entry.photos.map((src, i) => (
            <img key={i} src={src} alt="" style={{ height: 120, borderRadius: 'var(--radius-sm)', flexShrink: 0, objectFit: 'cover' }} />
          ))}
        </div>
      )}
      {entry.note && <p style={{ fontSize: 14, color: 'var(--color-cream)', lineHeight: 1.5 }}>{entry.note}</p>}
    </div>
  )
}
