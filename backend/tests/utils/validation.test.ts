import { validateEmail, validatePassword, validatePost, validateGenerateRequest } from '../../src/utils/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.com',
        'user@sub.domain.com',
        'user@domain.travel',
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        'test@',
        '@example.com',
        'test@.com',
        'test@com.',
        'test@.com.',
        'test space@example.com',
        'test@example com',
        'test@example.com.',
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });

    it('should handle empty and null values', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null as any)).toBe(false);
      expect(validateEmail(undefined as any)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate valid passwords', () => {
      const validPasswords = [
        'Password123!',
        'StrongP@ssw0rd',
        'Complex!Pass123',
        'Valid@Pass1',
      ];

      validPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(true);
      });
    });

    it('should reject invalid passwords', () => {
      const invalidPasswords = [
        'weak',
        'pass',
        '12345',
        'abcde',
        'ABCDE',
      ];

      invalidPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(false);
      });
    });

    it('should handle empty and null values', () => {
      expect(validatePassword('')).toBe(false);
      expect(validatePassword(null as any)).toBe(false);
      expect(validatePassword(undefined as any)).toBe(false);
    });
  });

  describe('validatePost', () => {
    it('should validate valid post data', () => {
      const validPosts = [
        {
          title: 'Test Post',
          content: 'Test content',
          isDraft: true,
        },
        {
          title: 'Another Post',
          content: 'More content',
          isDraft: false,
        },
      ];

      validPosts.forEach(post => {
        expect(validatePost(post)).toBe(true);
      });
    });

    it('should reject invalid post data', () => {
      const invalidPosts = [
        {
          content: 'Missing title',
          isDraft: true,
        },
        {
          title: 'Missing content',
          isDraft: false,
        },
        {
          title: '',
          content: 'Empty title',
          isDraft: true,
        },
        {
          title: 'Empty content',
          content: '',
          isDraft: false,
        },
        {
          title: null,
          content: 'Null title',
          isDraft: true,
        },
        {
          title: 'Null content',
          content: null,
          isDraft: false,
        },
      ];

      invalidPosts.forEach(post => {
        expect(validatePost(post)).toBe(false);
      });
    });

    it('should handle empty and null values', () => {
      expect(validatePost({} as any)).toBe(false);
      expect(validatePost(null as any)).toBe(false);
      expect(validatePost(undefined as any)).toBe(false);
    });
  });

  describe('validateGenerateRequest', () => {
    it('should validate valid generate requests', () => {
      const validRequests = [
        {
          topic: 'Test Topic',
          style: 'professional',
        },
        {
          topic: 'Another Topic',
          style: 'casual',
        },
        {
          topic: 'Technical Topic',
          style: 'technical',
        },
      ];

      validRequests.forEach(request => {
        expect(validateGenerateRequest(request).isValid).toBe(true);
      });
    });

    it('should reject invalid generate requests', () => {
      const invalidRequests = [
        {
          style: 'professional',
        },
        {
          topic: 'Missing style',
        },
        {
          topic: '',
          style: 'professional',
        },
        {
          topic: 'Invalid style',
          style: 'invalid-style',
        },
        {
          topic: null,
          style: 'professional',
        },
        {
          topic: 'Null style',
          style: null,
        },
      ];

      invalidRequests.forEach(request => {
        expect(validateGenerateRequest(request).isValid).toBe(false);
      });
    });

    it('should handle empty and null values', () => {
      expect(validateGenerateRequest({} as any).isValid).toBe(false);
      expect(validateGenerateRequest(null as any).isValid).toBe(false);
      expect(validateGenerateRequest(undefined as any).isValid).toBe(false);
    });
  });
}); 