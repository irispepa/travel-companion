import { useState, useRef, useCallback } from 'react'

export type RecordState = 'idle' | 'recording' | 'done'

export interface RecordResult {
  audioSrc: string
  duration: number
  waveform: number[]
}

export function useVoiceRecorder(onDone: (result: RecordResult) => void) {
  const [state, setState] = useState<RecordState>('idle')
  const [duration, setDuration] = useState(0)
  const [waveform, setWaveform] = useState<number[]>(Array(30).fill(0))

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const waveformIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const durationRef = useRef(0)
  const waveformAccRef = useRef<number[]>([])

  const clearIntervals = useCallback(() => {
    if (waveformIntervalRef.current !== null) {
      clearInterval(waveformIntervalRef.current)
      waveformIntervalRef.current = null
    }
    if (durationIntervalRef.current !== null) {
      clearInterval(durationIntervalRef.current)
      durationIntervalRef.current = null
    }
  }, [])

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const audioCtx = new AudioContext()
      audioCtxRef.current = audioCtx

      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []
      durationRef.current = 0
      waveformAccRef.current = []

      setDuration(0)
      setWaveform(Array(30).fill(0))
      setState('recording')

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const audioSrc = URL.createObjectURL(blob)

        // Average waveform across all samples, or use last snapshot
        const finalWaveform = waveformAccRef.current.length > 0
          ? waveformAccRef.current
          : Array(30).fill(0.3)

        // Stop all tracks
        stream.getTracks().forEach(t => t.stop())
        audioCtx.close().catch(() => {})

        setState('done')
        onDone({ audioSrc, duration: durationRef.current, waveform: finalWaveform })
      }

      mediaRecorder.start()

      // Sample analyser at ~10fps for waveform
      waveformIntervalRef.current = setInterval(() => {
        const analyserNode = analyserRef.current
        if (!analyserNode) return
        const bufferLength = analyserNode.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyserNode.getByteFrequencyData(dataArray)

        // Downsample to 30 bars
        const bars = 30
        const step = Math.floor(bufferLength / bars)
        const result: number[] = []
        for (let i = 0; i < bars; i++) {
          let sum = 0
          for (let j = 0; j < step; j++) {
            sum += dataArray[i * step + j] ?? 0
          }
          result.push(sum / step / 255) // normalise to [0,1]
        }
        waveformAccRef.current = result
        setWaveform(result)
      }, 100)

      // Increment duration every second
      durationIntervalRef.current = setInterval(() => {
        durationRef.current += 1
        setDuration(d => d + 1)
      }, 1000)
    } catch {
      // Microphone permission denied or unavailable — stay idle
      setState('idle')
    }
  }, [onDone])

  const stop = useCallback(() => {
    clearIntervals()
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }, [clearIntervals])

  return { state, duration, waveform, start, stop }
}
