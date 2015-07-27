var babel = require('babel-core');
var fs = require('fs-extra');

var src = "./es6src";
var dest = "./build";

try {
	fs.removeSync(dest);
} catch (e) {
   console.log(e);
}
fs.mkdirSync(dest);

var n_space = function (n) {
   var ret = '';
   for(var i = 0; i<n; i++){
      ret += '  ';
   }
   return ret;
}

var buildDir = function(f, t, deep) {
   var deep = deep || 0;
	var files = fs.readdirSync(f);
	for (var i in files) {
      var split = files[i].split('.');
      if(split.length > 1 && split[split.length-1] === 'js'){
         console.log('>'+n_space(deep), files[i]);
         var code = babel.transformFileSync(f+"/"+files[i]).code;
         fs.ensureDirSync(t);
         fs.writeFileSync(t+"/"+files[i], code);
      }
      if(split.length === 1){
         console.log('>'+n_space(deep), files[i]);
         buildDir(f+'/'+files[i], t+'/'+files[i], deep+1);
      }
	}
}

buildDir(src, dest);
