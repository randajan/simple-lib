# Simple node.js lib

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

    //those values are default values

    await slib({
        start:false,                                                //true = start dev server; false = generate minify build;
        port:3000,                                                  //port of dev server
        distdir:"dist",                                             //directory of build
        demodir:"demo",                                             //directory of demo
        fetchVars:(async _=>await fse.readJSON("package.json")),    //function returning pairs of variables which were injected to demo/build/index.html
        onRuntimeError:console.log                                  //function that handle dev server runtime errors
    });

```

Happy hacking