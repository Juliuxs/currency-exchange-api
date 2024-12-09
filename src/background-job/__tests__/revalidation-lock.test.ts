import { describe, it, expect, vi } from 'vitest'
import { createRevalidationLock } from '../revalidation-lock.js'

describe('Revalidation Lock', () => {
  it('should prevent concurrent revalidations', async () => {
    const lock = createRevalidationLock()
    
    const mockRevalidate = vi.fn().mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    const firstRevalidation = lock.startRevalidation(mockRevalidate)
    const secondRevalidation = lock.startRevalidation(mockRevalidate)
    const thirdRevalidation = lock.startRevalidation(mockRevalidate)

    await Promise.all([firstRevalidation, secondRevalidation, thirdRevalidation])

    expect(mockRevalidate).toHaveBeenCalledTimes(1)
  })

  it('should allow subsequent revalidation after completion', async () => {
    const lock = createRevalidationLock()
    const mockRevalidate = vi.fn().mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    await lock.startRevalidation(mockRevalidate)
    await new Promise(resolve => setTimeout(resolve, 100))
    await lock.startRevalidation(mockRevalidate)

    expect(mockRevalidate).toHaveBeenCalledTimes(2)
  })

  it('should handle revalidation errors gracefully', async () => {
    const lock = createRevalidationLock()
    const mockRevalidate = vi.fn().mockImplementation(async () => {
      throw new Error('Revalidation failed')
    })

    await lock.startRevalidation(mockRevalidate)

    const secondMockRevalidate = vi.fn()
    await lock.startRevalidation(secondMockRevalidate)

    expect(secondMockRevalidate).toHaveBeenCalled()
  })
})
