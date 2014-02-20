Interactive Runtime
-------------------

Register our interactive documentation runtime components.

    inflector = require "/source/inflector"

    Object.keys(inflector).forEach (method) ->
      return if method is "version"
      return if method is "pollute"

      Interactive.register method, ({source, runtimeElement}) ->
        outputElement = document.createElement "pre"
        runtimeElement.empty().append outputElement

        outputElement.textContent = source.split("\n").map (word) ->
          result = inflector[method](word)
        .join("\n")
