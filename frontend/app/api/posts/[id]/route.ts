import { NextResponse } from 'next/server'
import { posts } from '@/lib/mock-db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id)
    const post = posts.find((p) => p.id === postId)
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    return NextResponse.json(post)
  } catch (error) {
    console.error('Error getting post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id)
    const body = await request.json()
    const postIndex = posts.findIndex((p) => p.id === postId)
    
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    posts[postIndex] = {
      ...posts[postIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(posts[postIndex])
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id)
    const postIndex = posts.findIndex((p) => p.id === postId)
    
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    posts.splice(postIndex, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 