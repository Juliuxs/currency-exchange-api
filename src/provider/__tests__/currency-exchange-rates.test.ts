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
      const mockResponse = {
        timestamp: 1234567890,
        base: 'USD',
        rates: { EUR: 0.85, GBP: 0.73 }
      }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await provider.getLatestRates()

      expect(result).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}?app_id=${mockApiKey}`,
        expect.objectContaining({
          method: 'GET',
          headers: { Accept: 'application/json' }
        })
      )
    })

    it('retries on failure and eventually succeeds', async () => {
      const mockResponse = {
        timestamp: 1234567890,
        base: 'USD',
        rates: { EUR: 0.85, GBP: 0.73 }
      }
      
      const failedResponse = { ok: false, status: 500 }
      const successResponse = {
        ok: true,
        json: () => Promise.resolve(mockResponse)
      }

      global.fetch = vi.fn()
        .mockResolvedValueOnce(failedResponse)
        .mockResolvedValueOnce(failedResponse)
        .mockResolvedValueOnce(successResponse)

      const result = await provider.getLatestRates()

      expect(result).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledTimes(3)
    })

  })
})
