import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { CitySelector } from '../../src/components/layout/CitySelector'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate
}))

describe('CitySelector', () => {
  it('renders all 5 city view cards', () => {
    render(<MemoryRouter><CitySelector /></MemoryRouter>)
    expect(screen.getAllByRole('button')).toHaveLength(5)
  })

  it('navigates to city view on click', async () => {
    render(<MemoryRouter><CitySelector /></MemoryRouter>)
    await userEvent.click(screen.getByText('Prague'))
    expect(mockNavigate).toHaveBeenCalledWith('/prague')
  })
})
