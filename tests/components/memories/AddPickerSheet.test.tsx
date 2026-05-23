import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AddPickerSheet } from '../../../src/components/sections/memories/add/AddPickerSheet'

const defaultProps = {
  onSelect: vi.fn(),
  onClose: vi.fn(),
  onPhotoSelected: vi.fn(),
}

describe('AddPickerSheet', () => {
  it('renders six tile buttons', () => {
    render(<AddPickerSheet {...defaultProps} />)
    const buttons = screen.getAllByRole('button')
    // 6 tile buttons + 1 back button
    expect(buttons.length).toBeGreaterThanOrEqual(6)
  })

  it('renders tile labels for all six memory types', () => {
    render(<AddPickerSheet {...defaultProps} />)
    expect(screen.getByText('Photo')).toBeTruthy()
    expect(screen.getByText('Note')).toBeTruthy()
    expect(screen.getByText('Best thing ate')).toBeTruthy()
    expect(screen.getByText('Voice memo')).toBeTruthy()
    expect(screen.getByText('Ticket')).toBeTruthy()
    expect(screen.getByText('Line of the day')).toBeTruthy()
  })

  it('clicking Note tile calls onSelect with "note"', async () => {
    const onSelect = vi.fn()
    render(<AddPickerSheet {...defaultProps} onSelect={onSelect} />)
    await userEvent.click(screen.getByText('Note'))
    expect(onSelect).toHaveBeenCalledWith('note')
  })

  it('clicking Ticket tile calls onSelect with "ticket"', async () => {
    const onSelect = vi.fn()
    render(<AddPickerSheet {...defaultProps} onSelect={onSelect} />)
    await userEvent.click(screen.getByText('Ticket'))
    expect(onSelect).toHaveBeenCalledWith('ticket')
  })

  it('clicking Voice memo tile calls onSelect with "voice"', async () => {
    const onSelect = vi.fn()
    render(<AddPickerSheet {...defaultProps} onSelect={onSelect} />)
    await userEvent.click(screen.getByText('Voice memo'))
    expect(onSelect).toHaveBeenCalledWith('voice')
  })

  it('clicking Line of the day tile calls onSelect with "quote"', async () => {
    const onSelect = vi.fn()
    render(<AddPickerSheet {...defaultProps} onSelect={onSelect} />)
    await userEvent.click(screen.getByText('Line of the day'))
    expect(onSelect).toHaveBeenCalledWith('quote')
  })

  it('clicking Best thing ate tile calls onSelect with "food"', async () => {
    const onSelect = vi.fn()
    render(<AddPickerSheet {...defaultProps} onSelect={onSelect} />)
    await userEvent.click(screen.getByText('Best thing ate'))
    expect(onSelect).toHaveBeenCalledWith('food')
  })

  it('clicking ← back calls onClose', async () => {
    const onClose = vi.fn()
    render(<AddPickerSheet {...defaultProps} onClose={onClose} />)
    await userEvent.click(screen.getByText('← back'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
