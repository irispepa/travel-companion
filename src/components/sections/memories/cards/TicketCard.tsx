import { TicketMemory } from '../../../../db/schema'

const HAND_CAPTION = 13

interface Props {
  entry: TicketMemory
  width: number
}

export function TicketCard({ entry, width }: Props) {
  return (
    <div
      aria-label={`Ticket: ${entry.from} to ${entry.to}`}
      style={{
        width,
        background: 'var(--color-paper-deep)',
        border: '1px solid var(--color-ink)',
        borderRadius: 4,
        boxShadow: '2px 2px 0 var(--color-ink)',
        padding: '8px 10px 0',
        position: 'relative',
      }}
    >
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 7,
        color: 'var(--color-ink-soft)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
      }}>
        TICKET
      </span>

      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        marginTop: 4,
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: 16,
        color: 'var(--color-ink)',
      }}>
        <span>{entry.from.toUpperCase()}</span>
        <span style={{ color: 'var(--color-stamp)', fontSize: 14 }}>→</span>
        <span>{entry.to.toUpperCase()}</span>
      </div>

      {(entry.date || entry.time || entry.line) && (
        <div style={{
          marginTop: 4,
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--color-ink-soft)',
          letterSpacing: '0.06em',
        }}>
          {[entry.date, entry.time, entry.line].filter(Boolean).join(' · ')}
        </div>
      )}

      {/* Perforation */}
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 22,
        borderTop: '1px dashed var(--color-ink-faint)',
      }} />

      <div style={{ height: 22 }} />

      {entry.caption && (
        <div style={{ padding: '0 0 8px', marginTop: -14 }}>
          <span style={{
            fontFamily: 'var(--font-hand)',
            fontSize: HAND_CAPTION,
            color: 'var(--color-ink)',
            opacity: 0.8,
            lineHeight: 1.2,
          }}>
            {entry.caption}
          </span>
        </div>
      )}
    </div>
  )
}
