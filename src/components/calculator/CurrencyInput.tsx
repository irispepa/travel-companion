interface Props {
  from: string; to: string; rate: number | null
  fromValue: string; toValue: string
  onFromChange: (v: string) => void; onToChange: (v: string) => void
}

export function CurrencyInput({ from, to, fromValue, toValue, onFromChange, onToChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4, color: 'var(--color-gold)', fontSize: 12, letterSpacing: 1 }}>
        {from}
        <input aria-label={`${from} amount`} type="number" value={fromValue}
          onChange={e => onFromChange(e.target.value)}
          style={{ background: 'var(--color-bg-card-alt)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 12px', color: 'var(--color-cream)', fontSize: 24 }} />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4, color: 'var(--color-gold)', fontSize: 12, letterSpacing: 1 }}>
        {to}
        <input aria-label={`${to} amount`} type="number" value={toValue}
          onChange={e => onToChange(e.target.value)}
          style={{ background: 'var(--color-bg-card-alt)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 12px', color: 'var(--color-cream)', fontSize: 24 }} />
      </label>
    </div>
  )
}
