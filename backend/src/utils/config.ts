import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-post-generator',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  openaiApiKey: process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '' ? process.env.OPENAI_API_KEY : undefined,
}; 