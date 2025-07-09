import { getBlogPost } from '@/lib/blog'
import { notFound } from 'next/navigation'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  // This will be updated to fetch from database
  // For now, return empty array to avoid build-time errors
  return []
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return notFound()
  }

  return (
    <article className="prose prose-lg max-w-none">
      <h1 className="mb-1 font-bold">{post.title}</h1>
      {post.publishedAt && (
        <time className="text-sm text-gray-600">
          {new Date(post.publishedAt).toLocaleDateString()}
        </time>
      )}
      {post.excerpt && (
        <p className="mb-8 text-lg text-gray-700">{post.excerpt}</p>
      )}
      <div
        className="mt-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
}
