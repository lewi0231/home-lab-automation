'use client'

import mermaid from 'mermaid'
import { useEffect, useRef, useState } from 'react'

interface MermaidProps {
  children: string
  className?: string
}

export default function Mermaid({ children, className }: MermaidProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isRendered, setIsRendered] = useState(false)

  useEffect(() => {
    if (!elementRef.current || isRendered) return

    // Ensure children is a string
    let code = children
    if (Array.isArray(code)) {
      code = code.join('')
    }
    if (typeof code !== 'string') {
      code = String(code)
    }

    // Initialize mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'monospace',
    })

    // Render the diagram
    mermaid.render(`mermaid-${Date.now()}`, code).then(({ svg }) => {
      if (elementRef.current) {
        elementRef.current.innerHTML = svg
        setIsRendered(true)
      }
    })
  }, [children, isRendered])

  return (
    <div
      ref={elementRef}
      className={`mermaid-container ${className || ''}`}
      style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '2rem 0',
        overflow: 'auto',
      }}
    />
  )
}
