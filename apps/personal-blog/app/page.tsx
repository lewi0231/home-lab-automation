import AnimatedHomePage from '@/components/ui/animated-homepage'
import { getBlogPosts } from '@/lib/blog'

export default function Personal() {
  const posts = getBlogPosts()

  return <AnimatedHomePage posts={posts} />
}
