import { describe, it, expect } from 'vitest'
import { searchPhrases } from '../../../src/components/sections/phrases/PhrasesSection'

const categories = [
  { name: 'Basic', words: [{ english: 'Thank you', local: 'Dekuji', phonetic: 'dyeh-koo-yee' }], info: [{ title: 'Tipping', body: '10% is standard' }] },
  { name: 'Food', words: [{ english: 'Water', local: 'Voda', phonetic: 'vo-da' }], info: [] }
]

describe('searchPhrases', () => {
  it('returns matching words across all categories', () => {
    const results = searchPhrases(categories, 'thank')
    expect(results.words).toHaveLength(1)
    expect(results.words[0].english).toBe('Thank you')
  })

  it('returns matching info cards', () => {
    const results = searchPhrases(categories, 'tipping')
    expect(results.info).toHaveLength(1)
  })

  it('returns all when query is empty', () => {
    const results = searchPhrases(categories, '')
    expect(results.words).toHaveLength(2)
  })
})
