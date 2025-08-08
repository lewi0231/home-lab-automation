import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { ContentBlock } from '../components/content-renderer'
import { prisma } from '../lib/prisma'

// Simple MDX to JSON block converter
function mdxToBlocks(mdxContent: string): ContentBlock[] {
  const lines = mdxContent.split('\n')
  const blocks: ContentBlock[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Skip empty lines
    if (!line) continue

    // Handle headings
    if (line.startsWith('#')) {
      const level = line.match(/^#+/)?.[0].length || 1
      const text = line.replace(/^#+\s*/, '')
      blocks.push({
        type: 'heading',
        level: Math.min(level, 6) as 1 | 2 | 3 | 4 | 5 | 6,
        text,
      })
      continue
    }

    // Handle code blocks
    if (line.startsWith('```')) {
      const language = line.replace('```', '').trim()
      let code = ''
      i++ // Skip the opening ```

      while (i < lines.length && !lines[i].startsWith('```')) {
        code += lines[i] + '\n'
        i++
      }

      blocks.push({ type: 'code', language, code: code.trim() })
      continue
    }

    // Handle lists
    if (line.match(/^[\d]+\.\s/) || line.match(/^[-*]\s/)) {
      const items: string[] = []
      const ordered = line.match(/^[\d]+\.\s/) !== null

      while (
        i < lines.length &&
        (lines[i].match(/^[\d]+\.\s/) || lines[i].match(/^[-*]\s/))
      ) {
        const item = lines[i].replace(/^[\d]+\.\s/, '').replace(/^[-*]\s/, '')
        items.push(item)
        i++
      }
      i-- // Go back one line since the loop will increment

      blocks.push({ type: 'list', ordered, items })
      continue
    }

    // Handle quotes
    if (line.startsWith('>')) {
      const text = line.replace(/^>\s*/, '')
      blocks.push({ type: 'quote', text })
      continue
    }

    // Handle images
    const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/)
    if (imageMatch) {
      const [, alt, src] = imageMatch
      blocks.push({ type: 'image', src, alt })
      continue
    }

    // Handle horizontal rules
    if (line.match(/^[-*_]{3,}$/)) {
      blocks.push({ type: 'divider' })
      continue
    }

    // Default to paragraph - just use the current line
    blocks.push({ type: 'paragraph', text: line })
  }

  return blocks
}

async function migrateMdxToDatabase() {
  const contentDir = path.join(process.cwd(), 'content/blog')

  if (!fs.existsSync(contentDir)) {
    console.log('Content directory not found:', contentDir)
    return
  }

  const files = fs.readdirSync(contentDir)
  console.log(`Found ${files.length} files in content directory`)

  for (const file of files) {
    if (!file.endsWith('.mdx')) continue

    const slug = file.replace('.mdx', '')
    const filePath = path.join(contentDir, file)

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8')

      // Parse frontmatter
      const { data, content } = matter(fileContent)

      // Convert MDX content to JSON blocks
      const blocks = mdxToBlocks(content)

      console.log(`Processing ${slug}: ${blocks.length} blocks`)

      // Check if post already exists
      const existingPost = await prisma.post.findUnique({
        where: { slug },
      })

      if (existingPost) {
        console.log(`Updating existing post: ${slug}`)
        await prisma.post.update({
          where: { slug },
          data: {
            title: data.title || slug.replace(/-/g, ' '),
            content: content, // Store raw markdown content
            excerpt: data.description,
            published: true,
            publishedAt: data.date ? new Date(data.date) : new Date(),
            tags: data.tags || [],
            metaTitle: data.title,
            metaDescription: data.description,
          },
        })
      } else {
        console.log(`Creating new post: ${slug}`)
        await prisma.post.create({
          data: {
            slug,
            title: data.title || slug.replace(/-/g, ' '),
            content: content, // Store raw markdown content
            excerpt: data.description,
            published: true,
            publishedAt: data.date ? new Date(data.date) : new Date(),
            tags: data.tags || [],
            metaTitle: data.title,
            metaDescription: data.description,
          },
        })
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error)
    }
  }

  console.log('Migration completed!')
}

// Run the migration
migrateMdxToDatabase()
  .catch(console.error)
  .finally(() => process.exit(0))
