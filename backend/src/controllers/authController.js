import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';

import {
  createUser,
  findUserByEmail,
  findUserById
} from '../models/userModel.js';

import generateToken from '../utils/generateToken.js';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);


/* =========================================
   REGISTER
   ========================================= */

export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 6 characters'
      });
    }

    const existingUser =
      await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const userId = await createUser({
      name,
      email,
      password: hashedPassword,
      authProvider: 'local'
    });

    const user = await findUserById(userId);

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user
    });

  } catch (error) {
    next(error);
  }
};


/* =========================================
   LOGIN
   ========================================= */

export const login = async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user =
      await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'This account uses Google Login'
      });
    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token =
      generateToken(user);

    const safeUser =
      await findUserById(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser
    });

  } catch (error) {
    next(error);
  }
};


/* =========================================
   GOOGLE LOGIN
   ========================================= */

export const googleLogin = async (req, res, next) => {
  try {
    const {
      credential
    } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        success: false,
        message: 'Google Client ID is not configured'
      });
    }

    const ticket =
      await googleClient.verifyIdToken({
        idToken: credential,
        audience:
          process.env.GOOGLE_CLIENT_ID
      });

    const payload =
      ticket.getPayload();

    const googleId =
      payload.sub;

    const name =
      payload.name || 'Google User';

    const email =
      payload.email;

    const profileImage =
      payload.picture || null;

    let user =
      await findUserByEmail(email);

    if (!user) {
      const userId =
        await createUser({
          name,
          email,
          password: null,
          googleId,
          profileImage,
          authProvider: 'google'
        });

      user =
        await findUserById(userId);
    }

    const token =
      generateToken(user);

    res.json({
      success: true,
      message: 'Google login successful',
      token,
      user
    });

  } catch (error) {
    console.error(
      'Google Login Error:',
      error.message
    );

    res.status(401).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
};


/* =========================================
   CURRENT USER
   ========================================= */

export const getMe = async (req, res, next) => {
  try {
    const user =
      await findUserById(req.user.id);

    res.json({
      success: true,
      user
    });

  } catch (error) {
    next(error);
  }
};