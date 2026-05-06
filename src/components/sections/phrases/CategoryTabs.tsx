interface Props { categories: string[]; active: string; onSelect: (c: string) => void }

export function CategoryTabs({ categories, active, onSelect }: Props) {
  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 'var(--space-md)' }}>
      <button onClick={() => onSelect('')}
        style={{ flexShrink: 0, padding: '4px 12px', borderRadius: 20, fontSize: 12,
          background: active === '' ? 'var(--color-gold)' : 'var(--color-bg-card)',
          color: active === '' ? 'var(--color-bg)' : 'var(--color-cream)' }}>
        All
      </button>
      {categories.map(c => (
        <button key={c} onClick={() => onSelect(c)}
          style={{ flexShrink: 0, padding: '4px 12px', borderRadius: 20, fontSize: 12,
            background: active === c ? 'var(--color-gold)' : 'var(--color-bg-card)',
            color: active === c ? 'var(--color-bg)' : 'var(--color-cream)' }}>
          {c}
        </button>
      ))}
    </div>
  )
}
