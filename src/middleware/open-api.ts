import { type Express } from 'express'
import * as OpenApiValidator from 'express-openapi-validator'
import swaggerUi from 'swagger-ui-express'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import YAML from 'yamljs'

const currentDirname = dirname(fileURLToPath(import.meta.url))
const openApiPath = join(currentDirname, '../../openapi.yaml')
const swaggerDocument = YAML.load(openApiPath)

export async function swagger (app: Express): Promise<void> {
  // Add Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

  // Existing validation middleware
  app.use(
    OpenApiValidator.middleware({
      apiSpec: openApiPath,
      validateRequests: true,
      validateApiSpec: true,
      ignoreUndocumented: true,
      validateSecurity: true // Disable security validation
    })
  )
}
