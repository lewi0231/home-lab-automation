import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      content,
      excerpt,
      published = false,
      layout = 'default',
      featured = false,
      coverImage,
      metaTitle,
      metaDescription,
      tags = [],
      customFields,
    } = body

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        published,
        publishedAt: published ? new Date() : null,
        layout,
        featured,
        coverImage,
        metaTitle,
        metaDescription,
        tags,
        customFields,
      },
      include: {
        author: true,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 },
    )
  }
}
