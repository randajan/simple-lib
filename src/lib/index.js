import { info } from "../info";
import { logger } from "../tools/logger";

export default info;

export const log = logger(info.name, info.version, info.env);

export {
    info,
}