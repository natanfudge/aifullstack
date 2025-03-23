import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-post-generator',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  openaiApiKey: process.env.OPENAI_API_KEY,
  environment: process.env.NODE_ENV || 'development',
  nodeEnv: process.env.NODE_ENV || 'development',
}; 