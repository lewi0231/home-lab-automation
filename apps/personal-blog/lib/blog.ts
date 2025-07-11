import { ContentBlock } from '@/components/content-renderer'
import { prisma } from './prisma'

export interface BlogPost {
  id: string
  slug: string
  title: string
  content: ContentBlock[]
  excerpt?: string
  description?: string
  date?: string
  published: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  layout: string
  featured: boolean
  coverImage?: string
  metaTitle?: string
  metaDescription?: string
  tags: string[]
  customFields?: Record<string, unknown>
  authorId?: string
  author?: {
    id: string
    name?: string
    email: string
    avatar?: string
    bio?: string
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    })
    return posts as unknown as BlogPost[]
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug,
        published: true,
      },
      include: {
        author: true,
      },
    })
    return post as unknown as BlogPost | null
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        featured: true,
      },
      include: {
        author: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 3,
    })
    return posts as unknown as BlogPost[]
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        tags: {
          has: tag,
        },
      },
      include: {
        author: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    })
    return posts as unknown as BlogPost[]
  } catch (error) {
    console.error('Error fetching posts by tag:', error)
    return []
  }
}
