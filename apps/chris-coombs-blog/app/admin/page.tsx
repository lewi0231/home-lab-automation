'use client'

import { ContentBlock, ContentRenderer } from '@/components/content-renderer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ImageUpload from '@/components/ui/image-upload'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { parseMarkdownToBlocks } from '@/lib/markdown-parser'
import { Edit, Eye, EyeOff, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export interface Post {
  id: string
  title: string
  slug: string
  published: boolean
  createdAt: string
  updatedAt: string
  content?: string
  excerpt?: string
  coverImage?: string
}

interface FormData {
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage: string
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState<FormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
  })
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [accessKey, setAccessKey] = useState('')
  const [parsedBlocks, setParsedBlocks] = useState<ContentBlock[]>([])

  useEffect(() => {
    // Check for persisted admin access
    const persistedAuth = localStorage.getItem('admin_authorized')
    const authTimestamp = localStorage.getItem('admin_auth_timestamp')

    if (persistedAuth === 'true' && authTimestamp) {
      const timestamp = parseInt(authTimestamp)
      const now = Date.now()
      const authValidFor = 24 * 60 * 60 * 1000 // 24 hours

      if (now - timestamp < authValidFor) {
        setIsAuthorized(true)
        fetchPosts()
        setLoading(false)
        return
      } else {
        // Clear expired auth
        localStorage.removeItem('admin_authorized')
        localStorage.removeItem('admin_auth_timestamp')
      }
    }

    const checkIfEnabled = async () => {
      try {
        const response = await fetch('/api/admin/check-access')
        if (!response.ok) {
          alert('Admin access is disabled')
        }
      } catch (error) {
        console.error('Access check failed:', error)
      } finally {
        setLoading(false)
      }
    }
    checkIfEnabled()
  }, [])

  const handleAccessKeySubmit = async () => {
    // Client-side validation
    if (!accessKey.trim()) {
      alert('Please enter an access key')
      return
    }

    if (accessKey.length < 8) {
      alert('Access key must be at least 8 characters long')
      return
    }

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
        // Persist authorization with timestamp
        localStorage.setItem('admin_authorized', 'true')
        localStorage.setItem('admin_auth_timestamp', Date.now().toString())
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
      // Store raw markdown content directly instead of parsing to blocks
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost), // Send raw markdown content
      })

      if (response.ok) {
        setNewPost({
          title: '',
          slug: '',
          content: '',
          excerpt: '',
          coverImage: '',
        })
        setShowCreateForm(false)
        fetchPosts()
      }
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const updatePost = async () => {
    if (!editingPost) return

    try {
      // Store raw markdown content directly instead of parsing to blocks
      const response = await fetch(`/api/posts/${editingPost.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingPost,
          // Send raw markdown content, not parsed blocks
        }),
      })

      if (response.ok) {
        setEditingPost(null)
        setShowCreateForm(false)
        fetchPosts()
      }
    } catch (error) {
      console.error('Error updating post:', error)
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

  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setShowCreateForm(true)
  }

  const handlePreviewContent = async (content: string) => {
    if (content) {
      const blocks = await parseMarkdownToBlocks(content)
      setParsedBlocks(blocks)
    }
  }

  const resetForm = () => {
    setNewPost({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      coverImage: '',
    })
    setEditingPost(null)
    setShowCreateForm(false)
  }

  const handleLogout = () => {
    setIsAuthorized(false)
    localStorage.removeItem('admin_authorized')
    localStorage.removeItem('admin_auth_timestamp')
    setAccessKey('')
    setPosts([])
  }

  const handleCreateNewPost = () => {
    setShowCreateForm(true)
    setEditingPost(null)
    setNewPost({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      coverImage: '',
    })
  }

  // Convert Post to FormData for ImageUpload component
  const getFormDataForImageUpload = (): FormData => {
    if (editingPost) {
      return {
        title: editingPost.title,
        slug: editingPost.slug,
        content: editingPost.content || '',
        excerpt: editingPost.excerpt || '',
        coverImage: editingPost.coverImage || '',
      }
    }
    return newPost
  }

  // Handle image upload for both new and editing posts
  const handleImageUpload = (
    value: FormData | ((prev: FormData) => FormData),
  ) => {
    if (typeof value === 'function') {
      // Handle function-based update
      const updatedData = value(getFormDataForImageUpload())
      if (editingPost) {
        setEditingPost({
          ...editingPost,
          coverImage: updatedData.coverImage,
        })
      } else {
        setNewPost(updatedData)
      }
    } else {
      // Handle direct value update
      if (editingPost) {
        setEditingPost({
          ...editingPost,
          coverImage: value.coverImage,
        })
      } else {
        setNewPost(value)
      }
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

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
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl">Blog Admin</h1>
        <div className="flex items-center gap-4">
          {!showCreateForm && (
            <Button
              onClick={handleCreateNewPost}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create New Post
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Create/Edit Post Form */}
      {showCreateForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {editingPost
                ? `Edit Post: ${editingPost.title}`
                : 'Create New Post'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>
              <Input
                value={editingPost ? editingPost.title : newPost.title}
                onChange={(e) => {
                  if (editingPost) {
                    setEditingPost({ ...editingPost, title: e.target.value })
                  } else {
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                }}
                placeholder="Post title"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Slug</label>
              <Input
                value={editingPost ? editingPost.slug : newPost.slug}
                onChange={(e) => {
                  if (editingPost) {
                    setEditingPost({ ...editingPost, slug: e.target.value })
                  } else {
                    setNewPost({ ...newPost, slug: e.target.value })
                  }
                }}
                placeholder="post-slug"
              />
            </div>
            <ImageUpload
              post={getFormDataForImageUpload()}
              setNewPost={handleImageUpload}
            />
            <div>
              <label className="mb-2 block text-sm font-medium">
                Content (Markdown)
              </label>
              <textarea
                value={
                  editingPost ? editingPost.content || '' : newPost.content
                }
                onChange={(e) => {
                  if (editingPost) {
                    setEditingPost({ ...editingPost, content: e.target.value })
                  } else {
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                }}
                placeholder="Write your post in markdown..."
                className="min-h-[300px] w-full rounded-md border p-3 font-mono text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Excerpt</label>
              <textarea
                value={
                  editingPost ? editingPost.excerpt || '' : newPost.excerpt
                }
                onChange={(e) => {
                  if (editingPost) {
                    setEditingPost({ ...editingPost, excerpt: e.target.value })
                  } else {
                    setNewPost({ ...newPost, excerpt: e.target.value })
                  }
                }}
                placeholder="Brief description"
                className="min-h-[100px] w-full rounded-md border p-3"
              />
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={editingPost ? updatePost : createPost}
                className="hover:cursor-pointer"
              >
                {editingPost ? 'Update Post' : 'Create Post'}
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handlePreviewContent(
                        editingPost
                          ? editingPost.content || ''
                          : newPost.content,
                      )
                    }
                    className="hover:cursor-pointer"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Preview</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 max-h-[calc(100vh-120px)] overflow-y-auto">
                    <div className="prose max-w-none">
                      <ContentRenderer content={parsedBlocks} />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <Button
                variant="outline"
                onClick={resetForm}
                className="hover:cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator className="my-8" />

      {/* All Posts */}
      <div>
        <h2 className="mb-4 text-2xl font-bold">All Posts</h2>
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="relative">
              <CardContent className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-gray-600">{post.slug}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`rounded px-2 py-1 text-xs ${
                        post.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  {/* Actions Dropdown */}
                  <div className="ml-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditPost(post)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handlePreviewContent(post.content || '')
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            togglePublishStatus(post.id, post.published)
                          }
                        >
                          {post.published ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Publish
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => deletePost(post.id, post.title)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
