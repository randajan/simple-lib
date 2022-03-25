import { watch } from "chokidar";
import { build } from 'esbuild';
import fs from "fs-extra";
import server from "live-server";

const indexHTMLTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{{description}}" />
  <title>{{name}} v{{version}} by {{author}}</title>
</head>

<body>
  <div id="root"></div>
  <script src="index.js"></script>
</body>

</html>`;

const ensureFile = async (path, template)=>{
    if (fs.existsSync(path)) { return; }
    await fs.outputFile(path, template);
}

const injectFile = async (file, vars={})=>{
    let s = String(await fs.readFile(file));
    for (let key of (new Set(s.match(/(?<=\{\{)[^\{\}]+(?=\}\})/g)))) {
      s = s.replaceAll("{{"+key+"}}", vars[key] == null ? "" : vars[key]);
    }
    return await fs.writeFile(file, s);
}


export default async (options={})=>{
    let {
        start,
        port,
        srcdir,
        distdir,
        demodir,
        fetchVars,
        onRuntimeError,
        external
    } = options;

    start = start || false;
    port = port || 3000;
    srcdir = srcdir || "src";
    distdir = distdir || "dist";
    demodir = demodir || "demo";
    fetchVars = fetchVars || (async _=>await fs.readJSON("package.json"));
    onRuntimeError = onRuntimeError || console.log;
    external = external || [];

    await fs.remove(distdir);
    await ensureFile(srcdir+"/index.js", `export default _=>console.log("helloworld");`);

    const dist = await build({
        outdir:distdir,
        splitting: true,
        format: 'esm',
        incremental:true,
        color:true,
        bundle:true,
        sourcemap:true,
        minify:!start,
        entryPoints: [srcdir+"/index.js"],
        external
    });

    const resetDemo = async ()=>{
        await ensureFile(demodir+"/src/index.js", `import dist from "../../dist/index.js";`);
        await ensureFile(demodir+"/public/index.html", indexHTMLTemplate);
    
        await fs.remove(demodir+'/build');
        await fs.copy(demodir+'/public', demodir+'/build');
    
        await injectFile(demodir+'/build/index.html', await fetchVars());
    }

    await resetDemo();

    const demo = await build({
        color:true,
        entryPoints: [demodir+'/src/index.js'],
        outdir: demodir+'/build',
        bundle: true,
        sourcemap: true,
        minify:false,
        format: 'iife',
        incremental:true
    });

    if (!start) { return; }

    watch([demodir+"/public/**/*"], { ignoreInitial: true }).on('all', async _=>{
        await resetDemo();
        await demo.rebuild().catch(onRuntimeError);
    });

    watch([srcdir+'/**/*', demodir+"/src/**/*"], { ignoreInitial: true }).on('all', async _=>{
        await dist.rebuild().catch(onRuntimeError);
        await demo.rebuild().catch(onRuntimeError);
    });

    return server.start({
        port,
        root: demodir+"/build",
        open: true,
        file: "index.html",
        wait: 100,
        logLevel: 2
    });

}