import { CityId } from '../../../../db/schema'
interface Props { cityId: CityId; date: string; onClose: () => void; onBack: () => void }
export function AddQuoteSheet({ onBack }: Props) {
  return <div><button onClick={onBack}>← back</button></div>
}
