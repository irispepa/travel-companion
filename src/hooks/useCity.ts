import { useParams } from 'react-router-dom'
import { CityViewId, CityId } from '../db/schema'

const CITY_ID_MAP: Record<CityViewId, CityId> = {
  'philly-out': 'philly', 'philly-in': 'philly',
  'prague': 'prague', 'vienna': 'vienna', 'budapest': 'budapest'
}

export function useCity() {
  const { cityViewId } = useParams<{ cityViewId: CityViewId }>()
  const id = cityViewId as CityViewId
  return { cityViewId: id, cityId: CITY_ID_MAP[id] }
}
