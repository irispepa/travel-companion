
interface Props {
  onKey: (key: string) => void;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

export default function CalcKeypad({ onKey }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: 5,
        marginTop: 8,
        flex: 1,
      }}
    >
      {KEYS.map((key) => (
        <button
          key={key}
          style={{
            all: 'unset',
            textAlign: 'center',
            borderRadius: 10,
            border: '1px solid var(--color-rule)',
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: '-0.01em',
            cursor: 'pointer',
            userSelect: 'none',
            background: key === '⌫' ? 'var(--color-paper-deep)' : 'var(--color-white)',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 44,
          }}
          onClick={() => onKey(key)}
        >
          {key}
        </button>
      ))}
    </div>
  );
}
