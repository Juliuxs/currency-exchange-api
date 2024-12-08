import 'reflect-metadata'
import 'dotenv/config'

import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'

import { AppDataSource } from './data-source.js'
import { createServer } from 'http'
import { config } from './config.js'
import { logger } from './util/logger.js'

const app = express()
const server = createServer(app)

// Security middlewares
app.use(helmet())
app.use(cors())

// Performance middlewares
app.use(compression())
app.use(express.json({ limit: '10kb' }))

app.set('trust proxy', true)

// Initialize database first
AppDataSource.initialize()
  .then(async () => {
    logger.info('****************************')
    logger.info('*    DB: connected')

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
