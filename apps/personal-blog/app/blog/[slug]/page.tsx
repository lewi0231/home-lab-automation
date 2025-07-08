import { BlogDate, mdxComponents } from '@/mdx-components'
import fs from 'fs'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import path from 'path'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const blogDir = path.join(process.cwd(), 'content/blog')
  const files = fs.readdirSync(blogDir)
  const slugs = files
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => name.replace('.mdx', ''))
  return slugs.map((slug) => ({ slug }))
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params
  const filePath = path.join(process.cwd(), 'content/blog', `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return notFound()
  const file = fs.readFileSync(filePath, 'utf8')
  const { content, data } = matter(file)

  //TODO- Optionally use data.title, data.date, etc. for SEO or display

  return (
    <article>
      {data.title && <h1 className="mb-1 font-bold">{data.title}</h1>}
      <BlogDate date={data.date} />
      <MDXRemote source={content} components={mdxComponents} />
    </article>
  )
}
