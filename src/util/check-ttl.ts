import { config } from '../config.js'

export function checkTTL (numberInMs: number): boolean {
  return numberInMs + config.ratesExpirationTimeInMs < Date.now()
}
