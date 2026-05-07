import { PhraseWord } from '../../../db/schema'

interface Props { word: PhraseWord; index?: number }

export function PhraseCard({ word, index = 0 }: Props) {
  return (
    <div style={{
      background: 'var(--color-white)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-md)',
      marginBottom: 'var(--space-sm)',
      animation: 'fadeStagger 260ms var(--ease-out-expo) both',
      animationDelay: `${index * 30}ms`,
      border: '1px solid var(--color-rule)',
    }}>
      {/* Translation — small label sets context */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        fontWeight: 600,
        color: 'var(--color-ink-faint)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom: 6,
      }}>
        {word.english}
      </div>

      {/* Pronunciation — the hero: what you'll actually say */}
      {word.phonetic && (
        <div style={{
          fontSize: 22,
          fontWeight: 600,
          color: 'var(--color-ink)',
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
          marginBottom: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          <span style={{ color: 'var(--color-stamp)', opacity: 0.5, fontSize: 16, fontWeight: 400 }}>/</span>
          {word.phonetic}
          <span style={{ color: 'var(--color-stamp)', opacity: 0.5, fontSize: 16, fontWeight: 400 }}>/</span>
        </div>
      )}

      {/* Local spelling — secondary reference */}
      <div style={{
        fontSize: 13,
        fontStyle: 'italic',
        color: 'var(--color-ink-soft)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 8,
          fontStyle: 'normal',
          letterSpacing: '0.15em',
          color: 'var(--color-ink-faint)',
          textTransform: 'uppercase',
        }}>
          SPELT
        </span>
        {word.local}
      </div>
    </div>
  )
}
