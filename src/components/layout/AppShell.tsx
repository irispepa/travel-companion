import React from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  cityLabel: string
  showBack: boolean
  onCalculator: () => void
  children: React.ReactNode
}

export function AppShell({ cityLabel, showBack, onCalculator, children }: Props) {
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-bg-card)'
      }}>
        {showBack
          ? <button aria-label="back" onClick={() => navigate(-1)} style={{ fontSize: 20, color: 'var(--color-gold)' }}>←</button>
          : <span />}
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--color-cream)', letterSpacing: 1 }}>
          {cityLabel}
        </h1>
        <button aria-label="calculator" onClick={onCalculator} style={{ fontSize: 20, color: 'var(--color-gold)' }}>
          ₿
        </button>
      </header>
      <main style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-md)' }}>
        {children}
      </main>
    </div>
  )
}
