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
    isProd=true,                        //true = start dev server; false = generate build;
    {
        port:3000,                      //port of dev server
        mode:"web",                     //"web"=frontend lib, "node"=backend lib
        rebuildBuffer:100,              //delay between src changed and rebuild happens
        external:[],                    //global esbuild external libraries
        plugins:[],                     //global esbuild plugins
        loader:{},                      //global esbuild loader
        info:{},                        //global package info
        lib:{
            dir:"",                     //lib root directory
            srcdir:"src",               //lib source code directory
            distdir:"dist",             //lib build directory
            minify:isProd,              //lib minify - true = generate minify build; if null then isProd value will be used
            entries:["index.js"],       //lib entries files
            external:[],                //lib esbuild external libraries
            plugins:[],                 //lib esbuild plugins
            loader:{},                  //lib exbuild loader
            info:{}                     //lib package info
        },                                        
        demo:{                          
            dir:"demo",                 //demo root directory
            srcdir:"src",               //demo source code directory
            distdir:"dist",             //demo build directory
            minify:isProd,              //demo minify - true = generate minify build; if null then isProd value will be used
            entries:["index.js"],       //demo entries files
            external:[],                //demo esbuild external libraries
            plugins:[],                 //demo esbuild plugins
            loader:{},                  //demo esbuild loader
            info:{}                     //demo package info
        }
    }
)

```

## Requirements

```javascript
...
    "chokidar": "^3.5.3",
    "esbuild": "^0.14.27",
    "fs-extra": "^10.0.1",
    "live-server": "^1.2.1"
...
```


Happy hacking

## License

MIT © [randajan](https://github.com/randajan)