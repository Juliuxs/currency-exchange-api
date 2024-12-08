import 'reflect-metadata'
import 'dotenv/config'

import { DataSource } from 'typeorm'
import { config } from './config.js'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: 'currency-exchange',

  synchronize: false,
  logging: false,
  entities: [],
  migrations: ['dist/migration/**/*.js']
})
