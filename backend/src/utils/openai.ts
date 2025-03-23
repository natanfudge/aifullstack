import OpenAI from 'openai';
import { config } from './config';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

interface BlogPost {
  title: string;
  content: string;
}

export const generateBlogPost = async (topic: string, style: string): Promise<BlogPost> => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a professional blog writer. Write in a ${style} style.`,
        },
        {
          role: 'user',
          content: `Write a blog post about ${topic}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0].message.content || '';
    return {
      title: `Test Post`,
      content: content,
    };
  } catch (error) {
    throw new Error('Failed to generate blog post');
  }
}; 