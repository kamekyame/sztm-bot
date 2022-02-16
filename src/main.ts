// start cron job
import "./cron.ts";

// start twitter stream
import { stream } from "./stream.ts";

// start API server
import { api } from "./api.ts";

const acs: AbortController[] = [];
acs.push(stream());
acs.push(api());

Deno.addSignalListener("SIGTERM", () => {
  for (const ac of acs) {
    ac.abort();
  }
  console.log("[main] SIGTERM received.");
});

Deno.addSignalListener("SIGKILL", () => {
  console.log("[main] SIGKILL received.");
});
