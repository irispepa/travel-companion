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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 'var(--z-overlay)',
        animation: 'backdropFadeIn var(--duration-base) var(--ease-out-expo) both',
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="calculator-title"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          padding: 'var(--space-lg)',
          paddingBottom: 'calc(var(--space-lg) + env(safe-area-inset-bottom, 0px))',
          maxHeight: '85vh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          animation: 'sheetSlideUp var(--duration-sheet) var(--ease-out-expo) both',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2
          id="calculator-title"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-headline)',
            fontWeight: 400,
            marginBottom: 'var(--space-md)',
          }}
        >
          Currency
        </h2>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
          <CurrencyPicker value={from} onChange={handleFromCurrencyChange} label="From" />
          <CurrencyPicker value={to} onChange={handleToCurrencyChange} label="To" />
        </div>
        <CurrencyInput from={from} to={to} rate={rate} fromValue={fromVal} toValue={toVal}
          onFromChange={handleFromChange} onToChange={handleToChange} />
        {isOffline && rateDate && (
          <p role="status" style={{ fontSize: 'var(--text-caption)', color: 'var(--color-muted)', marginTop: 'var(--space-sm)' }}>
            Using cached rate from {rateDate}
          </p>
        )}
      </div>
    </div>
  )
}
