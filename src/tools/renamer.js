import fs from "fs";
import path from "path";

export const renameEntries = (dir, files, ext) => {

    for (const file of files) {
        const oldPath = path.resolve(path.join(dir, file));
        const mapPath = path.resolve(path.join(dir, file+".map"));

        if (fs.existsSync(oldPath)) { fs.renameSync(oldPath, oldPath.replace(/\.js$/, ext)); }
        if (fs.existsSync(mapPath)) { fs.renameSync(mapPath, mapPath.replace(/\.js\.map$/, ext+".map")); }
    }

};
