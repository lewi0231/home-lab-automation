import { prisma } from './prisma'

export interface BlogPost {
  id: string
  slug: string
  title: string
  content: string
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
  contentWarning?: string
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
    // Handle different types of errors more robustly
    if (error instanceof Error) {
      console.error('Error fetching blog posts:', error.message)
    } else if (error !== null && error !== undefined) {
      console.error('Error fetching blog posts:', String(error))
    } else {
      console.error('Error fetching blog posts: Unknown error')
    }
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
    // Handle different types of errors more robustly
    if (error instanceof Error) {
      console.error('Error fetching blog post:', error.message)
    } else if (error !== null && error !== undefined) {
      console.error('Error fetching blog post:', String(error))
    } else {
      console.error('Error fetching blog post: Unknown error')
    }
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
    // Handle different types of errors more robustly
    if (error instanceof Error) {
      console.error('Error fetching featured posts:', error.message)
    } else if (error !== null && error !== undefined) {
      console.error('Error fetching featured posts:', String(error))
    } else {
      console.error('Error fetching featured posts: Unknown error')
    }
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
    // Handle different types of errors more robustly
    if (error instanceof Error) {
      console.error('Error fetching posts by tag:', error.message)
    } else if (error !== null && error !== undefined) {
      console.error('Error fetching posts by tag:', String(error))
    } else {
      console.error('Error fetching posts by tag: Unknown error')
    }
    return []
  }
}
