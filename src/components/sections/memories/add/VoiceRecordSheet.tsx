import React, { useCallback, useEffect, useState } from 'react'
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
  const [author, setAuthor] = useState<VoiceMemory['author']>('both')

  const handleDone = useCallback(
    (result: { audioSrc: string; audioBlob: Blob; duration: number; waveform: number[] }) => {
      const entry: SaveArg = {
        kind: 'voice',
        author,
        audioSrc: result.audioSrc,
        audioBlob: result.audioBlob,
        duration: result.duration,
        waveform: result.waveform,
        timestamp: new Date().toISOString(),
      }
      onSave(entry)
    },
    [onSave, author],
  )

  const { state, duration, waveform, start, stop, cleanup } = useVoiceRecorder(handleDone)

  useEffect(() => {
    return () => { cleanup() }
  }, [cleanup])

  const cardState = state === 'idle' ? 'empty' : state === 'recording' ? 'recording' : 'recorded'

  const entry: VoiceMemory = {
    id: '',
    cityId: 'prague',
    kind: 'voice',
    author,
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

      <div style={{ display: 'flex', gap: 6 }}>
        {(['Iris', 'Niko', 'both'] as VoiceMemory['author'][]).map(a => (
          <button
            key={a}
            onClick={() => setAuthor(a)}
            aria-pressed={author === a}
            disabled={state === 'recording'}
            style={{
              padding: '0 12px',
              height: 36,
              borderRadius: 20,
              border: '1px solid var(--color-ink)',
              background: author === a ? 'var(--color-ink)' : 'transparent',
              color: author === a ? 'var(--color-paper)' : 'var(--color-ink)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              cursor: state === 'recording' ? 'default' : 'pointer',
              opacity: state === 'recording' ? 0.4 : 1,
              minHeight: 44,
            }}
          >
            {a === 'both' ? 'Both' : a}
          </button>
        ))}
      </div>

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
