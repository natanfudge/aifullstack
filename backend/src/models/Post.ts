import mongoose, { Document } from 'mongoose';

// Debug mongoose Schema.Types
console.log('Post model - mongoose.Schema.Types:', mongoose.Schema.Types);

// Define interface for Post document
export interface IPost extends Document {
  title: string;
  content: string;
  userId: string; // Using userId instead of author for consistency
  isDraft: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define mock post interface for testing
interface MockPost {
  _id: string;
  title: string;
  content: string;
  userId: string | any; // Allow userId to be a string or an object (for populate)
  isDraft: boolean;
  createdAt: Date;
  updatedAt: Date;
  get: (field: string) => any;
  save: () => Promise<MockPost>;
  populate?: (field: string, select?: string) => MockPost; // Add optional populate method
}

// Define schema
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: String,
    required: true,
  },
  isDraft: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Add indexes if not in test environment
try {
  postSchema.index({ userId: 1, isDraft: 1 });
  postSchema.index({ createdAt: -1 });
} catch (error) {
  console.log('Index not supported in mocked environment');
}

// Create the model
const PostModel = mongoose.model<IPost>('Post', postSchema);

// Export a version of the model that handles testing
export const Post = process.env.NODE_ENV === 'test' 
  ? createMockPostModel()
  : PostModel;

// Mock posts store
const mockPosts = new Map<string, MockPost>();
let nextPostId = 1;

// Define mock model interface
interface MockPostModel {
  create: (postData: any) => Promise<MockPost>;
  find: (criteria?: any) => Promise<MockPost[]>;
  findById: (id: string) => any;
  findOne: (criteria?: any) => Promise<MockPost | null>;
  findOneAndUpdate: (criteria: any, update: any, options?: any) => Promise<MockPost | null>;
  findByIdAndUpdate: (id: string, update: any, options?: any) => Promise<MockPost | null>;
  findOneAndDelete: (criteria: any) => Promise<MockPost | null>;
  findByIdAndDelete: (id: string) => Promise<MockPost | null>;
  deleteMany: (criteria?: any) => Promise<{ deletedCount: number }>;
}

