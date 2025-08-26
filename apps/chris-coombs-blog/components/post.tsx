import { BlogPost } from '@/lib/blog'
import { ContentRenderer } from './content-renderer'
import { BlogDate } from './ui/blog-date'
import CloudinaryImage from './ui/cloudinary-image'

type PostProps = {
  content: BlogPost['content']
  publishedAt?: BlogPost['publishedAt']
  slug: BlogPost['slug']
  coverImage?: BlogPost['coverImage']
  title: BlogPost['title']
  excerpt: BlogPost['excerpt']
  contentWarning: BlogPost['contentWarning']
}

export function Post({
  content,
  publishedAt,
  slug,
  coverImage,
  title,
  excerpt,
  contentWarning,
}: PostProps) {
  return (
    <article className="prose prose-lg max-w-none">
      <h1 className="mb-1 text-3xl font-light text-gray-800 dark:text-gray-300">
        {title}
      </h1>
      {publishedAt && <BlogDate date={publishedAt} />}
      {coverImage && (
        <CloudinaryImage key={slug} coverImage={coverImage} title={title} />
      )}
      {excerpt && (
        <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
          {excerpt} <br />
          <span className="italic">{contentWarning ?? ''}</span>
        </p>
      )}
      <ContentRenderer content={content} />
    </article>
  )
}

export default Post
