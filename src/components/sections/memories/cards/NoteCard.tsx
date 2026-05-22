import { NoteMemory } from '../../../../db/schema'

interface Props {
  entry: NoteMemory
  width: number
}

export function NoteCard({ entry, width }: Props) {
  const bg = entry.tone === 'cream' ? '#f3e2c1' : 'var(--color-white)'
  const date = new Date(entry.timestamp)
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      aria-label={`Note by ${entry.author}: ${entry.body}`}
      style={{
        width,
        padding: '12px 14px 10px',
        background: bg,
        border: '1px solid var(--color-ink)',
        borderRadius: 4,
        boxShadow: '2px 3px 0 var(--color-ink)',
      }}
    >
      <p style={{
        fontFamily: 'var(--font-hand)',
        fontSize: 18,
        color: 'var(--color-ink)',
        lineHeight: 1.4,
        margin: 0,
        marginBottom: 8,
        wordBreak: 'break-word',
      }}>
        {entry.body}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 7,
          color: 'var(--color-ink-soft)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          — {entry.author}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 7,
          color: 'var(--color-ink-faint)',
          letterSpacing: '0.08em',
        }}>
          {timeStr}
        </span>
      </div>
    </div>
  )
}
