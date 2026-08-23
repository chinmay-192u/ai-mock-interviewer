import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

interface AuthJwtPayload extends JwtPayload {
  userId: string;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Not authorized. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Not authorized. Invalid token.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthJwtPayload;
    console.log('Decoded JWT:', decoded);
    console.log('Authenticated userId:', decoded.userId);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Not authorized. Invalid token.',
    });
  }
};
