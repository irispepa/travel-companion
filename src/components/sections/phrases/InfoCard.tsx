interface Props { title: string; body: string }

export function InfoCard({ title, body }: Props) {
  return (
    <div style={{
      background: 'var(--color-white)',
      border: '1px solid var(--color-rule)',
      borderRadius: 10,
      padding: '12px 14px',
      marginBottom: 8,
    }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500,
        letterSpacing: '-0.01em', color: 'var(--color-ink)',
      }}>
        {title}
      </div>
      <div style={{
        fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-ink-soft)',
        marginTop: 4, lineHeight: 1.5,
      }}>
        {body}
      </div>
    </div>
  )
}
