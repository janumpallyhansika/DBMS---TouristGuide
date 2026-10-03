import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import pool from "../config/db.js";

const router = express.Router();

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);


// =====================================================
// CREATE JWT
// =====================================================

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
}


// =====================================================
// REGISTER
// POST /api/auth/register
// =====================================================

router.post("/register", async (req, res) => {
  try {

    const {
      name,
      email,
      password
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters"
      });
    }

    // Check existing user
    const [existingUsers] = await pool.execute(
      `
      SELECT id
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(
      password,
      10
    );

    // IMPORTANT:
    // Your database column is "password"
    // NOT "password_hash"

    const [result] = await pool.execute(
      `
      INSERT INTO users
        (
          name,
          email,
          password,
          auth_provider
        )
      VALUES
        (?, ?, ?, ?)
      `,
      [
        name,
        email,
        passwordHash,
        "local"
      ]
    );

    const user = {
      id: result.insertId,
      name,
      email
    };

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user
    });

  } catch (error) {

    console.error(
      "Register error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
});


// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

router.post("/login", async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const [users] = await pool.execute(
      `
      SELECT
        id,
        name,
        email,
        password,
        google_id,
        profile_image,
        auth_provider
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = users[0];

    // Google-only account
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message:
          "This account uses Google Login. Please continue with Google."
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      profile_image: user.profile_image || null
    };

    const token = createToken(safeUser);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: safeUser
    });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
});


// =====================================================
// GOOGLE LOGIN
// POST /api/auth/google
// =====================================================

router.post("/google", async (req, res) => {
  try {

    const {
      credential
    } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required"
      });
    }

    // Verify Google credential
    const ticket =
      await googleClient.verifyIdToken({
        idToken: credential,
        audience:
          process.env.GOOGLE_CLIENT_ID
      });

    const payload =
      ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google credential"
      });
    }

    const googleId =
      payload.sub;

    const email =
      payload.email;

    const name =
      payload.name ||
      email.split("@")[0];

    const picture =
      payload.picture || null;


    // Check existing user
    const [existingUsers] =
      await pool.execute(
        `
        SELECT
          id,
          name,
          email,
          password,
          google_id,
          profile_image,
          auth_provider
        FROM users
        WHERE email = ?
        LIMIT 1
        `,
        [email]
      );


    let user;


    if (existingUsers.length > 0) {

      user = existingUsers[0];

      // Update Google information
      await pool.execute(
        `
        UPDATE users
        SET
          google_id = ?,
          profile_image = ?,
          auth_provider = ?
        WHERE id = ?
        `,
        [
          googleId,
          picture,
          "google",
          user.id
        ]
      );

    } else {

      // Create Google user
      const [result] =
        await pool.execute(
          `
          INSERT INTO users
            (
              name,
              email,
              google_id,
              profile_image,
              auth_provider
            )
          VALUES
            (?, ?, ?, ?, ?)
          `,
          [
            name,
            email,
            googleId,
            picture,
            "google"
          ]
        );

      user = {
        id: result.insertId,
        name,
        email
      };
    }


    const safeUser = {
      id: user.id,
      name: user.name || name,
      email: user.email || email,
      profile_image:
        picture ||
        user.profile_image ||
        null
    };


    const token =
      createToken(safeUser);


    return res.json({
      success: true,
      message: "Google login successful",
      token,
      user: safeUser
    });

  } catch (error) {

    console.error(
      "Google authentication error:",
      error
    );

    return res.status(401).json({
      success: false,
      message: "Google authentication failed",
      error: error.message
    });
  }
});


export default router;