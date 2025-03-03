import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: any;
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(403).json({ message: 'Token required' });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
