import request from 'supertest';
import { app } from '../../src/app';
import { connectDB, closeDB, clearDB, createTestUser, generateTestToken } from '../helpers';
import { Post } from '../../src/models/Post';

describe('Generate Controller', () => {
  let testUser: any;
  let testToken: string;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  beforeEach(async () => {
    await clearDB();
    testUser = await createTestUser();
    testToken = generateTestToken(testUser._id);
  });

  describe('POST /api/generate', () => {
    it('should generate a new post with valid input', async () => {
      const res = await request(app)
        .post('/api/generate')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          topic: 'Artificial Intelligence',
          style: 'professional',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('title');
      expect(res.body.data).toHaveProperty('content');
      expect(res.body.data).toHaveProperty('isDraft', true);
      expect(res.body.data).toHaveProperty('userId', testUser._id.toString());

      // Verify post was saved to database
      const post = await Post.findById(res.body.data._id);
      expect(post).toBeTruthy();
      expect(post?.title).toBe(res.body.data.title);
      expect(post?.content).toBe(res.body.data.content);
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
      process.env.OPENAI_API_KEY = 'invalid-key';

      const res = await request(app)
        .post('/api/generate')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          topic: 'Artificial Intelligence',
          style: 'professional',
        });

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Failed to generate post');

      // Restore valid API key
      process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-key';
    });
  });
}); 