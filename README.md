[![Build Status](https://travis-ci.org/STRd6/inflecta.png?branch=master)](https://travis-ci.org/STRd6/inflecta)

Inflecta
========

What? Another ActiveSupport::Inflector port? Yeah, sorry.

The primary difference between **inflecta** and other ports is that **inflecta** translates the Ruby idioms to JavaScript idioms. It goes all the way.

The most important method is `constantize` which is not even attempted in most ports. In fact, the only reason we really need to pluralize or singularize things is so that we can automatically determine the class to instantiate from the name of the data key. That is the whole point of `ActiveSupport::Inflector`, `humanize` is just a nice side effect.

In Ruby the scope resolution operator is `::`. JavaScript doesn't have any such thing, instead people generally namespace classes using a module pattern like `MyApp.Models.MyModel`. For that reason **inflecta** uses `.` rather than blindly copying the Ruby scope resolution operator.

In JavaScript variables and properties are usually named with camel case. In Ruby they are named with underscores. It generally doesn't make a big difference, but if we want to implement `humanize` then it better work with our default conventions.

Real sorry about the name, but inflector was taken on npm.
