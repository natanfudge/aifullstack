"use client"

import { BlogPostGenerator } from '@/components/BlogPostGenerator'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">AI Blog Post Generator</h1>
        <Link href="/dashboard">
          <Button>View My Posts</Button>
        </Link>
      </div>
      <BlogPostGenerator />
    </main>
  )
}
