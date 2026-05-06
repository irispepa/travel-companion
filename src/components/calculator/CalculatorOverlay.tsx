import { useState } from 'react'
import { CityViewId } from '../../db/schema'
import { getCityView } from '../../config/cities'
import { useExchangeRate } from '../../hooks/useExchangeRate'
import { useUserPreferences } from '../../hooks/useUserPreferences'
import { CurrencyInput } from './CurrencyInput'
import { CurrencyPicker } from './CurrencyPicker'

interface Props { cityViewId: CityViewId; onClose: () => void }

export function CalculatorOverlay({ cityViewId, onClose }: Props) {
  const config = getCityView(cityViewId)
  const { pref, setPref } = useUserPreferences(cityViewId)
  const [from, setFrom] = useState(pref?.from ?? config.defaultCurrencyFrom)
  const [to, setTo] = useState(pref?.to ?? config.defaultCurrencyTo)
  const { rate, isOffline, rateDate } = useExchangeRate(from, to)
  const [fromVal, setFromVal] = useState('')
  const [toVal, setToVal] = useState('')

  function handleFromChange(v: string) {
    setFromVal(v)
    if (rate && v) setToVal((parseFloat(v) * rate).toFixed(2))
    else setToVal('')
  }

  function handleToChange(v: string) {
    setToVal(v)
    if (rate && v) setFromVal((parseFloat(v) / rate).toFixed(2))
    else setFromVal('')
  }

  function handleFromCurrencyChange(c: string) {
    setFrom(c); setFromVal(''); setToVal('')
    setPref({ from: c, to })
  }

  function handleToCurrencyChange(c: string) {
    setTo(c); setFromVal(''); setToVal('')
    setPref({ from, to: c })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'flex-end', zIndex: 100
    }} onClick={onClose}>
      <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', padding: 'var(--space-lg)', width: '100%' }}
        onClick={e => e.stopPropagation()}>
        <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: 'var(--space-md)' }}>Currency</h2>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
          <CurrencyPicker value={from} onChange={handleFromCurrencyChange} label="From" />
          <CurrencyPicker value={to} onChange={handleToCurrencyChange} label="To" />
        </div>
        <CurrencyInput from={from} to={to} rate={rate} fromValue={fromVal} toValue={toVal}
          onFromChange={handleFromChange} onToChange={handleToChange} />
        {isOffline && rateDate && (
          <p style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 8 }}>rate from {rateDate}</p>
        )}
      </div>
    </div>
  )
}
