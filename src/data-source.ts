import 'reflect-metadata'
import 'dotenv/config'

import { DataSource } from 'typeorm'
import { CurrencyRate } from './entity/currency-rates.js'
import { AccessLog } from './entity/access-logs.js'
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
  entities: [CurrencyRate, AccessLog],
  migrations: ['dist/migration/**/*.js']
})
