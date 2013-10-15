(function() {
  var applyRules, fileSeparator, idSuffix, inflector, nonTitlecasedWords, pluralRules, scopeResolution, singularRules, spaceOrUnderbar, uncountableWords, underbar, underbarPrefix, uppercase, _ref,
    __slice = [].slice;

  _ref = require("./rules"), nonTitlecasedWords = _ref.nonTitlecasedWords, pluralRules = _ref.pluralRules, singularRules = _ref.singularRules, uncountableWords = _ref.uncountableWords;

  idSuffix = RegExp("(_ids|_id)$", "g");

  underbar = RegExp("_", "g");

  spaceOrUnderbar = RegExp("[ _]", "g");

  uppercase = RegExp("([A-Z])", "g");

  underbarPrefix = RegExp("^_");

  scopeResolution = ".";

  fileSeparator = "/";

  applyRules = function(string, rules) {
    if (uncountableWords.indexOf(string.toLowerCase()) > -1) {
      return string;
    }
    return rules.reduce(function(result, _arg) {
      var replacer, rule;
      rule = _arg[0], replacer = _arg[1];
      return result || (string.match(rule) ? string.replace(rule, replacer) : void 0);
    }, null) || string;
  };

  inflector = {
    pluralize: function(string) {
      return applyRules(string, pluralRules);
    },
    singularize: function(string) {
      return applyRules(string, singularRules);
    },
    camelize: function(string, lowercaseFirstLetter) {
      return string.split(fileSeparator).map(function(pathItem) {
        return pathItem.split(underbar).map(function(chunk, i) {
          if (lowercaseFirstLetter && i === 0) {
            return chunk;
          } else {
            return chunk.charAt(0).toUpperCase() + chunk.substring(1);
          }
        }).join("");
      }).join(scopeResolution);
    },
    constantize: function(string, rootModule) {
      var item, target, _i, _len, _ref1;
      target = rootModule != null ? rootModule : typeof global !== "undefined" && global !== null ? global : window;
      _ref1 = string.split(scopeResolution);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        item = _ref1[_i];
        target = target[item];
      }
      return target;
    },
    underscore: function(string) {
      return string.split(scopeResolution).map(function(chunk) {
        return chunk.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase();
      }).join(fileSeparator).toLowerCase();
    },
    humanize: function(string, lowFirstLetter) {
      string = inflector.underscore(string).toLowerCase().replace(idSuffix, "").replace(underbar, " ");
      if (!lowFirstLetter) {
        string = inflector.capitalize(string);
      }
      return string;
    },
    capitalize: function(string) {
      string = string.toLowerCase();
      return string.substring(0, 1).toUpperCase() + string.substring(1);
    },
    titleize: function(string) {
      var result;
      result = string.toLowerCase().replace(underbar, " ").split(" ").map(function(chunk) {
        return chunk.split("-").map(function(piece) {
          if (nonTitlecasedWords.indexOf(piece.toLowerCase()) < 0) {
            return inflector.capitalize(piece);
          } else {
            return piece;
          }
        }).join("-");
      }).join(" ");
      return result.substring(0, 1).toUpperCase() + result.substring(1);
    },
    tableize: function(string) {
      return inflector.pluralize(inflector.underscore(string));
    },
    classify: function(str) {
      return inflector.singularize(inflector.camelize(str));
    },
    dasherize: function(str) {
      return str.trim().replace(/\s+/g, "-").toLowerCase();
    },
    pollute: function() {
      Object.keys(inflector).forEach(function(key) {
        if (key === "version") {
          return;
        }
        if (key === "pollute") {
          return;
        }
        return String.prototype[key] = function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return inflector[key].apply(inflector, [this].concat(__slice.call(args)));
        };
      });
      return inflector;
    }
  };

  module.exports = inflector;

}).call(this);

//# sourceURL=source/inflector.coffee