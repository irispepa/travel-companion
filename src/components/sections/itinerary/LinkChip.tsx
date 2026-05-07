interface Props { label: string; url: string }
export function LinkChip({ label, url }: Props) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        background: 'var(--color-paper-deep)',
        borderRadius: 20,
        padding: '3px 10px',
        color: 'var(--color-ink-blue)',
        whiteSpace: 'nowrap',
        border: '1px solid var(--color-rule)',
        letterSpacing: '0.04em',
      }}>
      {label}
    </a>
  )
}
