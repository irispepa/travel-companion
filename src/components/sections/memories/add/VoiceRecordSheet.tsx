import { VoiceMemory } from '../../../../db/schema'
type SaveArg = Omit<VoiceMemory, 'id' | 'cityId'>
interface Props { onSave: (entry: SaveArg) => void; onBack: () => void }
export function VoiceRecordSheet({ onBack }: Props) {
  return <div><button onClick={onBack}>← back</button></div>
}
