import type { MDXComponents } from 'mdx/types'
import CodeBlock from './components/ui/code-block'

// Blog Date Component
function BlogDate({ date }: { date: string }) {
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
function InlineCode({ children }: any) {
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
    Cover: ({
      src,
      alt,
      caption,
    }: {
      src: string
      alt: string
      caption: string
    }) => {
      return (
        <figure
          className="border-red h-auto w-full border-2" // Debug border
        >
          <img src={src} alt={alt} className="h-auto w-full rounded-2xl" />
        </figure>
      )
    },
  }
}

export const mdxComponents = {
  pre: CodeBlock, // Direct mapping - no wrapper needed
  InlineCode, // Custom component for inline code styling
  BlogDate,
  Cover: ({
    src,
    alt,
    caption,
  }: {
    src: string
    alt: string
    caption: string
  }) => {
    return (
      <figure
        className="border-red h-auto w-full border-2" // Debug border
      >
        <img src={src} alt={alt} className="h-auto w-full rounded-2xl" />
      </figure>
    )
  },
}
