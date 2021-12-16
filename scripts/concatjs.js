let uglify = require("uglify-js");
let fs = require('fs');

let uglified = uglify.minify([
  fs.readFileSync('./src/js-min/async.min.js', "utf8"), 
  fs.readFileSync('./src/js-min/babel.min.js', "utf8"),
  fs.readFileSync('./src/js/lib.js', "utf8"),
  fs.readFileSync('./src/js/ecc.js', "utf8"), 
  fs.readFileSync('./src/js/index.js', "utf8"), 
]);


fs.writeFile('./plugin/index.js', uglified.code, function (err){
  if(err) {
    console.log(err);
  } else {
    console.log("Script generated and saved:", 'concat.min.js');
  }      
});

