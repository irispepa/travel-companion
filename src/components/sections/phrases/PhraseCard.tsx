import { PhraseWord } from '../../../db/schema'

interface Props { word: PhraseWord; index?: number }

export function PhraseCard({ word, index = 0 }: Props) {
  return (
    <div style={{
      background: 'var(--color-bg-card)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-md)',
      marginBottom: 'var(--space-sm)',
      animation: 'fadeStagger 260ms var(--ease-out-expo) both',
      animationDelay: `${index * 30}ms`,
    }}>
      <div style={{
        fontSize: 'var(--text-caption)',
        color: 'var(--color-muted)',
        marginBottom: 'var(--space-xs)',
        letterSpacing: '0.03em',
      }}>
        {word.english}
      </div>
      <div style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'var(--text-headline)',
        fontWeight: 400,
        color: 'var(--color-cream)',
        lineHeight: 'var(--leading-snug)',
        marginBottom: word.phonetic ? 'var(--space-xs)' : 0,
      }}>
        {word.local}
      </div>
      {word.phonetic && (
        <div style={{
          fontSize: 'var(--text-caption)',
          color: 'var(--color-gold)',
          fontStyle: 'italic',
          letterSpacing: '0.03em',
        }}>
          {word.phonetic}
        </div>
      )}
    </div>
  )
}
