import 'reflect-metadata'
import 'dotenv/config'

import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import { router } from './router/index.js'
import { AppDataSource } from './data-source.js'
import { createServer } from 'http'
import { config } from './config.js'
import { errorHandler, AppError } from './middleware/error-handler.js'
import { swagger } from './middleware/open-api.js'
import { logger } from './util/logger.js'

const app = express()
const server = createServer(app)

// Security middlewares
app.use(helmet()) // Adds various HTTP headers for security
app.use(cors()) // By default, CORS allows:

// Performance middlewares
app.use(compression()) // Compress responses
app.use(express.json({ limit: '10kb' })) // Body parser with size limit

app.set('trust proxy', true)

// Initialize database first
AppDataSource.initialize()
  .then(async () => {
    logger.info('****************************')
    logger.info('*    DB: connected')

    app.use('/api', router)

    await swagger(app)

    // Route not found middleware
    app.use((req, _res, next) => {
      next(new AppError(404, `Such route does not exist ${req.originalUrl}`, { isOperational: true }))
    })

    // Global error handler
    app.use(errorHandler)

    // Start server after everything is initialized
    server.listen(config.port, () => {
      logger.info('*    Backend: ready')
      logger.info(`*    Port: ${config.port}`)
    })
  })
  .catch(error => {
    logger.error('Failed to connect to database:', error)
    process.exit(1)
  })
