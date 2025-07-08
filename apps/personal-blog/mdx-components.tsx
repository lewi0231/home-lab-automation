import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import CodeBlock from './components/ui/code-block'
import Mermaid from './components/ui/mermaid'

// Blog Date Component
export function BlogDate({ date }: { date: string }) {
  return (
    <time className="mb-4 block text-sm text-gray-500 dark:text-gray-400">
      {new Date(date).toLocaleDateString('en-AU', {
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
    pre: CodeBlock, // Direct mapping - no wrapper needed
    InlineCode, // Custom component for inline code styling
    BlogDate,
    Mermaid, // Add Mermaid component
    Cover: ({ src, alt }: { src: string; alt: string; caption: string }) => {
      return (
        <figure
          className="border-red h-auto w-full border-2" // Debug border
        >
          <Image src={src} alt={alt} className="h-auto w-full rounded-2xl" />
        </figure>
      )
    },
  }
}

export const mdxComponents = {
  pre: CodeBlock, // Direct mapping - no wrapper needed
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
          width={1920}
          height={1080}
          className="h-auto w-full rounded-2xl"
        />
      </figure>
    )
  },
}
