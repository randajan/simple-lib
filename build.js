import { build } from 'esbuild';
import fs from "fs-extra";
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import { builtinModules } from "module";

await fs.remove("dist");

await build({
    outdir:"dist",
    splitting: true,
    format: 'esm',
    color:true,
    bundle:true,
    sourcemap:true,
    entryPoints: [
        "src/index.js",
        "src/peers.js",
        "src/lib/index.js",
        "src/node/index.js",
        "src/web/index.js",
        "src/info/index.js",
    ],
    legalComments:"inline",
    plugins:[nodeExternalsPlugin()],
    external:builtinModules,
});