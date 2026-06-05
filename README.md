URL Shortener

A URL shortener made with Typescript.

## Steps to run locally

Clone the project

```bash
  git clone https://github.com/vepifanio/url-shortener.git
```

Go to the project directory

```bash
  cd url-shortener
```

Rename .env.example to .env

```bash
  mv .env.example .env
```

Install dependencies

```bash
  npm install
```

Run docker compose to get up MongoDB and Redis services

```bash
  docker compose up -d
```

Start the application

```bash
  npm run start:dev
```

Run the tests (uses in-memory MongoDB, no Docker required)

```bash
  npm run test
```

## Routes

### Create a short URL

[POST] - http://localhost:3333/api/short

```bash
  curl -X POST "http://localhost:3333/api/short" -H "Content-Type: application/json" -d '{ "originalUrl": "http://google.com" }'
```

Response example:

```json
{
  "shortUrl": "http://localhost:3333/a-short-url-id",
  "shortUrlId": "a-short-url-id"
}
```

### Redirect to the original URL

[GET] - http://localhost:3333/:shortUrlId

```bash
  curl -X GET "http://localhost:3333/a-short-url-id"
```

## Architecture

- **Clean Architecture**: Entity → Repository Interface → Use Case → Route
- **Caching**: Redis cache layer with decorator pattern (`CachedUrlsRepository` wrapping `MongooseUrlsRepository`)
- **Testing**: MongoDB Memory Server for isolated integration tests, Redis mocked in-memory

## ⚙️ Libraries

- Typescript
- Mongoose
- Express
- Vitest / Supertest
- express-rate-limit
- zod
- nanoid
- ioredis (Redis client)
- mongodb-memory-server (in-memory MongoDB for tests)
