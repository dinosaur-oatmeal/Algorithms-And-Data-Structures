-- elm make src/Main.elm --output=elm.js
-- live-server
module Main exposing (main)

-- Imports for website to work
import Browser
import Browser.Navigation as Nav
import Html exposing (Html, div, text, button, label, select, option, node)
import Html.Attributes exposing (class, value, attribute, title)
import Html.Events exposing (onInput, onClick)
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), s, top)

-- Custom structs imports (avoid circular import)
import Structs exposing (defaultSortingTrack, SortingTrack)

-- Pages that can be visited
import Pages.Home as Home
import Pages.BubbleSort as BubbleSort


-- MODEL (info stored during interactions)
type alias Model =
    { key : Nav.Key
    , currentPage : Page
    , homeModel : Home.Model
    , bubbleSortTrack : SortingTrack
    }

-- INIT (initial state of program)
init : () -> Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    ( { key = key
      , currentPage = parseUrl url
      , bubbleSortTrack = defaultSortingTrack
      , homeModel =
            -- Default to the superior theme
            { theme = Home.Dark
            }
      }
    , Cmd.none
    )

-- PAGES (different views for the website)
type Page
    = Home
    | BubbleSort

-- Convert URL into a page
parseUrl : Url -> Page
parseUrl url =
    case Parser.parse routeParser url of
        -- Home (default)
        Just HomeRoute ->
            Home

        -- BubbleSort Page
        Just BubbleSortRoute ->
            BubbleSort

        -- Go to home for edge cases
        _ ->
            Home

-- ROUTES (how URLs map to different pages)
type Route
    = HomeRoute
    | BubbleSortRoute

-- Defines mapping between URL and Route types
routeParser : Parser.Parser (Route -> a) a
routeParser =
    -- Check all possible routes
    Parser.oneOf
        [ Parser.map HomeRoute top
        , Parser.map BubbleSortRoute (s "bubble-sort")
        ]

-- MESSAGES (all possilbe messages for the program to receive)
type Msg
    = NavigateTo Page
    | HomeMsg Home.Msg
    | BubbleSortStep
    | SelectAlgorithm String


-- UPDATE

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        -- Visit specific page clicked on
        NavigateTo page ->
            ( { model | currentPage = page }, Cmd.none )

        HomeMsg homeMsg ->
            case homeMsg of
                -- Update website theme
                Home.ToggleTheme ->
                    let
                        updatedTheme =
                            if model.homeModel.theme == Home.Light then
                                Home.Dark
                            else
                                Home.Light
                    in
                    ( { model | homeModel = { theme = updatedTheme } }, Cmd.none )

        -- Update BubbleSort Track
        BubbleSortStep ->
            let
                updatedTrack =
                    BubbleSort.bubbleSortStep model.bubbleSortTrack
            in
            ( { model | bubbleSortTrack = updatedTrack }, Cmd.none )

        -- Universal algorithm selection from the top dropdown
        SelectAlgorithm algorithm ->
            case algorithm of
                -- BubbleSort
                "Bubble Sort" ->
                    ( { model | currentPage = BubbleSort }, Cmd.none )

                -- Default to home for algorithms not yet added
                _ ->
                    -- default to Home or do nothing
                    ( { model | currentPage = Home }, Cmd.none )


-- VIEW
view : Model -> Browser.Document Msg
view model =
    let
        -- Reuse them from homeModel
        themeClass =
            case model.homeModel.theme of
                Home.Light ->
                    "light-theme"

                Home.Dark ->
                    "dark-theme"
    in
    Browser.Document "Sorting Visualizer"
        [ div [ class ("main-container " ++ themeClass) ]
            [ viewHeader
            , div [ class "page-content" ]
                [ case model.currentPage of
                    Home ->
                        -- Render Home page
                        Html.map HomeMsg (Home.view model.homeModel)

                    BubbleSort ->
                        -- Render BubbleSort page
                        BubbleSort.view model.bubbleSortTrack BubbleSortStep
                ]
            , viewThemeToggle model
            ]
        ]

-- Top header (navbar) containing a label and dropdown with multiple algorithm categories.
viewHeader : Html Msg
viewHeader =
    div [ class "header" ]
        [ label [ class "dropdown-label" ] [ text "Algorithms:" ]
        , select [ class "dropdown", onInput SelectAlgorithm ]
            [ option [ value "" ] [ text "Home Page" ]
            -- Comparison-Based
            , node "optgroup" [ attribute "label" "Comparison-based" ]
                [ option [ value "Bubble Sort" ] [ text "Bubble Sort" ]
                , option [ value "Insertion Sort" ] [ text "Insertion Sort" ]
                , option [ value "Selection Sort" ] [ text "Selection Sort" ]
                ]
            -- Divide and Conquer
            , node "optgroup" [ attribute "label" "Divide & Conquer" ]
                [ option [ value "Merge Sort" ] [ text "Merge Sort" ]
                , option [ value "Quick Sort" ] [ text "Quick Sort" ]
                ]
            -- Heaps
            , node "optgroup" [ attribute "label" "Heaps" ]
                [ option [ value "Heap Sort" ] [ text "Heap Sort" ]
                ]
            -- Graphs
            , node "optgroup" [ attribute "label" "Graphs" ]
                [ option [ value "Topological Sort" ] [ text "Topological Sort" ]
                ]
            -- Trees
            , node "optgroup" [ attribute "label" "Trees" ]
                [ option [ value "AVL Tree" ] [ text "AVL Tree" ]
                , option [ value "Binary Search Tree" ] [ text "Binary Search Tree" ]
                ]
            ]
        ]


-- Bottom right theme toggle
viewThemeToggle : Model -> Html Msg
viewThemeToggle model =
    let
        (icon, tooltip) =
            if model.homeModel.theme == Home.Light then
                ("🌙", "Switch to Dark Mode")
            else
                ("☀", "Switch to Light Mode")
    in
    div [ class "theme-toggle-container" ]
        [ button
            [ class "theme-toggle-btn"
            , onClick (HomeMsg Home.ToggleTheme)
            , title tooltip
            ]
            [ text icon ]
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
