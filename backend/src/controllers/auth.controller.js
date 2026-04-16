import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { signToken, cookieOptions } from '../utils/jwt.js';

const COOKIE = () => process.env.COOKIE_NAME || 'jb_token';

function sanitize(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company,
    createdAt: user.createdAt,
  };
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, company } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('name, email, password, role are required');
  }
  if (!['seeker', 'employer'].includes(role)) {
    res.status(400);
    throw new Error('role must be seeker or employer');
  }
  if (role === 'employer' && !company) {
    res.status(400);
    throw new Error('company is required for employer');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error('Email already registered');
  }

  const user = await User.create({ name, email, password, role, company });
  const token = signToken({ sub: user._id.toString(), role: user.role });
  res.cookie(COOKIE(), token, cookieOptions());
  res.status(201).json({ user: sanitize(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('email and password required');
  }
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  const token = signToken({ sub: user._id.toString(), role: user.role });
  res.cookie(COOKIE(), token, cookieOptions());
  res.json({ user: sanitize(user) });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(COOKIE(), { ...cookieOptions(), maxAge: 0 });
  res.json({ ok: true });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: sanitize(req.user) });
});
