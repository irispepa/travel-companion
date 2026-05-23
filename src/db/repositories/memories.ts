import { AppDB } from '../client'
import { MemoryEntry, CityId } from '../schema'

export async function getMemories(db: AppDB, cityId: CityId): Promise<MemoryEntry[]> {
  const index = db.transaction('memories').store.index('byCityId')
  const entries = await index.getAll(cityId)
  return entries
    .map((e: any) => ({ ...e, kind: e.kind ?? 'photo' }) as MemoryEntry)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

export async function addMemory(db: AppDB, entry: MemoryEntry): Promise<void> {
  await db.put('memories', entry)
}

export async function deleteMemory(db: AppDB, id: string): Promise<void> {
  await db.delete('memories', id)
}
