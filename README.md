Inflecta
========

What? Another ActiveSupport::Inflector port? Yeah, sorry.

The primary difference between **inflecta** and other ports is that **inflecta** translates the Ruby idioms to JavaScript idioms. It goes all the way.

In Ruby the scope resolution operator is `::`. JavaScript doesn't have any such thing, instead people generally namespace classes using a module pattern like `MyApp.Models.MyModel`. For that reason **inflecta** uses `.` rather blindly copying the Ruby scope resolution operator.

In JavaScript variables and properties are usually named with camel case. In Ruby they are named with underscores. It generally doesn't make a big difference, but if we want to implement `humanize` then it better work with our default conventions.

Real sorry about the name, but inflector was taken on npm.
