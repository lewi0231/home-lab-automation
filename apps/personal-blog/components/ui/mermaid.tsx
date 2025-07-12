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

    // Ensure children is a string and clean it up
    let code = children
    if (Array.isArray(code)) {
      code = code.join('')
    }
    if (typeof code !== 'string') {
      code = String(code)
    }

    // Trim whitespace and normalize line endings
    code = code.trim().replace(/\r\n/g, '\n')

    // Initialize mermaid only once globally
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'monospace',
        // Add some additional configuration for better rendering
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
        },
        sequence: {
          useMaxWidth: true,
        },
        gantt: {
          useMaxWidth: true,
        },
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
        // Show error state in the container
        if (elementRef.current) {
          elementRef.current.innerHTML = `
            <div style="color: red; text-align: center; padding: 1rem;">
              Failed to render diagram: ${error.message}
            </div>
          `
        }
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
