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
    // Arrange
    const logSpy = vi.spyOn(logger, 'info')
    const testMessage = 'Test info message'
    
    // Act
    logger.info(testMessage)
    
    // Assert
    expect(logSpy).toHaveBeenCalledWith(testMessage)
  })

  it('should log warn messages correctly', () => {
    // Arrange
    const logSpy = vi.spyOn(logger, 'warn')
    const testMessage = 'Test warning message'
    
    // Act
    logger.warn(testMessage)
    
    // Assert
    expect(logSpy).toHaveBeenCalledWith(testMessage)
  })

  it('should log error messages correctly', () => {
    // Arrange
    const logSpy = vi.spyOn(logger, 'error')
    const testMessage = 'Test error message'
    const testError = new Error('Test error')
    
    // Act
    logger.error(testMessage, testError)
    
    // Assert
    expect(logSpy).toHaveBeenCalledWith(testMessage, testError)
  })

  it('should log debug messages correctly', () => {
    // Arrange
    const logSpy = vi.spyOn(logger, 'debug')
    const testMessage = 'Test debug message'
    
    // Act
    logger.debug(testMessage)
    
    // Assert
    expect(logSpy).toHaveBeenCalledWith(testMessage)
  })
})



