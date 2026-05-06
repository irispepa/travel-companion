import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { CurrencyInput } from '../../../src/components/calculator/CurrencyInput'

describe('CurrencyInput', () => {
  it('calls onFromChange when from field edited', async () => {
    const onFromChange = vi.fn()
    render(<CurrencyInput from="CZK" to="USD" rate={0.045} fromValue="" toValue="" onFromChange={onFromChange} onToChange={vi.fn()} />)
    await userEvent.type(screen.getByLabelText('CZK amount'), '100')
    expect(onFromChange).toHaveBeenCalled()
  })

  it('calls onToChange when to field edited', async () => {
    const onToChange = vi.fn()
    render(<CurrencyInput from="CZK" to="USD" rate={0.045} fromValue="" toValue="" onFromChange={vi.fn()} onToChange={onToChange} />)
    await userEvent.type(screen.getByLabelText('USD amount'), '5')
    expect(onToChange).toHaveBeenCalled()
  })
})
