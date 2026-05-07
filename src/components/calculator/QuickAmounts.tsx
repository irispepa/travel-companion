
interface Props {
  amounts: number[];
  currency: string;
  onSelect: (amount: number) => void;
}

export function QuickAmounts({ amounts, currency, onSelect }: Props) {
  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 10, overflowX: 'auto', WebkitOverflowScrolling: 'touch' as never, scrollbarWidth: 'none' as never }}>
      {amounts.map((amount) => (
        <button
          key={amount}
          onClick={() => onSelect(amount)}
          style={{
            all: 'unset',
            padding: '4px 12px',
            flexShrink: 0,
            borderRadius: 999,
            border: '1px solid var(--color-rule)',
            background: 'var(--color-white)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            userSelect: 'none',
            minHeight: 36,
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box',
          }}
        >
          {amount} {currency}
        </button>
      ))}
    </div>
  );
}
