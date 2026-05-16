import { AppDB } from '../client'

export async function getSeedVersion(db: AppDB): Promise<number> {
  const record = await db.get('appMeta', 'data')
  return record?.seedVersion ?? 0
}

export async function setSeedVersion(db: AppDB, version: number): Promise<void> {
  await db.put('appMeta', { key: 'data', initialized: true, seedVersion: version })
}
