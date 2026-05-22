import { FoodMemory } from '../../../../db/schema'
type SaveArg = Omit<FoodMemory, 'id' | 'cityId'>
interface Props { onSave: (entry: SaveArg) => void; onBack: () => void }
export function AddFoodSheet({ onBack }: Props) {
  return <div><button onClick={onBack}>← back</button></div>
}
