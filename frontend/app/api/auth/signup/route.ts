import { NextResponse } from 'next/server'

// Mock user database
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

    // Check if user already exists
    if (users.find(user => user.email === email)) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Store user (in a real app, you would hash the password)
    users.push({ email, password })

    // Generate a mock JWT token
    const token = `mock-jwt-token-${Date.now()}`

    return NextResponse.json({
      token,
      user: {
        email,
        id: users.length,
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 