import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AddFoodSheet } from '../../../src/components/sections/memories/add/AddFoodSheet'

const defaultProps = {
  onSave: vi.fn(),
  onBack: vi.fn(),
}

describe('AddFoodSheet', () => {
  it('renders dish and note fields', () => {
    render(<AddFoodSheet {...defaultProps} />)
    expect(screen.getByRole('textbox', { name: /dish name/i })).toBeTruthy()
    expect(screen.getByRole('textbox', { name: /food note/i })).toBeTruthy()
  })

  it('renders author chips for Iris, Niko, and Both', () => {
    render(<AddFoodSheet {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Iris' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Niko' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Both' })).toBeTruthy()
  })

  it('Iris chip is selected by default', () => {
    render(<AddFoodSheet {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Iris' }).getAttribute('aria-pressed')).toBe('true')
  })

  it('clicking an author chip selects it', async () => {
    render(<AddFoodSheet {...defaultProps} />)
    await userEvent.click(screen.getByRole('button', { name: 'Both' }))
    expect(screen.getByRole('button', { name: 'Both' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Iris' }).getAttribute('aria-pressed')).toBe('false')
  })

  it('PASTE IT IN button is disabled when dish is empty', () => {
    render(<AddFoodSheet {...defaultProps} />)
    expect(screen.getByRole('button', { name: /paste it in/i }).getAttribute('disabled')).not.toBeNull()
  })

  it('PASTE IT IN button is enabled after typing dish name', async () => {
    render(<AddFoodSheet {...defaultProps} />)
    await userEvent.type(screen.getByRole('textbox', { name: /dish name/i }), 'Svíčková')
    expect(screen.getByRole('button', { name: /paste it in/i }).getAttribute('disabled')).toBeNull()
  })

  it('renders a live FoodCard preview', () => {
    render(<AddFoodSheet {...defaultProps} />)
    // FoodCard renders "BEST THING WE ATE" — verify it's present (may appear more than once due to header + preview)
    expect(screen.getAllByText('BEST THING WE ATE').length).toBeGreaterThanOrEqual(1)
  })

  it('FoodCard preview updates as user types the dish name', async () => {
    render(<AddFoodSheet {...defaultProps} />)
    await userEvent.type(screen.getByRole('textbox', { name: /dish name/i }), 'Trdelník')
    expect(screen.getByLabelText(/food memory: trdelník/i)).toBeTruthy()
  })

  it('calls onSave with correct FoodMemory shape', async () => {
    const onSave = vi.fn()
    render(<AddFoodSheet {...defaultProps} onSave={onSave} />)
    await userEvent.type(screen.getByRole('textbox', { name: /dish name/i }), 'Svíčková')
    await userEvent.type(screen.getByRole('textbox', { name: /food note/i }), 'creamy and perfect')
    await userEvent.click(screen.getByRole('button', { name: /paste it in/i }))
    expect(onSave).toHaveBeenCalledTimes(1)
    const arg = onSave.mock.calls[0][0]
    expect(arg.kind).toBe('food')
    expect(arg.dish).toBe('Svíčková')
    expect(arg.note).toBe('creamy and perfect')
    expect(arg.author).toBe('Iris')
    expect(arg.timestamp).toBeTruthy()
  })

  it('saves with selected author', async () => {
    const onSave = vi.fn()
    render(<AddFoodSheet {...defaultProps} onSave={onSave} />)
    await userEvent.click(screen.getByRole('button', { name: 'Niko' }))
    await userEvent.type(screen.getByRole('textbox', { name: /dish name/i }), 'Goulash')
    await userEvent.click(screen.getByRole('button', { name: /paste it in/i }))
    expect(onSave.mock.calls[0][0].author).toBe('Niko')
  })

  it('renders a ← back button that calls onBack', async () => {
    const onBack = vi.fn()
    render(<AddFoodSheet {...defaultProps} onBack={onBack} />)
    await userEvent.click(screen.getByRole('button', { name: /← back/i }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
