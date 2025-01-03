-- elm make src/Main.elm --output=elm.js
-- live-server
module Main exposing (main)

-- Imports for website to work
import Browser
import Browser.Navigation as Nav
import Html exposing (Html, div, text, label, select, option, node, button)
import Html.Attributes exposing (class, value, attribute, title)
import Html.Events exposing (onInput, onClick)
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), s, top)

-- Time for "Run" button
import Time

-- Pages that can be visited
import Pages.Home as Home
import Pages.BubbleSort as BubbleSort
import Pages.SelectionSort as SelectionSort

-- Custom structs imports (avoid circular import)
import Structs exposing (defaultSortingTrack, SortingTrack)

-- Algorithm control buttons (run/pause/step/reset)
import Controls exposing (ControlMsg(..))

-- Model (info stored during interactions)
type alias Model =
    { key : Nav.Key
    -- Page we're visiting
    , currentPage : Page
    -- Theme of webiste (light/dark)
    , homeModel : Home.Model
    -- Generic sortingTrack data
    , sortingAlgorithm : SortingTrack
    -- Running or not
    , running : Bool
    }

-- ROUTE (how URLs map to different pages)
type Route
    = HomeRoute
    | BubbleSortRoute
    | SelectionSortRoute

-- PAGE (different views for the website)
type Page
    = Home
    | BubbleSort
    | SelectionSort

-- MESSAGES (all possible messages for the program to receive)
type Msg
    -- Visit a new page
    = NavigateTo Page
    -- Update the website theme
    | HomeMsg Home.Msg
    -- Select and algorithm to view
    | SelectAlgorithm String
    -- Control buttons for algorithm
    | ControlMsg ControlMsg
    -- Timing for running the algorithm
    | Tick Time.Posix

-- PARSER (Define mapping betwen URL and Route types)
routeParser : Parser.Parser (Route -> a) a
routeParser =
    Parser.oneOf
        [ Parser.map HomeRoute top
        , Parser.map BubbleSortRoute (s "bubble-sort")
        , Parser.map SelectionSortRoute (s "selection-sort")
        ]

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

        -- SelectionSort Page
        Just SelectionSortRoute ->
            SelectionSort

        -- Go to home for edge cases
        Nothing ->
            Home

-- INIT (initial state of program)
init : () -> Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    ( { key = key
      , currentPage = parseUrl url
      , homeModel =
            -- Default to the superior theme
          { theme = Home.Dark }
      , sortingAlgorithm = defaultSortingTrack
      -- Sorting algorithm should not start as running
      , running = False
      }
    , Cmd.none
    )

