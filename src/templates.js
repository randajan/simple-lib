
export default {
  html:`
<!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="{{description}}" />
      <title>{{name}} v{{version}} by {{author}}</title>
    </head>
    
    <body>
      <div id="root"></div>
      <script src="index.js"></script>
    </body>
    
</html>`,
  lib:`
import { info, log } from "@randajan/simple-lib/lib";

export default _=>log.bold.magenta("helloworld", JSON.stringify(info, null, 2));
`,
  node:`
import { info, log } from "@randajan/simple-lib/node";
import dist from "../../dist/index.js";

dist();
`,
  web:`
import { info, log } from "@randajan/simple-lib/web";
import dist from "../../dist/index.js";

dist();
`, peers:`
import "@randajan/simple-lib/peers"
`}