import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ContentBlock {
  type: string
  content?: string
  text?: string
  src?: string
  alt?: string
}

function blocksToMarkdown(blocks: ContentBlock[]): string {
  let markdown = ''

  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
        markdown += (block.content || block.text || '') + '\n\n'
        break
      case 'heading':
        const level = block.content?.match(/^#{1,6}/)?.[0].length || 1
        const text =
          block.content?.replace(/^#{1,6}\s*/, '') || block.text || ''
        markdown += '#'.repeat(level) + ' ' + text + '\n\n'
        break
      case 'code':
        markdown += '```\n' + (block.content || block.text || '') + '\n```\n\n'
        break
      case 'image':
        markdown += `![${block.alt || ''}](${block.src || ''})\n\n`
        break
      case 'divider':
        markdown += '---\n\n'
        break
      default:
        // For unknown types, just add the content as text
        markdown += (block.content || block.text || '') + '\n\n'
    }
  }

  return markdown.trim()
}

async function convertBlocksToMarkdown() {
  try {
    console.log('Starting conversion of parsed blocks to raw markdown...')

    // Get all posts
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        slug: true,
        content: true,
      },
    })

    console.log(`Found ${posts.length} posts to convert`)

    let convertedCount = 0
    let skippedCount = 0

    for (const post of posts) {
      try {
        // Check if content is already a string (already converted)
        if (typeof post.content === 'string') {
          console.log(`Skipping ${post.slug} - already raw markdown`)
          skippedCount++
          continue
        }

        // Convert parsed blocks to markdown
        const markdown = blocksToMarkdown(post.content as ContentBlock[])

        // Update the post with raw markdown
        await prisma.post.update({
          where: { id: post.id },
          data: { content: markdown },
        })

        console.log(
          `Converted ${post.slug}: ${(post.content as ContentBlock[]).length} blocks -> ${markdown.length} chars`,
        )
        convertedCount++
      } catch (error) {
        console.error(`Error converting post ${post.slug}:`, error)
      }
    }

    console.log(`\nConversion completed!`)
    console.log(`Converted: ${convertedCount} posts`)
    console.log(`Skipped: ${skippedCount} posts`)
  } catch (error) {
    console.error('Error during conversion:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the conversion
convertBlocksToMarkdown()
  .catch(console.error)
  .finally(() => process.exit(0))
