import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCurrentRatesAndLogAccess, getCurrentRates, synchronizeWithStorage } from '../current-rates.js'
import { backgroundWorker } from '../../background-job/queue.js'
import { currencyProvider } from '../../provider/currency-exchange-rates.js'
import { AppError } from '../../middleware/error-handler.js'

const mockRepository = vi.hoisted(() => ({
  findOne: vi.fn(),
  save: vi.fn()
}))

const mockRevalidator = vi.hoisted(() => ({
  startRevalidation: vi.fn()
}))

vi.mock('../../background-job/queue.js', () => ({
  backgroundWorker: {
    addTask: vi.fn()
  }
}))

vi.mock('../../data-source.js', () => ({
  AppDataSource: {
    getRepository: vi.fn(() => mockRepository)
  }
}))

vi.mock('../../provider/currency-exchange-rates.js', () => ({
  currencyProvider: {
    getLatestRates: vi.fn()
  }
}))

vi.mock('../../background-job/revalidation-lock.js', () => ({
  createRevalidationLock: () => mockRevalidator
}))

describe('getCurrentRatesAndLogAccess', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns current rates and logs access', async () => {
    const mockRates = {
      base: 'USD',
      rates: { EUR: 0.85 },
      createdAt: new Date()
    }
    mockRepository.findOne.mockResolvedValue(mockRates)

    const result = await getCurrentRatesAndLogAccess('127.0.0.1')

    expect(result).toEqual({
      base: 'USD',
      rates: { EUR: 0.85 },
      timestamp: mockRates.createdAt.toISOString()
    })
    expect(backgroundWorker.addTask).toHaveBeenCalledWith({
      type: 'LOG_ACCESS',
      payload: expect.objectContaining({
        ipAddress: '127.0.0.1',
        accessedAt: expect.any(String)
      })
    })
  })

  it('throws error when getCurrentRates fails', async () => {
    mockRepository.findOne.mockRejectedValue(new Error('DB error'))

    await expect(getCurrentRatesAndLogAccess('127.0.0.1')).rejects.toThrow(AppError)
  })
})

describe('getCurrentRates', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns stored rates when available and fresh', async () => {
    const mockRates = {
      base: 'USD',
      rates: { EUR: 0.85 },
      createdAt: new Date()
    }
    mockRepository.findOne.mockResolvedValue(mockRates)

    const result = await getCurrentRates()

    expect(result).toEqual({
      base: 'USD',
      rates: { EUR: 0.85 },
      timestamp: mockRates.createdAt.toISOString()
    })
    expect(mockRevalidator.startRevalidation).not.toHaveBeenCalled()
  })

  it('synchronizes with storage when no rates exist', async () => {
    mockRepository.findOne.mockResolvedValue(null)
    const newRates = {
      base: 'USD',
      rates: { EUR: 0.85 },
      timestamp: 1234567890
    }
    vi.mocked(currencyProvider.getLatestRates).mockResolvedValue(newRates)
    mockRepository.save.mockImplementation(data => ({
      ...data,
      createdAt: new Date()
    }))

    const result = await getCurrentRates()

    expect(result).toHaveProperty('base', 'USD')
    expect(result).toHaveProperty('rates', { EUR: 0.85 })
    expect(result).toHaveProperty('timestamp')
  })
})

describe('synchronizeWithStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('successfully synchronizes rates from provider', async () => {
    const providerRates = {
      base: 'USD',
      rates: { EUR: 0.85 },
      timestamp: 1234567890
    }
    vi.mocked(currencyProvider.getLatestRates).mockResolvedValue(providerRates)
    mockRepository.save.mockImplementation(data => ({
      ...data,
      createdAt: new Date()
    }))

    const result = await synchronizeWithStorage()

    expect(result).toHaveProperty('base', 'USD')
    expect(result).toHaveProperty('rates', { EUR: 0.85 })
    expect(result).toHaveProperty('timestamp')
  })

  it('throws error when provider fails', async () => {
    vi.mocked(currencyProvider.getLatestRates).mockResolvedValue(null)

    await expect(synchronizeWithStorage()).rejects.toThrow(AppError)
  })

  it('throws error when save fails', async () => {
    const providerRates = {
      base: 'USD',
      rates: { EUR: 0.85 },
      timestamp: 1234567890
    }
    vi.mocked(currencyProvider.getLatestRates).mockResolvedValue(providerRates)
    mockRepository.save.mockRejectedValue(new Error('DB error'))

    await expect(synchronizeWithStorage()).rejects.toThrow(AppError)
  })
})
