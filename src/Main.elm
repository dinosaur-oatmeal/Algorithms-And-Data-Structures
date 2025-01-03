-- elm make src/Main.elm --output=elm.js
-- live-server
module Main exposing (main)

-- Website functionality imports for muli-page site
import Browser
import Browser.Navigation as Nav
import Html exposing (Html)
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), s, top)

-- Custom Structs import (avoid circular imports)
import Structs exposing (defaultSortingTrack, SortingTrack)

-- Pages that can be visited
import Pages.Home exposing (view, Msg)
import Pages.BubbleSort exposing (view, bubbleSortStep)

-- MODEL
type alias Model =
    { key : Nav.Key
    , currentPage : Page
    , bubbleSortTrack : SortingTrack
    }

-- PAGES (different views for website)
type Page
    = Home
    | BubbleSort

-- INIT
init : () -> Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    ( { key = key
      , currentPage = parseUrl url
      , bubbleSortTrack = defaultSortingTrack
      }
    , Cmd.none
    )

-- ROUTES (how URLs map to different pages)
type Route
    = HomeRoute
    | BubbleSortRoute

-- Defines mapping between URL and Route types
routeParser : Parser.Parser (Route -> a) a
routeParser =
    -- Check all possible routes
    Parser.oneOf
        [ Parser.map HomeRoute top -- Match root URL to /
        , Parser.map BubbleSortRoute (s "bubble-sort") -- Match URL to /bubble-sort
        ]

-- Convert URL into a page
parseUrl : Url -> Page
parseUrl url =
    -- Match URL against routes defined in routeParser
    case Parser.parse routeParser url of
        -- Home (default)
        Just HomeRoute ->
            Home

        -- BubbleSort Page
        Just BubbleSortRoute ->
            BubbleSort

        -- Default is Home
        Nothing ->
            Home


-- MESSAGES (all possible messages for the program to receive)
type Msg
    = NavigateTo Page
    | HomeMsg Pages.Home.Msg
    | NextBubbleSortStep

-- UPDATE
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        -- Visit specific page clicked on
        NavigateTo page ->
            ( { model | currentPage = page }, Cmd.none )

        -- Home Page (default)
        HomeMsg homeMsg ->
            case homeMsg of
                Pages.Home.SelectAlgorithm algorithm ->
                    case algorithm of
                        -- BubbleSort Page
                        "Bubble Sort" ->
                            ( { model | currentPage = BubbleSort }, Cmd.none )

                        _ ->
                            ( model, Cmd.none )

        -- Update BubbleSort track
        NextBubbleSortStep ->
            let
                updatedTrack =
                    bubbleSortStep model.bubbleSortTrack
            in
            ( { model | bubbleSortTrack = updatedTrack }, Cmd.none )
-- VIEW
view : Model -> Browser.Document Msg
view model =
    case model.currentPage of
        -- Render Home Page
        Home ->
            Browser.Document "Sorting Algorithm Visualizer"
                [ Html.map HomeMsg Pages.Home.view ]

        -- Render BubbleSort Page
        BubbleSort ->
            Browser.Document "Bubble Sort"
                [ -- Pass `NextBubbleSortStep` as the message for the step button
                  Pages.BubbleSort.view model.bubbleSortTrack NextBubbleSortStep
                ]

-- MAIN (handles application state in browser)
main : Program () Model Msg
main =
    Browser.application
        { init = init
        , onUrlChange = \url -> NavigateTo (parseUrl url)
        , onUrlRequest = \_ -> NavigateTo Home
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }
