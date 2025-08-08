import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      published,
      title,
      slug,
      content,
      excerpt,
      coverImage,
      metaTitle,
      metaDescription,
      tags,
      customFields,
    } = body

    const updateData: Prisma.PostUpdateInput = {}

    // Only update fields that are provided
    if (published !== undefined) {
      updateData.published = published
      updateData.publishedAt = published ? new Date() : null
    }
    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = slug
    if (content !== undefined) updateData.content = content
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (coverImage !== undefined) updateData.coverImage = coverImage
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle
    if (metaDescription !== undefined)
      updateData.metaDescription = metaDescription
    if (tags !== undefined) updateData.tags = tags
    if (customFields !== undefined) updateData.customFields = customFields

    const post = await prisma.post.update({
      where: {
        id,
      },
      data: updateData,
      include: {
        author: true,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const post = await prisma.post.delete({
      where: {
        id,
      },
    })
    console.debug('Removed Post: ', post.slug)
    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 },
    )
  }
}
