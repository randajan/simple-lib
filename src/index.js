import { Worker } from "worker_threads";
import { watch } from "chokidar";

import fs from "fs-extra";
import server from "live-server";
import argv from "./tools/argv";
import { parseConfig, root } from "./tools/config";
import templates from "./tools/templates";
import path from "path";



export { root, argv }

export default async (isBuild, config = {}) => {
    isBuild = typeof isBuild === "boolean" ? isBuild : (argv.isBuild || false);

    const { port, isWeb, mode, lib, demo, pub, statics, peersFile, rebuildBuffer, log } = parseConfig(isBuild, config);
    const logbold = log.bold;
    const logred = logbold.red;

    if (!fs.existsSync(peersFile)) { await fs.outputFile(peersFile, templates.peers); }
    if (!fs.existsSync(lib.srcdir)) { await fs.outputFile(path.join(lib.srcdir, "index.js"), templates.lib); }
    if (!fs.existsSync(demo.srcdir)) { await fs.outputFile(path.join(demo.srcdir, "index.js"), isWeb ? templates.web : templates.node); }
    if (pub && !fs.existsSync(pub.srcdir)) { await fs.outputFile(path.join(pub.srcdir, "index.html"), templates.html); }
    
    if (fs.existsSync(lib.distdir)) { await fs.remove(lib.distdir); }
    if (fs.existsSync(demo.distdir)) { await fs.remove(demo.distdir); }

    await pub?.rebuild();
    await Promise.all(statics.map(s=>s.rebuild()));
    await lib.rebuild();
    await demo.rebuild();
    
    if (isBuild) { process.exit(0); }

    const rebuildDemo = async ()=>{
        await demo.rebuild();
        if (isWeb) { return; }
        if (demo.current) { demo.current.postMessage("shutdown"); }
        demo.current = new Worker(("./"+demo.distdir+"/index.js").replaceAll("\\", "/"));
    }
    const rebuildLib = async _=>{
        await lib.rebuild();
        await rebuildDemo();
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
        watch(path + '/**/*', { ignoreInitial: true, ignored }).on('all', (...args) => {
            clearTimeout(timer);
            timer = setTimeout(reboot, rebuildBuffer);
        });
    }

    const libIgnore = statics.map(({srcdir, rebuild})=>{
        rebootOn("Static", logbold.cyan, srcdir, async _=>{ await rebuild(); rebuildDemo(); });
        return srcdir;
    });


    logbold.inverse(`Started`);
    await rebuildDemo();

    rebootOn("Lib", logbold.blue, lib.srcdir, rebuildLib, libIgnore);
    rebootOn("Demo", logbold.green, demo.srcdir, rebuildDemo, [pub?.srcdir]);

    if (isWeb) {
        rebootOn("Public", logbold.magenta, pub.srcdir, async _=>{ await pub.rebuild(); rebuildDemo(); });
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