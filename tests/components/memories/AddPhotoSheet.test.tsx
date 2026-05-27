import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AddPhotoSheet } from '../../../src/components/sections/memories/add/AddPhotoSheet'

const SRC = 'data:image/png;base64,abc123'

const defaultProps = {
  src: SRC,
  onSave: vi.fn(),
  onClose: vi.fn(),
  onBack: vi.fn(),
}

describe('AddPhotoSheet', () => {
  it('renders a photo preview image', () => {
    render(<AddPhotoSheet {...defaultProps} />)
    const img = screen.getByRole('img', { name: /photo preview/i })
    expect(img).toBeTruthy()
    expect(img.getAttribute('src')).toBe(SRC)
  })

  it('renders a caption textarea', () => {
    render(<AddPhotoSheet {...defaultProps} />)
    expect(screen.getByRole('textbox', { name: /caption/i })).toBeTruthy()
  })

  it('renders author chips for Iris, Niko, and Both', () => {
    render(<AddPhotoSheet {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Iris' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Niko' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Both' })).toBeTruthy()
  })

  it('Iris chip is selected by default', () => {
    render(<AddPhotoSheet {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Iris' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Niko' }).getAttribute('aria-pressed')).toBe('false')
  })

  it('clicking Niko chip selects it', async () => {
    render(<AddPhotoSheet {...defaultProps} />)
    await userEvent.click(screen.getByRole('button', { name: 'Niko' }))
    expect(screen.getByRole('button', { name: 'Niko' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Iris' }).getAttribute('aria-pressed')).toBe('false')
  })

  it('PASTE IT IN button is always enabled (caption is optional)', () => {
    render(<AddPhotoSheet {...defaultProps} />)
    expect(screen.getByRole('button', { name: /paste it in/i }).getAttribute('disabled')).toBeNull()
  })

  it('calls onSave with correct PhotoMemory shape', async () => {
    const onSave = vi.fn()
    render(<AddPhotoSheet {...defaultProps} onSave={onSave} />)
    await userEvent.type(screen.getByRole('textbox', { name: /caption/i }), 'golden hour in prague')
    await userEvent.click(screen.getByRole('button', { name: /paste it in/i }))
    expect(onSave).toHaveBeenCalledTimes(1)
    const arg = onSave.mock.calls[0][0]
    expect(arg.kind).toBe('photo')
    expect(arg.photoSrc).toBe(SRC)
    expect(arg.caption).toBe('golden hour in prague')
    expect(arg.author).toBe('Iris')
    expect(arg.timestamp).toBeTruthy()
  })

  it('calls onSave without caption when textarea is empty', async () => {
    const onSave = vi.fn()
    render(<AddPhotoSheet {...defaultProps} onSave={onSave} />)
    await userEvent.click(screen.getByRole('button', { name: /paste it in/i }))
    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onSave.mock.calls[0][0].caption).toBeUndefined()
  })

  it('calls onSave with selected author', async () => {
    const onSave = vi.fn()
    render(<AddPhotoSheet {...defaultProps} onSave={onSave} />)
    await userEvent.click(screen.getByRole('button', { name: 'Niko' }))
    await userEvent.click(screen.getByRole('button', { name: /paste it in/i }))
    expect(onSave.mock.calls[0][0].author).toBe('Niko')
  })

  it('renders a ← back button that calls onBack', async () => {
    const onBack = vi.fn()
    render(<AddPhotoSheet {...defaultProps} onBack={onBack} />)
    await userEvent.click(screen.getByRole('button', { name: /← back/i }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
