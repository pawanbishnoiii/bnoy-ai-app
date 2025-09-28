import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456';

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  isAdmin?: boolean;
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email,
      isAdmin: user.isAdmin 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateAdminToken(): string {
  return jwt.sign(
    { 
      id: 'admin', 
      username: 'admin', 
      isAdmin: true 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function isAdmin(user: AuthUser | null): boolean {
  return user?.isAdmin === true;
}

// Session management
export class SessionManager {
  private sessions = new Map<string, AuthUser>();
  
  createSession(user: AuthUser): string {
    const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    this.sessions.set(sessionId, user);
    return sessionId;
  }
  
  getSession(sessionId: string): AuthUser | null {
    return this.sessions.get(sessionId) || null;
  }
  
  destroySession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
  
  clearExpiredSessions(): void {
    // In production, implement proper session expiry
    // For now, keep it simple
  }
}

export const sessionManager = new SessionManager();