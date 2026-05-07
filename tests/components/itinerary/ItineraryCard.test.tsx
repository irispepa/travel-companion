import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ItineraryCard } from '../../../src/components/sections/itinerary/ItineraryCard'

const item = {
  id: '1', name: 'Prague Castle', time: '9:00', duration: '2h',
  location: 'Hradcany', notes: 'St. Vitus Cathedral',
  links: [{ label: 'Maps', url: 'https://maps.google.com' }]
}

const noop = vi.fn()
const props = { isEditing: false as const, onEdit: noop, onClose: noop, onUpdate: noop, onDelete: noop }

describe('ItineraryCard', () => {
  it('renders item name and time', () => {
    render(<ItineraryCard item={item} isPast={false} {...props} />)
    expect(screen.getByText('Prague Castle')).toBeInTheDocument()
    expect(screen.getByText('9:00')).toBeInTheDocument()
  })

  it('applies reduced opacity for past items', () => {
    const { container } = render(<ItineraryCard item={item} isPast={true} {...props} />)
    expect(container.firstChild).toHaveStyle({ opacity: '0.55' })
  })

  it('renders link indicator for items with links', () => {
    render(<ItineraryCard item={item} isPast={false} {...props} />)
    expect(screen.getByText('Prague Castle')).toBeInTheDocument()
  })
})
