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
  - `/controller` - API route handlers
  - `/entity` - Entities
  - `/middleware` - Express middleware
  - `/provider` - External service integrations
  - `/schema` - Request/response validation schemas
  - `/service` - Business logic layer
  - `/util` - Utility functions

## Setup & Installation

### Prerequisites
- Node.js v20.9.0 or higher
- npm v10.0.0 or higher

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
4. Start required services:
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

# End of Selection
```
### Available Commands

- `npm run build` - Compiles TypeScript code to JavaScript
- `npm run start` - Starts the production server
- `npm run dev` - Runs the development server with hot reload
- `npm run test` - Runs all tests
- `npm run coverage:test` - Runs tests in coverage mode
- `npm run lint` - Lints the codebase
- `npm run db:migration:run` - Runs database migrations
- `npm run db:setup` - Starts required services