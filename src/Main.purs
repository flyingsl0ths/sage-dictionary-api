module Main where

import Prelude hiding ((/))

import HTTPurple (class Generic, RouteDuplex', ServerM, mkRoute, ok, segment, serve, (/))

data Route = Hello String
derive instance Generic Route _

route :: RouteDuplex' Route
route = mkRoute
  { "Hello": "hello" / segment
  }

main :: ServerM
main =
  serve { port: 8080 } { route, router }
  where
  router { route: Hello name } = ok $ "hello " <> name
