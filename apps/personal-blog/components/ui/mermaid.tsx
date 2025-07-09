'use client'

import mermaid from 'mermaid'
import { useEffect, useRef, useState } from 'react'

interface MermaidProps {
  children: string
  className?: string
}

// Global flag to ensure mermaid is only initialized once
let mermaidInitialized = false

export default function Mermaid({ children, className }: MermaidProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isRendered, setIsRendered] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Create a stable ID based on content hash to avoid hydration issues
  const createStableId = (content: string) => {
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return `mermaid-${Math.abs(hash).toString(36)}`
  }

  const diagramId = useRef(createStableId(children))

  // Handle mounting to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!elementRef.current || isRendered || !mounted) return

    // Ensure children is a string
    let code = children
    if (Array.isArray(code)) {
      code = code.join('')
    }
    if (typeof code !== 'string') {
      code = String(code)
    }

    // Initialize mermaid only once globally
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'monospace',
      })
      mermaidInitialized = true
    }

    // Render the diagram
    mermaid
      .render(diagramId.current, code)
      .then(({ svg }) => {
        if (elementRef.current) {
          elementRef.current.innerHTML = svg
          setIsRendered(true)
        }
      })
      .catch((error) => {
        console.error('Mermaid rendering error:', error)
      })
  }, [children, isRendered, mounted])

  // Show a loading state until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div
        className={`mermaid-container ${className || ''}`}
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '2rem 0',
          overflow: 'auto',
          minHeight: '200px',
          alignItems: 'center',
        }}
      >
        <div className="text-gray-500">Loading diagram...</div>
      </div>
    )
  }

  return (
    <div
      ref={elementRef}
      className={`mermaid-container ${className || ''}`}
      style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '2rem 0',
        overflow: 'auto',
        minHeight: '200px',
      }}
    />
  )
}
