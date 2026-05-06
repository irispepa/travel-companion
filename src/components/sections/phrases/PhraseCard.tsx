import { PhraseWord } from '../../../db/schema'

interface Props { word: PhraseWord }

export function PhraseCard({ word }: Props) {
  return (
    <div style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
      <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 4 }}>{word.english}</div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--color-cream)', marginBottom: 4 }}>{word.local}</div>
      {word.phonetic && <div style={{ fontSize: 12, color: 'var(--color-gold)', fontStyle: 'italic' }}>{word.phonetic}</div>}
    </div>
  )
}
