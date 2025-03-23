import { generateBlogPost } from '../../src/utils/openai';
import { config } from '../../src/utils/config';

jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  })),
}));

describe('OpenAI Utils', () => {
  const mockOpenAI = require('openai').OpenAI;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a blog post successfully', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: 'Test Post',
              content: 'Test content',
            }),
          },
        },
      ],
    };

    mockOpenAI.mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue(mockResponse),
        },
      },
    }));

    const result = await generateBlogPost('Test Topic', 'professional');

    expect(result).toBeDefined();
    expect(result.title).toBe('Test Post');
    expect(result.content).toBe('Test content');
    expect(mockOpenAI).toHaveBeenCalledWith({
      apiKey: config.openaiApiKey,
    });
  });

  it('should handle OpenAI API errors', async () => {
    mockOpenAI.mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockRejectedValue(new Error('API Error')),
        },
      },
    }));

    await expect(generateBlogPost('Test Topic', 'professional')).rejects.toThrow('API Error');
  });

  it('should handle invalid response format', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: 'Invalid JSON',
          },
        },
      ],
    };

    mockOpenAI.mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue(mockResponse),
        },
      },
    }));

    await expect(generateBlogPost('Test Topic', 'professional')).rejects.toThrow();
  });

  it('should handle missing API key', async () => {
    const originalKey = config.openaiApiKey;
    config.openaiApiKey = '';

    await expect(generateBlogPost('Test Topic', 'professional')).rejects.toThrow('OpenAI API key is required');

    config.openaiApiKey = originalKey;
  });

  it('should handle different writing styles', async () => {
    const styles = ['professional', 'casual', 'technical'];
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: 'Test Post',
              content: 'Test content',
            }),
          },
        },
      ],
    };

    mockOpenAI.mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue(mockResponse),
        },
      },
    }));

    for (const style of styles) {
      const result = await generateBlogPost('Test Topic', style);
      expect(result).toBeDefined();
      expect(result.title).toBe('Test Post');
      expect(result.content).toBe('Test content');
    }
  });

  it('should handle empty topic', async () => {
    await expect(generateBlogPost('', 'professional')).rejects.toThrow('Topic is required');
  });

  it('should handle invalid style', async () => {
    await expect(generateBlogPost('Test Topic', 'invalid-style')).rejects.toThrow('Invalid style');
  });

  it('should handle null topic', async () => {
    await expect(generateBlogPost(null as any, 'professional')).rejects.toThrow('Topic is required');
  });

  it('should handle undefined topic', async () => {
    await expect(generateBlogPost(undefined as any, 'professional')).rejects.toThrow('Topic is required');
  });

  it('should handle null style', async () => {
    await expect(generateBlogPost('Test Topic', null as any)).rejects.toThrow('Style is required');
  });

  it('should handle undefined style', async () => {
    await expect(generateBlogPost('Test Topic', undefined as any)).rejects.toThrow('Style is required');
  });

  it('should handle network errors', async () => {
    mockOpenAI.mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockRejectedValue(new Error('Network Error')),
        },
      },
    }));

    await expect(generateBlogPost('Test Topic', 'professional')).rejects.toThrow('Network Error');
  });

  it('should handle rate limiting', async () => {
    mockOpenAI.mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockRejectedValue(new Error('Rate limit exceeded')),
        },
      },
    }));

    await expect(generateBlogPost('Test Topic', 'professional')).rejects.toThrow('Rate limit exceeded');
  });
}); 