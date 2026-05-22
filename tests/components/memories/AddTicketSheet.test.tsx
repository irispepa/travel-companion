import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AddTicketSheet } from '../../../src/components/sections/memories/add/AddTicketSheet'

const defaultProps = {
  onSave: vi.fn(),
  onBack: vi.fn(),
}

describe('AddTicketSheet', () => {
  it('renders FROM and TO fields', () => {
    render(<AddTicketSheet {...defaultProps} />)
    expect(screen.getByRole('textbox', { name: /^from$/i })).toBeTruthy()
    expect(screen.getByRole('textbox', { name: /^to$/i })).toBeTruthy()
  })

  it('renders DATE, TIME, LINE, and CAPTION fields', () => {
    render(<AddTicketSheet {...defaultProps} />)
    expect(screen.getByRole('textbox', { name: /^date$/i })).toBeTruthy()
    expect(screen.getByRole('textbox', { name: /^time$/i })).toBeTruthy()
    expect(screen.getByRole('textbox', { name: /^line$/i })).toBeTruthy()
    expect(screen.getByRole('textbox', { name: /^caption$/i })).toBeTruthy()
  })

  it('renders author chips for Iris, Niko, and Both', () => {
    render(<AddTicketSheet {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Iris' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Niko' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Both' })).toBeTruthy()
  })

  it('Iris chip is selected by default', () => {
    render(<AddTicketSheet {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Iris' }).getAttribute('aria-pressed')).toBe('true')
  })

  it('clicking an author chip selects it', async () => {
    render(<AddTicketSheet {...defaultProps} />)
    await userEvent.click(screen.getByRole('button', { name: 'Niko' }))
    expect(screen.getByRole('button', { name: 'Niko' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Iris' }).getAttribute('aria-pressed')).toBe('false')
  })

  it('PASTE IT IN button is disabled when FROM or TO is empty', () => {
    render(<AddTicketSheet {...defaultProps} />)
    expect(screen.getByRole('button', { name: /paste it in/i }).getAttribute('disabled')).not.toBeNull()
  })

  it('PASTE IT IN button is disabled when only FROM is filled', async () => {
    render(<AddTicketSheet {...defaultProps} />)
    await userEvent.type(screen.getByRole('textbox', { name: /^from$/i }), 'PRG')
    expect(screen.getByRole('button', { name: /paste it in/i }).getAttribute('disabled')).not.toBeNull()
  })

  it('PASTE IT IN button is enabled when FROM and TO are filled', async () => {
    render(<AddTicketSheet {...defaultProps} />)
    await userEvent.type(screen.getByRole('textbox', { name: /^from$/i }), 'PRG')
    await userEvent.type(screen.getByRole('textbox', { name: /^to$/i }), 'VIE')
    expect(screen.getByRole('button', { name: /paste it in/i }).getAttribute('disabled')).toBeNull()
  })

  it('calls onSave with correct TicketMemory shape', async () => {
    const onSave = vi.fn()
    render(<AddTicketSheet {...defaultProps} onSave={onSave} />)
    await userEvent.type(screen.getByRole('textbox', { name: /^from$/i }), 'PRG')
    await userEvent.type(screen.getByRole('textbox', { name: /^to$/i }), 'VIE')
    await userEvent.type(screen.getByRole('textbox', { name: /^date$/i }), 'May 25')
    await userEvent.type(screen.getByRole('textbox', { name: /^time$/i }), '08:42')
    await userEvent.click(screen.getByRole('button', { name: /paste it in/i }))
    expect(onSave).toHaveBeenCalledTimes(1)
    const arg = onSave.mock.calls[0][0]
    expect(arg.kind).toBe('ticket')
    expect(arg.from).toBe('PRG')
    expect(arg.to).toBe('VIE')
    expect(arg.date).toBe('May 25')
    expect(arg.time).toBe('08:42')
    expect(arg.author).toBe('Iris')
    expect(arg.timestamp).toBeTruthy()
  })

  it('includes optional line and caption when filled', async () => {
    const onSave = vi.fn()
    render(<AddTicketSheet {...defaultProps} onSave={onSave} />)
    await userEvent.type(screen.getByRole('textbox', { name: /^from$/i }), 'PRG')
    await userEvent.type(screen.getByRole('textbox', { name: /^to$/i }), 'VIE')
    await userEvent.type(screen.getByRole('textbox', { name: /^line$/i }), 'EC 173')
    await userEvent.type(screen.getByRole('textbox', { name: /^caption$/i }), 'what a ride')
    await userEvent.click(screen.getByRole('button', { name: /paste it in/i }))
    const arg = onSave.mock.calls[0][0]
    expect(arg.line).toBe('EC 173')
    expect(arg.caption).toBe('what a ride')
  })

  it('omits line and caption when not filled', async () => {
    const onSave = vi.fn()
    render(<AddTicketSheet {...defaultProps} onSave={onSave} />)
    await userEvent.type(screen.getByRole('textbox', { name: /^from$/i }), 'PRG')
    await userEvent.type(screen.getByRole('textbox', { name: /^to$/i }), 'VIE')
    await userEvent.click(screen.getByRole('button', { name: /paste it in/i }))
    const arg = onSave.mock.calls[0][0]
    expect(arg.line).toBeUndefined()
    expect(arg.caption).toBeUndefined()
  })

  it('renders a ← back button that calls onBack', async () => {
    const onBack = vi.fn()
    render(<AddTicketSheet {...defaultProps} onBack={onBack} />)
    await userEvent.click(screen.getByRole('button', { name: /← back/i }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
