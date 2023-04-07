import slib from "./dist/index.js";
import fs from "fs-extra";


slib(
    false,
    {
        port:3000,                                                  //port of dev server
        mode:"node",                                                //frontend or backend app
        srcdir:"test/src",                                          //direrctory of source code
        distdir:"test/dist",                                        //directory of build
        demodir:"test/demo",                                        //directory of demo
        rebuildBuffer:100,                                          //delay between src changed and rebuild happend
        fetchVars:(async _=>await fs.readJSON("package.json")),     //function returning pairs which will be injected into the demo/build/index.html
        onRuntimeError:console.log,                                 //function that handle dev server runtime errors
        entries:["index.js"],
        external:[]
    }
)