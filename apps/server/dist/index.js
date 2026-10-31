import { serve } from "@hono/node-server";
import { app } from "@repo/api";
serve({
    fetch: app.fetch,
    port: 4000,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
