# Simple node.js lib

[![NPM](https://img.shields.io/npm/v/@randajan/simple-lib.svg)](https://www.npmjs.com/package/@randajan/simple-lib) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Goal is to provide supersimple start for developing custom js library.

## Instalation

```console
npm install -D @randajan/simple-lib;
```

or

```console
yarn add -D @randajan/simple-lib;
```

## Usage

```javascript
import slib from "@randajan/simple-lib";
import fs from "fs-extra"; // optional

//those values are default values

slib(
    isBuild=true,                       //true = generate build; false = start dev server;
    {
        port:3000,                      //port of dev server
        mode:"web",                     //"web"=frontend lib, "node"=backend lib
        rebuildBuffer:100,              //delay between src changed and rebuild happens
        minify:false,                   //global minify - true = generate minify build
        external:[],                    //global esbuild external libraries
        plugins:[],                     //global esbuild plugins
        loader:{},                      //global esbuild loader
        info:{},                        //global package info
        jsx:{                           //global jsx config
            transform:undefined,        //global es-build jsx
            dev:undefined,              //global es-build jsxDev
            factory:undefined,          //global es-build jsxFactory
            fragment:jsx.factory,       //global es-build jsxFragment; if null then jsx.factory will be set
            importSource:undefined      //global es-build jsxImportSource
        },
        lib:{
            dir:"",                     //lib root directory
            srcdir:"src",               //lib source code directory
            distdir:"dist",             //lib build directory
            minify:false,               //lib minify - true = generate minify build
            entries:["index.js"],       //lib entries files
            external:[],                //lib esbuild external libraries
            plugins:[],                 //lib esbuild plugins
            loader:{},                  //lib exbuild loader
            info:{},                    //lib package info
            jsx:{                       //lib jsx config
                transform:undefined,    //lib es-build jsx
                dev:undefined,          //lib es-build jsxDev
                factory:undefined,      //lib es-build jsxFactory
                fragment:jsx.factory,   //lib es-build jsxFragment; if null then jsx.factory will be set
                importSource:undefined  //lib es-build jsxImportSource
            },
            standalone:{                //standalone build of library - if string is provided it will asume it's name
                distdir:"standalone",   //standalone build directory
                name:"globalName",      //standalone globalName - required
                external:[],            //standalone external - default same as lib
                plugins:[],             //standalone plugins - default same as lib
                loader:{}               //standalone loader - default same as lib
            }     

        },                                        
        demo:{                          
            dir:"demo",                 //demo root directory
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
                fragment:jsx.factory,   //demo es-build jsxFragment; if null then jsx.factory will be set
                importSource:undefined  //demo es-build jsxImportSource
            },
        }
    }
)

```

## Requirements

```javascript
...
    "app-root-path": "^3.1.0",
    "chalk": "^5.2.0",
    "chokidar": "^3.6.0",
    "esbuild": "0.16.17",
    "esbuild-node-externals": "^1.13.0",
    "fs-extra": "^11.2.0",
    "live-server": "^1.2.2"
...
```


Happy hacking

## License

MIT © [randajan](https://github.com/randajan)