export interface Post {
  id: number
  title: string
  content: string
  userId: number
  isDraft: boolean
  createdAt: string
  updatedAt: string
}

// Mock database - in a real app, this would be a database
export let posts: Post[] = [
  {
    id: 1,
    title: 'Sample Post',
    content: 'This is a sample post content.',
    userId: 1,
    isDraft: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Getting Started with React',
    content: 'React is a popular JavaScript library for building user interfaces. In this post, we will explore the basics of React and how to get started with it.',
    userId: 1,
    isDraft: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Next.js for Beginners',
    content: 'Next.js is a React framework that enables server-side rendering and static site generation. This post covers the fundamentals of Next.js and its benefits.',
    userId: 1,
    isDraft: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
] 