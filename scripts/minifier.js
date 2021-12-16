let minify = require('html-minifier').minify;
let fs = require('fs');

let result = minify(fs.readFileSync('./index.html', "utf8"), {  
  removeAttributeQuotes: true,
  collapseInlineTagWhitespace:true,
  collapseWhitespace:true,
});


fs.writeFile('./plugin/index.html', result, (error) => { console.log(error) });

