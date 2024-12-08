import { describe, it, expect, vi } from 'vitest'
import * as currentRatesController from '../current-rates.js'
import * as currentRatesService from '../../service/current-rates.js'
import type { Request, Response, NextFunction } from 'express'

describe('Current Rates Controller', () => {
  it('should return current rates', async () => {
    // Arrange
    const req = {
      ip: '127.0.0.1'
    } as Request

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response

    const next = vi.fn() as NextFunction

    const mockRates: any = {
      base: 'USD',
      timestamp: Date.now(),
      rates: {
        EUR: 0.85,
        GBP: 0.73
      }
    }

    const getCurrentRatesSpy = vi.spyOn(currentRatesService, 'getCurrentRatesAndLogAccess')
      .mockResolvedValue(mockRates)

    // Act
    await currentRatesController.getCurrentExchangeRates(req, res, next)

    // Assert
    expect(getCurrentRatesSpy).toHaveBeenCalledWith('127.0.0.1')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockRates)
  })

  it('should use "unknown" if no IP provided', async () => {
    // Arrange
    const req = {} as Request

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response

    const next = vi.fn() as NextFunction

    const mockRates: any = {
      base: 'USD',
      timestamp: Date.now(),
      rates: {
        EUR: 0.85,
        GBP: 0.73
      }
    }

    const getCurrentRatesSpy = vi.spyOn(currentRatesService, 'getCurrentRatesAndLogAccess')
      .mockResolvedValue(mockRates)

    // Act
    await currentRatesController.getCurrentExchangeRates(req, res, next)
    // Assert
    expect(getCurrentRatesSpy).toHaveBeenCalledWith('unknown')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockRates)
  })
})
