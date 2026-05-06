import { ActivityItem } from '../../../db/schema'
import { ActivityDetail } from './ActivityDetail'

interface Props { item: ActivityItem; expanded: boolean; onToggle: () => void }

export function ActivityRow({ item, expanded, onToggle }: Props) {
  return (
    <div style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-sm)', overflow: 'hidden' }}>
      <button onClick={onToggle} style={{
        width: '100%', padding: 'var(--space-md)', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', textAlign: 'left'
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--color-cream)' }}>{item.name}</div>
          <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>{item.location}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--color-gold)', background: 'var(--color-bg)', borderRadius: 12, padding: '2px 8px' }}>
            {'★'.repeat(item.priority)}
          </span>
          <span style={{ color: 'var(--color-muted)', fontSize: 12 }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </button>
      {expanded && <ActivityDetail item={item} />}
    </div>
  )
}
