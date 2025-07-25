import { ContentBlock, ContentRenderer } from '@/components/content-renderer'
import { BlogDate } from '@/components/ui/blog-date'
import CloudinaryImage from '@/components/ui/cloudinary-image'
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
        <CloudinaryImage key={post.slug} post={post} />
        // <figure key={post.coverImage} className="mb-10">
        //   <Image
        //     src={post?.coverImage}
        //     alt="AI Generated Cover Image"
        //     className="w-full rounded-lg"
        //     width={800}
        //     height={400}
        //   />
        // </figure>
      )}
      {post.excerpt && (
        <p className="mb-8 text-lg text-gray-700">{post.excerpt}</p>
      )}
      <ContentRenderer content={post.content as ContentBlock[]} />
    </article>
  )
}
