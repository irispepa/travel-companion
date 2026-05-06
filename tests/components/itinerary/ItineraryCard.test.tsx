import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ItineraryCard } from '../../../src/components/sections/itinerary/ItineraryCard'

const item = {
  id: '1', name: 'Prague Castle', time: '9:00', duration: '2h',
  location: 'Hradcany', notes: 'St. Vitus Cathedral',
  links: [{ label: 'Maps', url: 'https://maps.google.com' }]
}

describe('ItineraryCard', () => {
  it('renders item name and time', () => {
    render(<ItineraryCard item={item} isPast={false} />)
    expect(screen.getByText('Prague Castle')).toBeInTheDocument()
    expect(screen.getByText('9:00')).toBeInTheDocument()
  })

  it('applies reduced opacity for past items', () => {
    const { container } = render(<ItineraryCard item={item} isPast={true} />)
    expect(container.firstChild).toHaveStyle({ opacity: '0.4' })
  })

  it('renders link chips', () => {
    render(<ItineraryCard item={item} isPast={false} />)
    expect(screen.getByText('Maps')).toBeInTheDocument()
  })
})
