import { parentPort } from "worker_threads";
import { info } from "../info";
import { logger } from "../tools/logger";

export default info;

export const log = logger(info.name, info.version, info.env);

export {
    info,
}

parentPort.on("message", msg=>{
    if (msg==="shutdown") { process.exit(0); }
});

process.on('uncaughtException', e=>{
  console.log(e.stack);
});