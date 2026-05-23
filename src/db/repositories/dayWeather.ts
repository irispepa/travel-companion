import { AppDB } from '../client'
import { DayWeather, CityId } from '../schema'

export async function getDayWeather(db: AppDB, cityId: CityId, date: string): Promise<DayWeather | undefined> {
  const index = db.transaction('dayWeather').store.index('byCityDate')
  const results = await index.getAll([cityId, date])
  return results[0]
}

export async function upsertDayWeather(db: AppDB, weather: DayWeather): Promise<void> {
  await db.put('dayWeather', weather)
}
