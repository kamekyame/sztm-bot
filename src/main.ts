// start cron job
import "./cron.ts";

// start twitter stream
// import { stream } from "./stream.ts";

// start API server
import { app } from "./api.ts";

export default { fetch: app.fetch };
