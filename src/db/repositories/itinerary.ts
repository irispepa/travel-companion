import { AppDB } from '../client'
import { CityViewId, ItineraryRecord } from '../schema'

export async function getItinerary(db: AppDB, cityViewId: CityViewId): Promise<ItineraryRecord | undefined> {
  return db.get('itinerary', cityViewId)
}

export async function saveItinerary(db: AppDB, record: ItineraryRecord): Promise<void> {
  await db.put('itinerary', record)
}
