import { Router } from "express";
import { BACKEND_USERS, BackendUser } from "../data/seedData.ts";

export const authRouter = Router();

// User Registration
authRouter.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  const existing = BACKEND_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: "An account with this email address already exists." });
  }

  const newUser: BackendUser = {
    id: `usr-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    password,
    role: role || "VOLUNTEER",
    authProvider: "email",
    createdAt: new Date().toISOString()
  };

  BACKEND_USERS.push(newUser);

  res.status(201).json({
    success: true,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      emailVerified: true,
      createdAt: newUser.createdAt
    }
  });
});

// User Login
authRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = BACKEND_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: true,
      createdAt: user.createdAt
    }
  });
});

// Google OAuth Sync
authRouter.post("/google", (req, res) => {
  const { name, email, role, googleId } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Google account email is required." });
  }

  let user = BACKEND_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    user = {
      id: googleId ? `goog-${googleId}` : `usr-${Date.now()}`,
      name: name || "Google User",
      email: email.toLowerCase(),
      role: role || "VOLUNTEER",
      authProvider: "google",
      createdAt: new Date().toISOString()
    };
    BACKEND_USERS.push(user);
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: true,
      createdAt: user.createdAt
    }
  });
});

// Current User Session
authRouter.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthenticated" });
  }

  const email = req.headers["x-user-email"] as string;
  const user = BACKEND_USERS.find(u => u.email.toLowerCase() === email?.toLowerCase()) || BACKEND_USERS[0];

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: true
    }
  });
});
