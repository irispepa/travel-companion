import { AppDB } from '../client'
import { CityId, ActivitiesRecord, ActivityItem } from '../schema'

export async function getActivities(db: AppDB, cityId: CityId): Promise<ActivitiesRecord | undefined> {
  return db.get('activities', cityId)
}

export async function saveActivities(db: AppDB, cityId: CityId, items: ActivityItem[]): Promise<void> {
  const existing = await db.get('activities', cityId)
  if (existing) {
    await db.put('activities', { ...existing, items })
  } else {
    await db.put('activities', { cityId, items })
  }
}
