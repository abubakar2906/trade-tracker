import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => 
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format the errors into a readable string
        const errorMessages = error.issues.map((issue: any) => `${issue.path.join('.')} is ${issue.message}`);
        res.status(400).json({ error: 'Invalid input', details: errorMessages });
        return;
      }
      res.status(500).json({ error: 'Internal validation error' });
      return;
    }
  };
