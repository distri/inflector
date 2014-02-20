(function(pkg) {
  // Expose a require for our package so scripts can access our modules
  window.require = Require.generateFor(pkg);
})({
  "source": {
    ".gitignore": {
      "path": ".gitignore",
      "mode": "100644",
      "content": "dist/\ndocs/\nnode_modules/\n",
      "type": "blob"
    },
    ".travis.yml": {
      "path": ".travis.yml",
      "mode": "100644",
      "content": "language: node_js\nnode_js:\n  - \"0.11\"\n  - \"0.10\"\n",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "mode": "100644",
      "content": "[![Build Status](https://travis-ci.org/STRd6/inflecta.png?branch=master)](https://travis-ci.org/STRd6/inflecta)\n\nInflecta\n========\n\nWhat? Another ActiveSupport::Inflector port? Yeah, sorry.\n\nThe primary difference between **inflecta** and other ports is that **inflecta** translates the Ruby idioms to JavaScript idioms. It goes all the way.\n\nThe most important method is `constantize` which is not even attempted in most ports. In fact, the only reason we really need to pluralize or singularize things is so that we can automatically determine the class to instantiate from the name of the data key. That is the whole point of `ActiveSupport::Inflector`, `humanize` is just a nice side effect.\n\nIn Ruby the scope resolution operator is `::`. JavaScript doesn't have any such thing, instead people generally namespace classes using a module pattern like `MyApp.Models.MyModel`. For that reason **inflecta** uses `.` rather than blindly copying the Ruby scope resolution operator.\n\nIn JavaScript variables and properties are usually named with camel case. In Ruby they are named with underscores. It generally doesn't make a big difference, but if we want to implement `humanize` then it better work with our default conventions.\n\nReal sorry about the name, but inflector was taken on npm.\n",
      "type": "blob"
    },
    "package.json": {
      "path": "package.json",
      "mode": "100644",
      "content": "{\n  \"name\": \"inflecta\",\n  \"version\": \"0.8.3\",\n  \"description\": \"A better port of ActiveSupport Inflector to JS.\",\n  \"main\": \"dist/inflector.js\",\n  \"scripts\": {\n    \"prepublish\": \"script/prepublish\",\n    \"test\": \"script/test\"\n  },\n  \"files\": [\n    \"dist\"\n  ],\n  \"repository\": {\n    \"type\": \"git\",\n    \"url\": \"https://github.com/STRd6/inflector\"\n  },\n  \"keywords\": [\n    \"inflector\"\n  ],\n  \"devDependencies\": {\n    \"should\": \"1.2.2\",\n    \"coffee-script\": \"~1.6.3\",\n    \"mocha\": \"~1.12.0\",\n    \"uglify-js\": \"~2.3.6\",\n    \"docco\": \"~0.6.2\",\n    \"browserify\": \"~2.26.0\"\n  },\n  \"author\": \"\",\n  \"license\": \"MIT\",\n  \"bugs\": {\n    \"url\": \"https://github.com/STRd6/inflector/issues\"\n  }\n}\n",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "mode": "100644",
      "content": "version: \"0.2.0\"\nentryPoint: \"source/inflector\"\n",
      "type": "blob"
    },
    "script/doc": {
      "path": "script/doc",
      "mode": "100644",
      "content": "#!/bin/bash\nset -e\n\nmkdir -p docs\nrm -rf docs/*\n\nnode_modules/.bin/docco -t resources/docco.jst source/*\nnode_modules/.bin/coffee -co docs/javascripts resources/interactive.litcoffee\nnode_modules/.bin/browserify -r ./dist/inflector.js > docs/javascripts/inflector.js\n\ncp -r resources/docco.css resources/public docs\ncp resources/*.js docs/javascripts\ncp docs/inflector.html docs/index.html\n",
      "type": "blob"
    },
    "script/gh-pages": {
      "path": "script/gh-pages",
      "mode": "100644",
      "content": "#!/bin/bash\n\nset -e\n\ncd docs\ngit add .\ngit ci -am \"gh-pages\"\ngit pull\ngit push\n",
      "type": "blob"
    },
    "script/prepublish": {
      "path": "script/prepublish",
      "mode": "100644",
      "content": "#!/bin/bash\n\n./node_modules/.bin/coffee -co dist/ source/\n\nfor file in dist/*.js\ndo\n  ./node_modules/.bin/uglifyjs $file > tmp.js\n  mv tmp.js $file\ndone\n",
      "type": "blob"
    },
    "script/test": {
      "path": "script/test",
      "mode": "100644",
      "content": "#!/bin/bash\n\nnode_modules/.bin/mocha \\\n  --compilers coffee:coffee-script \\\n  --reporter spec \\\n  --require test_helper.coffee.md\n",
      "type": "blob"
    },
    "source/inflector.coffee.md": {
      "path": "source/inflector.coffee.md",
      "mode": "100644",
      "content": "Inflecta\n========\n\nLoad our word lists and rules for inflecting from [rules](rules.html).\n\n    {\n      nonTitlecasedWords\n      pluralRules\n      singularRules\n      uncountableWords\n    } = require(\"./rules\")\n\nThese are regular expressions used for converting between String formats.\n\n    idSuffix = RegExp(\"(_ids|_id)$\", \"g\")\n    underbar = RegExp(\"_\", \"g\")\n    spaceOrUnderbar = RegExp(\"[ _]\", \"g\")\n    uppercase = RegExp(\"([A-Z])\", \"g\")\n    underbarPrefix = RegExp(\"^_\")\n    scopeResolution = \".\"\n    fileSeparator = \"/\"\n\nThe apply rules helper method applies a rules based replacement to a String.\n\n    applyRules = (string, rules) ->\n      return string if uncountableWords.indexOf(string.toLowerCase()) > -1\n\nReduce the list of rules to the first substitution that matches and apply it.\n\n      rules.reduce((result, [rule, replacer]) ->\n        result or\n          if string.match(rule)\n            string.replace(rule, replacer)\n\nReturn the string unmodified if no rule matches.\n\n      , null) or string\n\nAn object to hold all of our inflection methods.\n\n    inflector =\n\nConvert a string to a pluralized form by applying a list of rules. The rules contain regexes that match and replace portions of the string to transform it.\n\n>     #! pluralize\n>     address\n>     boss\n>     bus\n>     child\n>     man\n>     woman\n>     zombie\n>     octopus\n>     walrus\n>     person\n>     status\n\n      pluralize: (string) ->\n        applyRules string, pluralRules\n\nConversely we can also convert a string to a singular form by applying another list of rules.\n\n>     #! singularize\n>     addresses\n>     bosses\n>     buses\n>     children\n>     men\n>     women\n>     zombies\n>     octopi\n>     walruses\n>     people\n>     statuses\n\n      singularize: (string) ->\n        applyRules string, singularRules\n\nCamelize converts an underscore separated identifier into camel case. The optional parameter lowercaseFirstLetter can be passed in as `true` to prevent the default behavior of capitalizing it. File separators `/` are translated to the scope resolution operator `.`.\n\n>     #! camelize\n>     message_properties\n>     models/person\n\n      camelize: (string, lowercaseFirstLetter) ->\n        string.split(fileSeparator).map (pathItem) ->\n          pathItem.split(underbar).map (chunk, i) ->\n            if lowercaseFirstLetter and i is 0\n              chunk\n            else\n              chunk.charAt(0).toUpperCase() + chunk.substring(1)\n\n          .join(\"\")\n        .join scopeResolution\n\nConstantize looks up a class from within a namespace. For example `\"MyApp.Models.MyModel\".constantize()` will look up that constant in the global namespace. You can optionally pass the root namespace as an argument. `\"Models.MyModel\".constantize(MyApp)` will look up the constant in with the given namespace as a root.\n\n      constantize: (string, rootModule) ->\n        target = rootModule ? (global ? window)\n\n        target = target[item] for item in string.split scopeResolution\n\n        return target\n\nUnderscoring converts an identifier into lowercase separated by underscores. This is handy for file names or interfacing with services that prefer underscored names to camel cased.\n\nCamel cased words are returned as lower cased and underscored. Additionally the scope resolution symbol `.` is translated to file separator: '/'.\n\n>     #! underscore\n>     messageProperties\n>     Models.Person\n\n      underscore: (string) ->\n        string.split(scopeResolution).map (chunk) ->\n          chunk\n            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')\n            .replace(/([a-z\\d])([A-Z])/g, '$1_$2')\n            .replace(/-/g, '_')\n            .toLowerCase()\n        .join(fileSeparator).toLowerCase()\n\nHumanize takes words that computers like to read and converts them to a form that is easier for people. Lower case underscored words will be returned in humanized form, as will camel cased words.\n\nPassing true as the optional parameter will maintain the first letter as lowercase. The default is to capitalize the first letter if false or no optional parameter is passed.\n\n>     #! humanize\n>     message_property_id\n>     userPreferences\n\n      humanize: (string, lowFirstLetter) ->\n        string = inflector.underscore(string)\n          .toLowerCase()\n          .replace(idSuffix, \"\")\n          .replace(underbar, \" \")\n\n        unless lowFirstLetter\n          string = inflector.capitalize(string)\n\n        return string\n\nWhen capitalizing a string all characters will be lower case and the first will be upper.\n\n>     #! capitalize\n>     egg basket\n>     user preferences\n\n      capitalize: (string) ->\n        string = string.toLowerCase()\n        string.substring(0, 1).toUpperCase() + string.substring(1)\n\nTitleize capitalizes words as you would for a book title or page. Each principle word is capitalized.\n\n>     #! titleize\n>     a man for all seasons\n>     customer_support\n>     aboutUs\n\n      titleize: (string) ->\n        result = string\n          .toLowerCase()\n          .replace(underbar, \" \")\n          .split(\" \")\n          .map (chunk) ->\n            chunk.split(\"-\").map (piece) ->\n              if nonTitlecasedWords.indexOf(piece.toLowerCase()) < 0\n                inflector.capitalize(piece)\n              else\n                piece\n            .join(\"-\")\n\n          .join(\" \")\n\n        result.substring(0, 1).toUpperCase() + result.substring(1)\n\nTableize converts property names to something that would be used for a table name in SQL. It converts camel cased words into their underscored plural form.\n\n>     #! tableize\n>     sandwich\n>     userPreferences\n\n      tableize: (string) ->\n        inflector.pluralize(inflector.underscore(string))\n\nClassify converts a string into something that would be suitable for lookup via constantize. Underscored plural nouns become the camel cased singular form.\n\n>     #! classify\n>     sandwich\n>     user_preference\n>     app/models/person\n\n      classify: (str) ->\n        inflector.singularize(inflector.camelize(str))\n\nConvert a string with spaces and mixed case into all lower case with spaces replaced with dashes. This is the style that Github branch names are commonly in.\n\n      dasherize: (str) ->\n        str.trim()\n          .replace(/\\s+/g, \"-\")\n          .toLowerCase()\n\nAdds all of these sweet inflections to `String.prototype`. To each their own.\n\n`require('inflecta').pollute()` if you are so inclined.\n\n      pollute: ->\n        Object.keys(inflector).forEach (key) ->\n          return if key is \"version\"\n          return if key is \"pollute\"\n\n          String::[key] = (args...) ->\n            inflector[key](this, args...)\n\n        return inflector\n\nExport the inflector.\n\n    module.exports = inflector\n\nInteractive Docs\n----------------\n\nSet up interactive demos for docs.\n\n[Interactive Runtime](./interactive_runtime)\n\n>     #! setup\n>     require \"/interactive_runtime\"\n",
      "type": "blob"
    },
    "source/rules.coffee.md": {
      "path": "source/rules.coffee.md",
      "mode": "100644",
      "content": "Rules\n=====\n\nThese rules are used by the [inflector](inflector.html).\n\nThis `matcher` helper will let us construct rules easier. The default `replacement` is the entire match unchanged.\n\n    matcher = (string, replacement=\"$&\") ->\n      [RegExp(string, \"gi\"), replacement]\n\nAnother little helper to convert blocks of rules text into arrays of matchers. Each line is passed to the matcher helper to create a matcher and replacement pair.\n\n    toArrays = (text) ->\n      text.split(\"\\n\").map (line) ->\n        matcher line.split(\" \").filter((piece) -> piece != \"\")...\n\nThese rules translate from the singular form of a noun to its plural form. The first section is plurals that should remain unchanged. The next section contains rules and replacements to transform words from plural to singular forms.\n\n    pluralRules = toArrays \"\"\"\n      (m)en$\n      (pe)ople$\n      (child)ren$\n      ([ti])a$\n      ((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$\n      (hive)s$\n      (tive)s$\n      (curve)s$\n      ([lr])ves$\n      ([^fo])ves$\n      ([^aeiouy]|qu)ies$\n      (s)eries$\n      (m)ovies$\n      (x|ch|ss|sh)es$\n      ([m|l])ice$\n      (bus)es$\n      (o)es$\n      (shoe)s$\n      (cris|ax|test)es$\n      (octop|vir)i$\n      (alias|status)es$\n      ^(ox)en$\n      (vert|ind)ices$\n      (matr)ices$\n      (quiz)zes$\n      (m)an$                 $1en\n      (pe)rson$              $1ople\n      (child)$               $1ren\n      ^(ox)$                 $1en\n      (ax|test)is$           $1es\n      (octop|vir)us$         $1i\n      (alias|status)$        $1es\n      (u)s$                  $1ses\n      (buffal|tomat|potat)o$ $1oes\n      ([ti])um$              $1a\n      sis$                   ses\n      (?:([^f])fe|([lr])f)$  $1$2ves\n      (hive)$                $1s\n      ([^aeiouy]|qu)y$       $1ies\n      (x|ch|ss|sh)$          $1es\n      (matr|vert|ind)ix|ex$  $1ices\n      ([m|l])ouse$           $1ice\n      (quiz)$                $1zes\n      s$                     s\n      $                      s\n    \"\"\"\n\nThese rules translate from the plural form of a noun to its singular form. Like the plulization rules above, the first section contains matches that are already singular and sholud not be transformed. The following section contains the matchers with the transformations to convert plurals to singular form.\n\n    singularRules = toArrays \"\"\"\n      (m)an$\n      (pe)rson$\n      (child)$\n      ^(ox)$\n      (ax|test)is$\n      (octop|vir)us$\n      (alias|status)$\n      (b)ie$\n      ([br]u)s$\n      (buffal|tomat|potat)o$\n      ([ti])um$\n      sis$\n      (?:([^f])fe|([lr])f)$\n      (hive)$\n      ([^aeiouy]|qu)y$\n      (x|ch|ss|sh)$\n      (matr|vert|ind)ix|ex$\n      ([m|l])ouse$\n      (quiz)$\n      (m)en$                  $1an\n      (pe)ople$               $1rson\n      (child)ren$             $1\n      ([ti])a$                $1um\n      ((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$ $1$2sis\n      (hive)s$                $1\n      (tive)s$                $1\n      (curve)s$               $1\n      ([lr])ves$              $1f\n      ([^fo])ves$             $1fe\n      (bie)s                  $1\n      ([^aeiouy]|qu)ies$      $1y\n      (s)eries$               $1eries\n      (m)ovies$               $1ovie\n      (x|ch|ss|sh)es$         $1\n      ([m|l])ice$             $1ouse\n      (us)es$                 $1\n      (o)es$                  $1\n      (shoe)s$                $1\n      (cris|ax|test)es$       $1is\n      (octop|vir)i$           $1us\n      (alias|status)es$       $1\n      ^(ox)en                 $1\n      (vert|ind)ices$         $1ex\n      (matr)ices$             $1ix\n      (quiz)zes$              $1\n      ss$                     ss\n    \"\"\"\n\nThe common case for replacing the last s with an empty string, added separately because the text block can't easily parse the empty string as a replacement.\n\n    singularRules.push matcher(\"s$\", \"\")\n\nWords that should not be capitalized for title case.\n\n    nonTitlecasedWords = \"\"\"\n      and\n      or\n      nor\n      a\n      an\n      the\n      so\n      but\n      to\n      of\n      at\n      by\n      from\n      into\n      on\n      onto\n      off\n      out\n      in\n      over\n      with\n      for\n    \"\"\".split(\"\\n\")\n\nNouns that use the same form for both singular and plural.\n\n    uncountableWords = \"\"\"\n      equipment\n      information\n      rice\n      money\n      species\n      series\n      fish\n      sheep\n      moose\n      deer\n      news\n    \"\"\".split(\"\\n\")\n\nExport our rules.\n\n    module.exports = {\n      nonTitlecasedWords\n      pluralRules\n      singularRules\n      uncountableWords\n    }\n",
      "type": "blob"
    },
    "test/pollute.coffee": {
      "path": "test/pollute.coffee",
      "mode": "100644",
      "content": "require(\"../source/inflector\").pollute()\n\ndescribe \"Polluted String\", ->\n  it \"should have inflector methods\", ->\n    assert.equal \"String\".constantize(), String\n\n  it \"should not have version property\", ->\n    assert !\"\".version\n\n  it \"should not have pollute method\", ->\n    assert !\"\".pollute\n",
      "type": "blob"
    },
    "test/test.coffee": {
      "path": "test/test.coffee",
      "mode": "100644",
      "content": "Inflector = require(\"../source/inflector\")\n\nsampleData = \"\"\"\n  address       addresses\n  boss          bosses\n  bus           buses\n  cat           cats\n  child         children\n  duder         duders\n  Hat           Hats\n  man           men\n  woman         women\n  zombie        zombies\n  octopus       octopi\n  walrus        walruses\n  guy           guys\n  person        people\n  status        statuses\n\"\"\".split(\"\\n\").map (line) ->\n  line.split(\" \").filter (piece) ->\n    piece != \"\"\n\ndescribe \"Inflector\", ->\n  describe \"pluralize\", ->\n    sampleData.forEach ([singular, plural]) ->\n      it \"#{singular} as #{plural}\", ->\n        assert.equal Inflector.pluralize(singular), plural\n\n      it \"#{plural} as #{plural}\", ->\n        assert.equal Inflector.pluralize(plural), plural\n\n  describe \"singularize\", ->\n    sampleData.forEach ([singular, plural]) ->\n      it \"#{plural} as #{singular}\", ->\n        assert.equal Inflector.singularize(plural), singular\n\n      it \"#{singular} as #{singular}\", ->\n        assert.equal Inflector.singularize(singular), singular\n\n  describe \"camelize\", ->\n    it \"message_properties as MessageProperties\", ->\n      assert.equal Inflector.camelize(\"message_properties\"), \"MessageProperties\"\n\n    it \"message_properties, true as messageProperties\", ->\n      assert.equal Inflector.camelize(\"message_properties\", true), \"messageProperties\"\n\n    it \"should replace / with scope resolution operator\", ->\n      assert.equal Inflector.camelize(\"models/person\"), \"Models.Person\"\n\n    it \"shouldn't overdo it\", ->\n      assert.equal Inflector.camelize(Inflector.camelize(\"anAlreadyCamelizedDude\")), \"AnAlreadyCamelizedDude\"\n\n  describe \"classify\", ->\n    it \"should convert a property name into a class name suitable for lookup\", ->\n      assert.equal Inflector.classify(\"message_bus_properties\"), \"MessageBusProperty\"\n\n    it \"should work for camel cased names too\", ->\n      assert.equal Inflector.classify(\"messageBusProperties\"), \"MessageBusProperty\"\n\n    it \"should convert directory separators to namespaces\", ->\n      assert.equal Inflector.classify(\"models/message_bus_properties\"), \"Models.MessageBusProperty\"\n\n  describe \"capitalize\", ->\n    it \"should work on underscored words\", ->\n      assert.equal Inflector.capitalize(\"message_properties\"), \"Message_properties\"\n\n    it \"should work on normal words\", ->\n      assert.equal Inflector.capitalize(\"message properties\"), \"Message properties\"\n\n  describe \"constantize\", ->\n    # Namespace for testing\n    Tempest =\n      Models:\n        Person: {}\n\n    it \"should look up global constants\", ->\n      assert.equal Inflector.constantize(\"String\"), String\n      assert.equal Inflector.constantize(\"Number\"), Number\n      assert.equal Inflector.constantize(\"Object\"), Object\n\n    it \"should traverse namespaces\", ->\n      assert.equal Inflector.constantize(\"Models.Person\", Tempest), Tempest.Models.Person\n\n    it \"should work with classify\", ->\n      assert.equal Inflector.constantize(Inflector.classify(\"models/person\"), Tempest), Tempest.Models.Person\n\n  describe \"humanize\", ->\n    it \"should replace underscores with spaces\", ->\n      assert.equal Inflector.humanize(\"message_properties\"), \"Message properties\"\n      assert.equal Inflector.humanize(\"message_properties\", true), \"message properties\"\n\n    it \"should remove id suffixes\", ->\n      assert.equal Inflector.humanize(\"message_id\"), \"Message\"\n      assert.equal Inflector.humanize(\"messageId\"), \"Message\"\n\n    it \"should also work for camelCased words\", ->\n      assert.equal Inflector.humanize(\"messageProperties\"), \"Message properties\"\n      assert.equal Inflector.humanize(\"messageProperties\", true), \"message properties\"\n\n  describe \"tableize\", ->\n    it \"should transform words for use in storage solutions\", ->\n      assert.equal Inflector.tableize(\"people\"), \"people\"\n      assert.equal Inflector.tableize(\"MessageBusProperty\"), \"message_bus_properties\"\n\n  describe \"titleize\", ->\n    it \"should transform words to title case\", ->\n      assert.equal Inflector.titleize(\"message_properties\"), \"Message Properties\"\n      assert.equal Inflector.titleize(\"message properties to keep\"), \"Message Properties to Keep\"\n\n  describe \"underscore\", ->\n    it \"should convert camelCased words to underscored words\", ->\n      assert.equal Inflector.underscore(\"MessageProperties\"), \"message_properties\"\n      assert.equal Inflector.underscore(\"messageProperties\"), \"message_properties\"\n\n    it \"should deal with acronyms\", ->\n      assert.equal Inflector.underscore(\"MP\"), \"mp\"\n      assert.equal Inflector.underscore(\"HTTPConnection\"), \"http_connection\"\n\n  describe \"dasherize\", ->\n    it \"should convert words with spaces into words with dashes\", ->\n      assert.equal Inflector.dasherize(\"A really cool Feature\"), \"a-really-cool-feature\"\n",
      "type": "blob"
    },
    "test_helper.coffee.md": {
      "path": "test_helper.coffee.md",
      "mode": "100644",
      "content": "Test Helper\n===========\n\n    global.assert = require \"assert\"\n",
      "type": "blob"
    },
    "interactive_runtime.coffee.md": {
      "path": "interactive_runtime.coffee.md",
      "mode": "100644",
      "content": "Interactive Runtime\n-------------------\n\nRegister our interactive documentation runtime components.\n\n    inflector = require \"/source/inflector\"\n\n    Object.keys(inflector).forEach (method) ->\n      return if method is \"version\"\n      return if method is \"pollute\"\n\n      Interactive.register method, ({source, runtimeElement}) ->\n        outputElement = document.createElement \"pre\"\n        runtimeElement.empty().append outputElement\n\n        outputElement.textContent = source.split(\"\\n\").map (word) ->\n          result = inflector[method](word)\n        .join(\"\\n\")\n",
      "type": "blob"
    }
  },
  "distribution": {
    "package": {
      "path": "package",
      "content": "module.exports = {\"name\":\"inflecta\",\"version\":\"0.8.3\",\"description\":\"A better port of ActiveSupport Inflector to JS.\",\"main\":\"dist/inflector.js\",\"scripts\":{\"prepublish\":\"script/prepublish\",\"test\":\"script/test\"},\"files\":[\"dist\"],\"repository\":{\"type\":\"git\",\"url\":\"https://github.com/STRd6/inflector\"},\"keywords\":[\"inflector\"],\"devDependencies\":{\"should\":\"1.2.2\",\"coffee-script\":\"~1.6.3\",\"mocha\":\"~1.12.0\",\"uglify-js\":\"~2.3.6\",\"docco\":\"~0.6.2\",\"browserify\":\"~2.26.0\"},\"author\":\"\",\"license\":\"MIT\",\"bugs\":{\"url\":\"https://github.com/STRd6/inflector/issues\"}};",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"version\":\"0.2.0\",\"entryPoint\":\"source/inflector\"};",
      "type": "blob"
    },
    "source/inflector": {
      "path": "source/inflector",
      "content": "(function() {\n  var applyRules, fileSeparator, idSuffix, inflector, nonTitlecasedWords, pluralRules, scopeResolution, singularRules, spaceOrUnderbar, uncountableWords, underbar, underbarPrefix, uppercase, _ref,\n    __slice = [].slice;\n\n  _ref = require(\"./rules\"), nonTitlecasedWords = _ref.nonTitlecasedWords, pluralRules = _ref.pluralRules, singularRules = _ref.singularRules, uncountableWords = _ref.uncountableWords;\n\n  idSuffix = RegExp(\"(_ids|_id)$\", \"g\");\n\n  underbar = RegExp(\"_\", \"g\");\n\n  spaceOrUnderbar = RegExp(\"[ _]\", \"g\");\n\n  uppercase = RegExp(\"([A-Z])\", \"g\");\n\n  underbarPrefix = RegExp(\"^_\");\n\n  scopeResolution = \".\";\n\n  fileSeparator = \"/\";\n\n  applyRules = function(string, rules) {\n    if (uncountableWords.indexOf(string.toLowerCase()) > -1) {\n      return string;\n    }\n    return rules.reduce(function(result, _arg) {\n      var replacer, rule;\n      rule = _arg[0], replacer = _arg[1];\n      return result || (string.match(rule) ? string.replace(rule, replacer) : void 0);\n    }, null) || string;\n  };\n\n  inflector = {\n    pluralize: function(string) {\n      return applyRules(string, pluralRules);\n    },\n    singularize: function(string) {\n      return applyRules(string, singularRules);\n    },\n    camelize: function(string, lowercaseFirstLetter) {\n      return string.split(fileSeparator).map(function(pathItem) {\n        return pathItem.split(underbar).map(function(chunk, i) {\n          if (lowercaseFirstLetter && i === 0) {\n            return chunk;\n          } else {\n            return chunk.charAt(0).toUpperCase() + chunk.substring(1);\n          }\n        }).join(\"\");\n      }).join(scopeResolution);\n    },\n    constantize: function(string, rootModule) {\n      var item, target, _i, _len, _ref1;\n      target = rootModule != null ? rootModule : typeof global !== \"undefined\" && global !== null ? global : window;\n      _ref1 = string.split(scopeResolution);\n      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {\n        item = _ref1[_i];\n        target = target[item];\n      }\n      return target;\n    },\n    underscore: function(string) {\n      return string.split(scopeResolution).map(function(chunk) {\n        return chunk.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\\d])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase();\n      }).join(fileSeparator).toLowerCase();\n    },\n    humanize: function(string, lowFirstLetter) {\n      string = inflector.underscore(string).toLowerCase().replace(idSuffix, \"\").replace(underbar, \" \");\n      if (!lowFirstLetter) {\n        string = inflector.capitalize(string);\n      }\n      return string;\n    },\n    capitalize: function(string) {\n      string = string.toLowerCase();\n      return string.substring(0, 1).toUpperCase() + string.substring(1);\n    },\n    titleize: function(string) {\n      var result;\n      result = string.toLowerCase().replace(underbar, \" \").split(\" \").map(function(chunk) {\n        return chunk.split(\"-\").map(function(piece) {\n          if (nonTitlecasedWords.indexOf(piece.toLowerCase()) < 0) {\n            return inflector.capitalize(piece);\n          } else {\n            return piece;\n          }\n        }).join(\"-\");\n      }).join(\" \");\n      return result.substring(0, 1).toUpperCase() + result.substring(1);\n    },\n    tableize: function(string) {\n      return inflector.pluralize(inflector.underscore(string));\n    },\n    classify: function(str) {\n      return inflector.singularize(inflector.camelize(str));\n    },\n    dasherize: function(str) {\n      return str.trim().replace(/\\s+/g, \"-\").toLowerCase();\n    },\n    pollute: function() {\n      Object.keys(inflector).forEach(function(key) {\n        if (key === \"version\") {\n          return;\n        }\n        if (key === \"pollute\") {\n          return;\n        }\n        return String.prototype[key] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          return inflector[key].apply(inflector, [this].concat(__slice.call(args)));\n        };\n      });\n      return inflector;\n    }\n  };\n\n  module.exports = inflector;\n\n}).call(this);\n\n//# sourceURL=source/inflector.coffee",
      "type": "blob"
    },
    "source/rules": {
      "path": "source/rules",
      "content": "(function() {\n  var matcher, nonTitlecasedWords, pluralRules, singularRules, toArrays, uncountableWords;\n\n  matcher = function(string, replacement) {\n    if (replacement == null) {\n      replacement = \"$&\";\n    }\n    return [RegExp(string, \"gi\"), replacement];\n  };\n\n  toArrays = function(text) {\n    return text.split(\"\\n\").map(function(line) {\n      return matcher.apply(null, line.split(\" \").filter(function(piece) {\n        return piece !== \"\";\n      }));\n    });\n  };\n\n  pluralRules = toArrays(\"(m)en$\\n(pe)ople$\\n(child)ren$\\n([ti])a$\\n((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$\\n(hive)s$\\n(tive)s$\\n(curve)s$\\n([lr])ves$\\n([^fo])ves$\\n([^aeiouy]|qu)ies$\\n(s)eries$\\n(m)ovies$\\n(x|ch|ss|sh)es$\\n([m|l])ice$\\n(bus)es$\\n(o)es$\\n(shoe)s$\\n(cris|ax|test)es$\\n(octop|vir)i$\\n(alias|status)es$\\n^(ox)en$\\n(vert|ind)ices$\\n(matr)ices$\\n(quiz)zes$\\n(m)an$                 $1en\\n(pe)rson$              $1ople\\n(child)$               $1ren\\n^(ox)$                 $1en\\n(ax|test)is$           $1es\\n(octop|vir)us$         $1i\\n(alias|status)$        $1es\\n(u)s$                  $1ses\\n(buffal|tomat|potat)o$ $1oes\\n([ti])um$              $1a\\nsis$                   ses\\n(?:([^f])fe|([lr])f)$  $1$2ves\\n(hive)$                $1s\\n([^aeiouy]|qu)y$       $1ies\\n(x|ch|ss|sh)$          $1es\\n(matr|vert|ind)ix|ex$  $1ices\\n([m|l])ouse$           $1ice\\n(quiz)$                $1zes\\ns$                     s\\n$                      s\");\n\n  singularRules = toArrays(\"(m)an$\\n(pe)rson$\\n(child)$\\n^(ox)$\\n(ax|test)is$\\n(octop|vir)us$\\n(alias|status)$\\n(b)ie$\\n([br]u)s$\\n(buffal|tomat|potat)o$\\n([ti])um$\\nsis$\\n(?:([^f])fe|([lr])f)$\\n(hive)$\\n([^aeiouy]|qu)y$\\n(x|ch|ss|sh)$\\n(matr|vert|ind)ix|ex$\\n([m|l])ouse$\\n(quiz)$\\n(m)en$                  $1an\\n(pe)ople$               $1rson\\n(child)ren$             $1\\n([ti])a$                $1um\\n((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$ $1$2sis\\n(hive)s$                $1\\n(tive)s$                $1\\n(curve)s$               $1\\n([lr])ves$              $1f\\n([^fo])ves$             $1fe\\n(bie)s                  $1\\n([^aeiouy]|qu)ies$      $1y\\n(s)eries$               $1eries\\n(m)ovies$               $1ovie\\n(x|ch|ss|sh)es$         $1\\n([m|l])ice$             $1ouse\\n(us)es$                 $1\\n(o)es$                  $1\\n(shoe)s$                $1\\n(cris|ax|test)es$       $1is\\n(octop|vir)i$           $1us\\n(alias|status)es$       $1\\n^(ox)en                 $1\\n(vert|ind)ices$         $1ex\\n(matr)ices$             $1ix\\n(quiz)zes$              $1\\nss$                     ss\");\n\n  singularRules.push(matcher(\"s$\", \"\"));\n\n  nonTitlecasedWords = \"and\\nor\\nnor\\na\\nan\\nthe\\nso\\nbut\\nto\\nof\\nat\\nby\\nfrom\\ninto\\non\\nonto\\noff\\nout\\nin\\nover\\nwith\\nfor\".split(\"\\n\");\n\n  uncountableWords = \"equipment\\ninformation\\nrice\\nmoney\\nspecies\\nseries\\nfish\\nsheep\\nmoose\\ndeer\\nnews\".split(\"\\n\");\n\n  module.exports = {\n    nonTitlecasedWords: nonTitlecasedWords,\n    pluralRules: pluralRules,\n    singularRules: singularRules,\n    uncountableWords: uncountableWords\n  };\n\n}).call(this);\n\n//# sourceURL=source/rules.coffee",
      "type": "blob"
    },
    "test/pollute": {
      "path": "test/pollute",
      "content": "(function() {\n  require(\"../source/inflector\").pollute();\n\n  describe(\"Polluted String\", function() {\n    it(\"should have inflector methods\", function() {\n      return assert.equal(\"String\".constantize(), String);\n    });\n    it(\"should not have version property\", function() {\n      return assert(!\"\".version);\n    });\n    return it(\"should not have pollute method\", function() {\n      return assert(!\"\".pollute);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/pollute.coffee",
      "type": "blob"
    },
    "test/test": {
      "path": "test/test",
      "content": "(function() {\n  var Inflector, sampleData;\n\n  Inflector = require(\"../source/inflector\");\n\n  sampleData = \"address       addresses\\nboss          bosses\\nbus           buses\\ncat           cats\\nchild         children\\nduder         duders\\nHat           Hats\\nman           men\\nwoman         women\\nzombie        zombies\\noctopus       octopi\\nwalrus        walruses\\nguy           guys\\nperson        people\\nstatus        statuses\".split(\"\\n\").map(function(line) {\n    return line.split(\" \").filter(function(piece) {\n      return piece !== \"\";\n    });\n  });\n\n  describe(\"Inflector\", function() {\n    describe(\"pluralize\", function() {\n      return sampleData.forEach(function(_arg) {\n        var plural, singular;\n        singular = _arg[0], plural = _arg[1];\n        it(\"\" + singular + \" as \" + plural, function() {\n          return assert.equal(Inflector.pluralize(singular), plural);\n        });\n        return it(\"\" + plural + \" as \" + plural, function() {\n          return assert.equal(Inflector.pluralize(plural), plural);\n        });\n      });\n    });\n    describe(\"singularize\", function() {\n      return sampleData.forEach(function(_arg) {\n        var plural, singular;\n        singular = _arg[0], plural = _arg[1];\n        it(\"\" + plural + \" as \" + singular, function() {\n          return assert.equal(Inflector.singularize(plural), singular);\n        });\n        return it(\"\" + singular + \" as \" + singular, function() {\n          return assert.equal(Inflector.singularize(singular), singular);\n        });\n      });\n    });\n    describe(\"camelize\", function() {\n      it(\"message_properties as MessageProperties\", function() {\n        return assert.equal(Inflector.camelize(\"message_properties\"), \"MessageProperties\");\n      });\n      it(\"message_properties, true as messageProperties\", function() {\n        return assert.equal(Inflector.camelize(\"message_properties\", true), \"messageProperties\");\n      });\n      it(\"should replace / with scope resolution operator\", function() {\n        return assert.equal(Inflector.camelize(\"models/person\"), \"Models.Person\");\n      });\n      return it(\"shouldn't overdo it\", function() {\n        return assert.equal(Inflector.camelize(Inflector.camelize(\"anAlreadyCamelizedDude\")), \"AnAlreadyCamelizedDude\");\n      });\n    });\n    describe(\"classify\", function() {\n      it(\"should convert a property name into a class name suitable for lookup\", function() {\n        return assert.equal(Inflector.classify(\"message_bus_properties\"), \"MessageBusProperty\");\n      });\n      it(\"should work for camel cased names too\", function() {\n        return assert.equal(Inflector.classify(\"messageBusProperties\"), \"MessageBusProperty\");\n      });\n      return it(\"should convert directory separators to namespaces\", function() {\n        return assert.equal(Inflector.classify(\"models/message_bus_properties\"), \"Models.MessageBusProperty\");\n      });\n    });\n    describe(\"capitalize\", function() {\n      it(\"should work on underscored words\", function() {\n        return assert.equal(Inflector.capitalize(\"message_properties\"), \"Message_properties\");\n      });\n      return it(\"should work on normal words\", function() {\n        return assert.equal(Inflector.capitalize(\"message properties\"), \"Message properties\");\n      });\n    });\n    describe(\"constantize\", function() {\n      var Tempest;\n      Tempest = {\n        Models: {\n          Person: {}\n        }\n      };\n      it(\"should look up global constants\", function() {\n        assert.equal(Inflector.constantize(\"String\"), String);\n        assert.equal(Inflector.constantize(\"Number\"), Number);\n        return assert.equal(Inflector.constantize(\"Object\"), Object);\n      });\n      it(\"should traverse namespaces\", function() {\n        return assert.equal(Inflector.constantize(\"Models.Person\", Tempest), Tempest.Models.Person);\n      });\n      return it(\"should work with classify\", function() {\n        return assert.equal(Inflector.constantize(Inflector.classify(\"models/person\"), Tempest), Tempest.Models.Person);\n      });\n    });\n    describe(\"humanize\", function() {\n      it(\"should replace underscores with spaces\", function() {\n        assert.equal(Inflector.humanize(\"message_properties\"), \"Message properties\");\n        return assert.equal(Inflector.humanize(\"message_properties\", true), \"message properties\");\n      });\n      it(\"should remove id suffixes\", function() {\n        assert.equal(Inflector.humanize(\"message_id\"), \"Message\");\n        return assert.equal(Inflector.humanize(\"messageId\"), \"Message\");\n      });\n      return it(\"should also work for camelCased words\", function() {\n        assert.equal(Inflector.humanize(\"messageProperties\"), \"Message properties\");\n        return assert.equal(Inflector.humanize(\"messageProperties\", true), \"message properties\");\n      });\n    });\n    describe(\"tableize\", function() {\n      return it(\"should transform words for use in storage solutions\", function() {\n        assert.equal(Inflector.tableize(\"people\"), \"people\");\n        return assert.equal(Inflector.tableize(\"MessageBusProperty\"), \"message_bus_properties\");\n      });\n    });\n    describe(\"titleize\", function() {\n      return it(\"should transform words to title case\", function() {\n        assert.equal(Inflector.titleize(\"message_properties\"), \"Message Properties\");\n        return assert.equal(Inflector.titleize(\"message properties to keep\"), \"Message Properties to Keep\");\n      });\n    });\n    describe(\"underscore\", function() {\n      it(\"should convert camelCased words to underscored words\", function() {\n        assert.equal(Inflector.underscore(\"MessageProperties\"), \"message_properties\");\n        return assert.equal(Inflector.underscore(\"messageProperties\"), \"message_properties\");\n      });\n      return it(\"should deal with acronyms\", function() {\n        assert.equal(Inflector.underscore(\"MP\"), \"mp\");\n        return assert.equal(Inflector.underscore(\"HTTPConnection\"), \"http_connection\");\n      });\n    });\n    return describe(\"dasherize\", function() {\n      return it(\"should convert words with spaces into words with dashes\", function() {\n        return assert.equal(Inflector.dasherize(\"A really cool Feature\"), \"a-really-cool-feature\");\n      });\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/test.coffee",
      "type": "blob"
    },
    "test_helper": {
      "path": "test_helper",
      "content": "(function() {\n  global.assert = require(\"assert\");\n\n}).call(this);\n\n//# sourceURL=test_helper.coffee",
      "type": "blob"
    },
    "interactive_runtime": {
      "path": "interactive_runtime",
      "content": "(function() {\n  var inflector;\n\n  inflector = require(\"/source/inflector\");\n\n  Object.keys(inflector).forEach(function(method) {\n    if (method === \"version\") {\n      return;\n    }\n    if (method === \"pollute\") {\n      return;\n    }\n    return Interactive.register(method, function(_arg) {\n      var outputElement, runtimeElement, source;\n      source = _arg.source, runtimeElement = _arg.runtimeElement;\n      outputElement = document.createElement(\"pre\");\n      runtimeElement.empty().append(outputElement);\n      return outputElement.textContent = source.split(\"\\n\").map(function(word) {\n        var result;\n        return result = inflector[method](word);\n      }).join(\"\\n\");\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=interactive_runtime.coffee",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://strd6.github.io/editor/"
  },
  "version": "0.2.0",
  "entryPoint": "source/inflector",
  "repository": {
    "id": 12040290,
    "name": "inflecta",
    "full_name": "STRd6/inflecta",
    "owner": {
      "login": "STRd6",
      "id": 18894,
      "avatar_url": "https://gravatar.com/avatar/33117162fff8a9cf50544a604f60c045?d=https%3A%2F%2Fidenticons.github.com%2F39df222bffe39629d904e4883eabc654.png&r=x",
      "gravatar_id": "33117162fff8a9cf50544a604f60c045",
      "url": "https://api.github.com/users/STRd6",
      "html_url": "https://github.com/STRd6",
      "followers_url": "https://api.github.com/users/STRd6/followers",
      "following_url": "https://api.github.com/users/STRd6/following{/other_user}",
      "gists_url": "https://api.github.com/users/STRd6/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/STRd6/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/STRd6/subscriptions",
      "organizations_url": "https://api.github.com/users/STRd6/orgs",
      "repos_url": "https://api.github.com/users/STRd6/repos",
      "events_url": "https://api.github.com/users/STRd6/events{/privacy}",
      "received_events_url": "https://api.github.com/users/STRd6/received_events",
      "type": "User",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/STRd6/inflecta",
    "description": " A better port of ActiveSupport Inflector to JS",
    "fork": false,
    "url": "https://api.github.com/repos/STRd6/inflecta",
    "forks_url": "https://api.github.com/repos/STRd6/inflecta/forks",
    "keys_url": "https://api.github.com/repos/STRd6/inflecta/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/STRd6/inflecta/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/STRd6/inflecta/teams",
    "hooks_url": "https://api.github.com/repos/STRd6/inflecta/hooks",
    "issue_events_url": "https://api.github.com/repos/STRd6/inflecta/issues/events{/number}",
    "events_url": "https://api.github.com/repos/STRd6/inflecta/events",
    "assignees_url": "https://api.github.com/repos/STRd6/inflecta/assignees{/user}",
    "branches_url": "https://api.github.com/repos/STRd6/inflecta/branches{/branch}",
    "tags_url": "https://api.github.com/repos/STRd6/inflecta/tags",
    "blobs_url": "https://api.github.com/repos/STRd6/inflecta/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/STRd6/inflecta/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/STRd6/inflecta/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/STRd6/inflecta/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/STRd6/inflecta/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/STRd6/inflecta/languages",
    "stargazers_url": "https://api.github.com/repos/STRd6/inflecta/stargazers",
    "contributors_url": "https://api.github.com/repos/STRd6/inflecta/contributors",
    "subscribers_url": "https://api.github.com/repos/STRd6/inflecta/subscribers",
    "subscription_url": "https://api.github.com/repos/STRd6/inflecta/subscription",
    "commits_url": "https://api.github.com/repos/STRd6/inflecta/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/STRd6/inflecta/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/STRd6/inflecta/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/STRd6/inflecta/issues/comments/{number}",
    "contents_url": "https://api.github.com/repos/STRd6/inflecta/contents/{+path}",
    "compare_url": "https://api.github.com/repos/STRd6/inflecta/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/STRd6/inflecta/merges",
    "archive_url": "https://api.github.com/repos/STRd6/inflecta/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/STRd6/inflecta/downloads",
    "issues_url": "https://api.github.com/repos/STRd6/inflecta/issues{/number}",
    "pulls_url": "https://api.github.com/repos/STRd6/inflecta/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/STRd6/inflecta/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/STRd6/inflecta/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/STRd6/inflecta/labels{/name}",
    "releases_url": "https://api.github.com/repos/STRd6/inflecta/releases{/id}",
    "created_at": "2013-08-11T18:21:15Z",
    "updated_at": "2013-12-24T01:01:42Z",
    "pushed_at": "2013-12-24T01:01:42Z",
    "git_url": "git://github.com/STRd6/inflecta.git",
    "ssh_url": "git@github.com:STRd6/inflecta.git",
    "clone_url": "https://github.com/STRd6/inflecta.git",
    "svn_url": "https://github.com/STRd6/inflecta",
    "homepage": null,
    "size": 580,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": "CoffeeScript",
    "has_issues": true,
    "has_downloads": true,
    "has_wiki": true,
    "forks_count": 0,
    "mirror_url": null,
    "open_issues_count": 0,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "master",
    "master_branch": "master",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    },
    "network_count": 0,
    "subscribers_count": 1,
    "branch": "master",
    "defaultBranch": "master"
  },
  "dependencies": {}
});