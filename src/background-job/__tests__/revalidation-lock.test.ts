import { describe, it, expect, vi } from 'vitest'
import { createRevalidationLock } from '../revalidation-lock.js'

describe('Revalidation Lock', () => {
  it('should prevent concurrent revalidations', async () => {
    const lock = createRevalidationLock()
    
    const mockRevalidate = vi.fn().mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    // Start first revalidation
    const firstRevalidation = lock.startRevalidation(mockRevalidate)
    
    // Try to start second revalidation immediately
    const secondRevalidation = lock.startRevalidation(mockRevalidate)

    // Try to start third revalidation immediately
    const thirdRevalidation = lock.startRevalidation(mockRevalidate)

    await Promise.all([firstRevalidation, secondRevalidation, thirdRevalidation])

    // Should only call revalidate once since second call was locked
    expect(mockRevalidate).toHaveBeenCalledTimes(1)
  })

  it('should allow subsequent revalidation after completion', async () => {
    const lock = createRevalidationLock()
    const mockRevalidate = vi.fn().mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 50)) // Reduced timeout
    })

    // First revalidation
    await lock.startRevalidation(mockRevalidate)
    
    // Ensure first revalidation has fully completed
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Second revalidation after first completes
    await lock.startRevalidation(mockRevalidate)

    expect(mockRevalidate).toHaveBeenCalledTimes(2)
  })

  it('should handle revalidation errors gracefully', async () => {
    const lock = createRevalidationLock()
    const mockRevalidate = vi.fn().mockImplementation(async () => {
      throw new Error('Revalidation failed')
    })

    await lock.startRevalidation(mockRevalidate)

    // Should still allow new revalidations after error
    const secondMockRevalidate = vi.fn()
    await lock.startRevalidation(secondMockRevalidate)

    expect(secondMockRevalidate).toHaveBeenCalled()
  })
})
