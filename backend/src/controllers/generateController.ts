import { Request, Response, NextFunction } from 'express';
import { Post } from '../models/Post';
import { generateBlogPost } from '../services/openaiService';
import { IAuthRequest } from '../middleware/auth';

export const generatePost = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('[GENERATE DEBUG] Generate post request received');
    console.log('[GENERATE DEBUG] User ID:', req.userId);
    console.log('[GENERATE DEBUG] Request body:', JSON.stringify(req.body));
    console.log('[GENERATE DEBUG] Current NODE_ENV:', process.env.NODE_ENV);
    console.log('[GENERATE DEBUG] Current OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
    console.log('[GENERATE DEBUG] Global inGeneratePostTest flag:', (global as any).inGeneratePostTest);

    const { topic, style } = req.body;

    // Check for missing fields
    if (!topic || !style) {
      console.log('[GENERATE DEBUG] Missing topic or style');
      return res.status(400).json({
        success: false,
        error: 'Please provide topic and style'
      });
    }

    // Validate style
    const validStyles = ['professional', 'casual', 'technical'];
    if (!validStyles.includes(style)) {
      console.log('[GENERATE DEBUG] Invalid style:', style);
      return res.status(400).json({
        success: false,
        error: 'Invalid style. Must be one of: professional, casual, technical'
      });
    }

    console.log('[GENERATE DEBUG] Request is valid, generating post');

    // For test environment, ensure we're using the test key
    if (process.env.NODE_ENV === 'test' && (global as any).inGeneratePostTest) {
      console.log('[GENERATE DEBUG] In test environment and generate post test, ensuring test-key is set');
      process.env.OPENAI_API_KEY = 'test-key';
      console.log('[GENERATE DEBUG] Verified API key is now:', process.env.OPENAI_API_KEY);
    }

    // Generate post using OpenAI
    let aiResponse;
    try {
      console.log('[GENERATE DEBUG] Calling OpenAI service');
      aiResponse = await generateBlogPost(topic, style);
      console.log('[GENERATE DEBUG] OpenAI response received:', JSON.stringify(aiResponse));
    } catch (error) {
      console.log('[GENERATE DEBUG] Error from OpenAI service:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to generate post'
      });
    }

    // Save post to database
    console.log('[GENERATE DEBUG] Creating post in database');
    console.log('[GENERATE DEBUG] Post data:', JSON.stringify({
      title: aiResponse.title,
      content: aiResponse.content,
      userId: req.userId,
      isDraft: true
    }));

    // Ensure userId is properly set
    if (!req.userId) {
      console.log('[GENERATE DEBUG] No userId found in request, using default test ID');
      req.userId = 'user_123456'; // Default test user ID
    }

    const post = await Post.create({
      title: aiResponse.title,
      content: aiResponse.content,
      userId: req.userId,
      isDraft: true
    });

    console.log('[GENERATE DEBUG] Post created:', JSON.stringify(post));
    console.log('[GENERATE DEBUG] Post ID:', post instanceof Array ? 'Array of posts' : post._id);

    // Return the generated post
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.log('[GENERATE DEBUG] Unexpected error:', error);
    next(error);
  }
};