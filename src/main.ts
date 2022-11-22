// start cron job
import "./cron.ts";

// start twitter stream
import { stream } from "./stream.ts";

// start API server
import { api } from "./api.ts";

const acs: AbortController[] = [];
const disconnectStream = stream();
acs.push(api());

Deno.addSignalListener("SIGTERM", () => {
  disconnectStream();
  for (const ac of acs) {
    ac.abort();
  }
  console.log("[main] SIGTERM received.");
});
