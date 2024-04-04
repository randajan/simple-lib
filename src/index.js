import { Worker } from "worker_threads";
import { watch } from "chokidar";

import fs from "fs-extra";
import server from "live-server";
import argv from "./tools/argv";
import { injectFile } from "./tools/inject";
import { parseConfig, root } from "./tools/config";
import templates from "./tools/templates";


export { root, argv }

export default async (isBuild, config = {}) => {
    isBuild = typeof isBuild === "boolean" ? isBuild : (argv.isBuild || false);

    const { port, isWeb, mode, lib, demo, peersFile, injects, rebuildBuffer, log } = parseConfig(isBuild, config);
    const logbold = log.bold;
    const logred = logbold.red;

    const buildPublic = async () => {
        await fs.remove(demo.distdir);
        if (!isWeb) { return; }
        await fs.copy(demo.dir + '/public', demo.distdir);
        await Promise.all(injects.map(file=>injectFile(demo.distdir+"/"+file, demo.info)));
    }

    if (!fs.existsSync(peersFile)) { await fs.outputFile(peersFile, templates.peers); }
    if (!fs.existsSync(lib.srcdir)) { await fs.outputFile(lib.srcdir + "/index.js", templates.lib); }
    if (!fs.existsSync(demo.srcdir)) { await fs.outputFile(demo.srcdir + "/index.js", isWeb ? templates.web : templates.node); }
    if (isWeb && !fs.existsSync(demo.dir + "/public")) { await fs.outputFile(demo.dir + "/public/index.html", templates.html); }

    await buildPublic();
    await lib.rebuild();
    await demo.rebuild();

    if (isBuild) { process.exit(0); }

    const rebuildDemo = async (rebuildPublic=false)=>{
        if (rebuildPublic) { await buildPublic(); }
        await demo.rebuild();
        if (isWeb) { return; }
        if (demo.current) { demo.current.postMessage("shutdown"); }
        demo.current = new Worker(("./"+demo.distdir+"/index.js").replaceAll("\\", "/"));
    }
    const rebuildLib = async _=>{
        await lib.rebuild();
        await rebuildDemo(false);
    };

    const rebootOn = (name, customLog, path, exe, ignored) => {
        const reboot = async _ => {
            const msg = name + " change";
            const before = demo.current;
            try { await exe(); } catch (e) { logred(msg, " failed"); log(e.stack); return; };
            if (before) { before.postMessage("refresh:"+name); }
            customLog(msg + "d");
        }

        let timer;
        watch(path, { ignoreInitial: true, ignored }).on('all', (...args) => {
            clearTimeout(timer);
            timer = setTimeout(reboot, rebuildBuffer);
        });
    }

    logbold.inverse(`Started`);
    await rebuildDemo(false);

    rebootOn("Lib", logbold.blue, lib.srcdir + '/**/*', rebuildLib);
    rebootOn("Demo", logbold.green, demo.srcdir + "/**/*", _=>rebuildDemo(false));

    if (isWeb) {
        rebootOn("Public", logbold.magenta, demo.dir+'/public/**/*', _=>rebuildDemo(true));
        return server.start({
            port,
            root: demo.distdir,
            open: true,
            file: "index.html",
            wait: 100,
            logLevel: 0
        });
    } else {
        ["SIGTERM", "SIGINT", "SIGQUIT"].forEach(signal=>{
            process.on(signal, _=>{
                demo.current.on("exit", _=>process.exit(0));
                demo.current.postMessage("shutdown");
            });
        })
    }

}