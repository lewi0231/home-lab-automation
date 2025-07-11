import AnimatedHomePage from '@/components/ui/animated-homepage'
import { getBlogPosts } from '@/lib/blog'

export default async function Personal() {
  const posts = await getBlogPosts()

  return <AnimatedHomePage posts={posts} />
}
