interface Props { title: string; body: string }

export function InfoCard({ title, body }: Props) {
  return (
    <div style={{
      background: 'var(--color-paper-deep)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-md)',
      marginBottom: 'var(--space-sm)',
      border: '1px solid var(--color-rule)',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--color-stamp)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom: 'var(--space-xs)',
      }}>
        {title}
      </div>
      <div style={{
        fontSize: 'var(--text-body)',
        color: 'var(--color-ink-soft)',
        lineHeight: 'var(--leading-normal)',
      }}>
        {body}
      </div>
    </div>
  )
}
