import { generateBlogPost } from '../../src/utils/openai';
import { config } from '../../src/utils/config';
import { AppError } from '../../src/utils/AppError';

jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  })),
}));

const mockOpenAI = jest.requireMock('openai').OpenAI;
const mockCreate = mockOpenAI.mock.results[0].value.chat.completions.create;

describe('OpenAI Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: 'Generated blog post content',
          },
        },
      ],
    });
  });

  it('should generate a blog post', async () => {
    const topic = 'Test Topic';
    const style = 'Professional';

    const result = await generateBlogPost(topic, style);
    expect(result).toEqual({
      title: 'Blog Post About Test Topic',
      content: 'Generated blog post content'
    });
    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
      model: "gpt-3.5-turbo",
      messages: expect.arrayContaining([
        expect.objectContaining({
          role: "system",
          content: expect.any(String),
        }),
        expect.objectContaining({
          role: "user",
          content: expect.stringContaining(topic),
        }),
      ]),
    }));
  });

  it('should handle API errors', async () => {
    const mockError = new Error('API Error');
    mockCreate.mockRejectedValueOnce(mockError);

    await expect(generateBlogPost('Topic', 'Style')).rejects.toThrow(
      new AppError('Failed to generate blog post: API Error', 500)
    );
  });

  it('should handle empty topic', async () => {
    await expect(generateBlogPost('', 'Style')).rejects.toThrow(
      new AppError('Topic is required', 400)
    );
  });

  it('should handle empty style', async () => {
    await expect(generateBlogPost('Topic', '')).rejects.toThrow(
      new AppError('Style is required', 400)
    );
  });

  it('should handle null topic', async () => {
    await expect(generateBlogPost(null as any, 'Style')).rejects.toThrow(
      new AppError('Topic is required', 400)
    );
  });

  it('should handle undefined topic', async () => {
    await expect(generateBlogPost(undefined as any, 'Style')).rejects.toThrow(
      new AppError('Topic is required', 400)
    );
  });

  it('should handle null style', async () => {
    await expect(generateBlogPost('Topic', null as any)).rejects.toThrow(
      new AppError('Style is required', 400)
    );
  });

  it('should handle undefined style', async () => {
    await expect(generateBlogPost('Topic', undefined as any)).rejects.toThrow(
      new AppError('Style is required', 400)
    );
  });

  it('should handle network errors', async () => {
    const mockError = new Error('Network Error');
    mockCreate.mockRejectedValueOnce(mockError);

    await expect(generateBlogPost('Topic', 'Style')).rejects.toThrow(
      new AppError('Failed to generate blog post: Network Error', 500)
    );
  });

  it('should handle rate limiting', async () => {
    const mockError = new Error('Rate limit exceeded');
    mockCreate.mockRejectedValueOnce(mockError);

    await expect(generateBlogPost('Topic', 'Style')).rejects.toThrow(
      new AppError('Failed to generate blog post: Rate limit exceeded', 500)
    );
  });
}); 