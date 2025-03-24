import { OpenAI } from 'openai';
import { config } from './config';
import { AppError } from './AppError';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

interface BlogPostResult {
  title: string;
  content: string;
}

export const generateBlogPost = async (topic: string, style: string): Promise<BlogPostResult> => {
  console.log('[OPENAI DEBUG] Generating blog post for topic:', topic, 'with style:', style);
  
  if (!topic) {
    console.log('[OPENAI DEBUG] Topic is missing');
    throw new AppError('Topic is required', 400);
  }
  if (!style) {
    console.log('[OPENAI DEBUG] Style is missing');
    throw new AppError('Style is required', 400);
  }

  try {
    console.log('[OPENAI DEBUG] Creating prompt for OpenAI');
    const prompt = `Write a blog post about ${topic} in a ${style} style. Format your response with a title and content in this format: TITLE: [your title here] CONTENT: [your content here]`;
    
    console.log('[OPENAI DEBUG] Sending request to OpenAI');
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional blog writer who creates engaging and informative content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseText = response.choices[0].message.content;
    console.log('[OPENAI DEBUG] Received response from OpenAI:', responseText?.substring(0, 100) + '...');
    
    if (!responseText) {
      console.log('[OPENAI DEBUG] Empty response from OpenAI');
      throw new AppError('Failed to generate content', 500);
    }

    // Extract title and content from the response
    let title = '';
    let content = '';
    
    try {
      const titleMatch = responseText.match(/TITLE:\s*(.*?)(?=\s*CONTENT:|$)/s);
      const contentMatch = responseText.match(/CONTENT:\s*(.*?)$/s);
      
      title = titleMatch ? titleMatch[1].trim() : `Blog Post About ${topic}`;
      content = contentMatch ? contentMatch[1].trim() : responseText;
      
      console.log('[OPENAI DEBUG] Extracted title:', title);
      console.log('[OPENAI DEBUG] Content length:', content.length);
    } catch (parseError) {
      console.log('[OPENAI DEBUG] Error parsing OpenAI response:', parseError);
      // If parsing fails, use default formatting
      title = `Blog Post About ${topic}`;
      content = responseText;
    }

    return { title, content };
  } catch (error) {
    console.log('[OPENAI DEBUG] Error generating blog post:', error);
    
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new AppError(`Failed to generate blog post: ${error.message}`, 500);
    }
    throw new AppError('Failed to generate blog post', 500);
  }
}; 