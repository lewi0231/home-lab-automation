import AnimatedPosts from '@/components/ui/animated-posts'
import { getBlogPosts } from '@/lib/blog'

export default function BlogPage() {
  const posts = getBlogPosts()

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
