
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
    src:`export default _=>console.log("helloworld");`,
    demo:`import dist from "../../dist/index.js"; dist();`

}