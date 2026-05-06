import { ItineraryItem } from '../../../db/schema'
import { LinkChip } from './LinkChip'

interface Props { item: ItineraryItem; isPast: boolean }

export function ItineraryCard({ item, isPast }: Props) {
  return (
    <div style={{
      background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)',
      padding: 'var(--space-md)', marginBottom: 'var(--space-sm)',
      opacity: isPast ? 0.4 : 1
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 16 }}>{item.name}</span>
        <span style={{ fontSize: 12, color: 'var(--color-gold)' }}>{item.time}</span>
      </div>
      {item.duration && <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{item.duration} · {item.location}</div>}
      {item.notes && <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4 }}>{item.notes}</div>}
      {item.links.length > 0 && (
        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          {item.links.map(l => <LinkChip key={l.url} label={l.label} url={l.url} />)}
        </div>
      )}
    </div>
  )
}
