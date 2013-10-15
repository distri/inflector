These rules are used by the [inflector](inflector.html).

This `matcher` helper will let us construct rules easier. The default `replacement` is the entire match unchanged.

    matcher = (string, replacement="$&") ->
      [RegExp(string, "gi"), replacement]

Another little helper to convert blocks of rules text into arrays of matchers. Each line is passed to the matcher helper to create a matcher and replacement pair.

    toArrays = (text) ->
      text.split("\n").map (line) ->
        matcher line.split(" ").filter((piece) -> piece != "")...

These rules translate from the singular form of a noun to its plural form. The first section is plurals that should remain unchanged. The next section contains rules and replacements to transform words from plural to singular forms.

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

These rules translate from the plural form of a noun to its singular form. Like the plulization rules above, the first section contains matches that are already singular and sholud not be transformed. The following section contains the matchers with the transformations to convert plurals to singular form.

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

The common case for replacing the last s with an empty string, added separately because the text block can't easily parse the empty string as a replacement.

    singularRules.push matcher("s$", "")

Words that should not be capitalized for title case.

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

Nouns that use the same form for both singular and plural.

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

Export our rules.

    module.exports = {
      nonTitlecasedWords
      pluralRules
      singularRules
      uncountableWords
    }
