const COMMON = ['USD', 'EUR', 'CZK', 'HUF', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD']

interface Props { value: string; onChange: (v: string) => void; label: string }

export function CurrencyPicker({ value, onChange, label }: Props) {
  return (
    <label style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-xs)',
      color: 'var(--color-muted)',
      fontSize: 'var(--text-caption)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      flex: 1,
    }}>
      {label}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background: 'var(--color-bg-card-alt)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 10px',
          color: 'var(--color-cream)',
          fontSize: 'var(--text-body)',
          WebkitAppearance: 'none',
          appearance: 'none',
          minHeight: 44,
          cursor: 'pointer',
        }}
      >
        {COMMON.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </label>
  )
}
