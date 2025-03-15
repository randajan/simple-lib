import esbuild from 'esbuild';
import path from "path";
import { renameEntries } from './renamer';




const _buildFactory = ({ isLib, globalName, entries, entryPoints, filename, distdir, minify, splitting, external, plugins, loader, format, jsx, info })=>{
    let context; //cache esbuild

    return async _=>{
        if (!context) { 
            context = await esbuild.context({
                globalName,
                format,
                minify,
                color:true,
                bundle: true,
                sourcemap: true,
                logLevel: 'error',
                entryPoints,
                outfile:filename ? path.join(distdir, filename + (filename.endsWith(".js") ? "" : ".js")) : undefined,
                outdir:filename ? undefined : distdir,
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

        await context.rebuild();
        if (!isLib) {}
        else if (format === "esm") { renameEntries(distdir, entries, ".mjs"); }
        else if (format === "cjs") { renameEntries(distdir, entries, ".cjs" ); }
        return context;
    }
}

export const buildFactory = (config)=>{
    if (!config.isLib) { return _buildFactory(config); }

    const { distdir } = config;
 
    const esm = _buildFactory({
        ...config,
        distdir:path.join(distdir, "esm"),
    });

    const cjs = _buildFactory({
        ...config,
        distdir:path.join(distdir, "cjs"),
        format:"cjs",
        splitting:false
    });

    return _=>Promise.all([esm(), cjs()]);
}