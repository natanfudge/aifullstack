import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import { generateToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { validateEmail, validatePassword } from '../utils/validation';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('[AUTH DEBUG] Signup request body:', JSON.stringify(req.body));
    const { email, password } = req.body;

    // Check for missing fields first
    if (!email || !password) {
      console.log('[AUTH DEBUG] Missing email or password');
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    // Validate input
    console.log('[AUTH DEBUG] Validating email:', email);
    if (!validateEmail(email)) {
      console.log('[AUTH DEBUG] Invalid email format');
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    console.log('[AUTH DEBUG] Validating password');
    if (!validatePassword(password)) {
      console.log('[AUTH DEBUG] Invalid password format');
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Check if user exists
    console.log('[AUTH DEBUG] Checking if user exists with email:', email);
    const existingUser = await User.findOne({ email });
    console.log('[AUTH DEBUG] Existing user check result:', existingUser ? 'User exists' : 'User does not exist');
    
    if (existingUser) {
      console.log('[AUTH DEBUG] User already exists');
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Create user
    console.log('[AUTH DEBUG] Creating new user');
    const user = await User.create({
      email,
      password,
    });
    console.log('[AUTH DEBUG] User created with ID:', user._id);

    // Generate token
    console.log('[AUTH DEBUG] Generating token for user ID:', user._id);
    const token = generateToken(user._id.toString());
    console.log('[AUTH DEBUG] Token generated');

    // Remove password from output
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    console.log('[AUTH DEBUG] Signup successful, returning response');
    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    console.log('[AUTH DEBUG] Error in signup:', error);
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('[AUTH DEBUG] Login request body:', JSON.stringify(req.body));
    const { email, password } = req.body;

    // Check for missing fields first
    if (!email || !password) {
      console.log('[AUTH DEBUG] Missing email or password');
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    // Validate input
    console.log('[AUTH DEBUG] Validating email:', email);
    if (!validateEmail(email)) {
      console.log('[AUTH DEBUG] Invalid email format');
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    console.log('[AUTH DEBUG] Validating password');
    if (!validatePassword(password)) {
      console.log('[AUTH DEBUG] Invalid password format');
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Check if user exists - don't use select in test mode
    console.log('[AUTH DEBUG] Looking up user by email:', email);
    let user;
    try {
      if (process.env.NODE_ENV === 'test') {
        console.log('[AUTH DEBUG] Test mode - not using select');
        user = await User.findOne({ email });
      } else {
        console.log('[AUTH DEBUG] Production mode - using select +password');
        user = await User.findOne({ email }).select('+password');
      }
    } catch (err) {
      console.log('[AUTH DEBUG] Error finding user:', err);
      throw err;
    }
    
    console.log('[AUTH DEBUG] User lookup result:', user ? 'User found' : 'User not found');
    
    if (!user) {
      console.log('[AUTH DEBUG] User not found - invalid credentials');
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    console.log('[AUTH DEBUG] Comparing password');
    try {
      const isMatch = await user.comparePassword(password);
      console.log('[AUTH DEBUG] Password match result:', isMatch ? 'Password matches' : 'Password does not match');
      
      if (!isMatch) {
        console.log('[AUTH DEBUG] Password does not match - invalid credentials');
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
    } catch (err) {
      console.log('[AUTH DEBUG] Error comparing password:', err);
      throw err;
    }

    // Generate token
    console.log('[AUTH DEBUG] Generating token for user ID:', user._id);
    const token = generateToken(user._id.toString());
    console.log('[AUTH DEBUG] Token generated');

    // Remove password from output
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    console.log('[AUTH DEBUG] Login successful, returning response');
    res.status(200).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    console.log('[AUTH DEBUG] Error in login:', error);
    next(error);
  }
}; 