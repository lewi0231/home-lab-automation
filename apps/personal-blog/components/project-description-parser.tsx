import { marked } from 'marked'

export default function DescriptionParser({
  description,
  ...props
}: {
  description: string
}) {
  const parseForLinks = (text: string) => {
    // Configure marked for inline parsing
    marked.setOptions({
      gfm: true,
      breaks: false,
    })

    const result = marked.parseInline(text)
    return result
  }

  const result = parseForLinks(description)

  return (
    <p
      className="prose-a:hover:underline dark:prose-a:text-gray-300 text-base text-zinc-600 dark:text-zinc-400"
      dangerouslySetInnerHTML={{ __html: result }}
    />
  )
}
