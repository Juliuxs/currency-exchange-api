# Currency Exchange Rate API

A RESTful API service that provides current currency exchange rates with background synchronization and access logging capabilities.

## Tech Stack

- Node.js v20.18.0
- TypeScript
- Express
- TypeORM
- Postgres
- Zod for validation
- Vitest for testing

## Project Structure

- `/src`
  - `/background-job` - Background job processing
  - `/cron` - Cron jobs
  - `/controller` - API route handlers
  - `/entity` - TypeORM entities
  - `/middleware` - Express middleware
  - `/provider` - External service integrations
  - `/schema` - Request/response validation schemas
  - `/service` - Business logic layer
  - `/util` - Utility functions

## Setup & Installation

### Prerequisites
- Node.js v20.9.0 or higher
- npm v10.0.0 or higher
- Docker and Docker Compose

### External API Requirements
You'll need to sign up for a free API key at [Open Exchange Rates](https://openexchangerates.org/):
1. Create an account at https://openexchangerates.org/signup
2. Once registered, get your API key from the dashboard
3. Add your API key to the `.env` file as `OPEN_EXCHANGE_API_KEY`
4. The API URL should be set as `OPEN_EXCHANGE_URL=https://openexchangerates.org/api`

### Steps to get started
1. Clone the repository:
   ```sh
   git clone git@github.com:Juliuxs/currency-exchange-api.git
   cd git@github.com:Juliuxs/currency-exchange-api.git
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env` and set the necessary variables.
4. Start required services (PostgreSQL):
   ```sh
   npm run db:setup
   ```
5. Run database migrations:
   ```sh
   npm run db:migration:run
   ```
6. Start the development server:
   ```sh
   npm run dev
   ```

## API Documentation

Once the server is running, you can access the OpenAPI documentation at:
- http://localhost:3000/api-docs

This interactive documentation provides detailed information about all available endpoints, request/response schemas, and allows you to try out the API directly from the browser.

## Available Commands

- `npm run build` - Compiles TypeScript code to JavaScript
- `npm run start` - Starts the production server
- `npm run dev` - Runs the development server with hot reload
- `npm run test` - Runs all tests
- `npm run coverage:test` - Runs tests in coverage mode
- `npm run lint` - Lints the codebase
- `npm run db:migration:run` - Runs database migrations
- `npm run db:setup` - Starts required services