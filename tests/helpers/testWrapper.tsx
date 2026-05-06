import React from 'react'
import { DbProvider } from '../../src/db/DbContext'
import { MemoryRouter } from 'react-router-dom'

export function makeTestWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter>
        <DbProvider>{children}</DbProvider>
      </MemoryRouter>
    )
  }
}
