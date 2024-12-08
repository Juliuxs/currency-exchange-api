import { describe, it, expect, vi, beforeEach } from 'vitest'
import { type Request, type Response } from 'express'
import { AppError, errorHandler } from '../error-handler.js'

describe('Error Handler Middleware', () => {
  let mockResponse: Partial<Response>
  let statusCode: number
  let responseBody: any

  beforeEach(() => {
    // Reset mocks before each test
    statusCode = 0
    responseBody = null
    
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
  })

  const mockRequest = {
    path: '/test',
    method: 'GET',
    get: (header: string) => 'test-request-id'
  } as unknown as Request

  it('should handle operational errors by sending error message', () => {
    const operationalError = new AppError(400, 'Bad Request Error', { isOperational: true })
    
    errorHandler(operationalError, mockRequest, mockResponse as Response)

    expect(statusCode).toBe(400)
    expect(responseBody).toEqual({
      status: 'error',
      message: 'Bad Request Error'
    })
    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Bad Request Error'
    })
  })

  it('should handle non-operational errors by hiding actual error message', () => {
    const nonOperationalError = new Error('Internal System Failure')
    
    errorHandler(nonOperationalError, mockRequest, mockResponse as Response)

    expect(statusCode).toBe(500)
    expect(responseBody).toEqual({
      status: 'error',
      message: 'Internal server error'
    })
    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal server error'
    })
  })

  it('should handle AppError with custom status code', () => {
    const customError = new AppError(403, 'Forbidden Access', { isOperational: true })
    
    errorHandler(customError, mockRequest, mockResponse as Response)

    expect(statusCode).toBe(403)
    expect(responseBody).toEqual({
      status: 'error',
      message: 'Forbidden Access'
    })
    expect(mockResponse.status).toHaveBeenCalledWith(403)
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Forbidden Access'
    })
  })

  it('should convert unknown errors to AppError with 500 status', () => {
    const randomError = new TypeError('Unexpected type')
    
    errorHandler(randomError, mockRequest, mockResponse as Response)

    expect(statusCode).toBe(500)
    expect(responseBody).toEqual({
      status: 'error',
      message: 'Internal server error'
    })
    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal server error'
    })
  })
})

