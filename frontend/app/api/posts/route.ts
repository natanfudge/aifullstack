import { NextResponse } from 'next/server'
import { posts } from '@/lib/mock-db'

export async function GET() {
  try {
    // Mock user ID
    const userId = 1
    const userPosts = posts.filter((post) => post.userId === userId)
    return NextResponse.json(userPosts)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newPost = {
      id: Math.max(0, ...posts.map(p => p.id)) + 1,
      ...body,
      userId: 1, // Mock user ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    posts.push(newPost)
    return NextResponse.json(newPost)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 