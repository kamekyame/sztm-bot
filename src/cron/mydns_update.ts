import { baFetch, BasicAuthInfo } from "../deps.ts";
import { nonReqEnv } from "../env.ts";

const username = nonReqEnv.MYDNS_MASTER_ID;
const password = nonReqEnv.MYDNS_PASSWORD;

export const mydnsUpdateDNS = (() => {
  if (!username || !password) {
    console.log("[mydns_update] username or password is not set");
    return () => {};
  } else {
    const auth: BasicAuthInfo = { username, password };
    return () => {
      ["ipv4", "ipv6"].forEach(async (type) => {
        const res = await baFetch(`https://${type}.mydns.jp/login.html`, auth);
        // console.log(res);
        if (res.status === 200) {
          console.log(`[mydns_update] Updated ${type}`);
        } else {
          console.log(`[mydns_update] Failed update ${type}`);
        }
      });
    };
  }
})();

// Herokuでは再起動ごとにIPが変わる可能性があるため、起動時に更新を行う
mydnsUpdateDNS();
