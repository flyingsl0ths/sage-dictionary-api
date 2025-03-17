{ name = "sage"
, dependencies = [ "console", "effect", "httpurple", "prelude" ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}
