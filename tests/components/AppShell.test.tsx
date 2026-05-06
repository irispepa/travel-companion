import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { AppShell } from '../../src/components/layout/AppShell'

describe('AppShell', () => {
  it('renders city name in header', () => {
    render(
      <MemoryRouter>
        <AppShell cityLabel="Prague" showBack={false} onCalculator={() => {}}>
          <div>content</div>
        </AppShell>
      </MemoryRouter>
    )
    expect(screen.getByText('Prague')).toBeInTheDocument()
  })

  it('renders back button when showBack is true', () => {
    render(
      <MemoryRouter>
        <AppShell cityLabel="Prague" showBack={true} onCalculator={() => {}}>
          <div>content</div>
        </AppShell>
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
  })

  it('renders calculator icon button', () => {
    render(
      <MemoryRouter>
        <AppShell cityLabel="Prague" showBack={false} onCalculator={() => {}}>
          <div>content</div>
        </AppShell>
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: /calculator/i })).toBeInTheDocument()
  })
})
