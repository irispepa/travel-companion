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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-md)',
        height: 52,
        flexShrink: 0,
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-bg-card)',
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
              color: 'var(--color-gold)',
              fontSize: 20,
            }}
          >
            ←
          </button>
        ) : (
          <span style={{ minWidth: 44 }} />
        )}

        <h1 style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-caption)',
          fontWeight: 400,
          color: 'var(--color-muted)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}>
          {cityLabel}
        </h1>

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
              color: 'var(--color-gold)',
              fontSize: 18,
            }}
          >
            ⇄
          </button>
        ) : (
          <span style={{ minWidth: 44 }} />
        )}
      </header>

      <main style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain' }}>
        {children}
      </main>
    </div>
  )
}
