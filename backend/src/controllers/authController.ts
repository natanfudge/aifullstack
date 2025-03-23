import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { validateEmail, validatePassword } from '../utils/validation';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!validateEmail(email)) {
      throw new AppError('Invalid email format', 400);
    }
    if (!validatePassword(password)) {
      throw new AppError('Password must be at least 6 characters long', 400);
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }

    // Create user
    const user = await User.create({
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id.toString());

    // Remove password from output
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!validateEmail(email)) {
      throw new AppError('Invalid email format', 400);
    }
    if (!validatePassword(password)) {
      throw new AppError('Password must be at least 6 characters long', 400);
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate token
    const token = generateToken(user._id.toString());

    // Remove password from output
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}; 