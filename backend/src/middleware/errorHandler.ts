import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

// Global error handler middleware for Express
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({ err, req: { method: req.method, url: req.url } }, 'Unhandled Exception');
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred. Our team has been notified.' : err.message,
  });
};
