# Fullstack Hiring Assessment: TODO App

A TODO app where you can view, create, edit, mark as done (and undone) and delete todos.

- **Frontend:** Next.js (React) in [apps/web](apps/web/README.md)
- **Backend:** Hono on Node.js in [apps/server](apps/server/README.md), with the routes defined in `packages/api`
- **Database:** MongoDB, accessed through Prisma (`packages/db`)
- **Monorepo:** pnpm workspaces and [Turborepo](https://turborepo.dev/)

## Monorepo layout

```
apps/
  web/        Next.js frontend (http://localhost:3000)
  server/     Node server that serves the API (http://localhost:4000)
packages/
  api/        Hono routes (/api/todos) and the shared `AppType`
  db/         Prisma schema, generated contract and the `db` client
```

The web app imports the `AppType` from `@repo/api` and uses Hono's typed client
(`hc`), so request and response types are shared between the frontend and the
backend without a separate codegen step. The frontend still talks to the backend
over HTTP.

## Setup

### Prerequisites

- Node.js
- [pnpm](https://pnpm.io/)
- A MongoDB database, version 8.0 or newer (local or Atlas)

### Environment variables

Copy `packages/db/.env.example` to `packages/db/.env` and set `DATABASE_URL` to
your MongoDB connection string. Every app that uses the database loads this one
file, regardless of its working directory. See the
[backend README](apps/server/README.md) for connection notes.

### Install

```bash
pnpm install
```

## Running the app

Turborepo starts both apps with one command:

```bash
pnpm run dev
```

The backend runs on http://localhost:4000 and the frontend on
http://localhost:3000.

```bash
open http://localhost:3000
```

## Scripts

Run from the repo root:

| Script                 | What it does                        |
| ---------------------- | ----------------------------------- |
| `pnpm dev`             | Start the frontend and backend      |
| `pnpm build`           | Build all apps                      |
| `pnpm lint`            | Lint all apps                       |
| `pnpm check-types`     | Type-check all apps                 |
| `pnpm knip`            | Find unused files, exports and deps |
| `pnpm prettier:check`  | Check formatting                    |
| `pnpm prettier:format` | Format the code                     |

## Assumptions and limitations

- There is no authentication, so everyone who can reach the app shares one list
  of todos.
- There is no pagination; the API returns every todo, newest-updated first.
