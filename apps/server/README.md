# Backend

A [Hono](https://hono.dev/) API running on Node.js. This app only starts the
HTTP server (`src/index.ts`). The routes live in
[`packages/api`](../../packages/api/src/router.ts) and the database client in
[`packages/db`](../../packages/db/src/prisma/db.ts). The data is stored in
MongoDB through Prisma.

I chose Hono instead of Express because it lets the frontend import the API's
types and call it with a typed client. It is still a plain REST API over HTTP.

## Setup and run

1. Install dependencies from the repo root:

   ```bash
   pnpm install
   ```

2. Create the database config. Copy `packages/db/.env.example` to
   `packages/db/.env` and set `DATABASE_URL` (see below).

3. Start the server, either with the frontend from the repo root:

   ```bash
   pnpm run dev
   ```

   or on its own:

   ```bash
   pnpm --filter server dev
   ```

The server listens on http://localhost:4000. To run a production build, use
`pnpm --filter server build` and then `pnpm --filter server start`.

## MongoDB connection notes

Set `DATABASE_URL` in `packages/db/.env`. The file is git-ignored and is loaded
by the db package itself, so it works no matter which folder you start the
server from.

- **Version:** MongoDB 8.0 or newer.
- **Local:** a standalone `mongod`, or `docker run -p 27017:27017 mongo:8`, is
  enough. For example `mongodb://localhost:27017/todos`. No replica set is
  needed for the queries this app uses.
- **Atlas:** use the `mongodb+srv://...` connection string from Atlas, and make
  sure your IP address is on the cluster's access list.
- Todos are stored in a `todos` collection.

## API

| Method | Endpoint              | Description                                     |
| ------ | --------------------- | ----------------------------------------------- |
| GET    | `/api/todos`          | Get all todos, most recently updated first      |
| POST   | `/api/todos`          | Create a todo (`title`, optional `description`) |
| PUT    | `/api/todos/:id`      | Update a todo's title and description           |
| PATCH  | `/api/todos/:id/done` | Toggle the done status                          |
| DELETE | `/api/todos/:id`      | Delete a todo                                   |

A todo looks like this:

```json
{
  "id": "string",
  "title": "string",
  "description": "string | null",
  "done": false,
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

`id` is the MongoDB `_id`, returned as a string. Requests are validated with
zod: `title` must not be empty after trimming. Unknown ids return a 404 with
`{ "error": "Todo not found" }`.

## Configuration

| Variable       | Default                 | Purpose                                          |
| -------------- | ----------------------- | ------------------------------------------------ |
| `DATABASE_URL` | none (required)         | MongoDB connection string, in `packages/db/.env` |
| `WEB_ORIGIN`   | `http://localhost:3000` | Origin allowed by CORS                           |

The port is fixed at 4000 in `src/index.ts`.

## Assumptions and limitations

- There is no authentication, so all todos are shared.
- The port is hard-coded to 4000.
- `createdAt` and `updatedAt` are set by the API, because MongoDB has no column
  defaults. `updatedAt` also changes when a todo is marked done or undone.
- `GET /api/todos` returns every todo with no pagination.
