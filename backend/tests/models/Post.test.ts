import mongoose from 'mongoose';
import { connectDB, closeDB, clearDB, createTestUser } from '../helpers';
import { Post } from '../../src/models/Post';

describe('Post Model', () => {
  let testUser: any;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  beforeEach(async () => {
    await clearDB();
    testUser = await createTestUser();
  });

  it('should create a new post', async () => {
    const postData = {
      title: 'Test Post',
      content: 'Test content',
      userId: testUser._id,
      isDraft: true,
    };

    const post = await Post.create(postData);

    expect(post._id).toBeDefined();
    expect(post.title).toBe(postData.title);
    expect(post.content).toBe(postData.content);
    expect(post.get('userId').toString()).toBe(testUser._id.toString());
    expect(post.isDraft).toBe(true);
    expect(post.createdAt).toBeDefined();
    expect(post.updatedAt).toBeDefined();
  });

  it('should require title and content', async () => {
    const postData = {
      userId: testUser._id,
      isDraft: true,
    };

    try {
      await Post.create(postData);
      fail('Should have thrown validation error');
    } catch (error: any) {
      expect(error.errors.title).toBeDefined();
      expect(error.errors.content).toBeDefined();
    }
  });

  it('should require userId', async () => {
    const postData = {
      title: 'Test Post',
      content: 'Test content',
      isDraft: true,
    };

    try {
      await Post.create(postData);
      fail('Should have thrown validation error');
    } catch (error: any) {
      expect(error.errors.userId).toBeDefined();
    }
  });

  it('should set isDraft to true by default', async () => {
    const postData = {
      title: 'Test Post',
      content: 'Test content',
      userId: testUser._id,
    };

    const post = await Post.create(postData);
    expect(post.isDraft).toBe(true);
  });

  it('should update timestamps on save', async () => {
    const post = await Post.create({
      title: 'Test Post',
      content: 'Test content',
      userId: testUser._id,
      isDraft: true,
    });

    const createdAt = post.createdAt;
    const updatedAt = post.updatedAt;

    // Wait a shorter time to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 100));

    post.title = 'Updated Title';
    await post.save();

    expect(post.createdAt).toEqual(createdAt);
    expect(post.updatedAt.getTime()).toBeGreaterThan(updatedAt.getTime());
  });

  it('should populate userId with user data', async () => {
    const post = await Post.create({
      title: 'Test Post',
      content: 'Test content',
      userId: testUser._id,
      isDraft: true,
    });

    const populatedPost = await Post.findById(post._id).populate('userId', 'email');
    expect(populatedPost?.get('userId')).toHaveProperty('email', testUser.email);
  });

  it('should handle long content', async () => {
    const longContent = 'a'.repeat(10000);
    const post = await Post.create({
      title: 'Test Post',
      content: longContent,
      userId: testUser._id,
      isDraft: true,
    });

    expect(post.content).toBe(longContent);
  });

  it('should handle special characters in title and content', async () => {
    const postData = {
      title: 'Test Post!@#$%^&*()',
      content: 'Test content with special chars: !@#$%^&*()',
      userId: testUser._id,
      isDraft: true,
    };

    const post = await Post.create(postData);
    expect(post.title).toBe(postData.title);
    expect(post.content).toBe(postData.content);
  });

  it('should handle empty strings in title and content', async () => {
    const postData = {
      title: '',
      content: '',
      userId: testUser._id,
      isDraft: true,
    };

    try {
      await Post.create(postData);
      fail('Should have thrown validation error');
    } catch (error: any) {
      expect(error.errors.title).toBeDefined();
      expect(error.errors.content).toBeDefined();
    }
  });
}); 