import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AddQuoteSheet } from '../../../src/components/sections/memories/add/AddQuoteSheet'
import { makeTestWrapper } from '../../helpers/testWrapper'

const defaultProps = {
  cityId: 'prague' as const,
  date: '2026-06-14',
  onClose: vi.fn(),
  onBack: vi.fn(),
}

async function renderAndWait(props = defaultProps) {
  const utils = render(<AddQuoteSheet {...props} />, { wrapper: makeTestWrapper() })
  // Wait for DB to initialise and loading state to clear
  await waitFor(() => screen.getByRole('textbox', { name: /quote text/i }), { timeout: 5000 })
  return utils
}

describe('AddQuoteSheet', () => {
  it('renders a quote textarea', async () => {
    await renderAndWait()
    expect(screen.getByRole('textbox', { name: /quote text/i })).toBeTruthy()
  })

  it('renders the formatted date context', async () => {
    await renderAndWait()
    expect(screen.getByText(/2026/)).toBeTruthy()
  })

  it('shows a character count', async () => {
    await renderAndWait()
    expect(screen.getByLabelText(/character count/i)).toBeTruthy()
  })

  it('PASTE IT IN button is disabled when text is empty', async () => {
    await renderAndWait()
    expect(screen.getByRole('button', { name: /paste it in/i }).getAttribute('disabled')).not.toBeNull()
  })

  it('PASTE IT IN button is enabled after typing', async () => {
    await renderAndWait()
    await userEvent.type(screen.getByRole('textbox', { name: /quote text/i }), 'We got lost.')
    expect(screen.getByRole('button', { name: /paste it in/i }).getAttribute('disabled')).toBeNull()
  })

  it('character count decreases as user types', async () => {
    await renderAndWait()
    const counter = screen.getByLabelText(/character count/i)
    expect(counter.textContent).toBe('80')
    await userEvent.type(screen.getByRole('textbox', { name: /quote text/i }), 'hi')
    expect(counter.textContent).toBe('78')
  })

  it('calls onClose after saving', async () => {
    const onClose = vi.fn()
    await renderAndWait({ ...defaultProps, onClose })
    await userEvent.type(screen.getByRole('textbox', { name: /quote text/i }), 'We got lost.')
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /paste it in/i }))
    })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders a ← back button that calls onBack', async () => {
    const onBack = vi.fn()
    await renderAndWait({ ...defaultProps, onBack })
    await userEvent.click(screen.getByRole('button', { name: /← back/i }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
