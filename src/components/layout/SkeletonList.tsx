interface Props { rows?: number; rowHeight?: number }

export function SkeletonList({ rows = 4, rowHeight = 64 }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            height: rowHeight,
            background: 'var(--color-rule)',
            borderRadius: 'var(--radius-md)',
            opacity: 1 - i * 0.15,
            animation: 'skeletonPulse 1.4s ease-in-out infinite',
            animationDelay: `${i * 80}ms`,
          }}
        />
      ))}
    </div>
  )
}
