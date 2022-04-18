import { build } from 'esbuild';
import fs from "fs-extra";

await fs.remove("dist");

await build({
    outdir:"dist",
    splitting: true,
    format: 'esm',
    color:true,
    bundle:true,
    sourcemap:true,
    minify:false,
    entryPoints: ["src/index.js"],
    external:["esbuild", "chokidar", "fs-extra", "live-server"],
});