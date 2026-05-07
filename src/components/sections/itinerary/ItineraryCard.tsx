import { ItineraryItem } from '../../../db/schema'
import { LinkChip } from './LinkChip'

interface Props { item: ItineraryItem; isPast: boolean; index?: number }

export function ItineraryCard({ item, isPast, index = 0 }: Props) {
  return (
    <div style={{
      background: 'var(--color-bg-card)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-md)',
      marginBottom: 'var(--space-sm)',
      animation: 'fadeStagger 260ms var(--ease-out-expo) both',
      animationDelay: `${index * 40}ms`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-xs)', gap: 'var(--space-sm)' }}>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-title)',
          color: isPast ? 'var(--color-muted)' : 'var(--color-cream)',
          lineHeight: 'var(--leading-snug)',
          overflowWrap: 'break-word',
          minWidth: 0,
          flex: 1,
        }}>
          {item.name}
        </span>
        {item.time && (
          <span style={{
            fontSize: 'var(--text-caption)',
            color: isPast ? 'var(--color-muted)' : 'var(--color-gold)',
            letterSpacing: '0.05em',
            flexShrink: 0,
            marginLeft: 'var(--space-sm)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {item.time}
          </span>
        )}
      </div>
      {(item.duration || item.location) && (
        <div style={{
          fontSize: 'var(--text-caption)',
          color: 'var(--color-muted)',
          marginBottom: item.notes ? 'var(--space-xs)' : 0,
        }}>
          {[item.duration, item.location].filter(Boolean).join(' · ')}
        </div>
      )}
      {item.notes && (
        <div style={{
          fontSize: 'var(--text-caption)',
          color: 'var(--color-muted)',
          lineHeight: 'var(--leading-normal)',
          marginTop: 'var(--space-xs)',
        }}>
          {item.notes}
        </div>
      )}
      {item.links.length > 0 && (
        <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: 'var(--space-sm)', flexWrap: 'wrap' }}>
          {item.links.map(l => <LinkChip key={l.url} label={l.label} url={l.url} />)}
        </div>
      )}
    </div>
  )
}
