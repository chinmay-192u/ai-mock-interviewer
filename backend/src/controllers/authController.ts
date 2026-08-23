import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { generateToken } from '../services/authService.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = generateToken(user._id.toString());

    // Return token to frontend
    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Generate JWT
    const token = generateToken(user._id.toString());

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    console.log('Authenticated userId:', req.userId);

    const user = await User.findById(req.userId).select('-password');

    console.log('Found user:', user);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
    });
  }
};
