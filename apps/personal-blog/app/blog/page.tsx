import AnimatedPosts from '@/components/ui/animated-posts'
import { getBlogPosts, type BlogPost } from '@/lib/blog'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  let posts: BlogPost[] = []

  try {
    posts = await getBlogPosts()
  } catch (error) {
    console.error('Error fetching posts:', error)
    // Return empty posts array if database is not available
  }

  return (
    <AnimatedPosts
      posts={posts}
      title="Blog Posts"
      wrapWithMain={true}
      subtitle="A record of my humble attempts to understand and remember things"
      isBlogPage={true}
    />
  )
}
