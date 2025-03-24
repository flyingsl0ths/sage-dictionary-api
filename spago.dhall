{ name = "sage"
, dependencies =
  [ "aff"
  , "argonaut"
  , "console"
  , "effect"
  , "either"
  , "fetch"
  , "httpurple"
  , "maybe"
  , "node-http"
  , "prelude"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}
