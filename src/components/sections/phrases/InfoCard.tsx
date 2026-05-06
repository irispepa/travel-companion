interface Props { title: string; body: string }

export function InfoCard({ title, body }: Props) {
  return (
    <div style={{ background: 'var(--color-bg-card-alt)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-sm)', borderLeft: '3px solid var(--color-gold)' }}>
      <div style={{ fontSize: 12, color: 'var(--color-gold)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--color-cream)', lineHeight: 1.5 }}>{body}</div>
    </div>
  )
}
