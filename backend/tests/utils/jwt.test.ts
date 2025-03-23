import { generateToken, verifyToken } from '../../src/utils/jwt';
import { config } from '../../src/utils/config';

describe('JWT Utils', () => {
  const testUserId = '507f1f77bcf86cd799439011';

  it('should generate a valid token', () => {
    const token = generateToken(testUserId);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('should verify a valid token', () => {
    const token = generateToken(testUserId);
    const decoded = verifyToken(token);
    expect(decoded).toBeDefined();
    expect(decoded.id).toBe(testUserId);
  });

  it('should handle invalid token', () => {
    const invalidToken = 'invalid-token';
    expect(() => verifyToken(invalidToken)).toThrow();
  });

  it('should handle expired token', () => {
    // Create a token with a very short expiration time
    const token = generateToken(testUserId, '1ms');
    // Wait for token to expire
    return new Promise(resolve => {
      setTimeout(() => {
        expect(() => verifyToken(token)).toThrow();
        resolve(undefined);
      }, 10);
    });
  });

  it('should handle missing token', () => {
    expect(() => verifyToken('')).toThrow();
  });

  it('should handle null token', () => {
    expect(() => verifyToken(null as any)).toThrow();
  });

  it('should handle undefined token', () => {
    expect(() => verifyToken(undefined as any)).toThrow();
  });

  it('should handle malformed token', () => {
    const malformedToken = 'not.a.jwt.token';
    expect(() => verifyToken(malformedToken)).toThrow();
  });

  it('should handle token with invalid signature', () => {
    const token = generateToken(testUserId);
    const [header, payload] = token.split('.');
    const invalidToken = `${header}.${payload}.invalid-signature`;
    expect(() => verifyToken(invalidToken)).toThrow();
  });

  it('should handle token with invalid payload', () => {
    const token = generateToken(testUserId);
    const [header, , signature] = token.split('.');
    const invalidToken = `${header}.invalid-payload.${signature}`;
    expect(() => verifyToken(invalidToken)).toThrow();
  });

  it('should handle token with invalid header', () => {
    const token = generateToken(testUserId);
    const [, payload, signature] = token.split('.');
    const invalidToken = `invalid-header.${payload}.${signature}`;
    expect(() => verifyToken(invalidToken)).toThrow();
  });

  it('should handle token with missing parts', () => {
    const token = generateToken(testUserId);
    const [header, payload] = token.split('.');
    const invalidToken = `${header}.${payload}`;
    expect(() => verifyToken(invalidToken)).toThrow();
  });

  it('should handle token with extra parts', () => {
    const token = generateToken(testUserId);
    const invalidToken = `${token}.extra-part`;
    expect(() => verifyToken(invalidToken)).toThrow();
  });

  it('should handle token with non-JSON payload', () => {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const payload = Buffer.from('not-json').toString('base64');
    const signature = 'invalid-signature';
    const invalidToken = `${header}.${payload}.${signature}`;
    expect(() => verifyToken(invalidToken)).toThrow();
  });

  it('should handle token with invalid algorithm', () => {
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64');
    const payload = Buffer.from(JSON.stringify({ id: testUserId })).toString('base64');
    const signature = 'invalid-signature';
    const invalidToken = `${header}.${payload}.${signature}`;
    expect(() => verifyToken(invalidToken)).toThrow();
  });
}); 