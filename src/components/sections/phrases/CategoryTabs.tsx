import React from 'react'

interface Props { categories: string[]; active: string; onSelect: (c: string) => void }

export function CategoryTabs({ categories, active, onSelect }: Props) {
  const chipStyle = (isActive: boolean): React.CSSProperties => ({
    flexShrink: 0,
    padding: '0 var(--space-md)',
    height: 36,
    borderRadius: 'var(--radius-pill)',
    fontSize: 'var(--text-caption)',
    letterSpacing: '0.04em',
    background: isActive ? 'var(--color-gold)' : 'var(--color-bg-card)',
    color: isActive ? 'var(--color-bg)' : 'var(--color-cream)',
    transition: `background var(--duration-fast) var(--ease-out-expo), color var(--duration-fast) var(--ease-out-expo)`,
    whiteSpace: 'nowrap' as const,
  })

  return (
    <div style={{
      display: 'flex',
      gap: 'var(--space-xs)',
      overflowX: 'auto',
      paddingBottom: 'var(--space-xs)',
      marginBottom: 'var(--space-md)',
      WebkitOverflowScrolling: 'touch' as never,
      scrollbarWidth: 'none' as never,
      msOverflowStyle: 'none' as never,
    }}>
      <button onClick={() => onSelect('')} style={chipStyle(active === '')}>
        All
      </button>
      {categories.map(c => (
        <button key={c} onClick={() => onSelect(c)} style={chipStyle(active === c)}>
          {c}
        </button>
      ))}
    </div>
  )
}
