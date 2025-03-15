import { build } from 'esbuild';
import path from "path";




const _buildFactory = ({ globalName, entries, filename, distdir, minify, splitting, external, plugins, loader, format, jsx, info })=>{
    let _build; //cache esbuild

    return async _=>{
        if (_build) { await _build.rebuild(); return _build; }
        return _build = await build({
            globalName,
            format,
            minify,
            color:true,
            bundle: true,
            sourcemap: true,
            logLevel: 'error',
            incremental: true,
            entryPoints:entries,
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
}

export const buildFactory = (config)=>{
    if (config.format !== "esm") { return _buildFactory(config); }

    const { distdir } = config;
 
    const esm = _buildFactory({...config, distdir:path.join(distdir, "esm")});
    const cjs = _buildFactory({
        ...config,
        distdir:path.join(distdir, "cjs"),
        format:"cjs",
        splitting:false
    });

    return _=>Promise.all([esm(), cjs()]);
}