import type { AppType } from "@repo/api";
import { hc } from "hono/client";
import "server-only";

export const api = hc<AppType>(
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
);
