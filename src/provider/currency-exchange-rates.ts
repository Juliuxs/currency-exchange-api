import { config } from '../config.js'

interface ExchangeRate {
  timestamp: number
  base: string
  rates: Record<string, number>
}

export class ExchangeRatesProvider {
  private readonly baseUrl: string
  private readonly apiKey: string

  constructor (baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  async getLatestRates (): Promise<ExchangeRate> {
    try {
      const params = new URLSearchParams({
        app_id: this.apiKey
      })

      const url = `${this.baseUrl}?${params.toString()}`

      const options: RequestInit = {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      }

      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json() as ExchangeRate
      return {
        timestamp: data.timestamp,
        base: data.base,
        rates: data.rates
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch exchange rates: ${error.message}`)
      }
      throw new Error('Failed to fetch exchange rates')
    }
  }
}

export const currencyProvider = new ExchangeRatesProvider(
  config.openExchangeRates.baseUrl,
  config.openExchangeRates.apiKey
)
