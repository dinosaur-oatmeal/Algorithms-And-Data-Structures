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
import Pages.InsertionSort as InsertionSort
import Pages.ShellSort as ShellSort

-- Custom structs imports (avoid circular import)
import Structs exposing (defaultSortingTrack, SortingTrack)

-- Algorithm control buttons (run/pause/step/reset)
import Controls exposing (ControlMsg(..))

-- Model (info stored during interactions)
type alias Model =
    { key : Nav.Key
    -- Page we're visiting
    , currentPage : Page
    -- Call Home.elm model
    , homeModel : Home.Model
    -- Generic sortingTrack data
    , sortingAlgorithm : SortingTrack
    -- Running or not
    , running : Bool
    }

-- ROUTE (How URLs map to different pages)
type Route
    = HomeRoute
    | BubbleSortRoute
    | SelectionSortRoute
    | InsertionSortRoute
    | ShellSortRoute


-- PAGE (different views for the website)
type Page
    = Home
    | BubbleSort
    | SelectionSort
    | InsertionSort
    | ShellSort


-- MESSAGES (all possible messages for hte program to receive)
type Msg
    -- Visit a new page
    = NavigateTo Page
    -- Update something on homepage (typing/array)
    | HomeMsg Home.Msg
    -- Select and algorithm to view
    | SelectAlgorithm String
    -- Control buttons for algorithm
    | ControlMsg ControlMsg
    -- Timing for running the algorithm
    | Tick Time.Posix

-- PARSER (define mapping between URL and Route types)
routeParser : Parser.Parser (Route -> a) a
routeParser =
    Parser.oneOf
        [ Parser.map HomeRoute top
        , Parser.map BubbleSortRoute (s "bubble-sort")
        , Parser.map SelectionSortRoute (s "selection-sort")
        , Parser.map InsertionSortRoute (s "insertion-sort")
        , Parser.map ShellSortRoute (s "shell-sort")
        ]

-- Convert URL into a page
parseUrl : Url -> Page
parseUrl url =
    case Parser.parse routeParser url of
        -- Home Page
        Just HomeRoute ->
            Home

        -- BubbleSort Page
        Just BubbleSortRoute ->
            BubbleSort

        -- SelectionSort Page
        Just SelectionSortRoute ->
            SelectionSort

        -- InsertionSort Page
        Just InsertionSortRoute ->
            InsertionSort

        -- ShellSOrt Page
        Just ShellSortRoute ->
            ShellSort

        -- Default to Home
        Nothing ->
            Home


-- INIT (initial state of program)
init : () -> Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    ( { key = key
      , currentPage = parseUrl url
      -- Initialize Home.model
      , homeModel = Home.initModel
      , sortingAlgorithm = defaultSortingTrack
      -- Sorting algorithm shouldn't start as running
      , running = False
      }
    , Cmd.none
    )


