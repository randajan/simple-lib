import { builtinModules } from "module";
import approot from "app-root-path";
import { logger } from "./logger";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import fse from "fs-extra";
import { injectFile } from "../tools/inject";

import argv from "./argv";
import path from "path";
import { buildFactory } from "./buildFactory";

export const env = argv.env || process?.env?.NODE_ENV || "dev";
export const root = approot.path;

const { name, description, version, author } = fse.readJSONSync(path.join(root, "package.json"));

const _externalsPlugin = nodeExternalsPlugin({ allowList:["info", "lib", "node", "web"].map(v=>"@randajan/simple-lib/"+v)});
const _modes = ["web", "node"];

export const parseConfig = (isBuild, c={})=>{
    const port = c.port || argv.port || 3000;
    const mode = c.mode != null ? c.mode : _modes[0];
    const minify = c.minify != null ? c.minify : false;
    const info = {...(c.info ? c.info : {}), isBuild, name, description, version, author, env, mode};
    const injects = c.injects || ["index.html"];
    const rebuildBuffer = Math.max(0, Number(c.rebuildBuffer) || 100);
    const external = c.external || [];
    const plugins = c.plugins || [];
    const loader = c.loader || {};
    const jsx = c.jsx || {};

    if (!_modes.includes(mode)) { throw Error(`mode should be one of '${_modes.join("', '")}' but '${mode}' provided`); }
    const isWeb = mode === "web";

    const lib = c.lib || {};
    const demo = c.demo || {};

    lib.dir = lib.dir || "";
    lib.format = "esm";
    lib.splitting = true;
    lib.plugins = [...(lib.plugins || []), ...plugins, _externalsPlugin];

    demo.dir = demo.dir || "demo";
    demo.format = "iife";
    demo.plugins = [...(demo.plugins || []), ...plugins];

    if (!isWeb) {
        demo.format = "esm";
        demo.plugins.push(_externalsPlugin);
    }

    for (const x of [lib, demo]) {
        x.srcdir = path.join(x.dir, x.srcdir || "src");
        x.distdir = path.join(x.dir, x.distdir || "dist");
        x.entries = (x.entries || ["index.js"]).map(e=>path.join(x.srcdir, e));
        x.minify = x.minify != null ? x.minify : minify;
        x.external = [...(x.external || []), ...external, ...builtinModules];
        x.loader = {...(x.loader || {}), ...loader};
        x.jsx = x.jsx ? {...jsx, ...x.jsx} : jsx;
        x.info = { ...(x.info || {}), ...argv, ...info, port, mode, dir:{ root, dist:x.distdir }}
        x.rebuild = buildFactory(x);
    }

    if (lib.standalone) {
        const libRebuild = lib.rebuild;
        const sa = typeof lib.standalone == "object" ? lib.standalone : {...lib, name:lib.standalone, distdir:""};
        const { distdir, name, external, plugins, loader } = sa;
        
        const saRebuild = buildFactory({
            globalName:name,
            filename:name,
            entries:[path.join(lib.srcdir, "index.js")],
            distdir:path.join(lib.distdir, distdir || "standalone"),
            minify:false,
            splitting:false,
            external,
            plugins,
            loader,
            format:"iife",
            jsx:{},
            info:lib.info
        });
        
        lib.rebuild = _=>Promise.all([libRebuild(), saRebuild()]);
    }

    const statics = !lib.statics ? [] : lib.statics.map(stc=>{
        const srcdir = path.join(lib.srcdir, stc);
        const distdir = path.join(lib.distdir, stc);
        const rebuild = _=>fse.copy(srcdir, distdir);
        return {srcdir, distdir, rebuild}; 
    });

    const pub = !isWeb ? null : {
        srcdir:path.join(demo.dir, "public"),
        distdir:demo.distdir,
        rebuild:async () => {
            await fse.copy(pub.srcdir, pub.distdir);
            await Promise.all(injects.map(file=>injectFile(path.join(pub.distdir, file), demo.info)));
        }
    }

    const peersFile = path.join(lib.dir, "peers.js");
    return { port, lib, demo, pub, statics, peersFile, isWeb, mode, rebuildBuffer, log:logger(name, version, env) }
}