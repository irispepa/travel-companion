import { describe, it, expect } from 'vitest'
import { searchPhrases, sortByFavorites } from '../../../src/components/sections/phrases/PhrasesSection'

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

describe('sortByFavorites', () => {
  const words = [
    { english: 'Hello', local: 'Ahoj', phonetic: 'ah-hoy' },
    { english: 'Thank you', local: 'Dekuji', phonetic: 'dyeh-koo-yee' },
    { english: 'Goodbye', local: 'Ahoj', phonetic: 'ah-hoy' },
  ]

  it('moves favorited words to the top', () => {
    const favorites = new Set(['Thank you'])
    const result = sortByFavorites(words, favorites)
    expect(result[0].english).toBe('Thank you')
    expect(result[1].english).toBe('Hello')
    expect(result[2].english).toBe('Goodbye')
  })

  it('preserves order when no favorites', () => {
    const result = sortByFavorites(words, new Set())
    expect(result.map(w => w.english)).toEqual(['Hello', 'Thank you', 'Goodbye'])
  })

  it('preserves relative order within favorites group', () => {
    const favorites = new Set(['Hello', 'Goodbye'])
    const result = sortByFavorites(words, favorites)
    expect(result[0].english).toBe('Hello')
    expect(result[1].english).toBe('Goodbye')
    expect(result[2].english).toBe('Thank you')
  })
})
