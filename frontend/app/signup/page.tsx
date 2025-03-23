'use client'

import { AuthForm } from "@/components/AuthForm"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
  const handleSignup = async (email: string, password: string) => {
    // TODO: Implement signup API call
    console.log("Signup attempt:", { email, password })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Sign up to start generating AI-powered blog posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm type="signup" onSubmit={handleSignup} />
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 