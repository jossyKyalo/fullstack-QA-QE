import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/db.config';   

interface TokenPayload {
  id: number;
  email: string;
  user_type: string;
}

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userType?: string;
    }
  }
}

 
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      res.status(401).json({ message: 'Authentication token is required' });
      return;
    }

    const token = authHeader.split(' ')[1];  
    if (!token) {
      res.status(401).json({ message: 'Invalid token format' });
      return;
    }

    
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
      }

      const payload = decoded as TokenPayload;
      req.userId = payload.id;
      req.userType = payload.user_type;

       
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication token error' });
    return;
  }
};
 
export const isRecruiter = (req: Request, res: Response, next: NextFunction): void => {
  if (req.userType !== 'recruiter') {
    res.status(403).json({ message: 'Access denied. Recruiter role required' });
    return;
  }
  next();
};
