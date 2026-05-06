import { AppDB } from '../client'

export async function isInitialized(db: AppDB): Promise<boolean> {
  const record = await db.get('appMeta', 'data')
  return record?.initialized === true
}

export async function setInitialized(db: AppDB): Promise<void> {
  await db.put('appMeta', { key: 'data', initialized: true })
}
