import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AddMemorySheet } from '../../../src/components/sections/memories/AddMemorySheet'

const defaultProps = {
  cityId: 'prague' as const,
  date: '2026-05-22',
  onSave: vi.fn(),
  onClose: vi.fn(),
}

describe('AddMemorySheet', () => {
  it('renders a dialog with role="dialog" and aria-modal="true"', () => {
    render(<AddMemorySheet {...defaultProps} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeTruthy()
    expect(dialog.getAttribute('aria-modal')).toBe('true')
  })

  it('has aria-labelledby pointing to a heading', () => {
    render(<AddMemorySheet {...defaultProps} />)
    const dialog = screen.getByRole('dialog')
    const labelId = dialog.getAttribute('aria-labelledby')
    expect(labelId).toBeTruthy()
    const heading = document.getElementById(labelId!)
    expect(heading).toBeTruthy()
  })

  it('renders a grab handle', () => {
    render(<AddMemorySheet {...defaultProps} />)
    // The grab handle is a small div — verify it exists inside the dialog
    const dialog = screen.getByRole('dialog')
    expect(dialog.firstChild).toBeTruthy()
  })

  it('shows AddPickerSheet (picker step) by default', () => {
    render(<AddMemorySheet {...defaultProps} />)
    // Picker step shows "What did you capture?" heading
    expect(screen.getByText('What did you capture?')).toBeTruthy()
  })

  it('calls onClose when scrim is clicked', async () => {
    const onClose = vi.fn()
    const { container } = render(<AddMemorySheet {...defaultProps} onClose={onClose} />)
    // The scrim is the outermost fixed div (parent of dialog)
    const scrim = container.firstChild as HTMLElement
    await userEvent.click(scrim)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when dialog content is clicked', async () => {
    const onClose = vi.fn()
    render(<AddMemorySheet {...defaultProps} onClose={onClose} />)
    const dialog = screen.getByRole('dialog')
    await userEvent.click(dialog)
    expect(onClose).not.toHaveBeenCalled()
  })
})
