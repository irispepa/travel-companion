import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AddNoteSheet } from '../../../src/components/sections/memories/add/AddNoteSheet'

const defaultProps = {
  onSave: vi.fn(),
  onBack: vi.fn(),
}

describe('AddNoteSheet', () => {
  it('renders a textarea for the note body', () => {
    render(<AddNoteSheet {...defaultProps} />)
    expect(screen.getByRole('textbox', { name: /note body/i })).toBeTruthy()
  })

  it('renders author chips for Iris, Niko, and Both', () => {
    render(<AddNoteSheet {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Iris' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Niko' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Both' })).toBeTruthy()
  })

  it('Iris chip is selected by default', () => {
    render(<AddNoteSheet {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Iris' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Niko' }).getAttribute('aria-pressed')).toBe('false')
  })

  it('clicking Niko chip selects it', async () => {
    render(<AddNoteSheet {...defaultProps} />)
    await userEvent.click(screen.getByRole('button', { name: 'Niko' }))
    expect(screen.getByRole('button', { name: 'Niko' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Iris' }).getAttribute('aria-pressed')).toBe('false')
  })

  it('PASTE IT IN button is disabled when body is empty', () => {
    render(<AddNoteSheet {...defaultProps} />)
    expect(screen.getByRole('button', { name: /paste it in/i }).getAttribute('disabled')).not.toBeNull()
  })

  it('PASTE IT IN button is enabled after typing', async () => {
    render(<AddNoteSheet {...defaultProps} />)
    await userEvent.type(screen.getByRole('textbox', { name: /note body/i }), 'great day')
    expect(screen.getByRole('button', { name: /paste it in/i }).getAttribute('disabled')).toBeNull()
  })

  it('calls onSave with correct NoteMemory shape when submitted', async () => {
    const onSave = vi.fn()
    render(<AddNoteSheet {...defaultProps} onSave={onSave} />)
    await userEvent.type(screen.getByRole('textbox', { name: /note body/i }), 'a lovely afternoon')
    await userEvent.click(screen.getByRole('button', { name: /paste it in/i }))
    expect(onSave).toHaveBeenCalledTimes(1)
    const arg = onSave.mock.calls[0][0]
    expect(arg.kind).toBe('note')
    expect(arg.body).toBe('a lovely afternoon')
    expect(arg.author).toBe('Iris')
    expect(arg.timestamp).toBeTruthy()
  })

  it('calls onSave with selected author', async () => {
    const onSave = vi.fn()
    render(<AddNoteSheet {...defaultProps} onSave={onSave} />)
    await userEvent.click(screen.getByRole('button', { name: 'Niko' }))
    await userEvent.type(screen.getByRole('textbox', { name: /note body/i }), 'test note')
    await userEvent.click(screen.getByRole('button', { name: /paste it in/i }))
    expect(onSave.mock.calls[0][0].author).toBe('Niko')
  })

  it('renders a ← back button that calls onBack', async () => {
    const onBack = vi.fn()
    render(<AddNoteSheet {...defaultProps} onBack={onBack} />)
    await userEvent.click(screen.getByRole('button', { name: /← back/i }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
