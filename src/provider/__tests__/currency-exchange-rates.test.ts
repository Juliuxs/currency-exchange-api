import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ExchangeRatesProvider } from '../currency-exchange-rates.js'

describe('ExchangeRatesProvider', () => {
  let provider: ExchangeRatesProvider
  const mockBaseUrl = 'https://api.example.com'
  const mockApiKey = 'test-api-key'

  beforeEach(() => {
    provider = new ExchangeRatesProvider(mockBaseUrl, mockApiKey)
    vi.clearAllMocks()
  })

  describe('getLatestRates', () => {
    it('successfully fetches exchange rates', async () => {
      // Arrange
      const mockResponse = {
        timestamp: 1234567890,
        base: 'USD',
        rates: { EUR: 0.85, GBP: 0.73 }
      }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      // Act
      const result = await provider.getLatestRates()

      // Assert
      expect(result).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}?app_id=${mockApiKey}`,
        expect.objectContaining({
          method: 'GET',
          headers: { Accept: 'application/json' }
        })
      )
    })

    it('throws error when API request fails', async () => {
      // Arrange
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401
      })

      // Act & Assert
      await expect(provider.getLatestRates()).rejects.toThrow('Failed to fetch exchange rates: HTTP error! status: 401')
    })

    it('throws error when network request fails', async () => {
      // Arrange
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      // Act & Assert
      await expect(provider.getLatestRates()).rejects.toThrow('Failed to fetch exchange rates: Network error')
    })
  })
})
