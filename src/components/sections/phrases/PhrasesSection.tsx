import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CityViewId, PhraseCategory } from '../../../db/schema'
import { getCityView } from '../../../config/cities'
import { usePhrases } from '../../../hooks/usePhrases'
import { AppShell } from '../../layout/AppShell'
import { CalculatorOverlay } from '../../calculator/CalculatorOverlay'
import { CategoryTabs } from './CategoryTabs'
import { PhraseCard } from './PhraseCard'
import { InfoCard } from './InfoCard'
import { SkeletonList } from '../../layout/SkeletonList'

export function searchPhrases(categories: PhraseCategory[], query: string) {
  const q = query.toLowerCase()
  if (!q) return {
    words: categories.flatMap(c => c.words),
    info: categories.flatMap(c => c.info)
  }
  return {
    words: categories.flatMap(c => c.words).filter(w =>
      w.english.toLowerCase().includes(q) || w.local.toLowerCase().includes(q) || w.phonetic?.toLowerCase().includes(q)
    ),
    info: categories.flatMap(c => c.info).filter(i =>
      i.title.toLowerCase().includes(q) || i.body.toLowerCase().includes(q)
    )
  }
}

export function PhrasesSection() {
  const { cityViewId } = useParams<{ cityViewId: CityViewId }>()
  const config = getCityView(cityViewId!)
  const { categories, loading } = usePhrases(config.cityId)
  const [activeCategory, setActiveCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCalc, setShowCalc] = useState(false)

  const filtered = activeCategory
    ? categories.filter(c => c.name === activeCategory)
    : categories

  const { words, info } = searchPhrases(filtered, searchQuery)

  const translateUrl = config.translateFrom && config.translateTo
    ? `https://translate.google.com/?sl=${config.translateFrom}&tl=${config.translateTo}&op=translate`
    : null

  return (
    <AppShell cityLabel={config.label} showBack={true} onCalculator={() => setShowCalc(true)}>
      <div style={{ padding: 'var(--space-lg) var(--space-md) var(--space-3xl)', background: 'var(--color-paper)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 'var(--space-md)',
        }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--color-stamp)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}>
              {config.label}
            </p>
            <h2 style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--color-ink)',
              letterSpacing: '-0.01em',
            }}>
              What to Say
            </h2>
          </div>
          {translateUrl && (
            <a
              href={translateUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--color-ink-blue)',
                letterSpacing: '0.06em',
              }}
            >
              Translate →
            </a>
          )}
        </div>

        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search phrases…"
          aria-label="Search phrases"
          style={{
            width: '100%',
            background: 'var(--color-white)',
            border: '1px solid var(--color-rule)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            color: 'var(--color-ink)',
            fontSize: 'var(--text-body)',
            marginBottom: 'var(--space-md)',
          }}
        />

        <CategoryTabs
          categories={categories.map(c => c.name)}
          active={activeCategory}
          onSelect={setActiveCategory}
        />

        {loading && <SkeletonList rows={6} rowHeight={72} />}
        {!loading && words.length === 0 && info.length === 0 && (
          <p style={{ color: 'var(--color-ink-faint)', fontSize: 'var(--text-body)', textAlign: 'center', paddingTop: 'var(--space-xl)' }}>
            No phrases found
          </p>
        )}
        {!loading && words.map((w, idx) => <PhraseCard key={w.english} word={w} index={idx} />)}
        {!loading && info.map(card => <InfoCard key={card.title} title={card.title} body={card.body} />)}
      </div>
      {showCalc && <CalculatorOverlay cityViewId={cityViewId!} onClose={() => setShowCalc(false)} />}
    </AppShell>
  )
}
