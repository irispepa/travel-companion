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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>
            </svg>
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
