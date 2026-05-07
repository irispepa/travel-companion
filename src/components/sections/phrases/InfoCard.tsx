interface Props { title: string; body: string }

export function InfoCard({ title, body }: Props) {
  return (
    <div style={{
      background: 'var(--color-bg-card-alt)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-md)',
      marginBottom: 'var(--space-sm)',
    }}>
      <div style={{
        fontSize: 'var(--text-caption)',
        color: 'var(--color-gold)',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        marginBottom: 'var(--space-xs)',
      }}>
        {title}
      </div>
      <div style={{
        fontSize: 'var(--text-body)',
        color: 'var(--color-cream)',
        lineHeight: 'var(--leading-normal)',
      }}>
        {body}
      </div>
    </div>
  )
}
