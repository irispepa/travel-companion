import { AppDB } from '../client'
import { CityViewId, CurrencyPref } from '../schema'

export async function getCurrencyPref(db: AppDB, cityViewId: CityViewId): Promise<CurrencyPref | undefined> {
  const prefs = await db.get('userPreferences', 'data')
  return prefs?.currencyPairs?.[cityViewId]
}

export async function setCurrencyPref(db: AppDB, cityViewId: CityViewId, pref: CurrencyPref): Promise<void> {
  const existing = await db.get('userPreferences', 'data') ?? { key: 'data', currencyPairs: {} }
  existing.currencyPairs[cityViewId] = pref
  await db.put('userPreferences', existing)
}
