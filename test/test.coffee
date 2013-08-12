Inflector = require("../source/inflector")
pkg = require('../package.json')

should = require("should")

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
  it "should expose the correct version number", ->
    Inflector.version.should.equal pkg.version

  describe "pluralize", ->
    sampleData.forEach ([singular, plural]) ->
      it "#{singular} as #{plural}", ->
        Inflector.pluralize(singular).should.equal plural

      it "#{plural} as #{plural}", ->
        Inflector.pluralize(plural).should.equal plural

  describe "singularize", ->
    sampleData.forEach ([singular, plural]) ->
      it "#{plural} as #{singular}", ->
        Inflector.singularize(plural).should.equal singular

      it "#{singular} as #{singular}", ->
        Inflector.singularize(singular).should.equal singular

  describe "camelize", ->
    it "message_properties as MessageProperties", ->
      Inflector.camelize("message_properties").should.equal "MessageProperties"

    it "message_properties, true as messageProperties", ->
      Inflector.camelize("message_properties", true).should.equal "messageProperties"

    it "should replace / with scope resolution operator", ->
      Inflector.camelize("models/person").should.equal "Models.Person"

    it "shouldn't overdo it", ->
      Inflector.camelize(Inflector.camelize("anAlreadyCamelizedDude")).should.equal "AnAlreadyCamelizedDude"

  describe "classify", ->
    it "should convert a property name into a class name suitable for lookup", ->
      Inflector.classify("message_bus_properties").should.equal "MessageBusProperty"

    it "should work for camel cased names too", ->
      Inflector.classify("messageBusProperties").should.equal "MessageBusProperty"

    it "should convert directory separators to namespaces", ->
      Inflector.classify("models/message_bus_properties").should.equal "Models.MessageBusProperty"

  describe "capitalize", ->
    it "should work on underscored words", ->
      Inflector.capitalize("message_properties").should.equal "Message_properties"

    it "should work on normal words", ->
      Inflector.capitalize("message properties").should.equal "Message properties"

  describe "constantize", ->
    # Namespace for testing
    Tempest =
      Models:
        Person: {}

    it "should look up global constants", ->
      Inflector.constantize("String").should.equal String
      Inflector.constantize("Number").should.equal Number
      Inflector.constantize("Object").should.equal Object

    it "should traverse namespaces", ->
      Inflector.constantize("Models.Person", Tempest).should.equal Tempest.Models.Person

    it "should work with classify", ->
      Inflector.constantize(Inflector.classify("models/person"), Tempest).should.equal Tempest.Models.Person

  describe "humanize", ->
    it "should replace underscores with spaces", ->
      Inflector.humanize("message_properties").should.equal "Message properties"
      Inflector.humanize("message_properties", true).should.equal "message properties"

    it "should remove id suffixes", ->
      Inflector.humanize("message_id").should.equal "Message"
      Inflector.humanize("messageId").should.equal "Message"

    it "should also work for camelCased words", ->
      Inflector.humanize("messageProperties").should.equal "Message properties"
      Inflector.humanize("messageProperties", true).should.equal "message properties"

  describe "tableize", ->
    it "should transform words for use in storage solutions", ->
      Inflector.tableize("people").should.equal "people"
      Inflector.tableize("MessageBusProperty").should.equal "message_bus_properties"

  describe "titleize", ->
    it "should transform words to title case", ->
      Inflector.titleize("message_properties").should.equal "Message Properties"
      Inflector.titleize("message properties to keep").should.equal "Message Properties to Keep"

  describe "underscore", ->
    it "should convert camelCased words to underscored words", ->
      Inflector.underscore("MessageProperties").should.equal "message_properties"
      Inflector.underscore("messageProperties").should.equal "message_properties"

    it "should deal with acronyms", ->
      Inflector.underscore("MP").should.equal "m_p"
      Inflector.underscore("MP", true).should.equal "MP"
