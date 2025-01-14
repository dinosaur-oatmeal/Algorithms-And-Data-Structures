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

-- Random for random arrays on init and "Reset"
import Random exposing (Generator, generate)

-- Import Array for random Functions
import Array exposing (Array)

-- Custom structs imports (avoid circular import)
import MainComponents.Structs exposing (..)

-- Algorithm control buttons (run/pause/step/reset)
import MainComponents.Controls exposing (ControlMsg(..))

-- Home Page
import MainComponents.Home as Home

-- Sorting Algorithm pages that can be visited
import SortingAlgorithms.BubbleSort as BubbleSort
import SortingAlgorithms.SelectionSort as SelectionSort
import SortingAlgorithms.InsertionSort as InsertionSort
import SortingAlgorithms.ShellSort as ShellSort
import SortingAlgorithms.MergeSort as MergeSort
import SortingAlgorithms.QuickSort as QuickSort

-- Searching Algorithm pages that can be visited
import SearchAlgorithms.LinearSearch as LinearSearch

-- Tree Traversals page
import Trees.TreeTraversal as TreeTraversal exposing (Msg(..))

-- Model (info stored during interactions)
type alias Model =
    { key : Nav.Key
    -- Page we're visiting
    , currentPage : Page
    -- Call Home.elm model
    , homeModel : Home.Model
    -- Call TreeTraversal.elm model
    , treeTraversalModel : TreeTraversal.Model
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
    | MergeSortRoute
    | QuickSortRoute
    | LinearSearchRoute
    | TreeRoute

-- PAGE (different views for the website)
type Page
    = Home
    | BubbleSort
    | SelectionSort
    | InsertionSort
    | ShellSort
    | MergeSort
    | QuickSort
    | LinearSearch
    | TreeTraversal

-- MESSAGES (all possible messages for hte program to receive)
type Msg
    -- Visit a new page
    = NavigateTo Page
    -- Update something on homepage (typing/array)
    | HomeMsg Home.Msg
    -- Update something on tree traversal page (type of algorithm/buttons)
    | TreeTraversalMsg TreeTraversal.Msg
    -- Select and algorithm to view
    | SelectAlgorithm String
    -- Control buttons for algorithm
    | ControlMsg ControlMsg
    -- Timing for running the algorithm
    | Tick Time.Posix
    -- Initialize random array (sorts and searches)
    | GotRandomArray (List Int)
    -- Initialize random target (searches)
    | GotRandomTarget Int
    -- Initializes random tree (traversals)
    | GotRandomTree (Tree)

-- PARSER (define mapping between URL and Route types)
routeParser : Parser.Parser (Route -> a) a
routeParser =
    Parser.oneOf
        [ Parser.map HomeRoute top
        , Parser.map BubbleSortRoute (s "bubble-sort")
        , Parser.map SelectionSortRoute (s "selection-sort")
        , Parser.map InsertionSortRoute (s "insertion-sort")
        , Parser.map ShellSortRoute (s "shell-sort")
        , Parser.map MergeSortRoute (s "merge-sort")
        , Parser.map QuickSortRoute (s "quick-sort")
        , Parser.map LinearSearchRoute (s "linear-search")
        , Parser.map TreeRoute (s "tree-traversal")
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

        -- ShellSort Page
        Just ShellSortRoute ->
            ShellSort
        
        -- MergeSort Page
        Just MergeSortRoute ->
            MergeSort

        -- QuickSort Page
        Just QuickSortRoute ->
            QuickSort

        -- LinearSearch Page
        Just LinearSearchRoute ->
            LinearSearch

        -- TreeTraversal Page
        Just TreeRoute ->
            TreeTraversal

        -- Default to Home
        _ ->
            Home

-- INIT (initial state of program)
init : () -> Url -> Nav.Key -> (Model, Cmd Msg)
init _ url key =
    let
        model =
            { key = key
            , currentPage = parseUrl url
            , homeModel = Home.initModel
            , treeTraversalModel = TreeTraversal.initModel
            , sortingAlgorithm = defaultSortingTrack []
            , running = False
            }
    in
    ( model, Cmd.none )

-- UPDATE
    -- Tree updates are in TreeTraversal.elm
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        -- Visit specific page clicked on
        NavigateTo page ->
            ( { model
                | currentPage = page
                -- Reset sorting information and set running to false
                , sortingAlgorithm = defaultSortingTrack []
                , running = False
              }
            , Cmd.none
            )

        -- Theme, typing effect, and background array point to Home.elm
            -- Cmd.map wraps submodel messages into a Main model message
        HomeMsg homeMsg ->
            let
                ( newHome, homeCmd ) =
                    Home.update homeMsg model.homeModel
            in
            ( { model | homeModel = newHome }
            , Cmd.map HomeMsg homeCmd
            )

        -- Tree Traversal updates point to TreeTraversal.elm
        TreeTraversalMsg treeMsg ->
            let
                ( newTreeTraversalModel, treeCmd ) =
                    TreeTraversal.update treeMsg model.treeTraversalModel
            in
            ( { model | treeTraversalModel = newTreeTraversalModel }
            , Cmd.map TreeTraversalMsg treeCmd
            )

        -- Algorithm selection from dropdown
        SelectAlgorithm algName ->
            case algName of
                "Bubble Sort" ->
                    ( { model | currentPage = BubbleSort
                                -- Initialize to empty array
                              , sortingAlgorithm = defaultSortingTrack []
                              , running = False
                      }
                    -- Call to generate random array
                    , Random.generate GotRandomArray randomListGenerator
                    )

                "Selection Sort" ->
                    ( { model | currentPage = SelectionSort
                              , sortingAlgorithm = defaultSortingTrack []
                              , running = False
                      }
                    , Random.generate GotRandomArray randomListGenerator
                    )

                "Insertion Sort" ->
                    ( { model | currentPage = InsertionSort
                              , sortingAlgorithm = defaultSortingTrack []
                              , running = False
                      }
                    , Random.generate GotRandomArray randomListGenerator
                    )

                "Shell Sort" ->
                    ( { model | currentPage = ShellSort
                              , sortingAlgorithm = defaultSortingTrack []
                              , running = False
                      }
                    , Random.generate GotRandomArray randomListGenerator
                    )

                "Merge Sort" ->
                    ( { model | currentPage = MergeSort
                              , sortingAlgorithm = defaultSortingTrack []
                              , running = False
                      }
                    , Random.generate GotRandomArray randomListGenerator
                    )

                "Quick Sort" ->
                    ( { model | currentPage = QuickSort
                              , sortingAlgorithm = defaultSortingTrack []
                              , running = False
                      }
                    , Random.generate GotRandomArray randomListGenerator
                    )

                "Linear Search" ->
                    ( { model | currentPage = LinearSearch
                            , sortingAlgorithm = defaultSortingTrack []
                            , running = False
                    }
                    -- Batch random array generation and random target to find
                    , Cmd.batch
                        [ Random.generate GotRandomTarget randomTargetGenerator
                        , Random.generate GotRandomArray randomListGenerator
                        ]
                    )

                "Tree Traversal" ->
                    ( { model | currentPage = TreeTraversal
                            , sortingAlgorithm = defaultSortingTrack []
                            , running = False
                    }
                    -- Generate a new tree when selected
                    , Random.generate GotRandomTree randomTreeGenerator
                    )

                -- Default to home for algorithms not yet added
                _ ->
                    ( { model | currentPage = Home
                              , sortingAlgorithm = defaultSortingTrack []
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

                -- Multiple versions of "Reset" depending on what page
                Reset ->
                    let
                        resetCmds =
                            case model.currentPage of
                                -- Regenerate array and target for LinearSearch
                                LinearSearch ->
                                    [ Random.generate GotRandomTarget randomTargetGenerator
                                    , Random.generate GotRandomArray randomListGenerator
                                    ]

                                -- Regenerate a new tree for traversals
                                TreeTraversal ->
                                    [ Random.generate GotRandomTree randomTreeGenerator ]

                                -- Only regenerate array for sorting
                                _ ->
                                    [ Random.generate GotRandomArray randomListGenerator ]
                    in
                    ( { model
                        | sortingAlgorithm = defaultSortingTrack []
                        , running = False
                    }
                    -- Batch resetCmds because there may be more than one command executed
                    , Cmd.batch resetCmds
                    )


                Step ->
                    -- All cases should return ( Model, Cmd.msg )
                    case model.currentPage of
                        BubbleSort ->
                            let
                                updatedTrack = BubbleSort.bubbleSortStep model.sortingAlgorithm
                            in
                            ( { model | sortingAlgorithm = updatedTrack }, Cmd.none )

                        SelectionSort ->
                            let
                                updatedTrack = SelectionSort.selectionSortStep model.sortingAlgorithm
                            in
                            ( { model | sortingAlgorithm = updatedTrack }, Cmd.none )

                        InsertionSort ->
                            let
                                updatedTrack = InsertionSort.insertionSortStep model.sortingAlgorithm
                            in
                            ( { model | sortingAlgorithm = updatedTrack }, Cmd.none )

                        ShellSort ->
                            let
                                updatedTrack = ShellSort.shellSortStep model.sortingAlgorithm
                            in
                            ( { model | sortingAlgorithm = updatedTrack }, Cmd.none )

                        MergeSort ->
                            let
                                updatedTrack = MergeSort.mergeSortStep model.sortingAlgorithm
                            in
                            ( { model | sortingAlgorithm = updatedTrack }, Cmd.none )

                        QuickSort ->
                            let
                                updatedTrack = QuickSort.quickSortStep model.sortingAlgorithm
                            in
                            ( { model | sortingAlgorithm = updatedTrack }, Cmd.none )

                        LinearSearch ->
                            let
                                updatedTrack = LinearSearch.linearSearchStep model.sortingAlgorithm
                            in
                            ( { model | sortingAlgorithm = updatedTrack }, Cmd.none )

                        TreeTraversal ->
                            let
                                (updatedTreeModel, treeCmd) =
                                    TreeTraversal.update TraversalStep model.treeTraversalModel
                            in
                            ( { model | treeTraversalModel = updatedTreeModel }
                            , Cmd.map TreeTraversalMsg treeCmd
                            )

                        _ ->
                            ( model, Cmd.none )

        -- Running algorithm
        Tick _ ->
            if model.running then
                case model.currentPage of
                    -- Sorting pages
                    BubbleSort ->
                        let
                            updatedTrack = BubbleSort.bubbleSortStep model.sortingAlgorithm
                        in
                        ( { model | sortingAlgorithm = updatedTrack }, Cmd.none )

                    SelectionSort ->
                        let
                            updatedTrack = SelectionSort.selectionSortStep model.sortingAlgorithm
                        in
                        ( { model | sortingAlgorithm = updatedTrack }, Cmd.none )

                    InsertionSort ->
                            let
                                updatedTrack = InsertionSort.insertionSortStep model.sortingAlgorithm
                            in
                            ( { model | sortingAlgorithm = updatedTrack }, Cmd.none )

                    ShellSort ->
                        let
                            updatedTrack = ShellSort.shellSortStep model.sortingAlgorithm
                        in
                        ( { model | sortingAlgorithm = updatedTrack }, Cmd.none )

                    MergeSort ->
                        let
                            updatedTrack = MergeSort.mergeSortStep model.sortingAlgorithm
                        in
                        ( { model | sortingAlgorithm = updatedTrack }, Cmd.none )

                    QuickSort ->
                        let
                            updatedTrack = QuickSort.quickSortStep model.sortingAlgorithm
                        in
                        ( { model | sortingAlgorithm = updatedTrack }, Cmd.none )

                    LinearSearch ->
                        let
                            updatedTrack = LinearSearch.linearSearchStep model.sortingAlgorithm
                        in
                        ( { model | sortingAlgorithm = updatedTrack }, Cmd.none )

                    -- Tree traversal page
                    TreeTraversal ->
                        let
                            (updatedTreeModel, treeCmd) =
                                TreeTraversal.update TraversalStep model.treeTraversalModel
                        in
                        -- Return (Model, Cmd Msg) for TreeTraversal
                        ( { model | treeTraversalModel = updatedTreeModel }
                        , Cmd.map TreeTraversalMsg treeCmd
                        )

                    _ ->
                        ( model, Cmd.none )

            else
                -- Don't update if "Run" not active
                ( model, Cmd.none )

        -- Generate new array order and add to sortingAlgorithm
        GotRandomArray list ->
            let
                newTrack = defaultSortingTrack list
            in
            ( { model | sortingAlgorithm = defaultSortingTrack list }
            , Cmd.none
            )

        -- Generate new target index in model's sortingAlgorithm's currentIndex
        GotRandomTarget newTarget ->
            let
                -- Current SortingAlgorithm
                currentSortingAlgorithm =
                    model.sortingAlgorithm

                -- Updated SortingAlgorithm
                updatedSortingAlgorithm =
                    let
                        array = currentSortingAlgorithm.array
                        -- Get value at new target index
                        targetValue =
                            case Array.get newTarget array of
                                Just value -> value

                                -- Default to 0 (not found in array)
                                _ -> 0
                    in
                    { currentSortingAlgorithm
                        | array = array
                        , outerIndex = 0
                        , currentIndex = newTarget
                        , sorted = False
                        -- Set minIndex to targetValue
                            -- Needed for indices under array to work correctly
                        , minIndex = targetValue
                    }

                -- Update model to reflect updatedSortingAlgorithm
                updatedModel =
                    { model | sortingAlgorithm = updatedSortingAlgorithm }
            in
            ( updatedModel, Cmd.none )

        -- Generate new tree in treeTraversalModel
            -- Cmd.map to return a main model like other cases
        GotRandomTree newTree ->
            let 
                (newTreeModel, treeCmd) =
                    TreeTraversal.update (TreeTraversal.SetTree newTree) model.treeTraversalModel
            in
            ( { model | treeTraversalModel = newTreeModel }
            , Cmd.map TreeTraversalMsg treeCmd
            )

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

                    MergeSort ->
                        MergeSort.view model.sortingAlgorithm model.running ControlMsg

                    QuickSort ->
                        QuickSort.view model.sortingAlgorithm model.running ControlMsg

                    LinearSearch ->
                        LinearSearch.view model.sortingAlgorithm model.running ControlMsg

                    -- Tree Traversal Page points to TreeTraversal.elm
                    TreeTraversal ->
                        Html.map TreeTraversalMsg (TreeTraversal.view model.treeTraversalModel)
                ]
            -- Pass model to toggle to show appropriate emoji
            , viewThemeToggle model
            -- Left side footer
            , viewFooter
            ]
        ]

------------------------------
-- ON EVERY PAGE ON WEBSITE --
------------------------------

-- Algorithm dropdown with buttons for pages
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
            , node "optgroup" [ attribute "label" "Searching" ]
                [ option [ value "Linear Search" ] [ text "Linear Search" ] ]
            , node "optgroup" [ attribute "label" "Trees" ]
                [ option [ value "Tree Traversal" ] [ text "Tree Traversals" ] ]
            ]
        ]

-- Bottom right theme toggle
viewThemeToggle : Model -> Html Msg
viewThemeToggle model =
    let
        ( icon, tooltip ) =
            if model.homeModel.theme == Home.Light then
                ( "☀", "Switch to Dark Mode" )
            else
                ( "☾", "Switch to Light Mode" )
    in
    div [ class "theme-toggle-container" ]
        [ button
            [ class "theme-toggle-btn"
            -- Call Home.elm if clicked
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
