import { ActivityItem } from '../../../db/schema'

interface Props { item: ActivityItem }

export function ActivityDetail({ item }: Props) {
  return (
    <div style={{ padding: '8px var(--space-md) var(--space-md)', borderTop: '1px solid var(--color-bg)' }}>
      {item.notes && <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 8 }}>{item.notes}</p>}
      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--color-gold)' }}>
        <span>⏱ {item.timeEstimate}</span>
        <span>💰 {item.cost}</span>
      </div>
      {item.link && (
        <a href={item.link} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-block', marginTop: 8, fontSize: 12, color: 'var(--color-blue)' }}>
          More info →
        </a>
      )}
    </div>
  )
}
