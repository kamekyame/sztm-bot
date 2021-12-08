//console.log("Hello!!");

const port = Deno.args[0];

import { serve } from "https://deno.land/std@0.117.0/http/server.ts";

console.log(`http://localhost:${port}/`);
serve((req) => new Response("Hello World!!!!!!\n"), { addr: `:${port}` });