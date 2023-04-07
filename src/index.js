import { Worker } from "worker_threads";
import { watch } from "chokidar";
import { build } from 'esbuild';
import fs from "fs-extra";
import server from "live-server";
import { injectFile } from "./inject";
import templates from "./templates";

const { NODE_ENV, npm_package_version, npm_package_name } = process.env;

export const argv = {};
for ( const arg of process.argv ) {
  const pair = String(arg).split("=");
  if (pair.length === 2) { Object.defineProperty(argv, pair[0], {value:pair[1], enumerable:true}); }
}

const name = npm_package_name;
const version = npm_package_version;
const env = argv.env || NODE_ENV;

export const log = (color, ...msgs)=>console.log(
    color,
    [
        (env ? [name, version, env] : [name, version]).join(" "),
        (new Date()).toLocaleTimeString("cs-CZ"),
        msgs.join(" "),
    ].join(" | "),
    "\x1b[0m"
);

const _modes = ["web", "node"];

export default async (isProd = true, o = {}) => {

    const port = o.port || 3000;
    const mode = o.mode != null ? o.mode : _modes[0];
    const minify = o.minify != null ? o.minify : isProd;
    const srcdir = o.srcdir || "src";
    const distdir = o.distdir || "dist";
    const demodir = o.demodir || "demo";
    const entries = (o.entries || ["index.js"]).map(e => srcdir + "/" + e);
    const dist = o.dist || {};
    const demo = o.demo || {};
    const fetchVars = o.fetchVars || (async _ => await fs.readJSON("package.json"));
    const onRuntimeError = o.onRuntimeError || console.log;
    const external = o.external || [];
    const rebuildBuffer = Math.max(0, Number(o.rebuildBuffer) || 100);

    if (!_modes.includes(mode)) { throw Error(`mode should be one of '${_modes.join("', '")}' but '${mode}' provided`); }
    const isWeb = mode === "web";

    if (!fs.existsSync(srcdir)) {
        await fs.outputFile(srcdir + "/index.js", templates.src);
    }
    if (!fs.existsSync(demodir + "/src")) {
        await fs.outputFile(demodir + "/src/index.js", templates.demo);
    }
    if (isWeb && !fs.existsSync(demodir + "/public")) {
        await fs.outputFile(demodir + "/public/index.html", templates.html);
    }

    const buildPublic = async () => {

        await fs.remove(demodir + '/build');
        if (!isWeb) { return; }

        await fs.copy(demodir + '/public', demodir + '/build');
        await injectFile(demodir + '/build/index.html', await fetchVars());
    }

    await buildPublic();

    const [srcBuild, demoBuild] = await Promise.all([
        build({
            ...dist,
            outdir: distdir,
            splitting: true,
            format: 'esm',
            incremental: true,
            color: true,
            bundle: true,
            sourcemap: true,
            minify,
            entryPoints: entries,
            external
        }),
        build({
            ...demo,
            color: true,
            entryPoints: [demodir + '/src/index.js'],
            outdir: demodir + '/build',
            bundle: true,
            sourcemap: true,
            minify: false,
            format: 'iife',
            incremental: true
        })
    ])

    if (isProd) { return; }

    let worker;
    const rebuildDemo = async (rebuildPublic=false)=>{
        if (rebuildPublic) { await buildPublic(); }
        await demoBuild.rebuild().catch(onRuntimeError);
        if (isWeb) { return; }
        if (worker) { worker.terminate(); }
        worker = new Worker(("./"+demodir+"/build/index.js").replaceAll("\\", "/"));
    }
    const rebuildSrc = async _=>{
        await srcBuild.rebuild().catch(onRuntimeError);
        await rebuildDemo(false);
    };

    const rebootOn = (name, color, path, exe, ignored) => {
        const reboot = async _ => {
            const msg = name + " change";
            try { await exe(); } catch (e) { log("\x1b[1m\x1b[31m", msg, "failed"); console.log(e.stack); return; };
            log(color, msg + "d");
        }

        let timer;
        watch(path, { ignoreInitial: true, ignored }).on('all', (...args) => {
            clearTimeout(timer);
            timer = setTimeout(reboot, rebuildBuffer);
        });
    }

    log("\x1b[47m\x1b[30m", `Started`);

    await rebuildDemo(false);

    ["SIGTERM", "SIGINT", "SIGQUIT"].forEach(signal=>{
        process.on(signal, _=>{if (worker) { worker.terminate(); }});
    })

    rebootOn("Source", "\x1b[1m\x1b[32m", srcdir + '/**/*', rebuildSrc);
    rebootOn("Demo", "\x1b[1m\x1b[34m", demodir + "/src/**/*", _=>rebuildDemo(false));

    if (isWeb) {
        rebootOn("Public", "\x1b[1m\x1b[35m", demodir+'/public/**/*', _=>rebuildDemo(true));
        return server.start({
            port,
            root: demodir + "/build",
            open: true,
            file: "index.html",
            wait: 100,
            logLevel: 0
        });
    }

}