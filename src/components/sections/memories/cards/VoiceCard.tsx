import React, { useRef, useState, useEffect } from 'react'
import { VoiceMemory } from '../../../../db/schema'

// Module-level singleton — only one voice card plays at a time
let _currentAudio: HTMLAudioElement | null = null

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

function Waveform({
  bars,
  state,
  playProgress,
}: {
  bars: number[]
  state: 'empty' | 'recording' | 'recorded'
  playProgress?: number // 0–1
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 28, flex: 1, minWidth: 0, overflow: 'hidden' }}>
      {bars.map((h, i) => {
        const played = state === 'recorded' && playProgress !== undefined
          ? i / bars.length < playProgress
          : false
        // h is 0–1 normalised; scale to 3–24px range for visible bars
        const heightPx = state === 'empty' ? 3 : Math.max(3, Math.round(h * 24))
        return (
          <div
            key={i}
            style={{
              width: 3,
              flexShrink: 0,
              borderRadius: 2,
              height: heightPx,
              background: state === 'recording'
                ? 'var(--color-stamp)'
                : played
                ? 'var(--color-ink)'
                : 'var(--color-ink-faint)',
              opacity: state === 'recording'
                ? (0.4 + (i % 3) * 0.2)
                : state === 'empty' ? 0.35 : (played ? 0.95 : 0.32),
              animation: state === 'recording'
                ? `voiceBar ${0.8 + (i % 5) * 0.15}s ease-in-out infinite alternate`
                : 'none',
              animationDelay: state === 'recording' ? `${(i % 7) * 0.08}s` : '0s',
            }}
          />
        )
      })}
    </div>
  )
}

const DEFAULT_BARS = Array.from({ length: 30 }, (_, i) => 0.3 + 0.5 * Math.sin(i * 0.7 + 1))

export function VoiceCard({ entry, width, state = 'recorded', onStartRecord, onStopRecord }: Props) {
  const maxAmplitude = entry.waveform.length > 0 ? Math.max(...entry.waveform) : 0
  // Normalise bars to fill the display range — avoids flat dots on quiet recordings
  const bars = entry.waveform.length > 0 && maxAmplitude > 0.001
    ? entry.waveform.map(v => v / maxAmplitude)
    : DEFAULT_BARS
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [playProgress, setPlayProgress] = useState(0)

  // Tear down and reset audio whenever the entry changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setPlaying(false)
    setPlayProgress(0)
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = null
    }
  }, [entry.id])

  function vibrate(pattern: number | number[]) {
    try { navigator.vibrate?.(pattern) } catch { /* not supported */ }
  }

  // Always derive a fresh object URL from the stored blob — blob: URLs don't survive page reload
  function resolveAudioUrl(): string | null {
    if (entry.audioBlob) return URL.createObjectURL(entry.audioBlob)
    return null
  }

  function handleControlClick() {
    if (state === 'empty') {
      vibrate(10)
      onStartRecord?.()
    } else if (state === 'recording') {
      vibrate([10, 50, 10])
      onStopRecord?.()
    } else if (state === 'recorded') {
      const src = resolveAudioUrl()
      if (!src) return
      if (!audioRef.current) {
        const audio = new Audio(src)
        audioRef.current = audio

        audio.addEventListener('timeupdate', () => {
          if (audio.duration) {
            setPlayProgress(audio.currentTime / audio.duration)
          }
        })

        audio.addEventListener('ended', () => {
          setPlaying(false)
          setPlayProgress(0)
          if (_currentAudio === audio) _currentAudio = null
          if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'paused'
          }
        })

        audio.addEventListener('pause', () => {
          setPlaying(false)
          if (_currentAudio === audio) _currentAudio = null
          if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'paused'
          }
        })

        audio.addEventListener('play', () => {
          setPlaying(true)
          if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'playing'
          }
        })
      }

      if (playing) {
        audioRef.current.pause()
        vibrate(5)
      } else {
        // Stop any other card that's currently playing
        if (_currentAudio && _currentAudio !== audioRef.current) {
          _currentAudio.pause()
        }
        _currentAudio = audioRef.current
        // Wire Media Session
        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: 'Voice note',
            artist: entry.author === 'both' ? 'Iris & Niko' : entry.author,
          })
          navigator.mediaSession.setActionHandler('play', () => audioRef.current?.play())
          navigator.mediaSession.setActionHandler('pause', () => audioRef.current?.pause())
        }

        audioRef.current.play().catch(() => {})
        vibrate(10)
      }
    }
  }

  const controlStyle: React.CSSProperties = state === 'recording'
    ? {
        width: 36, height: 36, borderRadius: '50%',
        background: 'var(--color-stamp)',
        border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        animation: 'voiceStopBreathe 1.4s ease-in-out infinite',
      }
    : state === 'empty'
    ? {
        width: 36, height: 36, borderRadius: '50%',
        border: '1px dashed var(--color-ink)',
        background: 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }
    : {
        width: 36, height: 36, borderRadius: '50%',
        background: 'var(--color-ink)',
        border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }

  return (
    <div
      aria-label="Voice note"
      style={{
        width,
        background: 'var(--color-white)',
        border: '1px solid var(--color-ink)',
        borderRadius: 4,
        boxShadow: '2px 3px 0 var(--color-ink)',
        padding: '8px 10px 12px',
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
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--color-stamp)',
              animation: 'voicePulse 1s ease-in-out infinite',
            }} />
          )}
          <span
            aria-live="polite"
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--color-ink-faint)', letterSpacing: '0.04em',
            }}
          >
            {formatDuration(entry.duration)}
          </span>
        </div>
      </div>

      <div style={{ borderTop: '1px dashed var(--color-rule)', paddingTop: 10, paddingBottom: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 44 }}>
          <button
            onClick={handleControlClick}
            aria-label={
              state === 'recording' ? 'Stop recording'
              : state === 'empty' ? 'Start recording'
              : playing ? 'Pause voice memo' : 'Play voice memo'
            }
            style={{ ...controlStyle, cursor: 'pointer' }}
          >
            {state === 'recording' && (
              <div style={{ width: 10, height: 10, background: 'var(--color-white)', borderRadius: 1.5 }} />
            )}
            {state === 'empty' && (
              <span style={{ fontSize: 16 }}>🎙</span>
            )}
            {state === 'recorded' && !playing && (
              <div style={{
                width: 0, height: 0,
                borderTop: '7px solid transparent',
                borderBottom: '7px solid transparent',
                borderLeft: '11px solid var(--color-white)',
                marginLeft: 2,
              }} />
            )}
            {state === 'recorded' && playing && (
              <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <div style={{ width: 3, height: 10, background: 'var(--color-white)', borderRadius: 1 }} />
                <div style={{ width: 3, height: 10, background: 'var(--color-white)', borderRadius: 1 }} />
              </div>
            )}
          </button>
          <Waveform bars={bars} state={state} playProgress={playing ? playProgress : undefined} />
        </div>

        <div style={{ marginTop: 6 }}>
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
        </div>
      </div>
    </div>
  )
}