-- UPDATE
update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        -- Visit specific page clicked on
        NavigateTo page ->
            ( { model | currentPage = page
                        -- Reset sorting information and set running to false
                      , sortingAlgorithm = defaultSortingTrack
                      , running = False
              }
            , Cmd.none
            )

        HomeMsg homeMsg ->
            case homeMsg of
                -- Update website theme
                Home.ToggleTheme ->
                    let
                        newTheme =
                            if model.homeModel.theme == Home.Light then
                                Home.Dark
                            else
                                Home.Light
                    in
                    ( { model | homeModel = { theme = newTheme } }, Cmd.none )

        -- Algorithm selection form the top dropdown
        SelectAlgorithm algName ->
            case algName of
                -- BubbleSort
                "Bubble Sort" ->
                    ( { model | currentPage = BubbleSort
                              , sortingAlgorithm = defaultSortingTrack
                              , running = False
                      }
                    , Cmd.none
                    )

                -- SelectionSort
                "Selection Sort" ->
                    ( { model | currentPage = SelectionSort
                              , sortingAlgorithm = defaultSortingTrack
                              , running = False
                      }
                    , Cmd.none
                    )

                -- Default to home for algorithms not yet added
                _ ->
                    ( { model | currentPage = Home
                              , sortingAlgorithm = defaultSortingTrack
                              , running = False
                      }
                    , Cmd.none
                    )

        -- Control messages for algorithm buttons
        ControlMsg controlMsg ->
            case controlMsg of
                -- Run the algorithm (subscriptions)
                Run ->
                    ( { model | running = True }, Cmd.none )

                -- Pause the algorithm running (only available if it is running)
                Pause ->
                    ( { model | running = False }, Cmd.none )

                -- Reset back to the initial state
                Reset ->
                    ( { model
                        | sortingAlgorithm = defaultSortingTrack
                        , running = False
                      }
                    , Cmd.none
                    )

                -- Allow user to do one step to see how the array changes
                Step ->
                    let
                        updatedTrack =
                            case model.currentPage of
                                -- One step of Bubble if on Bubble Page
                                BubbleSort ->
                                    BubbleSort.bubbleSortStep model.sortingAlgorithm

                                -- One step of Selection if on Selection Page
                                SelectionSort ->
                                    SelectionSort.selectionSortStep model.sortingAlgorithm

                                -- Don't update if on Home
                                _ ->
                                    model.sortingAlgorithm
                    in
                    ( { model | sortingAlgorithm = updatedTrack }, Cmd.none )

        -- Running algorithm
        Tick _ ->
            -- Update model depending on page if flag is True
            if model.running then
                let
                    updatedTrack =
                        case model.currentPage of
                            -- BubbleSort Running
                            BubbleSort ->
                                BubbleSort.bubbleSortStep model.sortingAlgorithm

                            -- SelectionSort Running
                            SelectionSort ->
                                SelectionSort.selectionSortStep model.sortingAlgorithm

                            -- Don't update if on Home
                            _ ->
                                model.sortingAlgorithm
                in
                ( { model | sortingAlgorithm = updatedTrack }, Cmd.none )
            else
                ( model, Cmd.none )

-- SUBSCRIPTIONS
subscriptions : Model -> Sub Msg
subscriptions model =
    -- Automatically step every 0.5 seconds if the running flag is True
    if model.running then
        Time.every 500 Tick
    else
        Sub.none

-- VIEW
view : Model -> Browser.Document Msg
view model =
    let
        -- Website theme
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
                    -- Home Page
                    Home ->
                        Html.map HomeMsg (Home.view model.homeModel)

                    -- BubbleSort Page
                    BubbleSort ->
                        -- Call BubbleSort to render
                        -- Pass current array state, Bool if it's running, and message wrapper
                            -- Message wrapper allows BubbleSort.elm to place buttons in relation to webpage
                        BubbleSort.view model.sortingAlgorithm model.running ControlMsg

                    SelectionSort ->
                        SelectionSort.view model.sortingAlgorithm model.running ControlMsg
                ]
            , Html.text ""
            , viewThemeToggle model
            ]
        ]

-- Top header (navbar) with dropdown for algorithms
viewHeader : Html Msg
viewHeader =
    div [ class "header" ]
        [ label [ class "dropdown-label" ] [ text "Algorithms:" ]
        , select [ class "dropdown", onInput SelectAlgorithm ]
            [ option [ value "" ] [ text "Home Page" ]
            , node "optgroup" [ attribute "label" "Comparison-based" ]
                [ option [ value "Bubble Sort" ] [ text "Bubble Sort" ]
                , option [ value "Insertion Sort" ] [ text "Insertion Sort" ]
                , option [ value "Selection Sort" ] [ text "Selection Sort" ]
                ]
            , node "optgroup" [ attribute "label" "Divide & Conquer" ]
                [ option [ value "Merge Sort" ] [ text "Merge Sort" ]
                , option [ value "Quick Sort" ] [ text "Quick Sort" ]
                ]
            , node "optgroup" [ attribute "label" "Heaps" ]
                [ option [ value "Heap Sort" ] [ text "Heap Sort" ]
                ]
            , node "optgroup" [ attribute "label" "Graphs" ]
                [ option [ value "Topological Sort" ] [ text "Topological Sort" ]
                ]
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
        ( icon, tooltip ) =
            if model.homeModel.theme == Home.Light then
                ( "☾", "Switch to Dark Mode" )
            else
                ( "☀", "Switch to Light Mode" )
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
        , subscriptions = subscriptions
        }
