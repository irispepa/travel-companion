import { createHashRouter, Outlet } from 'react-router-dom'
import { CitySelector } from './components/layout/CitySelector'
import { CityDashboard } from './components/layout/CityDashboard'
import { ItinerarySection } from './components/sections/itinerary/ItinerarySection'
import { ActivitiesSection } from './components/sections/activities/ActivitiesSection'
import { PhrasesSection } from './components/sections/phrases/PhrasesSection'
import { MemoriesSection } from './components/sections/memories/MemoriesSection'
import { PageTransition } from './components/layout/PageTransition'

function Root() {
  return (
    <PageTransition>
      <Outlet />
    </PageTransition>
  )
}

export const router = createHashRouter([
  {
    element: <Root />,
    children: [
      { path: '/', element: <CitySelector /> },
      { path: '/:cityViewId', element: <CityDashboard /> },
      { path: '/:cityViewId/itinerary', element: <ItinerarySection /> },
      { path: '/:cityViewId/activities', element: <ActivitiesSection /> },
      { path: '/:cityViewId/phrases', element: <PhrasesSection /> },
      { path: '/:cityViewId/memories', element: <MemoriesSection /> },
    ]
  }
])
