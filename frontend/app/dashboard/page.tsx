'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import Link from 'next/link'

export default function DashboardPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const userPosts = await api.posts.getAll()
      setPosts(userPosts)
    } catch (error) {
      toast.error('Failed to load posts')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublish = async (postId: number) => {
    try {
      const post = posts.find(p => p.id === postId)
      await api.posts.update(postId, {
        ...post,
        isDraft: false,
      })
      toast.success('Post published successfully!')
      loadPosts()
    } catch (error) {
      toast.error('Failed to publish post')
    }
  }

  const handleDelete = async (postId: number) => {
    try {
      await api.posts.delete(postId)
      toast.success('Post deleted successfully!')
      loadPosts()
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading...</div>
  }

  const drafts = posts.filter(post => post.isDraft)
  const published = posts.filter(post => !post.isDraft)

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Posts</h1>
        <Link href="/">
          <Button>Create New Post</Button>
        </Link>
      </div>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Drafts</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {drafts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Last updated: {new Date(post.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/drafts/${post.id}`}>
                      <Button variant="outline">Edit</Button>
                    </Link>
                    <Button onClick={() => handlePublish(post.id)}>
                      Publish
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(post.id)}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {drafts.length === 0 && (
              <p className="text-gray-500 col-span-3">No drafts yet.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Published Posts</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {published.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Published: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/posts/${post.id}`}>
                      <Button>View</Button>
                    </Link>
                    <Button variant="destructive" onClick={() => handleDelete(post.id)}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {published.length === 0 && (
              <p className="text-gray-500 col-span-3">No published posts yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
} 