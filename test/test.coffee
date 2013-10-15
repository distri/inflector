Inflector = require("../source/inflector")

sampleData = """
  address       addresses
  boss          bosses
  bus           buses
  cat           cats
  child         children
  duder         duders
  Hat           Hats
  man           men
  woman         women
  zombie        zombies
  octopus       octopi
  walrus        walruses
  guy           guys
  person        people
  status        statuses
""".split("\n").map (line) ->
  line.split(" ").filter (piece) ->
    piece != ""

describe "Inflector", ->
  describe "pluralize", ->
    sampleData.forEach ([singular, plural]) ->
      it "#{singular} as #{plural}", ->
        assert.equal Inflector.pluralize(singular), plural

      it "#{plural} as #{plural}", ->
        assert.equal Inflector.pluralize(plural), plural

  describe "singularize", ->
    sampleData.forEach ([singular, plural]) ->
      it "#{plural} as #{singular}", ->
        assert.equal Inflector.singularize(plural), singular

      it "#{singular} as #{singular}", ->
        assert.equal Inflector.singularize(singular), singular

  describe "camelize", ->
    it "message_properties as MessageProperties", ->
      assert.equal Inflector.camelize("message_properties"), "MessageProperties"

    it "message_properties, true as messageProperties", ->
      assert.equal Inflector.camelize("message_properties", true), "messageProperties"

    it "should replace / with scope resolution operator", ->
      assert.equal Inflector.camelize("models/person"), "Models.Person"

    it "shouldn't overdo it", ->
      assert.equal Inflector.camelize(Inflector.camelize("anAlreadyCamelizedDude")), "AnAlreadyCamelizedDude"

  describe "classify", ->
    it "should convert a property name into a class name suitable for lookup", ->
      assert.equal Inflector.classify("message_bus_properties"), "MessageBusProperty"

    it "should work for camel cased names too", ->
      assert.equal Inflector.classify("messageBusProperties"), "MessageBusProperty"

    it "should convert directory separators to namespaces", ->
      assert.equal Inflector.classify("models/message_bus_properties"), "Models.MessageBusProperty"

  describe "capitalize", ->
    it "should work on underscored words", ->
      assert.equal Inflector.capitalize("message_properties"), "Message_properties"

    it "should work on normal words", ->
      assert.equal Inflector.capitalize("message properties"), "Message properties"

  describe "constantize", ->
    # Namespace for testing
    Tempest =
      Models:
        Person: {}

    it "should look up global constants", ->
      assert.equal Inflector.constantize("String"), String
      assert.equal Inflector.constantize("Number"), Number
      assert.equal Inflector.constantize("Object"), Object

    it "should traverse namespaces", ->
      assert.equal Inflector.constantize("Models.Person", Tempest), Tempest.Models.Person

    it "should work with classify", ->
      assert.equal Inflector.constantize(Inflector.classify("models/person"), Tempest), Tempest.Models.Person

  describe "humanize", ->
    it "should replace underscores with spaces", ->
      assert.equal Inflector.humanize("message_properties"), "Message properties"
      assert.equal Inflector.humanize("message_properties", true), "message properties"

    it "should remove id suffixes", ->
      assert.equal Inflector.humanize("message_id"), "Message"
      assert.equal Inflector.humanize("messageId"), "Message"

    it "should also work for camelCased words", ->
      assert.equal Inflector.humanize("messageProperties"), "Message properties"
      assert.equal Inflector.humanize("messageProperties", true), "message properties"

  describe "tableize", ->
    it "should transform words for use in storage solutions", ->
      assert.equal Inflector.tableize("people"), "people"
      assert.equal Inflector.tableize("MessageBusProperty"), "message_bus_properties"

  describe "titleize", ->
    it "should transform words to title case", ->
      assert.equal Inflector.titleize("message_properties"), "Message Properties"
      assert.equal Inflector.titleize("message properties to keep"), "Message Properties to Keep"

  describe "underscore", ->
    it "should convert camelCased words to underscored words", ->
      assert.equal Inflector.underscore("MessageProperties"), "message_properties"
      assert.equal Inflector.underscore("messageProperties"), "message_properties"

    it "should deal with acronyms", ->
      assert.equal Inflector.underscore("MP"), "mp"
      assert.equal Inflector.underscore("HTTPConnection"), "http_connection"

  describe "dasherize", ->
    it "should convert words with spaces into words with dashes", ->
      assert.equal Inflector.dasherize("A really cool Feature"), "a-really-cool-feature"
