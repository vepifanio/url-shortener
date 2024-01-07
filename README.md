# URL Shortener

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

Run docker compose to get up mongodb service

```bash
  docker compose up -d
```

Start the application

```bash
  npm run start:dev
```

Run the tests

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

## ⚙️ Libraries

- Typescript
- Mongoose
- Express
- Vitest / Supertest
- express-rate-limit
- zod
- nanoid
