'use client'
import { marked } from 'marked'
import { useEffect, useState } from 'react'

export default function DescriptionParser({
  description,
}: {
  description: string
}) {
  const [parsedContent, setParsedContent] = useState<string>('')

  useEffect(() => {
    const parseForLinks = async (text: string) => {
      // Configure marked for inline parsing
      marked.setOptions({
        gfm: true,
        breaks: false,
      })

      const result = await marked.parseInline(text)
      setParsedContent(result)
    }

    parseForLinks(description)
  }, [description])

  return (
    <p
      className="prose-a:hover:underline dark:prose-a:text-gray-300 text-base text-zinc-600 dark:text-zinc-400"
      dangerouslySetInnerHTML={{ __html: parsedContent }}
    />
  )
}
