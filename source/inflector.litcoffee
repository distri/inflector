This is a list of nouns that use the same form for both singular and plural.
This list should remain entirely in lower case to correctly match Strings.

    uncountableWords = """
      equipment
      information
      rice
      money
      species
      series
      fish
      sheep
      moose
      deer
      news
    """.split("\n")

This matcher helper will let us construct rules easier.

    matcher = (string, replacement="$&") ->
      [RegExp(string, "gi"), replacement]

A little helper to convert blocks of rules text into arrays of matchers.

    toArrays = (text) ->
      text.split("\n").map (line) ->
        matcher line.split(" ").filter((piece) -> piece != "")...

These rules translate from the singular form of a noun to its plural form.

    pluralRules = toArrays """
      (m)en$
      (pe)ople$
      (child)ren$
      ([ti])a$
      ((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$
      (hive)s$
      (tive)s$
      (curve)s$
      ([lr])ves$
      ([^fo])ves$
      ([^aeiouy]|qu)ies$
      (s)eries$
      (m)ovies$
      (x|ch|ss|sh)es$
      ([m|l])ice$
      (bus)es$
      (o)es$
      (shoe)s$
      (cris|ax|test)es$
      (octop|vir)i$
      (alias|status)es$
      ^(ox)en$
      (vert|ind)ices$
      (matr)ices$
      (quiz)zes$
      (m)an$                 $1en
      (pe)rson$              $1ople
      (child)$               $1ren
      ^(ox)$                 $1en
      (ax|test)is$           $1es
      (octop|vir)us$         $1i
      (alias|status)$        $1es
      (u)s$                  $1ses
      (buffal|tomat|potat)o$ $1oes
      ([ti])um$              $1a
      sis$                   ses
      (?:([^f])fe|([lr])f)$  $1$2ves
      (hive)$                $1s
      ([^aeiouy]|qu)y$       $1ies
      (x|ch|ss|sh)$          $1es
      (matr|vert|ind)ix|ex$  $1ices
      ([m|l])ouse$           $1ice
      (quiz)$                $1zes
      s$                     s
      $                      s
    """

These rules translate from the plural form of a noun to its singular form.

    singularRules = toArrays """
      (m)an$
      (pe)rson$
      (child)$
      ^(ox)$
      (ax|test)is$
      (octop|vir)us$
      (alias|status)$
      (b)ie$
      ([br]u)s$
      (buffal|tomat|potat)o$
      ([ti])um$
      sis$
      (?:([^f])fe|([lr])f)$
      (hive)$
      ([^aeiouy]|qu)y$
      (x|ch|ss|sh)$
      (matr|vert|ind)ix|ex$
      ([m|l])ouse$
      (quiz)$
      (m)en$                  $1an
      (pe)ople$               $1rson
      (child)ren$             $1
      ([ti])a$                $1um
      ((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$ $1$2sis
      (hive)s$                $1
      (tive)s$                $1
      (curve)s$               $1
      ([lr])ves$              $1f
      ([^fo])ves$             $1fe
      (bie)s                  $1
      ([^aeiouy]|qu)ies$      $1y
      (s)eries$               $1eries
      (m)ovies$               $1ovie
      (x|ch|ss|sh)es$         $1
      ([m|l])ice$             $1ouse
      (us)es$                 $1
      (o)es$                  $1
      (shoe)s$                $1
      (cris|ax|test)es$       $1is
      (octop|vir)i$           $1us
      (alias|status)es$       $1
      ^(ox)en                 $1
      (vert|ind)ices$         $1ex
      (matr)ices$             $1ix
      (quiz)zes$              $1
      ss$                     ss
    """

A special case for replacing the last s with an empty string.

    singularRules.push matcher("s$", "")

This is a list of words that should not be capitalized for title case.

    nonTitlecasedWords = """
      and
      or
      nor
      a
      an
      the
      so
      but
      to
      of
      at
      by
      from
      into
      on
      onto
      off
      out
      in
      over
      with
      for
    """.split("\n")

These are regular expressions used for converting between String formats.

    idSuffix = RegExp("(_ids|_id)$", "g")
    underbar = RegExp("_", "g")
    spaceOrUnderbar = RegExp("[ _]", "g")
    uppercase = RegExp("([A-Z])", "g")
    underbarPrefix = RegExp("^_")
    scopeResolution = "."
    fileSeparator = "/"

The apply rules helper method applies a rules based replacement to a String.

    applyRules = (str, rules, override) ->
      return override if override

      return str if uncountableWords.indexOf(str.toLowerCase()) > -1

      rules.reduce((result, [rule, replacer]) ->
        result or
          if str.match(rule)
            # console.log "matched #{rule}:#{replacer}"
            str.replace(rule, replacer)

      , null) or str

