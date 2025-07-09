'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import CopyCodeButton from './copy-code-button'

export default function CodeBlock({
  children,
  className,
  ...props
}: {
  children: ReactNode
  className?: string
}) {
  // Extract the actual code content from children
  let code = ''
  if (typeof children === 'string') {
    code = children
  } else if (children && typeof children === 'object' && 'props' in children) {
    // If children is a React element, extract its children (the actual code)
    const childrenProps = children.props as { children?: string }
    code = childrenProps.children || ''
  } else {
    code = children?.toString() || ''
  }

  console.debug('CodeBlock Classname:', className)
  return (
    <div className="group relative">
      <CopyCodeButton code={code} />
      <pre
        className={cn(
          className,
          'overflow-x-auto bg-gray-900 px-4 py-2 font-mono leading-7',
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  )
}
