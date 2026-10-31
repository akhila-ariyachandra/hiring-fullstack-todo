# Frontend

A [Next.js](https://nextjs.org) (React) app for managing todos. It talks to the
backend in [`apps/server`](../server/README.md) over HTTP.

## Features

- View todos in two tabs, **Not Done** and **Done**, with the most recently
  updated first
- Create a todo with a title and an optional description
- Edit the title and description in a dialog
- Mark a todo as done, or undo it; completed todos are shown with a strikethrough
- Delete a todo
- Confirmation dialogs before marking done, undoing and deleting
- Form validation (the title is required)
- Optimistic updates: the list changes immediately and rolls back if the request
  fails
- Success and error toasts for every action, and an error page with a retry
  button if the todos can't be loaded

## Setup and run

The API must be running, because the page loads the todos from it on the server.

1. Install dependencies from the repo root:

   ```bash
   pnpm install
   ```

2. Set up the backend's `DATABASE_URL` as described in the
   [backend README](../server/README.md).

3. Start both apps from the repo root:

   ```bash
   pnpm run dev
   ```

   or start only the frontend:

   ```bash
   pnpm --filter web dev
   ```

Open http://localhost:3000.

Other scripts: `pnpm --filter web build`, `start`, `lint` and `check-types`.

## Configuration

| Variable              | Default                 | Purpose             |
| --------------------- | ----------------------- | ------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Base URL of the API |

The API is only called from the server (server components and server actions),
so the browser never calls it directly.

## How it is built

- **Data loading:** `app/page.tsx` fetches the todos on the server and caches
  them under the `todos` tag. The server actions in `app/actions.ts` call the
  API and then expire that tag with `updateTag`, so the list is fresh after
  every change.
- **API client:** `lib/api.ts` is a typed Hono client. Its types come from
  `@repo/api`, so a change to a route shows up as a type error in the frontend.
- **UI:** [shadcn/ui](https://ui.shadcn.com/) components on Base UI and
  Tailwind CSS. The new and edit forms share one component,
  `app/todo-form.tsx`, built with react-hook-form and zod.
- **Optimistic UI:** `useOptimistic` and transitions in `app/todos.tsx`.

## Assumptions and limitations

- This is Next.js 16 with Cache Components, and its APIs differ from older
  versions. See `AGENTS.md` if you are editing the code with an AI assistant.
- Because the API is called from the server, the API URL must be reachable from
  the Next.js server, not from the browser.
- There is no authentication and no pagination.
- There is no loading skeleton for the first page load.
- `pnpm --filter web build` renders the home page, so the API and MongoDB must
  be running while you build.
