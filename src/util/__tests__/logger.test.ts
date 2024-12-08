import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logger } from '../logger.js'

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should log info messages correctly', () => {
    const logSpy = vi.spyOn(logger, 'info')
    const testMessage = 'Test info message'
    logger.info(testMessage)
    expect(logSpy).toHaveBeenCalledWith(testMessage)
  })

  it('should log warn messages correctly', () => {
    const logSpy = vi.spyOn(logger, 'warn')
    const testMessage = 'Test warning message'
    logger.warn(testMessage)
    expect(logSpy).toHaveBeenCalledWith(testMessage)
  })

  it('should log error messages correctly', () => {
    const logSpy = vi.spyOn(logger, 'error')
    const testMessage = 'Test error message'
    const testError = new Error('Test error')
    logger.error(testMessage, testError)
    expect(logSpy).toHaveBeenCalledWith(testMessage, testError)
  })

  it('should log debug messages correctly', () => {
    const logSpy = vi.spyOn(logger, 'debug')
    const testMessage = 'Test debug message'
    logger.debug(testMessage)
    expect(logSpy).toHaveBeenCalledWith(testMessage)
  })
})
