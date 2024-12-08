import { describe, it, expect, vi, beforeEach } from 'vitest'
import { type Request, type Response, type NextFunction } from 'express'
import { z } from 'zod'
import { validate } from '../input-validator.js'

describe('Input Validator Middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction
  let statusCode: number
  let responseBody: any

  beforeEach(() => {
    statusCode = 0
    responseBody = null
    
    mockRequest = {
      body: {},
      query: {},
      params: {},
      ip: '127.0.0.1'
    } as Partial<Request>

    mockResponse = {
      status: vi.fn().mockImplementation((code: number) => {
        statusCode = code
        return mockResponse
      }),
      json: vi.fn().mockImplementation((body: any) => {
        responseBody = body
        return mockResponse
      })
    } as Partial<Response>

    nextFunction = vi.fn()
  })

  it('should pass validation when input matches schema', async () => {
    const schema = z.object({
      body: z.object({
        name: z.string(),
        age: z.number()
      }),
      query: z.object({}),
      params: z.object({}),
      ip: z.string()
    })

    mockRequest.body = {
      name: 'John',
      age: 25
    }

    const middleware = validate(schema)
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(nextFunction).toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
  })

  it('should return 400 error when validation fails', async () => {
    const schema = z.object({
      body: z.object({
        name: z.string(),
        age: z.number()
      }),
      query: z.object({}),
      params: z.object({}),
      ip: z.string()
    })

    mockRequest.body = {
      name: 'John',
      age: 'twenty five' // Invalid type for age
    }

    const middleware = validate(schema)
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(nextFunction).not.toHaveBeenCalled()
    expect(statusCode).toBe(400)
    expect(responseBody).toEqual({
      status: 'error',
      message: 'Invalid input',
      details: expect.any(Array)
    })
  })

  it('should validate query parameters', async () => {
    const schema = z.object({
      body: z.object({}),
      query: z.object({
        page: z.string(),
        limit: z.string()
      }),
      params: z.object({}),
      ip: z.string()
    })

    mockRequest.query = {
      page: '1',
      limit: 'invalid'
    }

    const middleware = validate(schema)
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(nextFunction).toHaveBeenCalled()
  })

  it('should validate URL parameters', async () => {
    const schema = z.object({
      body: z.object({}),
      query: z.object({}),
      params: z.object({
        id: z.string()
      }),
      ip: z.string()
    })

    mockRequest.params = {
      id: '123'
    }

    const middleware = validate(schema)
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(nextFunction).toHaveBeenCalled()
  })

  it('should return 500 error for non-validation errors', async () => {
    const schema = z.object({
      body: z.object({}).strict(),
      query: z.object({}),
      params: z.object({}),
      ip: z.string()
    })

    // Force an error by making schema.parseAsync throw a non-ZodError
    vi.spyOn(schema, 'parseAsync').mockRejectedValue(new Error('Unknown error'))

    const middleware = validate(schema)
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(nextFunction).not.toHaveBeenCalled()
    expect(statusCode).toBe(500)
    expect(responseBody).toEqual({
      status: 'error',
      message: 'Internal server error'
    })
  })
})
