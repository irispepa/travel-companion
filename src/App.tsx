import { RouterProvider } from 'react-router-dom'
import { DbProvider } from './db/DbContext'
import { router } from './router'

export default function App() {
  return (
    <DbProvider>
      <RouterProvider router={router} />
    </DbProvider>
  )
}
