
import { spawn } from "child_process";
import fs from "fs";

const _rgxp = /has unmet peer dependency "([^"@]*)["@]/;

const yarnAddP = async (current, add)=>{
    const peers = current.concat(add);
    const unmetDep = [];

    const child = spawn('yarn add -P', peers, { shell: true });
    child.stdout.on('data', (data) => {
        data = String(data);
        console.log(data);
    });
    
    child.stderr.on('data', (data) => {
        data = String(data);
        const ud = (data.match(_rgxp) || [])[1];
        if (ud) { unmetDep.push(ud); }
        console.error(data);
    });
    
    child.on('close', (code) => {
        if (!unmetDep.length) { return; }
        console.log("Resolving unmet peer dependencies...");
        yarnAddP(peers, unmetDep);
    });

}

const pkgJson = fs.readFileSync("./package.json", "utf-8");
const pkg = JSON.parse(pkgJson);

const peersCurrent = Object.keys(pkg.peerDependencies || {});
const peersAdd = process.argv.slice(2);


yarnAddP(peersCurrent, peersAdd);
