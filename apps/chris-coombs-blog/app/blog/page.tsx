import AnimatedPosts from '@/components/ui/animated-posts'
import { getBlogPosts, type BlogPost } from '@/lib/blog'

// Enable static generation with revalidation
export const revalidate = 3600 // Revalidate every hour

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
      subtitle="My prosaic ponderings."
      isBlogPage={true}
    />
  )
}
