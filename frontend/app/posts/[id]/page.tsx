import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'

async function getPost(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
  const res = await fetch(`${apiUrl}/api/posts/${id}`, {
    cache: 'no-store',
  })
  
  if (!res.ok) {
    return null
  }
  
  return res.json()
}

export default async function PostPage({
  params,
}: {
  params: { id: string }
}) {
  const post = await getPost(params.id)

  if (!post) {
    notFound()
  }

  return (
    <main className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {post.content}
          </div>
        </CardContent>
      </Card>
    </main>
  )
} 