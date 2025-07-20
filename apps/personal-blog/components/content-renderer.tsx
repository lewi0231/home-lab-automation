'use client'

import { cn } from '@/lib/utils'
import CloudinaryImage from './ui/cloudinary-image'
import Mermaid from './ui/mermaid'

export type ContentBlock =
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'divider' }

interface ContentRendererProps {
  content: ContentBlock[]
  className?: string
}

export function ContentRenderer({ content, className }: ContentRendererProps) {
  const renderBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'heading':
        const headingClasses = cn(
          'font-medium tracking-tight ',
          block.level === 1 && 'mb-4 text-3xl',
          block.level === 2 && 'mt-8 mb-3 text-2xl',
          block.level === 3 && 'mt-6 mb-2 text-xl',
          block.level === 4 && 'mt-4 mb-2 text-lg',
          block.level === 5 && 'mt-3 mb-1 text-base',
          block.level === 6 && 'mt-2 mb-1 text-sm',
        )

        switch (block.level) {
          case 1:
            return (
              <h1 key={index} className={headingClasses}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: block.text,
                  }}
                />
              </h1>
            )
          case 2:
            return (
              <h2 key={index} className={headingClasses}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: block.text,
                  }}
                />
              </h2>
            )
          case 3:
            return (
              <h3 key={index} className={headingClasses}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: block.text,
                  }}
                />
              </h3>
            )
          case 4:
            return (
              <h4 key={index} className={headingClasses}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: block.text,
                  }}
                />
              </h4>
            )
          case 5:
            return (
              <h5 key={index} className={headingClasses}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: block.text,
                  }}
                />
              </h5>
            )
          case 6:
            return (
              <h6 key={index} className={headingClasses}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: block.text,
                  }}
                />
              </h6>
            )
          default:
            return (
              <h2 key={index} className={headingClasses}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: block.text,
                  }}
                />
              </h2>
            )
        }

      case 'paragraph':
        return (
          <p key={index} className="mb-4 leading-relaxed">
            <span
              dangerouslySetInnerHTML={{
                __html: block.text,
              }}
            />
          </p>
        )

      case 'code':
        if (block.language === 'mermaid') {
          return <Mermaid key={index}>{block.code}</Mermaid>
        }
        return (
          <div key={index} className="mb-4">
            <pre className="overflow-x-auto rounded-lg bg-gray-100 p-4 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
              <code className={`language-${block.language}`}>{block.code}</code>
            </pre>
          </div>
        )

      case 'list':
        const ListTag = block.ordered ? 'ol' : 'ul'
        return (
          <ListTag
            key={index}
            className={cn('', block.ordered ? 'list-decimal' : 'list-disc', '')}
          >
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex} className="mb-1">
                <span
                  dangerouslySetInnerHTML={{
                    __html: item,
                  }}
                />
              </li>
            ))}
          </ListTag>
        )

      case 'quote':
        return (
          <blockquote
            key={index}
            className="mb-4 border-l-4 border-gray-300 pl-4 italic dark:border-gray-600"
          >
            <p className="mb-2">
              <span
                dangerouslySetInnerHTML={{
                  __html: block.text,
                }}
              />
            </p>
            {block.author && (
              <cite className="text-sm text-gray-600 dark:text-gray-400">
                — {block.author}
              </cite>
            )}
          </blockquote>
        )

      case 'image':
        return <CloudinaryImage key={index} block={block} />

      case 'divider':
        return (
          <hr
            key={index}
            className="my-8 border-gray-300 dark:border-gray-600"
          />
        )

      default:
        return null
    }
  }

  return (
    <div className={cn('max-w-none', className)}>
      {content.map((block, index) => renderBlock(block, index))}
    </div>
  )
}
