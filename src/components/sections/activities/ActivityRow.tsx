import { ActivityItem } from '../../../db/schema'
import { ActivityDetail } from './ActivityDetail'

interface Props { item: ActivityItem; expanded: boolean; onToggle: () => void; index?: number }

export function ActivityRow({ item, expanded, onToggle, index = 0 }: Props) {
  const stars = item.priority > 0 ? '★'.repeat(Math.min(item.priority, 5)) : null
  return (
    <div style={{
      background: 'var(--color-white)',
      borderRadius: 'var(--radius-md)',
      marginBottom: 'var(--space-sm)',
      overflow: 'hidden',
      border: '1px solid var(--color-rule)',
      animation: 'fadeStagger 260ms var(--ease-out-expo) both',
      animationDelay: `${index * 40}ms`,
    }}>
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        style={{
          width: '100%',
          padding: 'var(--space-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'left',
          minHeight: 56,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 'var(--text-title)',
            fontWeight: 600,
            color: 'var(--color-ink)',
            lineHeight: 'var(--leading-snug)',
            overflowWrap: 'break-word',
          }}>
            {item.name}
          </div>
          {item.location && (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--color-ink-faint)',
              marginTop: 3,
              letterSpacing: '0.04em',
            }}>
              {item.location}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexShrink: 0, marginLeft: 'var(--space-sm)' }}>
          {stars && (
            <span style={{
              fontSize: 10,
              color: 'var(--color-stamp)',
              letterSpacing: '0.05em',
            }}>
              {stars}
            </span>
          )}
          <span style={{
            color: 'var(--color-ink-faint)',
            fontSize: 10,
            transition: `transform var(--duration-fast) var(--ease-out-expo)`,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            display: 'inline-block',
          }}>
            ▼
          </span>
        </div>
      </button>
      {expanded && (
        <div style={{ animation: 'fadeStagger 200ms var(--ease-out-expo) both' }}>
          <ActivityDetail item={item} />
        </div>
      )}
    </div>
  )
}
