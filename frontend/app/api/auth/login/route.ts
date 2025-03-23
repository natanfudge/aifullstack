import { NextResponse } from 'next/server'

// Mock user database (same as signup route)
const users: { email: string; password: string }[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate a mock JWT token
    const token = `mock-jwt-token-${Date.now()}`

    return NextResponse.json({
      token,
      user: {
        email: user.email,
        id: users.indexOf(user) + 1,
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 