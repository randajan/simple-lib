import slib from "./dist/index.js";
import fs from "fs-extra";

slib(
    false,                              //false = start dev server; true = generate build;
    {
        port:3000,                      //port of dev server
        mode:"web",                    //"web"=frontend lib, "node"=backend lib
        rebuildBuffer:500,              //delay between src changed and rebuild happens
        external:[],                    //global esbuild external libraries
        plugins:[],                     //global esbuild plugins
        info:{},                        //global package info
        lib:{
            dir:"test",                 //lib root directory
            srcdir:"src",               //lib source code directory
            distdir:"dist",             //lib build directory
            minify:false,               //lib minify - true = generate minify build; if null then isProd value will be used
            entries:["index.js"],       //lib entries files
            external:[],                //lib esbuild external libraries
            plugins:[],                 //lib esbuild plugins
            info:{}                     //lib package info
        },                                        
        demo:{                          
            dir:"test/demo",            //demo root directory
            srcdir:"src",               //demo source code directory
            distdir:"dist",             //demo build directory
            minify:false,               //demo minify - true = generate minify build; if null then isProd value will be used
            entries:["index.js"],       //demo entries files
            external:[],                //demo esbuild external libraries
            plugins:[],                 //demo esbuild plugins
            info:{},                     //demo package info
            loader:{
                ".js":"jsx"
            },
            jsx:{
                factory:"PDFComponent.create"
            }
        }
    }
)