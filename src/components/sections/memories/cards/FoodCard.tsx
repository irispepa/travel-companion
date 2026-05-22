import { FoodMemory } from '../../../../db/schema'

const HAND_CARD_TITLE = 19
const HAND_CAPTION = 13

interface Props {
  entry: FoodMemory
  width: number
}

export function FoodCard({ entry, width }: Props) {
  return (
    <div
      aria-label={`Food memory: ${entry.dish}`}
      style={{
        width,
        background: 'var(--color-white)',
        border: '1px solid var(--color-ink)',
        borderRadius: 4,
        boxShadow: '2px 3px 0 var(--color-ink)',
        padding: '10px 12px 12px',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
      }}>
        <span style={{ fontSize: 12 }}>🍴</span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          fontWeight: 700,
          color: 'var(--color-stamp)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}>
          BEST THING WE ATE
        </span>
      </div>

      <div style={{
        height: 0,
        borderTop: '1px dashed var(--color-rule)',
        marginBottom: 8,
      }} />

      <p style={{
        fontFamily: 'var(--font-hand)',
        fontSize: HAND_CARD_TITLE,
        color: 'var(--color-ink)',
        margin: 0,
        marginBottom: 4,
        lineHeight: 1.2,
      }}>
        {entry.dish}
      </p>

      {entry.note && (
        <p style={{
          fontFamily: 'var(--font-hand)',
          fontSize: HAND_CAPTION,
          color: 'var(--color-ink-soft)',
          margin: 0,
          lineHeight: 1.3,
        }}>
          {entry.note}
        </p>
      )}
    </div>
  )
}
