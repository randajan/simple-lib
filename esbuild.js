import { watch } from "chokidar";
import { build } from 'esbuild';
import fs from "fs-extra";
import server from "live-server";

const port = 3000;

const { NODE_ENV, npm_package_version, npm_package_name, npm_package_author_name } = process.env;
const info = process.info = {
  name:npm_package_name,
  version:npm_package_version,
  author:npm_package_author_name,
  env:NODE_ENV,
  isDev:NODE_ENV === "dev"
}

fs.removeSync('dist');

build({
    entryPoints: ['src/index.js'],
    outfile: "dist/index.cjs.js",
    bundle: true,
    sourcemap: true,
    minify:!info.isDev,
    format: 'cjs'
})
.catch(() => process.exit(1));

(async ()=>{
    const distBuilder = await build({
        color:true,
        entryPoints: ['src/index.js'],
        outdir: 'dist',
        bundle: true,
        sourcemap: true,
        minify:!info.isDev,
        splitting: true,
        format: 'esm',
        incremental:info.isDev
    });

    fs.removeSync('demo/build');
    fs.copySync('demo/public', 'demo/build');

    const demoBuilder = await build({
        color:true,
        entryPoints: ['demo/src/index.js'],
        outdir: 'demo/build',
        bundle: true,
        sourcemap: true,
        minify:false,
        format: 'iife',
        incremental:true
    });

    if (!info.isDev) { return; }

    server.start({
        port, // Set the server port. Defaults to 8080.
        //host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
        root: "demo/build", // Set root directory that's being served. Defaults to cwd.
        open: true, // When false, it won't load your browser by default.
        file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
        //ignore: 'scss,my/templates', // comma-separated string for paths to ignore
        wait: 100, // Waits for all changes, before reloading. Defaults to 0 sec.
        //mount: [['/components', './node_modules']], // Mount a directory to a route.
        logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    });

    watch(['src/**/*', "demo/src/**/*", "demo/public/**/*"], { ignoreInitial: true }).on('all', async _=>{
        await distBuilder.rebuild();
        await demoBuilder.rebuild();
    });

})();