import { getBlogPosts } from '@/lib/blog'
import Link from 'next/link'

export default function BlogPage() {
  const posts = getBlogPosts()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Blog Posts</h1>
        <p className="text-gray-600 dark:text-gray-400">
          A record of my tinkering for myself and others.
        </p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="border-b border-gray-200 pb-6 dark:border-gray-800"
          >
            <Link href={`/blog/${post.slug}`} className="group">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <h2 className="text-xl font-semibold transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {post.description}
                  </p>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