-- UPDATE
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        -- Visit specific page clicked on
        NavigateTo page ->
            ( { model
                | currentPage = page
                -- Reset sorting information and set running to false
                , sortingAlgorithm = defaultSortingTrack
                , running = False
              }
            , Cmd.none
            )

        -- Theme, typing effect, and background array point to Home.elm
        HomeMsg homeMsg ->
            let
                ( newHome, homeCmd ) =
                    Home.update homeMsg model.homeModel
            in
            ( { model | homeModel = newHome }
            , Cmd.map HomeMsg homeCmd
            )

        -- Algorithm selection from dropdown
        SelectAlgorithm algName ->
            case algName of
                "Bubble Sort" ->
                    ( { model | currentPage = BubbleSort
                              , sortingAlgorithm = defaultSortingTrack
                              , running = False
                      }
                    , Cmd.none
                    )

                "Selection Sort" ->
                    ( { model | currentPage = SelectionSort
                              , sortingAlgorithm = defaultSortingTrack
                              , running = False
                      }
                    , Cmd.none
                    )

                "Insertion Sort" ->
                    ( { model | currentPage = InsertionSort
                              , sortingAlgorithm = defaultSortingTrack
                              , running = False
                      }
                    , Cmd.none
                    )

                "Shell Sort" ->
                    ( { model | currentPage = ShellSort
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
                Run ->
                    ( { model | running = True }, Cmd.none )

                Pause ->
                    ( { model | running = False }, Cmd.none )

                Reset ->
                    ( { model
                        | sortingAlgorithm = defaultSortingTrack
                        , running = False
                      }
                    , Cmd.none
                    )

                Step ->
                    let
                        updatedTrack =
                            -- One step of specific algorithm depending on what currentPage is
                            case model.currentPage of
                                BubbleSort ->
                                    BubbleSort.bubbleSortStep model.sortingAlgorithm

                                SelectionSort ->
                                    SelectionSort.selectionSortStep model.sortingAlgorithm

                                InsertionSort ->
                                    InsertionSort.insertionSortStep model.sortingAlgorithm

                                ShellSort ->
                                    ShellSort.shellSortStep model.sortingAlgorithm

                                _ ->
                                    model.sortingAlgorithm
                    in
                    ( { model | sortingAlgorithm = updatedTrack }, Cmd.none )

        -- Running algorithm
        Tick _ ->
            if model.running then
                let
                    updatedTrack =
                        -- Run specific algorithm depending on what currentPage is
                        case model.currentPage of
                            BubbleSort ->
                                BubbleSort.bubbleSortStep model.sortingAlgorithm

                            SelectionSort ->
                                SelectionSort.selectionSortStep model.sortingAlgorithm

                            InsertionSort ->
                                InsertionSort.insertionSortStep model.sortingAlgorithm

                            ShellSort ->
                                ShellSort.shellSortStep model.sortingAlgorithm

                            _ ->
                                model.sortingAlgorithm
                in
                ( { model | sortingAlgorithm = updatedTrack }, Cmd.none )

            else
                -- Don't update if "Run" not active
                ( model, Cmd.none )


-- SUBSCRIPTIONS
subscriptions : Model -> Sub Msg
subscriptions model =
    case model.currentPage of
        -- Redirect Home subscriptions to Home.elm
        Home ->
            Home.subscriptions model.homeModel
                |> Sub.map HomeMsg

        -- Default to every 0.5 seconds if running flag True
            -- Used for running algorithms
        _ ->
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
            -- Call viewHeader for algorithm dropdown
            [ viewHeader
            , div [ class "page-content" ]
                [ case model.currentPage of
                    Home ->
                        -- Home Page
                        Html.map HomeMsg (Home.view model.homeModel)

                    -- BubbleSort Page
                    BubbleSort ->
                        -- Call BubbleSort to render
                        -- Pass current array state, Bool if it's running, and message wrapper
                            -- Message wrapper allows BubbleSort.elm to place buttons in relation to webpage
                        BubbleSort.view model.sortingAlgorithm model.running ControlMsg

                    SelectionSort ->
                        SelectionSort.view model.sortingAlgorithm model.running ControlMsg

                    InsertionSort ->
                        InsertionSort.view model.sortingAlgorithm model.running ControlMsg

                    ShellSort ->
                        ShellSort.view model.sortingAlgorithm model.running ControlMsg
                ]
            -- Pass model to toggle to show appropriate emoji
            , viewThemeToggle model
            -- Left side footer
            , viewFooter
            ]
        ]

-- Algorithm Dropdown
viewHeader : Html Msg
viewHeader =
    div [ class "header" ]
        [ label [ class "dropdown-label" ] [ text "Algorithms:" ]
        , select [ class "dropdown", onInput SelectAlgorithm ]
            [ option [ value "" ] [ text "Home Page" ]
            , node "optgroup" [ attribute "label" "Comparison-based" ]
                [ option [ value "Bubble Sort" ] [ text "Bubble Sort" ]
                , option [ value "Selection Sort" ] [ text "Selection Sort" ]
                , option [ value "Insertion Sort" ] [ text "Insertion Sort" ]
                , option [ value "Shell Sort" ] [ text "Shell Sort" ]
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

-- Footer with a String
viewFooter : Html Msg
viewFooter =
    div [ class "footer-left" ]
        [ text "An educational platform built by Will Maberry" ]

-- MAIN (handles application state in browser)
main : Program () Model Msg
main =
    Browser.application
        { init = init
        , onUrlChange = \url -> NavigateTo (parseUrl url)
        , onUrlRequest = \_ -> NavigateTo Home
        , update = update
        , subscriptions = subscriptions
        , view = view
        }
