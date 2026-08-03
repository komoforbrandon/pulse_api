# Pulse API

Pulse is a lightweight uptime monitoring service with a public status page API. It lets operators register monitors, track availability checks, and inspect active incidents while exposing a simple public endpoint for status consumers.

## Features

- Register and authenticate operators
- Create, list, update, and remove URL monitors
- Record periodic check results and expose historical check data
- Track incidents and expose uptime statistics over time
- Serve a public status overview for your status page consumers
- Document the API with Swagger UI at `/docs`

## Tech stack

- Node.js
- Express
- PostgreSQL
- JWT-based operator authentication
- Swagger UI for API documentation
- Zod for request validation

## Project structure

- [src/app.js](src/app.js) – application wiring and route registration
- [src/routes](src/routes) – route definitions
- [src/controllers](src/controllers) – request handlers
- [src/models](src/models) – database access layer
- [src/lib](src/lib) – validators, auth helpers, and schemas
- [docs/openapi.yaml](docs/openapi.yaml) – OpenAPI specification used by Swagger UI

## Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database

## Environment variables

Create a `.env` file in the project root with the following values:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/pulse
JWT_SECRET=replace-this-with-a-long-random-secret
NODE_ENV=development
LOG_LEVEL=info
CORS_ORIGIN=*
RATE_LIMIT_MAX=100
```

## Installation

```bash
pnpm install
```

## Database setup

Run the schema and seed scripts:

```bash
pnpm run db:migrate
pnpm run db:seed
```

## Run locally

Start the development server:

```bash
pnpm run dev
```

The API will be available at:

- http://localhost:3000/
- http://localhost:3000/health
- http://localhost:3000/docs

## API overview

### Authentication

- `POST /auth/register` – create an operator account
- `POST /auth/login` – authenticate and receive a JWT token

### Monitoring

- `POST /monitors` – create a monitor
- `GET /monitors` – list monitors with pagination
- `GET /monitors/{id}` – get a monitor by ID
- `PATCH /monitors/{id}` – update monitor state
- `DELETE /monitors/{id}` – delete a monitor
- `GET /monitors/{id}/checks` – fetch recent checks
- `GET /monitors/{id}/checks.csv` – download check history as CSV
- `GET /monitors/{id}/uptime` – get uptime metrics
- `GET /monitors/{id}/incidents` – get incidents for a monitor

### Incidents and status

- `GET /incidents` – list incidents across monitors
- `GET /status` – fetch the public status payload

## Documentation

Swagger UI is served from `/docs` and uses the spec in [docs/openapi.yaml](docs/openapi.yaml).

## Testing

Run the test suite:

```bash
pnpm test
```

## Notes

- The public status endpoint is intended for frontend status pages and dashboards.
- Protected monitor-management endpoints expect a Bearer token in the `Authorization` header.
