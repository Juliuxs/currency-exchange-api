import { pino, type Logger as PinoLoggerType } from 'pino'

export interface Logger {
  info: (message: string, context?: Record<string, unknown>) => void
  error: (message: string, error?: Error, context?: Record<string, unknown>) => void
  warn: (message: string, context?: Record<string, unknown>) => void
  debug: (message: string, context?: Record<string, unknown>) => void
}

class PinoLogger implements Logger {
  private readonly logger: PinoLoggerType

  constructor () {
    this.logger = pino({
      level: 'info',
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: {
        level: (label) => ({ level: label })
      }
    })
  }

  info (message: string, context: Record<string, unknown> = {}): void {
    this.logger.info(context, message)
  }

  error (message: string, error?: Error, context: Record<string, unknown> = {}): void {
    this.logger.error({
      ...context,
      error: error
        ? {
            message: error.message,
            name: error.name,
            stack: error.stack
          }
        : undefined
    }, message)
  }

  warn (message: string, context: Record<string, unknown> = {}): void {
    this.logger.warn(context, message)
  }

  debug (message: string, context: Record<string, unknown> = {}): void {
    this.logger.debug(context, message)
  }
}

// Export a singleton instance
export const logger: Logger = new PinoLogger()
