import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

interface Props { children: React.ReactNode }

export function PageTransition({ children }: Props) {
  const location = useLocation()
  const [displayedChildren, setDisplayedChildren] = useState(children)
  const [phase, setPhase] = useState<'idle' | 'exit' | 'enter'>('idle')
  const pendingChildren = useRef(children)

  useEffect(() => {
    pendingChildren.current = children
    setPhase('exit')
  }, [location.key])

  useEffect(() => {
    if (phase === 'exit') {
      const t = setTimeout(() => {
        setDisplayedChildren(pendingChildren.current)
        setPhase('enter')
      }, 120)
      return () => clearTimeout(t)
    }
    if (phase === 'enter') {
      const t = setTimeout(() => setPhase('idle'), 260)
      return () => clearTimeout(t)
    }
  }, [phase])

  const style: React.CSSProperties = {
    height: '100%',
    opacity: phase === 'exit' ? 0 : 1,
    transform: phase === 'enter' ? 'translateY(0)' : phase === 'exit' ? 'translateY(-6px)' : 'translateY(0)',
    transition: phase === 'idle'
      ? 'none'
      : `opacity ${phase === 'exit' ? '120ms' : '220ms'} var(--ease-out-expo), transform ${phase === 'exit' ? '120ms' : '220ms'} var(--ease-out-expo)`,
  }

  // On enter, start from slightly below
  const enterStyle: React.CSSProperties = phase === 'enter'
    ? { ...style, transform: 'translateY(0)', animationName: 'pageEnter', animationDuration: '220ms', animationTimingFunction: 'var(--ease-out-expo)', animationFillMode: 'both' }
    : style

  return <div style={enterStyle}>{displayedChildren}</div>
}
