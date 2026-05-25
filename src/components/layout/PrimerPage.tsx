import { useParams, useNavigate } from 'react-router-dom'
import { getCityView } from '../../config/cities'
import { CityViewId } from '../../db/schema'

const PRIMER_FILES: Record<string, string> = {
  prague: `${import.meta.env.BASE_URL}primers/prague-primer.html`,
  vienna: `${import.meta.env.BASE_URL}primers/vienna-primer.html`,
  budapest: `${import.meta.env.BASE_URL}primers/budapest-primer.html`,
}

export function PrimerPage() {
  const { cityViewId } = useParams<{ cityViewId: CityViewId }>()
  const navigate = useNavigate()
  const config = getCityView(cityViewId!)
  const primerUrl = PRIMER_FILES[config.cityId]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-paper)' }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '10px 18px',
        flexShrink: 0,
        borderBottom: '1px solid var(--color-rule)',
      }}>
        <button
          onClick={() => navigate(`/${cityViewId}`)}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em',
            color: 'var(--color-ink-soft)', minHeight: 44,
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          }}
        >
          ← {config.label.toUpperCase()}
        </button>
      </div>

      {primerUrl ? (
        <iframe
          src={primerUrl}
          style={{ flex: 1, border: 'none', width: '100%' }}
          title={`${config.label} Primer`}
        />
      ) : (
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
          color: 'var(--color-ink-faint)',
        }}>
          NO PRIMER AVAILABLE
        </div>
      )}
    </div>
  )
}
