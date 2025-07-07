import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

export interface BlogPost {
  slug: string
  title: string
  date: string
  description?: string
  content: string
}

const blogDirectory = path.join(process.cwd(), 'content/blog')

export function getBlogPosts(): BlogPost[] {
  const fileNames = fs.readdirSync(blogDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace('.mdx', '')
      const fullPath = path.join(blogDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')

      // Parse frontmatter
      const { data, content } = matter(fileContents)

      // Extract title from first h1 if not in frontmatter
      const titleMatch = content.match(/^#\s+(.+)$/m)
      const title = data.title || titleMatch?.[1] || slug.replace(/-/g, ' ')

      return {
        slug,
        title,
        date: data.date || '2025-01-01', // Default date if not provided
        description: data.description,
        content,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return allPostsData
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    const { data, content } = matter(fileContents)

    // Extract title from first h1 if not in frontmatter
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const title = data.title || titleMatch?.[1] || slug.replace(/-/g, ' ')

    return {
      slug,
      title,
      date: data.date || '2024-01-01',
      description: data.description,
      content,
    }
  } catch (error) {
    console.error(error)
    return null
  }
}
