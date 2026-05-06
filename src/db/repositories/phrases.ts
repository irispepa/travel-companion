import { AppDB } from '../client'
import { CityId, PhrasesRecord } from '../schema'

export async function getPhrases(db: AppDB, cityId: CityId): Promise<PhrasesRecord | undefined> {
  return db.get('phrases', cityId)
}
