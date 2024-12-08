import { type NextFunction, type Request, type Response } from 'express'
import { logger } from '../util/logger.js'

// Basic error class for application errors
export class AppError extends Error {
  public isOperational: boolean
  constructor (
    public statusCode: number,
    message: string,
    { cause, isOperational }: { cause?: Error, isOperational: boolean }
  ) {
    super(message, { cause })
    this.isOperational = isOperational
  }
}

// Global error handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response
): void => {
  // Convert to AppError if not already
  const error = err instanceof AppError
    ? err
    : new AppError(500, err.message, { isOperational: false, cause: err })

  // Log error details
  logger.error('Error occurred during request processing', error, {
    path: req.path,
    method: req.method,
    statusCode: error.statusCode,
    isOperational: error.isOperational,
    timestamp: new Date().toISOString(),
    requestId: req.get('x-request-id')
  })

  // Send error response
  res.status(error.statusCode).json({
    status: 'error',
    message: error.isOperational
      ? error.message
      : 'Internal server error'
  })
}

// Type definition for async route handler functions
export type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>

// Wrapper for async route handlers
export const catchAsync = (
  fn: AsyncRouteHandler
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next)
  }
}
