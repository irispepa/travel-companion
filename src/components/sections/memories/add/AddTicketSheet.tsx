import { TicketMemory } from '../../../../db/schema'
type SaveArg = Omit<TicketMemory, 'id' | 'cityId'>
interface Props { onSave: (entry: SaveArg) => void; onBack: () => void }
export function AddTicketSheet({ onBack }: Props) {
  return <div><button onClick={onBack}>← back</button></div>
}