Hold all of our inflection methods.

    inflector =

This function adds pluralization support to every String object.

      pluralize: (string, plural) ->
        applyRules string, pluralRules, plural

This function adds singularization support to every String object.

      singularize: (string, singular) ->
        applyRules string, singularRules, singular

Camelize converts an underscore separated identifier into camel case. The optional parameter lowercaseFirstLetter can be passed in as `true` to prevent the default behavior of capitalizing it. File separators `/` are translated to the scope resolution operator `.`.

      camelize: (string, lowercaseFirstLetter) ->
        string.split(fileSeparator).map (pathItem) ->
          pathItem.split(underbar).map (chunk, i) ->
            if lowercaseFirstLetter and i is 0
              chunk
            else
              chunk.charAt(0).toUpperCase() + chunk.substring(1)

          .join("")
        .join scopeResolution

Constantize looks up a class from within a namespace. For example `"MyApp.Models.MyModel".constantize()` will look up that constant in the global namespace. You can optionally pass the root namespace as an argument. `"Models.MyModel".constantize(MyApp)` will look up the constant in with the given namespace as a root.

      constantize: (string, rootModule) ->
        target = rootModule ? (global ? window)

        target = target[item] for item in string.split scopeResolution

        return target

Underscoring converts an identifier into lowercase separated by underscores. This is handy for file names or interfacing with services that prefer underscored names to camel cased.

The optional parameter allUpperCase can be set to true to return unchanged strings that are currently all upercase characters.

Camel cased words are returned as lower cased and underscored. Additionally the scope resolution symbol `.` is translated to file separator: '/'.

      underscore: (string, allUpperCase) ->
        if allUpperCase and string is string.toUpperCase()
          return string

        string.split(scopeResolution).map (chunk) ->
          chunk
            .replace(uppercase, "_$1")
            .replace(underbarPrefix, "")
        .join(fileSeparator).toLowerCase()

Humanize takes words that computers like to read and converts them to a form that is easier for people. Lower case underscored words will be returned in humanized form, as will camel cased words.

Passing true as the optional parameter will maintain the first letter as lowercase. The default is to capitalize the first letter if false or no optional parameter is passed.

      humanize: (string, lowFirstLetter) ->
        string = inflector.underscore(string)
          .toLowerCase()
          .replace(idSuffix, "")
          .replace(underbar, " ")

        unless lowFirstLetter
          string = inflector.capitalize(string)

        return string

When capitalizing a string all characters will be lower case and the first will be upper.

      capitalize: (string) ->
        string = string.toLowerCase()
        string.substring(0, 1).toUpperCase() + string.substring(1)

Titleize capitalizes words as you would for a book title.

      titleize: (string) ->
        result = string
          .toLowerCase()
          .replace(underbar, " ")
          .split(" ")
          .map (chunk) ->
            chunk.split("-").map (piece) ->
              if nonTitlecasedWords.indexOf(piece.toLowerCase()) < 0
                inflector.capitalize(piece)
              else
                piece
            .join("-")

          .join(" ")

        result.substring(0, 1).toUpperCase() + result.substring(1)

Tableize converts property names to something that would be used for a table name in SQL. It converts camel cased words into their underscored plural form.

      tableize: (str) ->
        str = inflector.underscore(str)
        str = inflector.pluralize(str)
        str

Classify converts a string into something that would be suitable for lookup via constantize. Underscored plural nouns become the camel cased singular form.

      classify: (str) ->
        str = inflector.camelize(str)
        str = inflector.singularize(str)
        str

Ordinalize converts all found numbers to their sequence name i.e. "22" => "22nd".

      ordinalize: (str) ->
        suffix = (number) ->
          lastDigit = number.substr(-1)
          lastTwoDigits = number.substr(-2)

          switch lastTwoDigits
            when "11", "12", "13"
              "th"
            else
              switch lastDigit
                when "1"
                  "st"
                when "2"
                  "nd"
                when "3"
                  "rd"
                else
                  "th"

        str.split(" ").map (piece) ->
          if isNaN(parseInt(piece, 10))
            piece
          else
            piece + suffix(piece)

        .join " "

Add all of these sweet inflections to `String.prototype`. I prefer it, but hey, it's up to you!

You can just `require('inflecta').pollute()`

      pollute: ->
        Object.keys(inflector).forEach (key) ->
          # Skip the `version` and `pollute` properties
          return if key is "version"
          return if key is "pollute"

          String::[key] = (args...) ->
            inflector[key](this, args...)

        return inflector

Expose the current version.

    pkg = require('../package.json')
    inflector.version = pkg.version

Export the inflector.

    module.exports = inflector
