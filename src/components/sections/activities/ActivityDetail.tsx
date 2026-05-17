import { ActivityItem } from '../../../db/schema'

interface Props { item: ActivityItem }

export function ActivityDetail({ item }: Props) {
  return (
    <div style={{
      padding: 'var(--space-sm) var(--space-md) var(--space-md)',
      borderTop: '1px solid var(--color-rule)',
    }}>
      {item.notes && (
        <p style={{
          fontSize: 'var(--text-body)',
          color: 'var(--color-ink-soft)',
          lineHeight: 'var(--leading-normal)',
          marginBottom: 'var(--space-sm)',
        }}>
          {item.notes}
        </p>
      )}
      <div style={{
        display: 'flex',
        gap: 'var(--space-lg)',
        fontSize: 'var(--text-caption)',
        color: 'var(--color-stamp)',
        letterSpacing: '0.04em',
      }}>
        {item.timeEstimate && <span>{item.timeEstimate}</span>}
        {item.cost && <span>{item.cost}</span>}
      </div>
      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: 'var(--space-sm)',
            fontSize: 'var(--text-caption)',
            color: 'var(--color-blue)',
          }}
        >
          More info →
        </a>
      )}
    </div>
  )
}
