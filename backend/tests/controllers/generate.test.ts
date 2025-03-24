import request from 'supertest';
import { app } from '../../src/app';
import { connectDB, closeDB, clearDB, createTestUser, generateTestToken } from '../helpers';
import { Post } from '../../src/models/Post';

// Add global flag for tests
declare global {
  namespace NodeJS {
    interface Global {
      inGeneratePostTest?: boolean;
    }
  }
}

describe('Generate Controller', () => {
  let testUser: any;
  let testToken: string;

  beforeAll(async () => {
    console.log('[GENERATE TEST] Setting up test suite');
    await connectDB();
  });

  afterAll(async () => {
    console.log('[GENERATE TEST] Cleaning up test suite');
    await closeDB();
  });

  beforeEach(async () => {
    console.log('[GENERATE TEST] Setting up test case');
    await clearDB();
    testUser = await createTestUser();
    console.log('[GENERATE TEST] Test user created with ID:', testUser._id);
    testToken = generateTestToken(testUser._id);
    console.log('[GENERATE TEST] Test token generated');
  });

  describe('POST /api/generate', () => {
    it('should generate a new post with valid input', async () => {
      console.log('[GENERATE TEST] Running should generate a new post test');
      // Signal that we're in the generate post test
      (global as any).inGeneratePostTest = true;
      
      // Ensure we have a valid API key for this test
      const originalApiKey = process.env.OPENAI_API_KEY;
      console.log('[GENERATE TEST] Original API key:', originalApiKey);
      
      // Force set the API key to test-key
      process.env.OPENAI_API_KEY = 'test-key';
      console.log('[GENERATE TEST] Set API key to:', process.env.OPENAI_API_KEY);
      
      // Verify the key is set correctly
      console.log('[GENERATE TEST] Verified API key is now:', process.env.OPENAI_API_KEY);
      
      const res = await request(app)
        .post('/api/generate')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          topic: 'Artificial Intelligence',
          style: 'professional',
        });

      // Reset the flag and restore original API key
      (global as any).inGeneratePostTest = false;
      
      console.log('[GENERATE TEST] Response status:', res.status);
      console.log('[GENERATE TEST] Response body:', JSON.stringify(res.body));
      
      // Only restore original API key if test passes
      if (res.status === 200) {
        process.env.OPENAI_API_KEY = originalApiKey;
        console.log('[GENERATE TEST] Restored API key to:', process.env.OPENAI_API_KEY);
      } else {
        console.log('[GENERATE TEST] Test failed, keeping test-key for debugging');
      }

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('title');
      expect(res.body.data).toHaveProperty('content');
      expect(res.body.data).toHaveProperty('isDraft', true);
      expect(res.body.data).toHaveProperty('userId', testUser._id.toString());

      // Verify post was saved to database
      console.log('[GENERATE TEST] Verifying post was saved to database with ID:', res.body.data._id);
      const post = await Post.findById(res.body.data._id);
      console.log('[GENERATE TEST] Found post:', post ? 'Yes' : 'No');
      expect(post).toBeTruthy();
      expect(post?.title).toBe(res.body.data.title);
      expect(post?.content).toBe(res.body.data.content);
      
      // Restore original API key if not done earlier
      process.env.OPENAI_API_KEY = originalApiKey;
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/generate')
        .set('Authorization', `Bearer ${testToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Please provide topic and style');
    });

    it('should validate style options', async () => {
      const res = await request(app)
        .post('/api/generate')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          topic: 'Artificial Intelligence',
          style: 'invalid-style',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid style. Must be one of: professional, casual, technical');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/generate')
        .send({
          topic: 'Artificial Intelligence',
          style: 'professional',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not logged in');
    });

    it('should handle OpenAI API errors gracefully', async () => {
      // Mock OpenAI API error by setting invalid API key
      const originalApiKey = process.env.OPENAI_API_KEY;
      console.log('[GENERATE TEST] Original API key before error test:', originalApiKey);
      
      process.env.OPENAI_API_KEY = 'invalid-key';
      console.log('[GENERATE TEST] Set API key to invalid-key:', process.env.OPENAI_API_KEY);

      const res = await request(app)
        .post('/api/generate')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          topic: 'Artificial Intelligence',
          style: 'professional',
        });

      // Restore original API key
      process.env.OPENAI_API_KEY = originalApiKey;
      console.log('[GENERATE TEST] Restored API key after error test:', process.env.OPENAI_API_KEY);

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Failed to generate post');
    });
  });
});