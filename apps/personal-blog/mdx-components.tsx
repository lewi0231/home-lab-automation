import CodeBlock from '@/components/ui/code-block'
import Mermaid from '@/components/ui/mermaid'
import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'

// Blog Date Component
export function BlogDate({ date }: { date: string }) {
  return (
    <time className="mb-4 block text-sm text-gray-500 dark:text-gray-400">
      {new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </time>
  )
}

// Custom inline code component for better styling
function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-gray-900 px-2 py-1 font-mono text-sm text-gray-300">
      {children}
    </span>
  )
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: CodeBlock, // Use our custom pre component
    InlineCode, // Custom component for inline code styling
    BlogDate,
    Mermaid, // Add Mermaid component
    Cover: ({ src, alt }: { src: string; alt: string; caption: string }) => {
      return (
        <figure
          className="border-red h-auto w-full border-2" // Debug border
        >
          <Image
            src={src}
            alt={alt}
            width={800}
            height={600}
            className="h-auto w-full rounded-2xl"
            priority={true}
          />
        </figure>
      )
    },
  }
}

// Custom pre component that handles both regular code blocks and Mermaid blocks
function CustomPre(props: React.ComponentProps<'pre'>) {
  const { children, ...rest } = props

  // Check if this is a mermaid code block
  let isMermaid = false
  let codeClassName = ''
  let mermaidCode = ''

  if (children && typeof children === 'object' && 'props' in children) {
    const childrenProps = children.props as {
      className?: string
      children?: string
    }
    codeClassName = childrenProps.className || ''
    mermaidCode = childrenProps.children || ''
    isMermaid = codeClassName.includes('language-mermaid')
  }

  // If this is a mermaid code block, use our Mermaid component
  if (isMermaid) {
    console.debug('Mermaid block detected:', codeClassName)
    return <Mermaid className={codeClassName}>{mermaidCode}</Mermaid>
  }

  // Otherwise, use the CodeBlock component
  return (
    <CodeBlock className={codeClassName} {...rest}>
      {children}
    </CodeBlock>
  )
}

export const mdxComponents = {
  pre: CustomPre, // Use our custom pre component
  InlineCode, // Custom component for inline code styling
  BlogDate,
  Mermaid, // Add Mermaid component
  Cover: ({ src, alt }: { src: string; alt: string; caption: string }) => {
    return (
      <figure
        className="border-red h-auto w-full border-2" // Debug border
      >
        <Image
          src={src}
          alt={alt}
          width={800}
          height={600}
          className="h-auto w-full rounded-2xl"
          priority={true}
        />
      </figure>
    )
  },
}
