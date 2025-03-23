'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function DraftPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [post, setPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('Loading draft with ID:', params.id)
    loadPost()
  }, [params.id])

  const loadPost = async () => {
    setError(null)
    try {
      console.log('Fetching post with ID:', params.id)
      const loadedPost = await api.posts.getById(parseInt(params.id))
      console.log('Loaded post:', loadedPost)
      setPost(loadedPost)
      setTitle(loadedPost.title)
      setContent(loadedPost.content)
    } catch (error) {
      console.error('Error loading draft:', error)
      setError('Failed to load draft. Please try again.')
      toast.error('Failed to load draft')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      console.log('Saving draft with ID:', params.id)
      await api.posts.update(parseInt(params.id), {
        title,
        content,
        isDraft: true,
      })
      toast.success('Draft saved successfully!')
    } catch (error) {
      console.error('Error saving draft:', error)
      toast.error('Failed to save draft')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    setIsSaving(true)
    try {
      console.log('Publishing post with ID:', params.id)
      await api.posts.update(parseInt(params.id), {
        title,
        content,
        isDraft: false,
      })
      toast.success('Post published successfully!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error publishing post:', error)
      toast.error('Failed to publish post')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading...</div>
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <p className="text-red-500">{error}</p>
              <Button onClick={loadPost}>Try Again</Button>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Edit Draft</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button 
                onClick={handlePublish}
                disabled={isSaving}
              >
                {isSaving ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] font-mono"
              placeholder="Write your post content here..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 