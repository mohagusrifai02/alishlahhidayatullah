import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'replace-me-with-secret';
const JWT_EXPIRES_IN = '7d';

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Use a strong secret in .env.local');
}

export interface AuthPayload {
  id: string;
  email: string;
  name?: string;
}

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compareSync(password, hashedPassword);
}

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export function getAuthPayload(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export function isAuthenticated(request: NextRequest) {
  return !!getAuthPayload(request);
}
