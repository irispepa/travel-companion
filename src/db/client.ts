import { openDB, IDBPDatabase } from 'idb'

export type AppDB = IDBPDatabase

export async function openAppDB(): Promise<AppDB> {
  return openDB('trip-companion', 1, {
    upgrade(db) {
      db.createObjectStore('appMeta', { keyPath: 'key' })
      db.createObjectStore('userPreferences', { keyPath: 'key' })
      db.createObjectStore('itinerary', { keyPath: 'cityViewId' })
      db.createObjectStore('activities', { keyPath: 'cityId' })
      db.createObjectStore('phrases', { keyPath: 'cityId' })
      const memories = db.createObjectStore('memories', { keyPath: 'id' })
      memories.createIndex('byCityId', 'cityId')
      db.createObjectStore('exchangeRates', { keyPath: 'pair' })
    }
  })
}
