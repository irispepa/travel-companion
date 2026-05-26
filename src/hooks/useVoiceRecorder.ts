import { useState, useRef, useCallback } from 'react'

export type RecordState = 'idle' | 'recording' | 'done'

export interface RecordResult {
  audioSrc: string
  audioBlob: Blob
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
  const waveformAccRef = useRef<number[][]>([])

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

      const mimeType = ['audio/mp4', 'audio/aac', 'audio/webm;codecs=opus', 'audio/webm']
        .find(t => MediaRecorder.isTypeSupported(t)) ?? ''
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {})
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []
      durationRef.current = 0
      waveformAccRef.current = [] as number[][]

      setDuration(0)
      setWaveform(Array(30).fill(0))
      setState('recording')

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type: mimeType })
        const audioSrc = URL.createObjectURL(blob)

        // Average all collected samples into a single waveform
        const samples = waveformAccRef.current
        const finalWaveform = samples.length > 0
          ? samples[0].map((_, i) => samples.reduce((sum, s) => sum + s[i], 0) / samples.length)
          : Array(30).fill(0.3)

        // Stop all tracks
        stream.getTracks().forEach(t => t.stop())
        audioCtx.close().catch(() => {})

        setState('done')
        onDone({ audioSrc, audioBlob: blob, duration: durationRef.current, waveform: finalWaveform })
      }

      mediaRecorder.start()

      // Sample analyser at ~10fps — use time-domain data for even amplitude distribution
      waveformIntervalRef.current = setInterval(() => {
        const analyserNode = analyserRef.current
        if (!analyserNode) return
        const bufferLength = analyserNode.fftSize
        const dataArray = new Uint8Array(bufferLength)
        analyserNode.getByteTimeDomainData(dataArray)

        // Downsample to 30 bars by computing RMS amplitude in each segment
        const bars = 30
        const step = Math.floor(bufferLength / bars)
        const result: number[] = []
        for (let i = 0; i < bars; i++) {
          let sum = 0
          for (let j = 0; j < step; j++) {
            const v = (dataArray[i * step + j] - 128) / 128 // centre around 0
            sum += v * v
          }
          result.push(Math.sqrt(sum / step)) // RMS, normalised to [0,1]
        }
        waveformAccRef.current.push(result)
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

  const cleanup = useCallback(() => {
    clearIntervals()
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop())
    audioCtxRef.current?.close().catch(() => {})
  }, [clearIntervals])

  return { state, duration, waveform, start, stop, cleanup }
}
