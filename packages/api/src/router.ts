import { zValidator } from "@hono/zod-validator";
import { db } from "@repo/db";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";

const todoSchema = z.object({
  title: z.string().trim().min(1),
  description: z
    .string()
    .nullish()
    .transform((v) => v ?? null),
});

// Routes are chained so their types are preserved for the RPC client.
const todosRouter = new Hono()
  .get("/", async (c) => {
    const items = await db.orm.todos.orderBy({ updatedAt: -1 }).all();

    return c.json(items);
  })
  .post("/", zValidator("json", todoSchema), async (c) => {
    const now = new Date();
    const created = await db.orm.todos.create({
      ...c.req.valid("json"),
      done: false,
      createdAt: now,
      updatedAt: now,
    });

    return c.json(created, 201);
  })
  .put("/:id", zValidator("json", todoSchema), async (c) => {
    const updated = await db.orm.todos
      .where({ id: c.req.param("id") })
      .update({ ...c.req.valid("json"), updatedAt: new Date() });

    if (!updated) {
      return c.json({ error: "Todo not found" }, 404);
    }

    return c.json(updated, 200);
  })
  .patch("/:id/done", async (c) => {
    const todo = await db.orm.todos.where({ id: c.req.param("id") }).first();

    if (!todo) {
      return c.json({ error: "Todo not found" }, 404);
    }

    const updated = await db.orm.todos
      .where({ id: todo.id })
      .update({ done: !todo.done, updatedAt: new Date() });

    return c.json(updated, 200);
  })
  .delete("/:id", async (c) => {
    const deleted = await db.orm.todos
      .where({ id: c.req.param("id") })
      .delete();

    if (!deleted) {
      return c.json({ error: "Todo not found" }, 404);
    }

    return c.json(deleted, 200);
  });

const app = new Hono()
  .use("*", cors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:3000" }))
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route("/api/todos", todosRouter);

export type AppType = typeof app;
export { app };
