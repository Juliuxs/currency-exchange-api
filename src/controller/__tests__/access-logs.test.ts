import { describe, it, expect, vi } from 'vitest'
import * as accessLogsController from '../access-logs.js'
import * as accessLogsService from '../../service/access-logs.js'
import type { Request, Response, NextFunction } from 'express'

describe('Access Logs Controller', () => {
  it('should return access logs with default pagination', async () => {
    // Arrange
    const req = {
      query: {}
    } as Request

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response

    const next = vi.fn() as NextFunction

    const mockLogs = [
      { ipAddress: '127.0.0.1', accessedAt: new Date() },
      { ipAddress: '127.0.0.2', accessedAt: new Date() }
    ]

    const getAccessLogsSpy = vi.spyOn(accessLogsService, 'getAccessLogs')
      .mockResolvedValue(mockLogs)

    // Act
    await accessLogsController.getAccessLogsController(req, res, next)

    // Assert
    expect(getAccessLogsSpy).toHaveBeenCalledWith({
      startDate: undefined,
      endDate: undefined,
      limit: 100,
      offset: 0
    })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      data: mockLogs,
      pagination: {
        limit: 100,
        offset: 0
      }
    })
  })

  it('should return access logs with custom pagination and date range', async () => {
    // Arrange
    const startDate = '2023-01-01'
    const endDate = '2023-12-31'
    const req = {
      query: {
        startDate,
        endDate,
        limit: '50',
        offset: '10'
      }
    } as unknown as Request

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response

    const next = vi.fn() as NextFunction

    const mockLogs = [
      { ipAddress: '127.0.0.1', accessedAt: new Date() }
    ]

    const getAccessLogsSpy = vi.spyOn(accessLogsService, 'getAccessLogs')
      .mockResolvedValue(mockLogs)

    // Act
    await accessLogsController.getAccessLogsController(req, res, next)

    // Assert
    expect(getAccessLogsSpy).toHaveBeenCalledWith({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      limit: '50',
      offset: '10'
    })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      data: mockLogs,
      pagination: {
        limit: '50',
        offset: '10'
      }
    })
  })
})
