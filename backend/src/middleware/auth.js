import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';

export const protect = asyncHandler(async (req, res, next) => {
  const cookieName = process.env.COOKIE_NAME || 'jb_token';
  const token =
    req.cookies?.[cookieName] ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    res.status(401);
    throw new Error('Not authenticated');
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    res.status(401);
    throw new Error('Invalid or expired token');
  }

  const user = await User.findById(decoded.sub);
  if (!user) {
    res.status(401);
    throw new Error('User no longer exists');
  }

  req.user = user;
  next();
});

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    return next(new Error(`Forbidden: requires role ${roles.join(' or ')}`));
  }
  next();
};
