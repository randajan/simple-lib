import { info } from "../info";
import { logger } from "../logger";

export default info;

export const log = logger(info.name, info.version, info.env);

export {
    info,
}