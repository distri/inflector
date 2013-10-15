Load our word lists and rules for inflecting from [rules](rules.html).

    {
      nonTitlecasedWords
      pluralRules
      singularRules
      uncountableWords
    } = require("./rules")

These are regular expressions used for converting between String formats.

    idSuffix = RegExp("(_ids|_id)$", "g")
    underbar = RegExp("_", "g")
    spaceOrUnderbar = RegExp("[ _]", "g")
    uppercase = RegExp("([A-Z])", "g")
    underbarPrefix = RegExp("^_")
    scopeResolution = "."
    fileSeparator = "/"

The apply rules helper method applies a rules based replacement to a String.

    applyRules = (string, rules) ->
      return string if uncountableWords.indexOf(string.toLowerCase()) > -1

Reduce the list of rules to the first substitution that matches and apply it.

      rules.reduce((result, [rule, replacer]) ->
        result or
          if string.match(rule)
            string.replace(rule, replacer)

Return the string unmodified if no rule matches.

      , null) or string

An object to hold all of our inflection methods.

    inflector =

Convert a string to a pluralized form by applying a list of rules. The rules contain regexes that match and replace portions of the string to transform it.

>     #! pluralize
>     address
>     boss
>     bus
>     child
>     man
>     woman
>     zombie
>     octopus
>     walrus
>     person
>     status

      pluralize: (string) ->
        applyRules string, pluralRules

Conversely we can also convert a string to a singular form by applying another list of rules.

>     #! singularize
>     addresses
>     bosses
>     buses
>     children
>     men
>     women
>     zombies
>     octopi
>     walruses
>     people
>     statuses

      singularize: (string) ->
        applyRules string, singularRules

Camelize converts an underscore separated identifier into camel case. The optional parameter lowercaseFirstLetter can be passed in as `true` to prevent the default behavior of capitalizing it. File separators `/` are translated to the scope resolution operator `.`.

>     #! camelize
>     message_properties
>     models/person

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

Camel cased words are returned as lower cased and underscored. Additionally the scope resolution symbol `.` is translated to file separator: '/'.

>     #! underscore
>     messageProperties
>     Models.Person

      underscore: (string) ->
        string.split(scopeResolution).map (chunk) ->
          chunk
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/-/g, '_')
            .toLowerCase()
        .join(fileSeparator).toLowerCase()

Humanize takes words that computers like to read and converts them to a form that is easier for people. Lower case underscored words will be returned in humanized form, as will camel cased words.

Passing true as the optional parameter will maintain the first letter as lowercase. The default is to capitalize the first letter if false or no optional parameter is passed.

>     #! humanize
>     message_property_id
>     userPreferences

      humanize: (string, lowFirstLetter) ->
        string = inflector.underscore(string)
          .toLowerCase()
          .replace(idSuffix, "")
          .replace(underbar, " ")

        unless lowFirstLetter
          string = inflector.capitalize(string)

        return string

When capitalizing a string all characters will be lower case and the first will be upper.

>     #! capitalize
>     egg basket
>     user preferences

      capitalize: (string) ->
        string = string.toLowerCase()
        string.substring(0, 1).toUpperCase() + string.substring(1)

Titleize capitalizes words as you would for a book title or page. Each principle word is capitalized.

>     #! titleize
>     a man for all seasons
>     customer_support
>     aboutUs

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

>     #! tableize
>     sandwich
>     userPreferences

      tableize: (string) ->
        inflector.pluralize(inflector.underscore(string))

Classify converts a string into something that would be suitable for lookup via constantize. Underscored plural nouns become the camel cased singular form.

>     #! classify
>     sandwich
>     user_preference
>     app/models/person

      classify: (str) ->
        inflector.singularize(inflector.camelize(str))

Convert a string with spaces and mixed case into all lower case with spaces replaced with dashes. This is the style that Github branch names are commonly in.

      dasherize: (str) ->
        str.trim()
          .replace(/\s+/g, "-")
          .toLowerCase()

Adds all of these sweet inflections to `String.prototype`. To each their own.

`require('inflecta').pollute()` if you are so inclined.

      pollute: ->
        Object.keys(inflector).forEach (key) ->
          return if key is "version"
          return if key is "pollute"

          String::[key] = (args...) ->
            inflector[key](this, args...)

        return inflector

Export the inflector.

    module.exports = inflector
