import { AppDB } from '../client'
import { ExchangeRate } from '../schema'

export async function getCachedRate(db: AppDB, pair: string): Promise<ExchangeRate | undefined> {
  return db.get('exchangeRates', pair)
}

export async function setCachedRate(db: AppDB, rate: ExchangeRate): Promise<void> {
  await db.put('exchangeRates', rate)
}
