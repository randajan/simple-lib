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
    //minify:true,
    entryPoints: ["src/index.js", "src/lib/index.js", "src/node/index.js", "src/web/index.js", "src/info/index.js"],
    plugins:[nodeExternalsPlugin()],
    external:builtinModules,
});