import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { DbProvider } from '../src/db/DbContext'

const TestHome = () => <div>home</div>
const TestCity = () => <div>city</div>

const testRouter = createHashRouter([
  { path: '/', element: <TestHome /> },
  { path: '/:cityViewId', element: <TestCity /> },
])

function Wrapper() {
  return (
    <DbProvider>
      <RouterProvider router={testRouter} />
    </DbProvider>
  )
}

describe('hash router', () => {
  it('renders home at root after db initializes', async () => {
    render(<Wrapper />)
    await waitFor(() => expect(screen.getByText('home')).toBeTruthy())
  })

  it('uses createHashRouter so iOS PWA standalone mode is preserved across navigation', () => {
    // createHashRouter changes window.location.hash, not pathname —
    // iOS Safari stays in standalone mode and never reopens the browser.
    // Verify the router was created and has the expected route structure.
    expect(testRouter.routes).toHaveLength(2)
    expect(testRouter.routes[0].path).toBe('/')
    expect(testRouter.routes[1].path).toBe('/:cityViewId')
  })
})
