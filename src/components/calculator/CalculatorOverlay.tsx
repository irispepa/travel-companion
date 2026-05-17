import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CityViewId } from '../../db/schema'
import { getCityView } from '../../config/cities'
import { useExchangeRate } from '../../hooks/useExchangeRate'
import { useUserPreferences } from '../../hooks/useUserPreferences'
import CalcKeypad from './CalcKeypad'
import { QuickAmounts } from './QuickAmounts'

const COMMON = ['USD', 'EUR', 'CZK', 'HUF', 'GBP', 'CHF']

function SwapIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
    </svg>
  )
}

function formatDisplay(val: string): { whole: string; frac: string } {
  if (!val) return { whole: '0', frac: '.00' }
  const [whole, frac] = val.split('.')
  if (frac !== undefined) return { whole, frac: '.' + frac.slice(0, 2) }
  return { whole, frac: '' }
}

interface Props { cityViewId: CityViewId; onClose: () => void }

export function CalculatorOverlay({ cityViewId, onClose }: Props) {
  const config = getCityView(cityViewId)
  const { pref, setPref } = useUserPreferences(cityViewId)
  const [from, setFrom] = useState(pref?.from ?? config.defaultCurrencyFrom)
  const [to, setTo] = useState(pref?.to ?? config.defaultCurrencyTo)
  const { rate, isOffline, rateDate } = useExchangeRate(from, to)
  const [fromVal, setFromVal] = useState('')
  const [activeField, setActiveField] = useState<'from' | 'to'>('from')

  const toVal = rate && fromVal ? (parseFloat(fromVal) * rate).toFixed(2) : ''

  function handleKey(key: string) {
    if (activeField === 'from') {
      setFromVal(prev => applyKey(prev, key))
    } else {
      const rawTo = applyKey(toVal, key)
      if (rate && rawTo) {
        setFromVal((parseFloat(rawTo) / rate).toFixed(2))
      } else {
        setFromVal('')
      }
    }
  }

  function applyKey(current: string, key: string): string {
    if (key === '⌫') return current.slice(0, -1)
    if (key === '.' && current.includes('.')) return current
    if (key === '.' && current === '') return '0.'
    if (current === '0' && key !== '.') return key
    if (current.length >= 10) return current
    return current + key
  }

  function handleQuickAmount(amount: number) {
    setActiveField('from')
    setFromVal(String(amount))
  }

  function handleSwap() {
    const newFrom = to
    const newTo = from
    setFrom(newFrom)
    setTo(newTo)
    setFromVal('')
    setPref({ from: newFrom, to: newTo })
  }

  function handleFromCurrency(c: string) {
    setFrom(c); setFromVal(''); setPref({ from: c, to })
  }

  function handleToCurrency(c: string) {
    setTo(c); setFromVal(''); setPref({ from, to: c })
  }

  const fromDisplay = formatDisplay(fromVal)
  const toDisplay = formatDisplay(toVal)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const quickAmounts = from === 'CZK' ? [100, 250, 500, 1000]
    : from === 'HUF' ? [500, 1000, 5000, 10000]
    : from === 'EUR' ? [10, 20, 50, 100]
    : [10, 20, 50, 100]

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(29,28,26,0.55)',
        zIndex: 200,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        overflowY: 'hidden',
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Currency converter"
        style={{
          background: 'var(--color-paper)',
          borderRadius: '20px 20px 0 0',
          padding: '10px 20px calc(20px + env(safe-area-inset-bottom, 0px))',
          border: '1px solid var(--color-ink)',
          borderBottom: 'none',
          maxHeight: '88dvh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'sheetSlideUp var(--duration-sheet) var(--ease-out-expo) both',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, background: 'var(--color-rule)', borderRadius: 4, margin: '0 auto 14px' }}/>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 500,
            margin: 0, letterSpacing: '-0.02em', color: 'var(--color-ink)',
          }}>
            Convert.
          </h2>
          <button
            onClick={onClose}
            style={{
              all: 'unset', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em',
              color: 'var(--color-stamp)', fontWeight: 600,
            }}
          >
            DONE
          </button>
        </div>

        {/* Rate line */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em',
          color: 'var(--color-ink-soft)', marginTop: 2,
        }}>
          {rate
            ? `${isOffline ? 'CACHED' : 'LIVE'} · 1 ${from} = ${rate.toFixed(4)} ${to}${isOffline && rateDate ? ` (${rateDate})` : ''}`
            : 'LOADING RATE…'}
        </div>

        {/* YOU PAY box */}
        <button
          onClick={() => setActiveField('from')}
          style={{
            all: 'unset', display: 'block', width: '100%', boxSizing: 'border-box',
            marginTop: 8, padding: '8px 14px',
            background: 'var(--color-white)',
            border: `1.5px solid ${activeField === 'from' ? 'var(--color-ink)' : 'var(--color-rule)'}`,
            borderRadius: 12, cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--color-ink-soft)' }}>
              YOU PAY
            </div>
            <select
              value={from}
              onChange={e => { e.stopPropagation(); handleFromCurrency(e.target.value) }}
              onClick={e => e.stopPropagation()}
              style={{
                all: 'unset', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em',
                color: 'var(--color-stamp)', fontWeight: 600,
              }}
            >
              {COMMON.map(c => <option key={c} value={c}>{c} ▾</option>)}
            </select>
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 500,
            letterSpacing: '-0.03em', lineHeight: 1, marginTop: 4, color: 'var(--color-ink)',
          }}>
            {fromDisplay.whole}
            <span style={{ color: 'var(--color-ink-faint)' }}>{fromDisplay.frac || (fromVal ? '' : '.00')}</span>
          </div>
        </button>

        {/* Swap button */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '-10px 0', position: 'relative', zIndex: 1 }}>
          <div style={{ background: 'var(--color-paper)', padding: 4, borderRadius: '50%' }}>
            <button
              onClick={handleSwap}
              style={{
                all: 'unset', cursor: 'pointer',
                width: 36, height: 36, borderRadius: '50%',
                border: '1px solid var(--color-ink)',
                background: 'var(--color-paper)',
                display: 'grid', placeItems: 'center',
                color: 'var(--color-ink)',
              }}
            >
              <SwapIcon/>
            </button>
          </div>
        </div>

        {/* YOU GET box */}
        <button
          onClick={() => setActiveField('to')}
          style={{
            all: 'unset', display: 'block', width: '100%', boxSizing: 'border-box',
            padding: '10px 14px',
            background: 'var(--color-paper-deep)',
            border: `1.5px solid ${activeField === 'to' ? 'var(--color-ink)' : 'var(--color-rule)'}`,
            borderRadius: 12, cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--color-ink-soft)' }}>
              YOU GET
            </div>
            <select
              value={to}
              onChange={e => { e.stopPropagation(); handleToCurrency(e.target.value) }}
              onClick={e => e.stopPropagation()}
              style={{
                all: 'unset', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em',
                color: 'var(--color-ink)', fontWeight: 600,
              }}
            >
              {COMMON.map(c => <option key={c} value={c}>{c} ▾</option>)}
            </select>
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 500,
            letterSpacing: '-0.03em', lineHeight: 1, marginTop: 4, color: 'var(--color-ink)',
          }}>
            {toDisplay.whole}
            <span style={{ color: 'var(--color-ink-faint)' }}>{toDisplay.frac || (toVal ? '' : '.00')}</span>
          </div>
        </button>

        {/* Quick amounts */}
        <QuickAmounts amounts={quickAmounts} currency={from} onSelect={handleQuickAmount}/>

        {/* Keypad */}
        <CalcKeypad onKey={handleKey}/>
      </div>
    </div>,
    document.body
  )
}