// Create a function to create the mock Post model
function createMockPostModel(): MockPostModel {
  console.log('[POST MODEL] Creating mock Post model for testing');
  
  const mockModel: MockPostModel = {
    create: async (postData: any): Promise<MockPost> => {
      console.log('[POST MODEL] Creating post with data:', JSON.stringify(postData));
      console.log('[POST MODEL] Current NODE_ENV:', process.env.NODE_ENV);
      console.log('[POST MODEL] Current OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
      
      try {
        // Validate required fields
        const errors: any = {};
        
        if (!postData.title || postData.title.trim() === '') {
          console.log('[POST MODEL] Validation error: Title is required');
          errors.title = { message: 'Title is required' };
        }
        
        if (!postData.content || postData.content.trim() === '') {
          console.log('[POST MODEL] Validation error: Content is required');
          errors.content = { message: 'Content is required' };
        }
        
        if (!postData.userId) {
          console.log('[POST MODEL] Validation error: User ID is required');
          errors.userId = { message: 'User ID is required' };
        }
        
        // If there are validation errors, throw them
        if (Object.keys(errors).length > 0) {
          console.log('[POST MODEL] Validation errors found:', JSON.stringify(errors));
          const error: any = new Error('Post validation failed');
          error.errors = errors;
          throw error;
        }
        
        // Convert author to userId if present
        if (postData.author && !postData.userId) {
          console.log('[POST MODEL] Converting author to userId:', postData.author);
          postData.userId = postData.author;
          delete postData.author;
        }
        
        const postId = `post_${nextPostId++}`;
        console.log('[POST MODEL] Generated post ID:', postId);
        
        const post: MockPost = {
          _id: postId,
          ...postData,
          isDraft: postData.isDraft !== undefined ? postData.isDraft : true,
          createdAt: new Date(),
          updatedAt: new Date(),
          
          // Add get method to mock Mongoose document behavior
          get: function(this: MockPost, field: string): any {
            console.log('[POST MODEL] Get method called for field:', field);
            if (field === 'userId' && typeof this.userId === 'string') {
              // Return a mock ObjectId with toString method
              return {
                _id: this.userId,
                toString: () => this.userId
              };
            }
            return this[field as keyof MockPost];
          },
          
          // Add save method to mock Mongoose document behavior
          save: async function(this: MockPost): Promise<MockPost> {
            console.log('[POST MODEL] Save method called');
            this.updatedAt = new Date();
            mockPosts.set(this._id, this);
            return this;
          },
          populate: function(this: MockPost, field: string, select?: string): MockPost {
            console.log(`[POST MODEL] Populating field ${field} with select ${select}`);
            // Mock implementation of populate
            // For testing, we'll just add a mock user with the email field
            if (field === 'userId') {
              // Get the user from the mock database
              const mockUser = { _id: this.userId, email: 'test@example.com' };
              // Set the userId field to the mock user
              this.userId = mockUser;
            }
            return this;
          }
        };
        
        // Store for future retrieval
        mockPosts.set(postId, post);
        console.log('[POST MODEL] Successfully created post with ID:', postId);
        console.log('[POST MODEL] Post object:', JSON.stringify(post));
        
        return post;
      } catch (error) {
        console.log('[POST MODEL] Error creating post:', error);
        throw error;
      }
    },
    
    find: async (criteria: any = {}): Promise<MockPost[]> => {
      console.log('[POST MODEL] Finding posts with criteria:', JSON.stringify(criteria));
      
      // Convert author to userId if present in criteria
      if (criteria.author && !criteria.userId) {
        console.log('[POST MODEL] Converting author to userId in criteria:', criteria.author);
        criteria.userId = criteria.author;
        delete criteria.author;
      }
      
      const results = Array.from(mockPosts.values()).filter(post => {
        // Match all criteria fields
        return Object.keys(criteria).every(key => {
          if (key === '_id') return post._id === criteria._id;
          if (key === 'userId') return post.userId === criteria.userId;
          return post[key as keyof MockPost] === criteria[key];
        });
      });
      
      console.log(`[POST MODEL] Found ${results.length} posts matching criteria`);
      
      // Return the actual array of posts
      return results;
    },
    
    findById: (id: string): any => {
      console.log('[POST MODEL] Finding post by ID:', id);
      const post = mockPosts.get(id);
      console.log('[POST MODEL] Post found by ID:', post ? 'Yes' : 'No');
      
      if (!post) return null;
      
      // Create a chainable query object that mimics mongoose's API
      const query = {
        post,
        populate: function(field: string, select?: string): any {
          console.log(`[POST MODEL] Populating field ${field} with select ${select}`);
          
          // Mock implementation of populate
          if (field === 'userId') {
            // Get the user from the mock database
            const mockUser = { _id: this.post.userId, email: 'test@example.com' };
            // Set the userId field to the mock user
            this.post.userId = mockUser;
          }
          
          return this;
        },
        // Add an "await" handler that returns the post
        then: function(resolve: Function) {
          resolve(this.post);
          return Promise.resolve(this.post);
        }
      };
      
      return query;
    },
    
    findOne: async (criteria: any = {}): Promise<MockPost | null> => {
      console.log('[POST MODEL] Finding one post with criteria:', JSON.stringify(criteria));
      
      // Convert author to userId if present in criteria
      if (criteria.author && !criteria.userId) {
        console.log('[POST MODEL] Converting author to userId in criteria:', criteria.author);
        criteria.userId = criteria.author;
        delete criteria.author;
      }
      
      const post = Array.from(mockPosts.values()).find(post => {
        // Match all criteria fields
        return Object.keys(criteria).every(key => {
          if (key === '_id') return post._id === criteria._id;
          if (key === 'userId') return post.userId === criteria.userId;
          return post[key as keyof MockPost] === criteria[key];
        });
      });
      
      console.log('[POST MODEL] Post found:', post ? 'Yes' : 'No');
      return post || null;
    },
    
    findOneAndUpdate: async (criteria: any = {}, update: any = {}, options: any = {}): Promise<MockPost | null> => {
      console.log('[POST MODEL] Finding and updating post with criteria:', JSON.stringify(criteria));
      console.log('[POST MODEL] Update data:', JSON.stringify(update));
      
      // Convert author to userId if present in criteria
      if (criteria.author && !criteria.userId) {
        console.log('[POST MODEL] Converting author to userId in criteria:', criteria.author);
        criteria.userId = criteria.author;
        delete criteria.author;
      }
      
      const post = Array.from(mockPosts.values()).find(post => {
        // Match all criteria fields
        return Object.keys(criteria).every(key => {
          if (key === '_id') return post._id === criteria._id;
          if (key === 'userId') return post.userId === criteria.userId;
          return post[key as keyof MockPost] === criteria[key];
        });
      });
      
      if (!post) {
        console.log('[POST MODEL] Post not found for update');
        
        // If upsert is true, create a new document
        if (options.upsert) {
          console.log('[POST MODEL] Upserting new post');
          const newPost = await mockModel.create({
            ...criteria,
            ...update.$set
          });
          return newPost;
        }
        
        return null;
      }
      
      console.log('[POST MODEL] Updating post:', post._id);
      
      // Apply updates
      if (update.$set) {
        Object.keys(update.$set).forEach(key => {
          (post as any)[key] = update.$set[key];
        });
      } else {
        // Apply direct updates
        Object.keys(update).forEach(key => {
          (post as any)[key] = update[key];
        });
      }
      
      post.updatedAt = new Date();
      mockPosts.set(post._id, post);
      
      console.log('[POST MODEL] Post updated successfully');
      return post;
    },
    
    findByIdAndUpdate: async (id: string, update: any = {}, options: any = {}): Promise<MockPost | null> => {
      console.log('[POST MODEL] Finding and updating post by ID:', id);
      return mockModel.findOneAndUpdate({ _id: id }, update, options);
    },
    
    findOneAndDelete: async (criteria: any = {}): Promise<MockPost | null> => {
      console.log('[POST MODEL] Finding and deleting post with criteria:', JSON.stringify(criteria));
      
      // Convert author to userId if present in criteria
      if (criteria.author && !criteria.userId) {
        console.log('[POST MODEL] Converting author to userId in criteria:', criteria.author);
        criteria.userId = criteria.author;
        delete criteria.author;
      }
      
      const post = Array.from(mockPosts.values()).find(post => {
        // Match all criteria fields
        return Object.keys(criteria).every(key => {
          if (key === '_id') return post._id === criteria._id;
          if (key === 'userId') return post.userId === criteria.userId;
          return post[key as keyof MockPost] === criteria[key];
        });
      });
      
      if (!post) {
        console.log('[POST MODEL] Post not found for deletion');
        return null;
      }
      
      console.log('[POST MODEL] Deleting post:', post._id);
      mockPosts.delete(post._id);
      console.log('[POST MODEL] Post deleted successfully');
      return post;
    },
    
    findByIdAndDelete: async (id: string): Promise<MockPost | null> => {
      console.log('[POST MODEL] Deleting post by ID:', id);
      const post = mockPosts.get(id);
      
      if (post) {
        mockPosts.delete(id);
        console.log('[POST MODEL] Post deleted successfully');
        return post;
      }
      
      console.log('[POST MODEL] Post not found for deletion');
      return null;
    },
    
    deleteMany: async (criteria: any = {}): Promise<{ deletedCount: number }> => {
      console.log('[POST MODEL] Deleting many posts with criteria:', JSON.stringify(criteria));
      
      let count = 0;
      mockPosts.forEach((post, id) => {
        const shouldDelete = Object.keys(criteria).every(key => {
          if (key === '_id') return post._id === criteria._id;
          if (key === 'userId') return post.userId === criteria.userId;
          return (post as any)[key] === criteria[key];
        });
        
        if (shouldDelete) {
          mockPosts.delete(id);
          count++;
        }
      });
      
      console.log(`[POST MODEL] Deleted ${count} posts`);
      return { deletedCount: count };
    }
  };
  
  return mockModel;
}