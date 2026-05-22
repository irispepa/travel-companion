import React, { useCallback } from 'react'
import { VoiceMemory } from '../../../../db/schema'
import { VoiceCard } from '../cards/VoiceCard'
import { useVoiceRecorder } from '../../../../hooks/useVoiceRecorder'

type SaveArg = Omit<VoiceMemory, 'id' | 'cityId'>

interface Props {
  onSave: (entry: SaveArg) => void
  onBack: () => void
}

const CARD_WIDTH = 300

export function VoiceRecordSheet({ onSave, onBack }: Props) {
  const handleDone = useCallback(
    (result: { audioSrc: string; duration: number; waveform: number[] }) => {
      const entry: SaveArg = {
        kind: 'voice',
        author: 'Iris',
        audioSrc: result.audioSrc,
        duration: result.duration,
        waveform: result.waveform,
        timestamp: new Date().toISOString(),
      }
      onSave(entry)
    },
    [onSave],
  )

  const { state, duration, waveform, start, stop } = useVoiceRecorder(handleDone)

  const cardState = state === 'idle' ? 'empty' : state === 'recording' ? 'recording' : 'recorded'

  const entry: VoiceMemory = {
    id: '',
    cityId: 'prague',
    kind: 'voice',
    author: 'Iris',
    audioSrc: '',
    duration,
    waveform,
    timestamp: new Date().toISOString(),
  }

  const containerStyle: React.CSSProperties = {
    padding: 'var(--space-lg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-lg)',
  }

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  }

  const backButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--color-ink-faint)',
    letterSpacing: '0.08em',
    padding: 0,
  }

  const hintStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--color-ink-faint)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    textAlign: 'center',
    margin: 0,
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button onClick={onBack} style={backButtonStyle} aria-label="Go back">
          ← back
        </button>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--color-ink-faint)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          voice memo
        </span>
        <div style={{ width: 40 }} />
      </div>

      <VoiceCard
        entry={entry}
        width={CARD_WIDTH}
        state={cardState}
        onStartRecord={start}
        onStopRecord={stop}
      />

      {state === 'idle' && (
        <p style={hintStyle}>tap the mic to start recording</p>
      )}
      {state === 'recording' && (
        <p style={{ ...hintStyle, color: 'var(--color-stamp)' }}>tap to stop</p>
      )}
      {state === 'done' && (
        <p style={hintStyle}>saved</p>
      )}
    </div>
  )
}
