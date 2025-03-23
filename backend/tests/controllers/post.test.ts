import request from 'supertest';
import { app } from '../../src/app';
import { connectDB, closeDB, clearDB, createTestUser, createTestPost, generateTestToken } from '../helpers';

describe('Post Controller', () => {
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

  describe('GET /api/posts', () => {
    it('should get all posts for the authenticated user', async () => {
      await createTestPost(testUser._id);
      await createTestPost(testUser._id, 'Another Post', 'More content');

      const res = await request(app)
        .get('/api/posts')
        .set('Authorization', `Bearer ${testToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });

    it('should return empty array when no posts exist', async () => {
      const res = await request(app)
        .get('/api/posts')
        .set('Authorization', `Bearer ${testToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(0);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/posts');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not logged in');
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should get a single post by id', async () => {
      const post = await createTestPost(testUser._id);

      const res = await request(app)
        .get(`/api/posts/${post._id}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(post._id.toString());
    });

    it('should return 404 for non-existent post', async () => {
      const res = await request(app)
        .get('/api/posts/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${testToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Post not found');
    });

    it('should require authentication', async () => {
      const post = await createTestPost(testUser._id);

      const res = await request(app)
        .get(`/api/posts/${post._id}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not logged in');
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          title: 'New Post',
          content: 'New content',
          isDraft: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('title', 'New Post');
      expect(res.body.data).toHaveProperty('content', 'New content');
      expect(res.body.data).toHaveProperty('isDraft', true);
      expect(res.body.data).toHaveProperty('userId', testUser._id.toString());
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${testToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Please provide title and content');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({
          title: 'New Post',
          content: 'New content',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not logged in');
    });
  });

  describe('PATCH /api/posts/:id', () => {
    it('should update an existing post', async () => {
      const post = await createTestPost(testUser._id);

      const res = await request(app)
        .patch(`/api/posts/${post._id}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated content',
          isDraft: false,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Title');
      expect(res.body.data.content).toBe('Updated content');
      expect(res.body.data.isDraft).toBe(false);
    });

    it('should return 404 for non-existent post', async () => {
      const res = await request(app)
        .patch('/api/posts/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated content',
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Post not found');
    });

    it('should require authentication', async () => {
      const post = await createTestPost(testUser._id);

      const res = await request(app)
        .patch(`/api/posts/${post._id}`)
        .send({
          title: 'Updated Title',
          content: 'Updated content',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not logged in');
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete an existing post', async () => {
      const post = await createTestPost(testUser._id);

      const res = await request(app)
        .delete(`/api/posts/${post._id}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(res.status).toBe(204);

      // Verify post is deleted
      const getRes = await request(app)
        .get(`/api/posts/${post._id}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(getRes.status).toBe(404);
    });

    it('should return 404 for non-existent post', async () => {
      const res = await request(app)
        .delete('/api/posts/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${testToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Post not found');
    });

    it('should require authentication', async () => {
      const post = await createTestPost(testUser._id);

      const res = await request(app)
        .delete(`/api/posts/${post._id}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not logged in');
    });
  });
}); 