import Post from '@/components/post'
import { getBlogPost, getBlogPosts, type BlogPost } from '@/lib/blog'
import { notFound } from 'next/navigation'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

// don't need this as we want it to be a static (NOT SSR)
// export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params
  let post: BlogPost | null = null

  try {
    post = await getBlogPost(slug)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return notFound()
  }
  console.log(post?.contentWarning)
  if (!post) {
    return notFound()
  }

  return (
    <Post
      content={post.content}
      title={post.title}
      coverImage={post.coverImage}
      excerpt={post.excerpt}
      slug={post.slug}
      publishedAt={post.publishedAt}
      contentWarning={post.contentWarning}
    />
  )
}
