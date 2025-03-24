import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { config } from './config';
import { AppError } from './AppError';

interface TokenPayload {
  id: string;
}

// Define valid string values for expiresIn
type StringValue = '1s' | '1m' | '1h' | '1d' | '7d' | '30d';
type ExpiresIn = number | StringValue | undefined;

export const generateToken = (userId: string, expiresIn: ExpiresIn = '1d'): string => {
  console.log('[JWT DEBUG] Generating token for user:', userId);
  console.log('[JWT DEBUG] Token expiration:', expiresIn);
  console.log('[JWT DEBUG] Using secret:', config.jwtSecret || 'default-secret');
  
  const options: SignOptions = { expiresIn };
  const secret = config.jwtSecret as Secret;
  return jwt.sign({ id: userId }, secret, options);
};

export const verifyToken = (token: string): TokenPayload => {
  console.log('[JWT DEBUG] Verifying token');
  console.log('[JWT DEBUG] Token length:', token?.length);
  console.log('[JWT DEBUG] JWT Secret:', config.jwtSecret || 'default-secret');
  
  if (!token) {
    console.log('[JWT DEBUG] No token provided');
    throw new AppError('No token provided', 401);
  }

  try {
    const secret = config.jwtSecret as Secret;
    const decoded = jwt.verify(token, secret);
    console.log('[JWT DEBUG] Raw decoded token:', JSON.stringify(decoded));

    // Check if decoded is a string or doesn't have the expected structure
    if (typeof decoded === 'string' || !decoded || typeof decoded !== 'object') {
      console.log('[JWT DEBUG] Decoded token has invalid format', typeof decoded);
      throw new AppError('Invalid token payload', 401);
    }

    // Check if decoded has the id property
    if (!('id' in decoded)) {
      console.log('[JWT DEBUG] Decoded token missing id property');
      throw new AppError('Invalid token payload', 401);
    }

    console.log('[JWT DEBUG] Valid token with id:', (decoded as TokenPayload).id);
    return decoded as TokenPayload;
  } catch (error) {
    console.log('[JWT DEBUG] Error during token verification:', error);
    
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof jwt.TokenExpiredError) {
      console.log('[JWT DEBUG] Token expired');
      throw new AppError('Token expired', 401);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      console.log('[JWT DEBUG] Invalid token format or signature');
      throw new AppError('Invalid token', 401);
    }
    console.log('[JWT DEBUG] Unknown token verification error');
    throw new AppError('Token verification failed', 401);
  }
}; 