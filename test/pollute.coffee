require("../source/inflector").pollute()

assert = require "assert"

describe "Polluted String", ->
  it "should have inflector methods", ->
    assert.equal "String".constantize(), String

  it "should not have version property", ->
    assert !"".version

  it "should not have pollute method", ->
    assert !"".pollute
