import { PhotoMemory } from '../../../../db/schema'
type SaveArg = Omit<PhotoMemory, 'id' | 'cityId'>
interface Props { src: string; onSave: (entry: SaveArg) => void; onBack: () => void }
export function AddPhotoSheet({ onBack }: Props) {
  return <div><button onClick={onBack}>← back</button></div>
}
