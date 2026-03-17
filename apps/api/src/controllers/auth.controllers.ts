import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PlatformUser } from "@enterprise-commerce/core/platform/types"
import { createUser } from "../models/User"
import { platform } from 'os';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const newUser: PlatformUser = {
      id: '',
      email,
      password,
    };

    const createdUser = await createUser(newUser);

    res.status(201).json({
      user: {
        id: createdUser.id,
        email: createdUser.email,
      },
    });
  } catch (error: any) {
    console.error(error);
    if (error?.message?.includes('UNIQUE constraint failed: users.email')) {
      res.status(409).json({ message: 'Email already in use.' });
      return;
    }
    res.status(500).json({ message: error?.message || 'Registration failed.' });
  }
};