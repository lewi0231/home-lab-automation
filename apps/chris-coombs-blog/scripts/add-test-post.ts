import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addTestPost() {
  try {
    const post = await prisma.post.create({
      data: {
        title: 'Test Post',
        slug: 'test-post',
        content: [
          {
            type: 'paragraph',
            content:
              'This is a test post to verify the database connection is working.',
          },
        ],
        excerpt: 'A test post for development',
        published: true,
        publishedAt: new Date(),
        layout: 'post',
        featured: false,
        tags: ['test'],
        metaTitle: 'Test Post',
        metaDescription: 'A test post for development',
      },
    })

    console.log('Test post created:', post)
  } catch (error) {
    console.error('Error creating test post:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addTestPost()
