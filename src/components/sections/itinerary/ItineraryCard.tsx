import { ItineraryItem } from '../../../db/schema'
import { LinkChip } from './LinkChip'

interface Props { item: ItineraryItem; isPast: boolean; index?: number }

export function ItineraryCard({ item, isPast, index = 0 }: Props) {
  return (
    <div style={{
      background: 'var(--color-white)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-md)',
      marginBottom: 'var(--space-sm)',
      border: '1px solid var(--color-rule)',
      animation: 'fadeStagger 260ms var(--ease-out-expo) both',
      animationDelay: `${index * 40}ms`,
      opacity: isPast ? 0.55 : 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-xs)', gap: 'var(--space-sm)' }}>
        <span style={{
          fontSize: 'var(--text-title)',
          fontWeight: 600,
          color: 'var(--color-ink)',
          lineHeight: 'var(--leading-snug)',
          overflowWrap: 'break-word',
          minWidth: 0,
          flex: 1,
        }}>
          {item.name}
        </span>
        {item.time && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: isPast ? 'var(--color-ink-faint)' : 'var(--color-stamp)',
            letterSpacing: '0.04em',
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
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--color-ink-faint)',
          marginBottom: item.notes ? 'var(--space-xs)' : 0,
          letterSpacing: '0.04em',
        }}>
          {[item.duration, item.location].filter(Boolean).join(' · ')}
        </div>
      )}
      {item.notes && (
        <div style={{
          fontSize: 'var(--text-caption)',
          color: 'var(--color-ink-soft)',
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
