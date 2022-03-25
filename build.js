import { build } from 'esbuild';
import fs from "fs-extra";

const uni = {
    color:true,
    bundle:true,
    sourcemap:true,
    minify:true,
    entryPoints: ["src/index.js"],
    external:["esbuild", "chokidar", "fs-extra", "live-server"],
}

await fs.remove("dist");

build({
    outfile: "dist/index.cjs.js",
    format: 'cjs',
    ...uni
});

build({
    outdir:"dist",
    splitting: true,
    format: 'esm',
    ...uni
});