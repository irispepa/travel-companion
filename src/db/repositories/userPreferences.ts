import { AppDB } from '../client'
import { CityViewId, CityId, CurrencyPref } from '../schema'

export async function getFavoritePhrases(db: AppDB, cityId: CityId): Promise<string[]> {
  const prefs = await db.get('userPreferences', 'data')
  return prefs?.favoritePhrases?.[cityId] ?? []
}

export async function toggleFavoritePhrase(db: AppDB, cityId: CityId, english: string): Promise<void> {
  const existing = await db.get('userPreferences', 'data') ?? { key: 'data', currencyPairs: {}, favoritePhrases: {} }
  const current = existing.favoritePhrases?.[cityId] ?? []
  const has = current.includes(english)
  existing.favoritePhrases = existing.favoritePhrases ?? {}
  existing.favoritePhrases[cityId] = has ? current.filter((e: string) => e !== english) : [...current, english]
  await db.put('userPreferences', existing)
}

export async function getCurrencyPref(db: AppDB, cityViewId: CityViewId): Promise<CurrencyPref | undefined> {
  const prefs = await db.get('userPreferences', 'data')
  return prefs?.currencyPairs?.[cityViewId]
}

export async function setCurrencyPref(db: AppDB, cityViewId: CityViewId, pref: CurrencyPref): Promise<void> {
  const existing = await db.get('userPreferences', 'data') ?? { key: 'data', currencyPairs: {}, favoritePhrases: {} }
  existing.currencyPairs[cityViewId] = pref
  await db.put('userPreferences', existing)
}
