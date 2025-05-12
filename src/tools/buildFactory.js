import esbuild from 'esbuild';
import path from "path";
import { renameEntries } from './renamer';
import { builtinModules } from 'module';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

const _allowList = ["info", "lib", "node", "web"].map(v=>"@randajan/simple-lib/"+v);

const extPlug = (plugins, bundle)=>{
    if (!bundle) { return plugins; }
    return [...plugins, nodeExternalsPlugin({ allowList:[...bundle, ..._allowList] })]
}

const _buildFactory = (opt={})=>{
    const { isLib, globalName, entries, entryPoints, filename, distdir, minify, splitting, plugins, bundle, loader, format, jsx, info } = opt;
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
                external:builtinModules,
                plugins:extPlug(plugins, bundle),
                loader,
                jsx:jsx.transform,
                jsxDev:jsx.dev,
                jsxFactory:jsx.factory,
                jsxFragment:jsx.fragment || jsx.factory,
                jsxImportSource:jsx.importSource
            });
        }

        await context.rebuild();
        if (!isLib) { return }
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