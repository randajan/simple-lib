import slib, { argv } from "./dist/index.js";
import fs from "fs-extra";


slib(
    false,                              //true = generate build; false = start dev server;
    {
        port:3000,                      //port of dev server
        mode:"web",                     //"web"=frontend lib, "node"=backend lib
        rebuildBuffer:500,              //delay between src changed and rebuild happens
        minify:false,                   //global minify - true = generate minify build
        legalComments:"linked",
        external:[],                    //global esbuild external libraries
        plugins:[],                     //global esbuild plugins
        loader:{},                      //global esbuild loader
        info:{},                        //global package info
        jsx:{                           //global jsx config
            transform:undefined,        //global es-build jsx
            dev:undefined,              //global es-build jsxDev
            factory:undefined,          //global es-build jsxFactory
            fragment:undefined,         //global es-build jsxFragment; if null then jsx.factory will be set
            importSource:undefined      //global es-build jsxImportSource
        },
        lib:{
            dir:"test",                 //lib root directory
            srcdir:"src",               //lib source code directory
            distdir:"dist",             //lib build directory
            minify:false,               //lib minify - true = generate minify build
            entries:["index.js"],       //lib entries files
            external:[],                //lib esbuild external libraries
            statics:["static"],         //lib statics files and folders
            plugins:[],                 //lib esbuild plugins
            loader:{},                  //lib exbuild loader
            info:{},                    //lib package info
            jsx:{                       //lib jsx config
                transform:undefined,    //lib es-build jsx
                dev:undefined,          //lib es-build jsxDev
                factory:undefined,      //lib es-build jsxFactory
                fragment:undefined,     //lib es-build jsxFragment; if null then jsx.factory will be set
                importSource:undefined  //lib es-build jsxImportSource
            },
            standalone:{
                entries:{
                    "testLib":"index.js",
                    "just":"just.js"
                }
            }
        },                                        
        demo:{                          
            dir:"test/demo",            //demo root directory
            srcdir:"src",               //demo source code directory
            distdir:"dist",             //demo build directory
            minify:false,               //demo minify - true = generate minify build
            entries:["index.js"],       //demo entries files
            external:[],                //demo esbuild external libraries
            plugins:[],                 //demo esbuild plugins
            loader:{},                  //demo esbuild loader
            info:{},                    //demo package info
            jsx:{                       //demo jsx config
                transform:undefined,    //demo es-build jsx
                dev:undefined,          //demo es-build jsxDev
                factory:undefined,      //demo es-build jsxFactory
                fragment:undefined,     //demo es-build jsxFragment; if null then jsx.factory will be set
                importSource:undefined  //demo es-build jsxImportSource
            },
        }
    }
);