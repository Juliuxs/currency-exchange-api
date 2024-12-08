import { type Request, type Response, type NextFunction } from 'express'
import { type AnyZodObject, ZodError } from 'zod'

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        ip: req.ip
      })
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid input',
          details: error.errors
        })
      }
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      })
    }
  }
}
