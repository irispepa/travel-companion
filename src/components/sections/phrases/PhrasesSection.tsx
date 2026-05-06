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
  const { categories } = usePhrases(config.cityId)
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 12px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 18 }}>What to Say</h2>
        {translateUrl && (
          <a href={translateUrl} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, color: 'var(--color-blue)' }}>
            Google Translate →
          </a>
        )}
      </div>
      <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search phrases..."
        style={{ width: '100%', background: 'var(--color-bg-card)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--color-cream)', fontSize: 14, marginBottom: 'var(--space-md)' }} />
      <CategoryTabs categories={categories.map(c => c.name)} active={activeCategory} onSelect={setActiveCategory} />
      {words.map((w, i) => <PhraseCard key={i} word={w} />)}
      {info.map((card, i) => <InfoCard key={i} title={card.title} body={card.body} />)}
      {showCalc && <CalculatorOverlay cityViewId={cityViewId!} onClose={() => setShowCalc(false)} />}
    </AppShell>
  )
}
