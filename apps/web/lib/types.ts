import type { AppType } from "@repo/api";
import type { hc, InferResponseType } from "hono/client";

type Client = ReturnType<typeof hc<AppType>>;

export type Todo = InferResponseType<Client["api"]["todos"]["$get"]>[number];
