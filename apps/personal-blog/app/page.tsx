import AnimatedHomePage from '@/components/ui/animated-homepage'
import { getBlogPosts, type BlogPost } from '@/lib/blog'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function Personal() {
  let posts: BlogPost[] = []

  try {
    posts = await getBlogPosts()
  } catch (error) {
    console.error('Error fetching posts:', error)
    // Return empty posts array if database is not available
  }

  return <AnimatedHomePage posts={posts} />
}
