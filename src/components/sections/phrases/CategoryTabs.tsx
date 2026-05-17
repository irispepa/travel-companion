import React from 'react'

interface Props { categories: string[]; active: string; onSelect: (c: string) => void }

export function CategoryTabs({ categories, active, onSelect }: Props) {
  const chipStyle = (isActive: boolean): React.CSSProperties => ({
    flexShrink: 0,
    padding: '0 var(--space-md)',
    height: 34,
    borderRadius: 'var(--radius-pill)',
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    background: isActive ? 'var(--color-stamp)' : 'var(--color-white)',
    color: isActive ? '#fff' : 'var(--color-ink-soft)',
    border: isActive ? 'none' : '1px solid var(--color-rule)',
    transition: `background var(--duration-fast) var(--ease-out-expo), color var(--duration-fast) var(--ease-out-expo)`,
    whiteSpace: 'nowrap' as const,
  })

  return (
    <div style={{
      display: 'flex',
      gap: 6,
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
