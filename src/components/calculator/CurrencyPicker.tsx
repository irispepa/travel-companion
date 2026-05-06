const COMMON = ['USD', 'EUR', 'CZK', 'HUF', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD']

interface Props { value: string; onChange: (v: string) => void; label: string }

export function CurrencyPicker({ value, onChange, label }: Props) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, color: 'var(--color-muted)', fontSize: 11, letterSpacing: 1 }}>
      {label}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ background: 'var(--color-bg-card-alt)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '6px 10px', color: 'var(--color-cream)', fontSize: 14 }}>
        {COMMON.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </label>
  )
}
