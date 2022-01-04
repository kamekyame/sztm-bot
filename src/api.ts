import { Application } from "./deps.ts";
import { logger, responseTypeHeader } from "./api/middleware.ts";

// Read Arguments
const port = parseInt(Deno.args[0]) || 8888;

// Oak application
const app = new Application();

app.use(logger);
app.use(responseTypeHeader);

// Hello World!
app.use((ctx) => {
  ctx.response.body = "Hello World!";
});

console.log(`Listen to http://localhost:${port}/`);
app.listen({ port }).then(() => {
  Deno.exit(1);
});
