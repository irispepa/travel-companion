import { AppDB } from '../client'
import { LineOfDay, CityId } from '../schema'

export async function getLineOfDay(db: AppDB, cityId: CityId, date: string): Promise<LineOfDay | undefined> {
  const index = db.transaction('linesOfDay').store.index('byCityDate')
  const results = await index.getAll([cityId, date])
  return results[0]
}

export async function upsertLineOfDay(db: AppDB, line: LineOfDay): Promise<void> {
  await db.put('linesOfDay', line)
}
