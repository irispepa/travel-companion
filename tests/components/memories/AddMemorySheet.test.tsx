import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AddMemorySheet } from '../../../src/components/sections/memories/AddMemorySheet'

describe('AddMemorySheet', () => {
  it('calls onSave with author and note', async () => {
    const onSave = vi.fn()
    render(<AddMemorySheet onSave={onSave} onClose={vi.fn()} />)
    const textarea = screen.getAllByRole('textbox')[0]
    await userEvent.type(textarea, 'Great view')
    await userEvent.click(screen.getByText('Iris'))
    await userEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ author: 'Iris', caption: 'Great view' }))
  })
})
