import { builtinModules } from "module";
import { build } from 'esbuild';
import approot from "app-root-path";
import { logger } from "./logger";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import fse from "fs-extra";
import { injectFile } from "../tools/inject";

import argv from "./argv";

export const env = argv.env || process?.env?.NODE_ENV || "dev";
export const root = approot.path;

const { name, description, version, author } = fse.readJSONSync(root + "/package.json");

const _externalsPlugin = nodeExternalsPlugin({ allowList:["info", "lib", "node", "web"].map(v=>"@randajan/simple-lib/"+v)});
const _modes = ["web", "node"];

const buildFactory = ({entries, distdir, minify, splitting, external, plugins, loader, format, jsx, info })=>{
    let _build; //cache esbuild

    return async _=>{
        if (_build) { await _build.rebuild(); return _build; }
        return _build = await build({
            format,
            minify,
            color:true,
            bundle: true,
            sourcemap: true,
            logLevel: 'error',
            incremental: true,
            entryPoints:entries,
            outdir:distdir,
            define:{__slib_info:JSON.stringify(info)},
            splitting,
            external,
            plugins,
            loader,
            jsx:jsx.transform,
            jsxDev:jsx.dev,
            jsxFactory:jsx.factory,
            jsxFragment:jsx.fragment || jsx.factory,
            jsxImportSource:jsx.importSource
        });
    }
}

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
        const dir = (x.dir ? x.dir + "/" : "");
        
        x.srcdir = dir + (x.srcdir || "src");
        x.distdir = dir + (x.distdir || "dist");
        x.entries = (x.entries || ["index.js"]).map(e=>x.srcdir+"/"+e);
        x.minify = x.minify != null ? x.minify : minify;
        x.external = [...(x.external || []), ...external, ...builtinModules];
        x.loader = {...(x.loader || {}), ...loader};
        x.jsx = x.jsx ? {...jsx, ...x.jsx} : jsx;
        x.info = { ...(x.info || {}), ...argv, ...info, port, mode, dir:{ root, dist:x.distdir }}
        x.rebuild = buildFactory(x);
    }

    const statics = !lib.statics ? [] : lib.statics.map(stc=>{
        const srcdir = lib.srcdir+"/"+stc;
        const distdir = lib.distdir+"/"+stc;
        const rebuild = _=>fse.copy(srcdir, distdir);
        return {srcdir, distdir, rebuild}; 
    });

    const pub = !isWeb ? {} : {
        srcdir:demo.dir+ "/public",
        distdir:demo.distdir+"/public",
        rebuild:async () => {
            await fse.copy(pub.srcdir, pub.distdir);
            await Promise.all(injects.map(file=>injectFile(pub.distdir+"/"+file, demo.info)));
        }
    }

    const peersFile = (lib.dir ? lib.dir+"/" : "")+"peers.js";
    return { port, lib, demo, pub, statics, peersFile, isWeb, mode, rebuildBuffer, log:logger(name, version, env) }
}