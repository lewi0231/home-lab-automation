import { ContentBlock, ContentRenderer } from '@/components/content-renderer'
import { BlogDate } from '@/components/ui/blog-date'
import { getBlogPost, getBlogPosts } from '@/lib/blog'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts()

    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return notFound()
  }

  return (
    <article className="prose prose-lg max-w-none">
      <h1 className="mb-1 text-3xl font-light text-gray-800 dark:text-gray-300">
        {post.title}
      </h1>
      {post.publishedAt && <BlogDate date={post.publishedAt} />}
      {post.coverImage && (
        <figure key={post.coverImage} className="mb-10">
          <Image
            src={`/${post?.coverImage}`}
            alt="AI Generated Cover Image"
            className="w-full rounded-lg"
            width={800}
            height={400}
          />
        </figure>
      )}
      {post.excerpt && (
        <p className="mb-8 text-lg text-gray-700">{post.excerpt}</p>
      )}
      <ContentRenderer content={post.content as ContentBlock[]} />
    </article>
  )
}
