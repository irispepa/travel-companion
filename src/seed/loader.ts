import { AppDB } from '../db/client'
import { isInitialized, setInitialized } from '../db/repositories/appMeta'
import seed from '../data/seed.json'

export async function loadSeedIfNeeded(db: AppDB): Promise<void> {
  if (await isInitialized(db)) return

  const tx = db.transaction(['itinerary', 'activities', 'phrases'], 'readwrite')
  for (const record of Object.values(seed.itinerary)) {
    await tx.objectStore('itinerary').put(record)
  }
  for (const record of Object.values(seed.activities)) {
    await tx.objectStore('activities').put(record)
  }
  for (const record of Object.values(seed.phrases)) {
    await tx.objectStore('phrases').put(record)
  }
  await tx.done

  await setInitialized(db)
}
