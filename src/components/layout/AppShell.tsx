import React from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  cityLabel: string
  showBack: boolean
  onCalculator?: () => void
  children: React.ReactNode
}

export function AppShell({ cityLabel, showBack, onCalculator, children }: Props) {
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-paper)' }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-md)',
        height: 52,
        flexShrink: 0,
        background: 'var(--color-paper)',
        borderBottom: '1px solid var(--color-rule)',
      }}>
        {showBack ? (
          <button
            aria-label="Back"
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 44,
              minHeight: 44,
              color: 'var(--color-ink-soft)',
              fontSize: 20,
            }}
          >
            ←
          </button>
        ) : (
          <span style={{ minWidth: 44 }} />
        )}

        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 500,
          color: 'var(--color-ink-faint)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}>
          {cityLabel}
        </span>

        {onCalculator ? (
          <button
            aria-label="Currency calculator"
            onClick={onCalculator}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 44,
              minHeight: 44,
              color: 'var(--color-ink-soft)',
              fontSize: 18,
            }}
          >
            ⇄
          </button>
        ) : (
          <span style={{ minWidth: 44 }} />
        )}
      </header>

      <main style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', background: 'var(--color-paper)' }}>
        {children}
      </main>
    </div>
  )
}
