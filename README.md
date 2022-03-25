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
import slib from "./dist/index.js";
import fs from "fs-extra"; // optional

//those values are default values

slib({
    start:true,                                                 //true = start dev server; false = generate minify build;
    port:3000,                                                  //port of dev server
    srcdir:"src",                                               //direrctory of source code
    distdir:"dist",                                             //directory of build
    demodir:"demo",                                             //directory of demo
    fetchVars:(async _=>await fs.readJSON("package.json")),     //function returning pairs of variables which were injected to demo/build/index.html
    onRuntimeError:console.log,                                 //function that handle dev server runtime errors
    external:[]   
})

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