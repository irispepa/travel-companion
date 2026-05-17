import { PhraseWord } from '../../../db/schema'

interface Props {
  word: PhraseWord
  isFirst?: boolean
  isFavorite: boolean
  onToggle: () => void
}

function StarFilled() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>
    </svg>
  )
}

function StarEmpty() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>
    </svg>
  )
}

export function PhraseRow({ word, isFirst = false, isFavorite, onToggle }: Props) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '18px 4px 16px',
      borderTop: isFirst ? 'none' : '1px solid var(--color-rule)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* English label */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
          letterSpacing: '0.18em', color: 'var(--color-ink-soft)',
          textTransform: 'uppercase',
        }}>
          {word.english}
        </div>

        {/* Pronunciation — hero */}
        {word.phonetic && (
          <div style={{
            marginTop: 6,
            fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 600,
            color: 'var(--color-ink)', letterSpacing: '-0.015em', lineHeight: 1.05,
            display: 'flex', alignItems: 'baseline', gap: 2,
          }}>
            <span style={{ color: 'var(--color-stamp)', fontWeight: 500, fontSize: 22 }}>/</span>
            <span>{word.phonetic}</span>
            <span style={{ color: 'var(--color-stamp)', fontWeight: 500, fontSize: 22 }}>/</span>
          </div>
        )}

        {/* Local spelling */}
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-ink-faint)',
            letterSpacing: '0.18em', fontWeight: 600, textTransform: 'uppercase',
          }}>
            SPELT
          </span>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 500,
            color: 'var(--color-ink)', fontStyle: 'italic', letterSpacing: '-0.01em',
          }}>
            {word.local}
          </span>
        </div>
      </div>

      <button
        onClick={onToggle}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 44,
          minHeight: 44,
          color: isFavorite ? 'var(--color-stamp)' : 'var(--color-ink-faint)',
          flexShrink: 0,
        }}
      >
        {isFavorite ? <StarFilled /> : <StarEmpty />}
      </button>
    </div>
  )
}
