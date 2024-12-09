import { config } from '../config.js'
import pRetry from 'p-retry'

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

  private async fetchRates (): Promise<ExchangeRate> {
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
  }

  async getLatestRates (): Promise<ExchangeRate> {
    return await pRetry(async () => await this.fetchRates(), {
      retries: 3, // Number of retry attempts
      onFailedAttempt: error => {
        console.error(`Attempt ${error.attemptNumber} failed. Retries left: ${error.retriesLeft}. Error: ${error.message}`)
      }
    })
  }
}

export const currencyProvider = new ExchangeRatesProvider(
  config.openExchangeRates.baseUrl,
  config.openExchangeRates.apiKey
)
