import { useNavigate } from 'react-router-dom'
import { CITY_VIEWS } from '../../config/cities'

export function CitySelector() {
  const navigate = useNavigate()
  return (
    <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--color-cream)', marginBottom: 'var(--space-md)' }}>
        Your Trip
      </h1>
      {CITY_VIEWS.map((city) => (
        <button
          key={city.cityViewId}
          onClick={() => navigate(`/${city.cityViewId}`)}
          style={{
            background: 'var(--color-bg-card)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-lg)',
            textAlign: 'left',
            color: 'var(--color-cream)',
            fontSize: 20,
            fontFamily: 'var(--font-serif)',
          }}
        >
          {city.label}
          {city.travelNote && (
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>
              {city.travelNote}
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
