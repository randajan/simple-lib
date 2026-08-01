import { spawn } from "child_process";
import path from "path";

const localTsc = cwd=>path.join(cwd, "node_modules", "typescript", "bin", "tsc");

const run = (cmd, args, opt={})=>new Promise((resolve, reject)=>{
    const child = spawn(process.execPath, [cmd, ...args], { cwd:opt.cwd, stdio:opt.stdio || "inherit" });
    child.on("error", reject);
    child.on("close", code=>code ? reject(Error(`tsc failed with code ${code}`)) : resolve());
});

export default (opt={})=>{
    const root = opt.cwd || process.cwd();
    const config = opt.config || "tsconfig.json";
    const declarationDir = opt.declarationDir;
    const args = opt.args || [];
    const bin = opt.bin || localTsc(root);

    return {
        ...opt,
        cwd:root,
        config,
        declarationDir,
        args,
        bin,
        build:opt.build || (lib=>{
            const cwd = path.resolve(root, lib.dir || "");
            return run(bin, [
            "-p", path.resolve(cwd, config),
            "--declaration",
            "--emitDeclarationOnly",
            "--declarationDir", declarationDir ? path.resolve(cwd, declarationDir) : path.resolve(root, lib.distdir, "types"),
            ...args
        ], {...opt, cwd})
        })
    };
}
