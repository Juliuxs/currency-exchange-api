import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logAccess, getAccessLogs } from '../access-logs.js'
import { AppError } from '../../middleware/error-handler.js'

const mockRepository = vi.hoisted(() => ({
  save: vi.fn(),
  find: vi.fn()
}))

vi.mock('../../data-source.js', () => ({
  AppDataSource: {
    getRepository: vi.fn(() => mockRepository)
  }
}))

describe('logAccess', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('successfully logs access', async () => {
    const accessData = {
      ipAddress: '127.0.0.1',
      accessedAt: '2023-01-01T00:00:00.000Z'
    }
    mockRepository.save.mockResolvedValue(accessData)

    await logAccess(accessData)

    expect(mockRepository.save).toHaveBeenCalledWith(accessData)
  })

  it('throws AppError when save fails', async () => {
    const accessData = {
      ipAddress: '127.0.0.1',
      accessedAt: '2023-01-01T00:00:00.000Z'
    }
    mockRepository.save.mockRejectedValue(new Error('DB error'))

    await expect(logAccess(accessData)).rejects.toThrow(AppError)
  })
})

describe('getAccessLogs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns access logs with default parameters', async () => {
    const mockLogs = [
      { ipAddress: '127.0.0.1', accessedAt: new Date('2023-01-01') },
      { ipAddress: '127.0.0.2', accessedAt: new Date('2023-01-02') }
    ]
    mockRepository.find.mockResolvedValue(mockLogs)

    const result = await getAccessLogs({})

    expect(result).toEqual(mockLogs)
    expect(mockRepository.find).toHaveBeenCalledWith(expect.objectContaining({
      take: 100,
      skip: 0
    }))
  })

  it('respects custom pagination parameters', async () => {
    const mockLogs = [
      { ipAddress: '127.0.0.1', accessedAt: new Date('2023-01-01') }
    ]
    mockRepository.find.mockResolvedValue(mockLogs)

    const result = await getAccessLogs({ limit: 50, offset: 2 })

    expect(result).toEqual(mockLogs)
    expect(mockRepository.find).toHaveBeenCalledWith(expect.objectContaining({
      take: 50,
      skip: 100
    }))
  })

  it('enforces maximum limit', async () => {
    const mockLogs = []
    mockRepository.find.mockResolvedValue(mockLogs)

    await getAccessLogs({ limit: 2000 })

    expect(mockRepository.find).toHaveBeenCalledWith(expect.objectContaining({
      take: 1000
    }))
  })

  it('applies date filters correctly', async () => {
    const startDate = new Date('2023-01-01')
    const endDate = new Date('2023-12-31')
    const mockLogs = []
    mockRepository.find.mockResolvedValue(mockLogs)

    await getAccessLogs({ startDate, endDate })

    expect(mockRepository.find).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        accessedAt: expect.any(Object)
      }
    }))
  })

  it('throws AppError when query fails', async () => {
    mockRepository.find.mockRejectedValue(new Error('DB error'))

    await expect(getAccessLogs({})).rejects.toThrow(AppError)
  })
})

