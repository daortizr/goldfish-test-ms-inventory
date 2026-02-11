import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    [key: string]: any;
  };
}

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: any, info: any) => {
    if (err) {
      return res.status(500).json({
        error: 'Error de autenticación',
        message: err.message
      });
    }
    
    if (!user) {
      return res.status(401).json({
        error: 'No autorizado',
        message: 'Token inválido o expirado'
      });
    }
    
    // Attach user to request
    (req as AuthRequest).user = user;
    next();
  })(req, res, next);
};

/**
 * Optional: Middleware to check for specific roles
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthRequest).user;
    
    if (!user) {
      return res.status(401).json({
        error: 'No autorizado',
        message: 'Usuario no autenticado'
      });
    }
    
    // Check if user has required role
    // Adjust this based on your user structure
    const userRole = user.role || 'user';
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        error: 'Prohibido',
        message: 'No tienes permisos para realizar esta acción'
      });
    }
    
    next();
  };
};

