'use client'

import { ContentBlock, ContentRenderer } from '@/components/content-renderer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { parseMarkdownToBlocks } from '@/lib/markdown-parser'
import { useEffect, useState } from 'react'

interface Post {
  id: string
  title: string
  slug: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
  })
  const [showPreview, setShowPreview] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [accessKey, setAccessKey] = useState('')

  useEffect(() => {
    // Don't auto-authorize - always require access key
    // The GET endpoint is just to check if admin is enabled at all
    const checkIfEnabled = async () => {
      try {
        const response = await fetch('/api/admin/check-access')
        if (!response.ok) {
          // Admin is completely disabled
          alert('Admin access is disabled')
        }
      } catch (error) {
        console.error('Access check failed:', error)
      } finally {
        // Set loading to false regardless of authorization status
        setLoading(false)
      }
    }
    checkIfEnabled()
  }, [])

  const handleAccessKeySubmit = async () => {
    try {
      const response = await fetch('/api/admin/check-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessKey }),
      })

      if (response.ok) {
        setIsAuthorized(true)
        fetchPosts()
      } else {
        alert('Invalid access key')
      }
    } catch (error) {
      console.error('Access check failed:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const createPost = async () => {
    try {
      // Parse markdown to JSON blocks
      const contentBlocks = await parseMarkdownToBlocks(newPost.content)

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newPost,
          content: contentBlocks,
        }),
      })

      if (response.ok) {
        setNewPost({
          title: '',
          slug: '',
          content: '',
          excerpt: '',
          coverImage: '',
        })
        fetchPosts()
      }
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const togglePublishStatus = async (
    postId: string,
    currentStatus: boolean,
  ) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          published: !currentStatus,
        }),
      })

      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error updating post status:', error)
    }
  }

  const deletePost = async (postId: string, postTitle: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${postTitle}"? This action cannot be undone.`,
      )
    ) {
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPosts()
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post')
    }
  }

  // Move parsedBlocks calculation inside render and memoize it
  const [parsedBlocks, setParsedBlocks] = useState<ContentBlock[]>([])

  useEffect(() => {
    const parseContent = async () => {
      if (newPost.content) {
        const blocks = await parseMarkdownToBlocks(newPost.content)
        setParsedBlocks(blocks)
      } else {
        setParsedBlocks([])
      }
    }
    parseContent()
  }, [newPost.content])

  console.debug('Parsed Blocks are:', parsedBlocks)

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  // Show access key form if not authorized
  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-8 py-16">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Access Key
              </label>
              <Input
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Enter access key"
                onKeyPress={(e) => e.key === 'Enter' && handleAccessKeySubmit()}
              />
            </div>
            <Button onClick={handleAccessKeySubmit} className="w-full">
              Access Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-8">
      <h1 className="mb-8 text-3xl">Blog Admin</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Title</label>
            <Input
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              placeholder="Post title"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Slug</label>
            <Input
              value={newPost.slug}
              onChange={(e) => setNewPost({ ...newPost, slug: e.target.value })}
              placeholder="post-slug"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Cover Image
            </label>
            <Input
              value={newPost.coverImage}
              onChange={(e) =>
                setNewPost({ ...newPost, coverImage: e.target.value })
              }
              placeholder="cover-image.jpg"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Content (Markdown)
            </label>
            <textarea
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              placeholder="Write your post in markdown..."
              className="min-h-[300px] w-full rounded-md border p-3 font-mono text-sm"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Excerpt</label>
            <textarea
              value={newPost.excerpt}
              onChange={(e) =>
                setNewPost({ ...newPost, excerpt: e.target.value })
              }
              placeholder="Brief description"
              className="min-h-[100px] w-full rounded-md border p-3"
            />
          </div>
          <div className="flex space-x-4">
            <Button className="hover:cursor-pointer" onClick={createPost}>
              Create Post
            </Button>
            <Button
              className="hover:cursor-pointer"
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPreview && newPost.content && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <ContentRenderer content={parsedBlocks} />
            </div>
          </CardContent>
        </Card>
      )}

      <Separator className="my-8" />

      <div>
        <h2 className="mb-4 text-2xl font-bold">All Posts</h2>
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="py-0">
              <CardContent className="px-4 py-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-gray-600">{post.slug}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`rounded px-2 py-1 text-xs ${
                        post.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                    <Button
                      size="sm"
                      variant={post.published ? 'outline' : 'default'}
                      onClick={() =>
                        togglePublishStatus(post.id, post.published)
                      }
                      className="hover:cursor-pointer"
                    >
                      {post.published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deletePost(post.id, post.title)}
                      className="hover:cursor-pointer"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
