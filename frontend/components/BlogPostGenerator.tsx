import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function BlogPostGenerator() {
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedPost, setGeneratedPost] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [postId, setPostId] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const post = await api.posts.generate({ topic, style })
      setGeneratedPost(post.content)
      toast.success('Blog post generated successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate blog post')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!generatedPost) return

    try {
      const post = await api.posts.save({
        title: topic,
        content: generatedPost,
        isDraft: true,
      })
      setPostId(post.id)
      toast.success('Post saved as draft!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save post')
    }
  }

  const handlePublish = async () => {
    if (!generatedPost) return

    try {
      // If we haven't saved the post yet, save it first
      if (!postId) {
        const post = await api.posts.save({
          title: topic,
          content: generatedPost,
          isDraft: false,
        })
        setPostId(post.id)
        toast.success('Post published successfully!')
        router.push(`/posts/${post.id}`)
      } else {
        // If we already have a postId, update it
        await api.posts.update(postId, {
          title: topic,
          content: generatedPost,
          isDraft: false,
        })
        toast.success('Post published successfully!')
        router.push(`/posts/${postId}`)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to publish post')
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGeneratedPost(e.target.value)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="topic" className="text-sm font-medium">
                Topic
              </label>
              <Input
                id="topic"
                placeholder="Enter your blog post topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="style" className="text-sm font-medium">
                Writing Style
              </label>
              <Input
                id="style"
                placeholder="e.g., Professional, Casual, Technical"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Post'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedPost && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Blog Post</CardTitle>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={handleEdit}>Edit</Button>
              ) : (
                <Button onClick={() => setIsEditing(false)}>Done Editing</Button>
              )}
              <Button onClick={handleSave}>Save as Draft</Button>
              <Button onClick={handlePublish}>Publish</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedPost}
              onChange={handleContentChange}
              readOnly={!isEditing}
              className="min-h-[300px] font-mono"
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
} 