import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CityViewId, PhraseCategory } from '../../../db/schema'
import { getCityView } from '../../../config/cities'
import { usePhrases } from '../../../hooks/usePhrases'
import { CalculatorOverlay } from '../../calculator/CalculatorOverlay'
import { PhraseRow } from './PhraseRow'
import { InfoCard } from './InfoCard'

export function searchPhrases(categories: PhraseCategory[], query: string) {
  const q = query.toLowerCase()
  if (!q) return {
    words: categories.flatMap(c => c.words),
    info: categories.flatMap(c => c.info)
  }
  return {
    words: categories.flatMap(c => c.words).filter(w =>
      w.english.toLowerCase().includes(q) || w.local.toLowerCase().includes(q) || w.phonetic?.toLowerCase().includes(q)
    ),
    info: categories.flatMap(c => c.info).filter(i =>
      i.title.toLowerCase().includes(q) || i.body.toLowerCase().includes(q)
    )
  }
}

const LANG_LABEL: Record<string, string> = {
  cs: 'ČEŠTINA',
  de: 'DEUTSCH',
  hu: 'MAGYAR',
}

function SearchIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/>
      <path d="M21 21l-4.35-4.35"/>
    </svg>
  )
}

function Glyph({ name, size = 16, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (name === 'arrow-left') return <svg {...p}><path d="M14 6l-6 6 6 6"/></svg>
  return null
}

export function PhrasesSection() {
  const { cityViewId } = useParams<{ cityViewId: CityViewId }>()
  const config = getCityView(cityViewId!)
  const navigate = useNavigate()
  const { categories, loading } = usePhrases(config.cityId)
  const [activeCategory, setActiveCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCalc, setShowCalc] = useState(false)

  const filtered = activeCategory
    ? categories.filter(c => c.name === activeCategory)
    : categories

  const { words, info } = searchPhrases(filtered, searchQuery)

  const langLabel = config.translateTo ? (LANG_LABEL[config.translateTo] ?? config.translateTo.toUpperCase()) : null
  const eyebrow = langLabel ? `ENGLISH → ${langLabel}` : config.label.toUpperCase()

  const translateUrl = config.translateFrom && config.translateTo
    ? `googletranslate://?sl=${config.translateFrom}&tl=${config.translateTo}${searchQuery ? `&text=${encodeURIComponent(searchQuery)}` : ''}`
    : null

  return (
    <div style={{ background: 'var(--color-paper)', minHeight: '100dvh', color: 'var(--color-ink)', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: '10px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            all: 'unset', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em',
            color: 'var(--color-ink-soft)', minHeight: 44,
          }}
        >
          <Glyph name="arrow-left" size={14} color="var(--color-ink-soft)"/>
          {config.label.toUpperCase()}
        </button>
        <button
          onClick={() => setShowCalc(true)}
          aria-label="Calculator"
          style={{
            all: 'unset', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em',
            color: 'var(--color-ink-soft)', minHeight: 44,
          }}
        >
          CALC
        </button>
      </div>

      {/* Title */}
      <div style={{ padding: '6px 22px 0' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em',
          color: 'var(--color-stamp)', fontWeight: 600, textTransform: 'uppercase',
        }}>
          {eyebrow}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 500,
          margin: '4px 0 0', letterSpacing: '-0.02em', color: 'var(--color-ink)',
        }}>
          What to say.
        </h1>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-ink-soft)',
          marginTop: 4, fontStyle: 'italic',
        }}>
          Try. They'll smile.
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '16px 18px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px',
          border: '1px solid var(--color-ink)',
          borderRadius: 999,
          background: 'var(--color-white)',
        }}>
          <span style={{ color: 'var(--color-ink-soft)', display: 'flex' }}><SearchIcon/></span>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search a phrase…"
            aria-label="Search phrases"
            style={{
              all: 'unset', flex: 1,
              fontFamily: 'var(--font-sans)', fontSize: 14,
              color: 'var(--color-ink)',
            }}
          />
          {translateUrl && (
            <a
              href={translateUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em',
                color: 'var(--color-ink-soft)', textDecoration: 'none', flexShrink: 0,
              }}
            >
              ↗ TRANSLATE
            </a>
          )}
        </div>
      </div>

      {/* Category chips */}
      <div style={{
        padding: '14px 18px 0',
        display: 'flex', gap: 6,
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch' as unknown as undefined,
        scrollbarWidth: 'none' as unknown as undefined,
      }}>
        <button
          onClick={() => setActiveCategory('')}
          style={{
            all: 'unset', cursor: 'pointer',
            padding: '6px 12px', borderRadius: 999,
            border: '1px solid var(--color-ink)',
            background: activeCategory === '' ? 'var(--color-ink)' : 'transparent',
            color: activeCategory === '' ? 'var(--color-paper)' : 'var(--color-ink)',
            fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          All
        </button>
        {categories.map(c => (
          <button
            key={c.name}
            onClick={() => setActiveCategory(c.name)}
            style={{
              all: 'unset', cursor: 'pointer',
              padding: '6px 12px', borderRadius: 999,
              border: '1px solid var(--color-ink)',
              background: activeCategory === c.name ? 'var(--color-ink)' : 'transparent',
              color: activeCategory === c.name ? 'var(--color-paper)' : 'var(--color-ink)',
              fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500,
              whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Phrase list */}
      <div style={{ padding: '18px 18px 0' }}>
        {loading && (
          <div style={{ color: 'var(--color-ink-faint)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', padding: '20px 0', textAlign: 'center' }}>
            LOADING…
          </div>
        )}

        {!loading && words.length > 0 && (
          <>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em',
              color: 'var(--color-ink-soft)', marginBottom: 4, paddingLeft: 2,
              textTransform: 'uppercase',
            }}>
              Words
            </div>
            {words.map((w, i) => <PhraseRow key={w.english} word={w} isFirst={i === 0}/>)}
          </>
        )}

        {!loading && info.length > 0 && (
          <>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em',
              color: 'var(--color-ink-soft)', margin: '20px 0 8px 2px',
              textTransform: 'uppercase',
            }}>
              Good to know
            </div>
            {info.map(card => <InfoCard key={card.title} title={card.title} body={card.body}/>)}
          </>
        )}

        {!loading && words.length === 0 && info.length === 0 && (
          <div style={{ color: 'var(--color-ink-faint)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', padding: '20px 0', textAlign: 'center' }}>
            NO PHRASES FOUND
          </div>
        )}
      </div>

      {showCalc && <CalculatorOverlay cityViewId={cityViewId!} onClose={() => setShowCalc(false)}/>}
    </div>
  )
}
