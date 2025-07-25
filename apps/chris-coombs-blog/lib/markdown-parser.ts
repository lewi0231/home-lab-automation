import { ContentBlock } from '@/components/content-renderer'
import * as cheerio from 'cheerio'
import { marked } from 'marked'

// Configure marked for GitHub Flavored Markdown
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert line breaks to <br>
  pedantic: false, // Don't be overly strict
})

export async function parseMarkdownToBlocks(
  markdown: string,
): Promise<ContentBlock[]> {
  if (!markdown || typeof markdown !== 'string') {
    return []
  }

  // Parse the entire markdown to HTML first
  const html = await marked.parse(markdown)

  // Load HTML into cheerio for DOM manipulation
  const $ = cheerio.load(html)
  const blocks: ContentBlock[] = []

  // Iterate over the top-level child nodes
  $('body')
    .children()
    .each((index, element) => {
      const tagName = element.tagName.toLowerCase()

      switch (tagName) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          blocks.push({
            type: 'heading',
            level: parseInt(tagName[1], 10) as 1 | 2 | 3 | 4 | 5 | 6,
            text: $(element).html() || '',
          })
          break

        case 'p':
          blocks.push({
            type: 'paragraph',
            text: $(element).html() || '',
          })
          break

        case 'pre':
          const codeElement = $(element).find('code')
          blocks.push({
            type: 'code',
            language: codeElement.attr('class')?.replace('language-', '') || '',
            code: codeElement.text() || '',
          })
          break

        case 'ul':
        case 'ol':
          const items: string[] = []

          // Process all direct list items (including their nested content)
          $(element)
            .find('> li')
            .each((liIndex, liElement) => {
              // Get the full HTML content of this list item (including nested lists)
              let liHtml = $(liElement).html() || ''

              // Remove unwanted <p> tags from list items that cause line breaks
              // This is a common issue with markdown parsers
              liHtml = liHtml.replace(/<p>(.*?)<\/p>/g, '$1')

              items.push(liHtml)
            })

          // Only create a list block if we have items
          if (items.length > 0) {
            blocks.push({
              type: 'list',
              ordered: tagName === 'ol',
              items,
            })
          }
          break

        case 'blockquote':
          blocks.push({
            type: 'quote',
            text: $(element).html() || '',
          })
          break

        case 'hr':
          blocks.push({
            type: 'divider',
          })
          break

        case 'img':
          blocks.push({
            type: 'image',
            src: $(element).attr('src') || '',
            alt: $(element).attr('alt') || '',
          })
          break

        default:
          // Handle any other tags as paragraphs
          blocks.push({
            type: 'paragraph',
            text: $(element).html() || '',
          })
          break
      }
    })

  return blocks
}
