module Main where

import Prelude hiding ((/))

import Data.Argonaut as AR
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff)
import Fetch (fetch)
import HTTPurple (class Generic, RouteDuplex', ServerM, headers, mkRoute, response', segment, serve, (/))
import HTTPurple.Headers (ResponseHeaders)
import Node.HTTP.Types (ServerResponse)
import Partial.Unsafe (unsafePartial)

type Word' a = Record a
data Route = Word String

derive instance Generic Route _

url :: String
url = "https://api.dictionaryapi.dev/api/v2/entries/en/"

route :: RouteDuplex' Route
route = mkRoute
  { "Word": "word" / segment
  }

fetchWord
  :: String
  -> Aff
       { headers :: ResponseHeaders
       , status :: Int
       , writeBody :: ServerResponse -> Aff Unit
       }
fetchWord word = do
  { status, json } <- getWord word
  let hs = headers { "Content-Type": "application/json" }
  let resp = response' status hs
  case json of
    Just json' -> case json' of
      Left _ -> resp "{\"error\": \"Internal server error\"}"
      Right word' -> resp $ AR.stringify word'
    Nothing -> resp "{\"error\": \"Unknown word\"}"
  where
  getWord w =
    unsafePartial $
      do
        { status, text } <- fetch (url <> w) { headers: { "Accept": "application/json" } }
        case status of
          200 ->
            do
              text' <- text
              pure
                { status
                , json: Just $ AR.parseJson text'
                }

          _ -> pure { status, json: Nothing }

main :: ServerM
main =
  serve { port: 8080 } { route, router }
  where
  router { route: Word name } = fetchWord name
