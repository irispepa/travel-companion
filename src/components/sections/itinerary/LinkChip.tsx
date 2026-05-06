interface Props { label: string; url: string }
export function LinkChip({ label, url }: Props) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      style={{ fontSize: 11, background: 'var(--color-bg)', borderRadius: 20, padding: '3px 10px', color: 'var(--color-blue)', whiteSpace: 'nowrap' }}>
      {label}
    </a>
  )
}
