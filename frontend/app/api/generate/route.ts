import { NextResponse } from 'next/server'

function generateMockPost(topic: string, style: string) {
  const styles = {
    professional: {
      intro: "In today's rapidly evolving landscape",
      conclusion: "As we look to the future, it's clear that this topic will continue to shape our understanding.",
    },
    casual: {
      intro: "Hey there! Let's talk about something interesting",
      conclusion: "Pretty cool stuff, right? Can't wait to see what happens next!",
    },
    technical: {
      intro: "This technical analysis examines the key components",
      conclusion: "The implementation details discussed above demonstrate the significance of this approach.",
    },
  }

  const selectedStyle = styles[style.toLowerCase() as keyof typeof styles] || styles.professional
  
  return {
    title: `${topic}: A ${style} Perspective`,
    content: `
${selectedStyle.intro}, ${topic} has become increasingly important.

Here are some key points to consider:

1. The impact of ${topic} on modern society
2. How ${topic} is transforming our daily lives
3. Future implications and potential developments

${topic} represents a significant shift in how we approach traditional problems. 
By analyzing its various aspects, we can better understand its role in shaping our future.

${selectedStyle.conclusion}
    `.trim(),
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { topic, style } = body

    if (!topic || !style) {
      return NextResponse.json(
        { error: 'Topic and style are required' },
        { status: 400 }
      )
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const { title, content } = generateMockPost(topic, style)

    const post = {
      id: Date.now(),
      title,
      content,
      userId: 1,
      isDraft: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 