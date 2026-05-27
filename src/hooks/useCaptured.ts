import { useState, useRef, useEffect } from 'react'

export function useCaptured(onClose: () => void) {
  const [captured, setCaptured] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [])

  function trigger(saveFn: () => void) {
    if (captured) return
    saveFn()
    setCaptured(true)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setCaptured(false)
      onClose()
    }, 600)
  }

  return { captured, trigger }
}
