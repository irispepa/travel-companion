import React from 'react'
import { VoiceMemory } from '../../../../db/schema'

interface Props {
  entry: VoiceMemory
  width: number
  state?: 'empty' | 'recording' | 'recorded'
  onStartRecord?: () => void
  onStopRecord?: () => void
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function Waveform({ bars, state }: { bars: number[]; state: 'empty' | 'recording' | 'recorded' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 28, flex: 1 }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            width: 3,
            borderRadius: 2,
            height: state === 'empty' ? 3 : `${Math.max(4, h * 28)}px`,
            background: state === 'recording' ? 'var(--color-stamp)'
              : state === 'recorded' ? (i < bars.length * 0.35 ? 'var(--color-ink-faint)' : 'var(--color-ink)')
              : 'var(--color-ink-faint)',
            opacity: state === 'recording' ? 0.6 : state === 'empty' ? 0.35 : 1,
            animation: state === 'recording' ? `voiceBar ${0.3 + (i % 5) * 0.07}s ease-in-out infinite alternate` : 'none',
          }}
        />
      ))}
    </div>
  )
}

const DEFAULT_BARS = Array.from({ length: 30 }, (_, i) => 0.3 + 0.5 * Math.sin(i * 0.7 + 1))

export function VoiceCard({ entry, width, state = 'recorded', onStartRecord, onStopRecord }: Props) {
  const bars = entry.waveform.length > 0 ? entry.waveform : DEFAULT_BARS

  const controlStyle: React.CSSProperties = state === 'recording'
    ? {
        width: 36, height: 36, borderRadius: '50%',
        background: 'var(--color-stamp)',
        border: '1px solid var(--color-ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        animation: 'voiceStopBreathe 1.4s ease-in-out infinite',
      }
    : state === 'empty'
    ? {
        width: 36, height: 36, borderRadius: '50%',
        border: '1px dashed var(--color-ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }
    : {
        width: 36, height: 36, borderRadius: '50%',
        background: 'var(--color-ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }

  function handleControlClick() {
    if (state === 'empty') onStartRecord?.()
    else if (state === 'recording') onStopRecord?.()
  }

  return (
    <div
      aria-label={entry.caption ? `Voice memo: ${entry.caption}` : 'Voice memo'}
      style={{
        width,
        background: 'var(--color-white)',
        border: '1px solid var(--color-ink)',
        borderRadius: 4,
        boxShadow: '2px 3px 0 var(--color-ink)',
        padding: '8px 10px 10px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 12 }}>🎙</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 9,
            color: 'var(--color-ink-soft)', letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>VOICE MEMO</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {state === 'recording' && (
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-stamp)', animation: 'voicePulse 1s ease-in-out infinite' }} />
          )}
          <span
            aria-live="polite"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-ink-faint)', letterSpacing: '0.04em' }}
          >
            {formatDuration(entry.duration)}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <button
          onClick={handleControlClick}
          aria-label={state === 'recording' ? 'Stop recording' : state === 'empty' ? 'Start recording' : 'Play voice memo'}
          style={{ ...controlStyle, cursor: 'pointer', border: state === 'empty' ? '1px dashed var(--color-ink)' : 'none' }}
        >
          {state === 'recording' && (
            <div style={{ width: 10, height: 10, background: 'var(--color-white)' }} />
          )}
          {state === 'empty' && (
            <span style={{ fontSize: 16 }}>🎙</span>
          )}
          {state === 'recorded' && (
            <div style={{
              width: 0, height: 0,
              borderTop: '7px solid transparent',
              borderBottom: '7px solid transparent',
              borderLeft: '11px solid var(--color-white)',
              marginLeft: 2,
            }} />
          )}
        </button>
        <Waveform bars={bars} state={state} />
      </div>

      <div style={{ minHeight: 18 }}>
        {state === 'empty' && (
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: 13, color: 'var(--color-ink-soft)' }}>
            tap mic to record a thought…
          </span>
        )}
        {state === 'recording' && (
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: 13, color: 'var(--color-stamp)' }}>
            listening…
          </span>
        )}
        {state === 'recorded' && entry.caption && (
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: 13, color: 'var(--color-ink)' }}>
            {entry.caption}
          </span>
        )}
      </div>
    </div>
  )
}
