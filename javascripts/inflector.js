require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"nI3V8L":[function(require,module,exports){
var global=self;!function(){var applyRules,fileSeparator,idSuffix,inflector,nonTitlecasedWords,pluralRules,scopeResolution,singularRules,spaceOrUnderbar,uncountableWords,underbar,underbarPrefix,uppercase,_ref,__slice=[].slice;_ref=require("./rules"),nonTitlecasedWords=_ref.nonTitlecasedWords,pluralRules=_ref.pluralRules,singularRules=_ref.singularRules,uncountableWords=_ref.uncountableWords;idSuffix=RegExp("(_ids|_id)$","g");underbar=RegExp("_","g");spaceOrUnderbar=RegExp("[ _]","g");uppercase=RegExp("([A-Z])","g");underbarPrefix=RegExp("^_");scopeResolution=".";fileSeparator="/";applyRules=function(string,rules){if(uncountableWords.indexOf(string.toLowerCase())>-1){return string}return rules.reduce(function(result,_arg){var replacer,rule;rule=_arg[0],replacer=_arg[1];return result||(string.match(rule)?string.replace(rule,replacer):void 0)},null)||string};inflector={pluralize:function(string){return applyRules(string,pluralRules)},singularize:function(string){return applyRules(string,singularRules)},camelize:function(string,lowercaseFirstLetter){return string.split(fileSeparator).map(function(pathItem){return pathItem.split(underbar).map(function(chunk,i){if(lowercaseFirstLetter&&i===0){return chunk}else{return chunk.charAt(0).toUpperCase()+chunk.substring(1)}}).join("")}).join(scopeResolution)},constantize:function(string,rootModule){var item,target,_i,_len,_ref1;target=rootModule!=null?rootModule:typeof global!=="undefined"&&global!==null?global:window;_ref1=string.split(scopeResolution);for(_i=0,_len=_ref1.length;_i<_len;_i++){item=_ref1[_i];target=target[item]}return target},underscore:function(string,allUpperCase){if(allUpperCase&&string===string.toUpperCase()){return string}return string.split(scopeResolution).map(function(chunk){return chunk.replace(uppercase,"_$1").replace(underbarPrefix,"")}).join(fileSeparator).toLowerCase()},humanize:function(string,lowFirstLetter){string=inflector.underscore(string).toLowerCase().replace(idSuffix,"").replace(underbar," ");if(!lowFirstLetter){string=inflector.capitalize(string)}return string},capitalize:function(string){string=string.toLowerCase();return string.substring(0,1).toUpperCase()+string.substring(1)},titleize:function(string){var result;result=string.toLowerCase().replace(underbar," ").split(" ").map(function(chunk){return chunk.split("-").map(function(piece){if(nonTitlecasedWords.indexOf(piece.toLowerCase())<0){return inflector.capitalize(piece)}else{return piece}}).join("-")}).join(" ");return result.substring(0,1).toUpperCase()+result.substring(1)},tableize:function(string){return inflector.pluralize(inflector.underscore(string))},classify:function(str){return inflector.singularize(inflector.camelize(str))},pollute:function(){Object.keys(inflector).forEach(function(key){if(key==="version"){return}if(key==="pollute"){return}return String.prototype[key]=function(){var args;args=1<=arguments.length?__slice.call(arguments,0):[];return inflector[key].apply(inflector,[this].concat(__slice.call(args)))}});return inflector}};inflector.version=require("../package.json").version;module.exports=inflector}.call(this);
},{"../package.json":3,"./rules":2}],2:[function(require,module,exports){
!function(){var matcher,nonTitlecasedWords,pluralRules,singularRules,toArrays,uncountableWords;matcher=function(string,replacement){if(replacement==null){replacement="$&"}return[RegExp(string,"gi"),replacement]};toArrays=function(text){return text.split("\n").map(function(line){return matcher.apply(null,line.split(" ").filter(function(piece){return piece!==""}))})};pluralRules=toArrays("(m)en$\n(pe)ople$\n(child)ren$\n([ti])a$\n((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$\n(hive)s$\n(tive)s$\n(curve)s$\n([lr])ves$\n([^fo])ves$\n([^aeiouy]|qu)ies$\n(s)eries$\n(m)ovies$\n(x|ch|ss|sh)es$\n([m|l])ice$\n(bus)es$\n(o)es$\n(shoe)s$\n(cris|ax|test)es$\n(octop|vir)i$\n(alias|status)es$\n^(ox)en$\n(vert|ind)ices$\n(matr)ices$\n(quiz)zes$\n(m)an$                 $1en\n(pe)rson$              $1ople\n(child)$               $1ren\n^(ox)$                 $1en\n(ax|test)is$           $1es\n(octop|vir)us$         $1i\n(alias|status)$        $1es\n(u)s$                  $1ses\n(buffal|tomat|potat)o$ $1oes\n([ti])um$              $1a\nsis$                   ses\n(?:([^f])fe|([lr])f)$  $1$2ves\n(hive)$                $1s\n([^aeiouy]|qu)y$       $1ies\n(x|ch|ss|sh)$          $1es\n(matr|vert|ind)ix|ex$  $1ices\n([m|l])ouse$           $1ice\n(quiz)$                $1zes\ns$                     s\n$                      s");singularRules=toArrays("(m)an$\n(pe)rson$\n(child)$\n^(ox)$\n(ax|test)is$\n(octop|vir)us$\n(alias|status)$\n(b)ie$\n([br]u)s$\n(buffal|tomat|potat)o$\n([ti])um$\nsis$\n(?:([^f])fe|([lr])f)$\n(hive)$\n([^aeiouy]|qu)y$\n(x|ch|ss|sh)$\n(matr|vert|ind)ix|ex$\n([m|l])ouse$\n(quiz)$\n(m)en$                  $1an\n(pe)ople$               $1rson\n(child)ren$             $1\n([ti])a$                $1um\n((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$ $1$2sis\n(hive)s$                $1\n(tive)s$                $1\n(curve)s$               $1\n([lr])ves$              $1f\n([^fo])ves$             $1fe\n(bie)s                  $1\n([^aeiouy]|qu)ies$      $1y\n(s)eries$               $1eries\n(m)ovies$               $1ovie\n(x|ch|ss|sh)es$         $1\n([m|l])ice$             $1ouse\n(us)es$                 $1\n(o)es$                  $1\n(shoe)s$                $1\n(cris|ax|test)es$       $1is\n(octop|vir)i$           $1us\n(alias|status)es$       $1\n^(ox)en                 $1\n(vert|ind)ices$         $1ex\n(matr)ices$             $1ix\n(quiz)zes$              $1\nss$                     ss");singularRules.push(matcher("s$",""));nonTitlecasedWords="and\nor\nnor\na\nan\nthe\nso\nbut\nto\nof\nat\nby\nfrom\ninto\non\nonto\noff\nout\nin\nover\nwith\nfor".split("\n");uncountableWords="equipment\ninformation\nrice\nmoney\nspecies\nseries\nfish\nsheep\nmoose\ndeer\nnews".split("\n");module.exports={nonTitlecasedWords:nonTitlecasedWords,pluralRules:pluralRules,singularRules:singularRules,uncountableWords:uncountableWords}}.call(this);
},{}],3:[function(require,module,exports){
module.exports={
  "name": "inflecta",
  "version": "0.8.2",
  "description": "A better port of ActiveSupport Inflector to JS.",
  "main": "dist/inflector.js",
  "scripts": {
    "prepublish": "script/prepublish",
    "test": "script/test"
  },
  "files": [
    "dist"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/STRd6/inflector"
  },
  "keywords": [
    "inflector"
  ],
  "devDependencies": {
    "should": "1.2.2",
    "coffee-script": "~1.6.3",
    "mocha": "~1.12.0",
    "uglify-js": "~2.3.6",
    "docco": "~0.6.2",
    "browserify": "~2.26.0"
  },
  "author": "",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/STRd6/inflector/issues"
  }
}

},{}],"./dist/inflector.js":[function(require,module,exports){
module.exports=require('nI3V8L');
},{}]},{},[])
;