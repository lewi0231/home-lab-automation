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
  className: string
}) {
  const code = children?.toString() || ''

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
        <code className="">{children}</code>
      </pre>
    </div>
  )
}
