import { AppDB } from '../client'
import { CityId, ActivitiesRecord } from '../schema'

export async function getActivities(db: AppDB, cityId: CityId): Promise<ActivitiesRecord | undefined> {
  return db.get('activities', cityId)
}
