import { useState, useEffect } from 'react'
import { CityViewId } from '../../db/schema'
import { getCityView } from '../../config/cities'
import { useExchangeRate } from '../../hooks/useExchangeRate'
import { useUserPreferences } from '../../hooks/useUserPreferences'
import { CurrencyPicker } from './CurrencyPicker'

interface Props { cityViewId: CityViewId }

const STORAGE_KEY = (id: string) => `converter-collapsed-${id}`

export function InlineCurrencyConverter({ cityViewId }: Props) {
  const config = getCityView(cityViewId)
  const { pref, setPref } = useUserPreferences(cityViewId)
  const [from, setFrom] = useState(pref?.from ?? config.defaultCurrencyFrom)
  const [to, setTo] = useState(pref?.to ?? config.defaultCurrencyTo)
  const { rate, isOffline, rateDate } = useExchangeRate(from, to)
  const [fromVal, setFromVal] = useState('')
  const [toVal, setToVal] = useState('')
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(STORAGE_KEY(cityViewId)) === 'true'
  )

  // sync from/to once prefs load
  useEffect(() => {
    if (pref) { setFrom(pref.from); setTo(pref.to) }
  }, [pref])

  function toggleCollapsed() {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem(STORAGE_KEY(cityViewId), String(next))
  }

  function handleFromChange(v: string) {
    setFromVal(v)
    if (rate && v !== '') setToVal((parseFloat(v) * rate).toFixed(2))
    else setToVal('')
  }

  function handleToChange(v: string) {
    setToVal(v)
    if (rate && v !== '') setFromVal((parseFloat(v) / rate).toFixed(2))
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
      background: 'var(--color-bg-card)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      marginBottom: 'var(--space-lg)',
    }}>
      {/* Header row */}
      <button
        onClick={toggleCollapsed}
        aria-expanded={!collapsed}
        aria-controls="converter-body"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: 'var(--space-sm) var(--space-md)',
          background: 'transparent',
          minHeight: 44,
        }}
      >
        <span style={{
          fontSize: 'var(--text-caption)',
          color: 'var(--color-gold)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}>
          {from} → {to}
        </span>
        <span style={{
          color: 'var(--color-muted)',
          fontSize: 12,
          display: 'inline-block',
          transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: `transform var(--duration-fast) var(--ease-out-expo)`,
        }}>
          ▲
        </span>
      </button>

      {/* Collapsible body */}
      {!collapsed && (
        <div
          id="converter-body"
          style={{ padding: '0 var(--space-md) var(--space-md)' }}
        >
          {/* Currency pickers */}
          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
            <CurrencyPicker value={from} onChange={handleFromCurrencyChange} label="From" />
            <CurrencyPicker value={to} onChange={handleToCurrencyChange} label="To" />
          </div>

          {/* Inputs */}
          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{
                fontSize: 'var(--text-caption)',
                color: 'var(--color-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>{from}</span>
              <input
                aria-label={`${from} amount`}
                type="number"
                inputMode="decimal"
                value={fromVal}
                onChange={e => handleFromChange(e.target.value)}
                placeholder="0"
                style={{
                  background: 'var(--color-bg-card-alt)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  color: 'var(--color-cream)',
                  fontSize: 28,
                  fontVariantNumeric: 'tabular-nums',
                  width: '100%',
                  minHeight: 54,
                }}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{
                fontSize: 'var(--text-caption)',
                color: 'var(--color-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>{to}</span>
              <input
                aria-label={`${to} amount`}
                type="number"
                inputMode="decimal"
                value={toVal}
                onChange={e => handleToChange(e.target.value)}
                placeholder="0"
                style={{
                  background: 'var(--color-bg-card-alt)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  color: 'var(--color-cream)',
                  fontSize: 28,
                  fontVariantNumeric: 'tabular-nums',
                  width: '100%',
                  minHeight: 54,
                }}
              />
            </div>
          </div>

          {/* Rate line */}
          {rate ? (
            <p style={{
              fontSize: 'var(--text-caption)',
              color: 'var(--color-muted)',
              letterSpacing: '0.02em',
            }}>
              1 {from} = {rate.toFixed(4)} {to}
              {isOffline && rateDate ? ` · cached ${rateDate}` : ' · live'}
            </p>
          ) : (
            <p style={{
              fontSize: 'var(--text-caption)',
              color: 'var(--color-muted)',
              letterSpacing: '0.02em',
            }}>
              Rate unavailable offline
            </p>
          )}
        </div>
      )}
    </div>
  )
}
