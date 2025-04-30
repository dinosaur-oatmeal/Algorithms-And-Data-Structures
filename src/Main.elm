-- elm make src/Main.elm --output=elm.js
-- live-server
module Main exposing (main)

-- Imports for website to work
import Browser
import Browser.Navigation as Nav
import Html exposing (Html, div, text, label, select, option, node, button, ul, li, a)
import Html.Attributes exposing (class, value, attribute, title, href, target)
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
import SearchAlgorithms.BinarySearch as BinarySearch

-- Tree pages that can be visited
import Trees.TreeTraversal as TreeTraversal exposing (Msg(..))
import Trees.HeapType as HeapType exposing (Msg(..))

-- Graph pages that can be visited
import Graphs.Dijkstra as Dijkstra exposing(Msg(..))
import Graphs.MST as MST exposing(Msg(..))

import DataStructures.StackQueue as StackQueue exposing(Msg(..))

-- Model (info stored during interactions)
type alias Model =
    { key : Nav.Key
    -- Page we're visiting
    , currentPage : Page
    -- Call Home.elm model
    , homeModel : HomeState
    -- Call TreeTraversal.elm model
    , treeTraversalModel : TreeTraversal.Model
    -- Call HeapType.elm model
    , heapTypeModel : HeapType.Model
    -- Call Dijkstra.elm model
    , dijkstraModel : Dijkstra.Model
    -- Call MST.elm model
    , mstModel : MST.Model
    -- Call StackQueue.elm model
    , sqModel : StackQueue.Model
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
    | BinarySearchRoute
    | TreeRoute
    | HeapRoute
    | DijkstraRoute
    | MSTRoute
    | SQRoute

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
    | BinarySearch
    | TreeTraversal
    | HeapType
    | Dijkstra
    | MST
    | SQ

-- MESSAGES (all possible messages for hte program to receive)
type Msg
    -- Visit a new page
    = NavigateTo Page
    -- Update something on homepage (typing/array)
    | HomeMsg Home.Msg
    -- Update something on tree traversal page (type of algorithm/buttons)
    | TreeTraversalMsg TreeTraversal.Msg
    -- Update something on heap type page (type of heap/buttons)
    | HeapTypeMsg HeapType.Msg
    -- Update something on Dijkstra page
    | DijkstraMsg Dijkstra.Msg
    -- Update something on MST page
    | MSTMsg MST.Msg
    -- Update something on SQ page
    | SQMsg StackQueue.Msg
    -- Select and algorithm to view
    | SelectAlgorithm String
    -- Control buttons for algorithm
    | ControlMsg ControlMsg
    -- Timing for running the algorithm
    | Tick Time.Posix
    -- Initialize random array (sorts and searches)
    | GotRandomArray (List Int)
    -- Initialize ordered array (binary search)
    | GotOrderedArray (List Int)
    -- Initialize random target (searches)
    | GotRandomTarget Int
    -- Initializes random tree (traversals and heaps)
    | GotRandomTree (Tree)
    -- Initializes random graph with source and goal int (Dijkstra, Prim, and Kruskal)
    | GotRandomGraph (Graph, Int, Int)

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
        , Parser.map BinarySearchRoute (s "binary-search")
        , Parser.map TreeRoute (s "tree-traversal")
        , Parser.map HeapRoute (s "heap-type")
        , Parser.map DijkstraRoute (s "dijkstra")
        , Parser.map MSTRoute (s "mst")
        , Parser.map SQRoute (s "sq")
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

        -- BinarySearch Page
        Just BinarySearchRoute ->
            BinarySearch

        -- TreeTraversal Page
        Just TreeRoute ->
            TreeTraversal

        -- HeapType Page
        Just HeapRoute ->
            HeapType

        -- Dijkstra Page
        Just DijkstraRoute ->
            Dijkstra

        -- MST Page
        Just MSTRoute ->
            MST
        
        -- StackQueue Page
        Just SQRoute ->
            SQ

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
            , homeModel = defaultHomeState
            , treeTraversalModel = TreeTraversal.initModel
            , heapTypeModel = HeapType.initModel
            , dijkstraModel = Dijkstra.initModel
            , mstModel = MST.initModel
            , sqModel = StackQueue.initModel
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

        -- Heap Type updates point to HeapType.elm
        HeapTypeMsg heapMsg ->
            let
                ( newHeapTypeModel, heapCmd ) =
                    HeapType.update heapMsg model.heapTypeModel
            in
            ( { model | heapTypeModel = newHeapTypeModel }
            , Cmd.map HeapTypeMsg heapCmd
            )

        -- Dijkstra updates point to Dijkstra.elm
        DijkstraMsg dijkstraMsg ->
            let
                ( newDijkstraModel, dijkstraCmd ) =
                    Dijkstra.update dijkstraMsg model.dijkstraModel
            in
            ( { model | dijkstraModel = newDijkstraModel }
            , Cmd.map DijkstraMsg dijkstraCmd
            )

        -- MST updates point to MST.elm
        MSTMsg mstMsg ->
            let
                ( newMSTModel, mstCmd ) =
                    MST.update mstMsg model.mstModel
            in
            ( { model | mstModel = newMSTModel }
            , Cmd.map MSTMsg mstCmd
            )

        -- SQ updates point to StackQueue.elm
        SQMsg sqMsg ->
            let
                newSQModel =
                    StackQueue.update sqMsg model.sqModel
            in
            ( { model | sqModel = newSQModel }
            , Cmd.none
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

                "Binary Search" ->
                    ( { model
                        | currentPage = BinarySearch
                        , sortingAlgorithm = defaultSortingTrack []
                        , running = False
                    }
                    -- Batch ordered array generation and random target to find
                    , Cmd.batch
                        [ Random.generate GotRandomTarget randomTargetGenerator
                        , orderedListCmd GotOrderedArray
                        ]
                    )

                "Tree Traversal" ->
                    ( { model | currentPage = TreeTraversal
                            , sortingAlgorithm = defaultSortingTrack []
                            , running = False
                    }
                    -- Generate a new tree when selected
                    , Random.generate GotRandomTree (randomTreeGenerator 9 31)
                    )

                "Heap Type" ->
                    ( { model | currentPage = HeapType
                            , sortingAlgorithm = defaultSortingTrack []
                            , running = False
                    }
                    -- Generate a new tree when selected
                    , Random.generate GotRandomTree (randomTreeGenerator 9 30)
                    )

                "Dijkstra" ->
                    ( { model | currentPage = Dijkstra
                            , sortingAlgorithm = defaultSortingTrack []
                            , running = False
                    }
                    , Random.generate GotRandomGraph randomGraphGenerator
                    )

                "MST" ->
                    ( { model | currentPage = MST
                            , sortingAlgorithm = defaultSortingTrack []
                            , running = False
                    }
                    , Random.generate GotRandomGraph randomGraphGenerator
                    )

                "StacksQueues" ->
                    ( { model | currentPage = SQ
                            , sortingAlgorithm = defaultSortingTrack []
                            , running = False
                    }
                    , Cmd.none
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

                                -- Regenerate target and ordered array for BinarySearch
                                BinarySearch ->
                                    [ Random.generate GotRandomTarget randomTargetGenerator
                                    , orderedListCmd GotOrderedArray
                                    ]

                                -- Regenerate a new tree for traversals
                                TreeTraversal ->
                                    [ Random.generate GotRandomTree (randomTreeGenerator 9 31) ]

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

                        BinarySearch ->
                            let
                                updatedTrack = BinarySearch.binarySearchStep model.sortingAlgorithm
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

                        HeapType ->
                            let
                                (updatedHeapModel, heapCmd) =
                                    HeapType.update HeapifyStep model.heapTypeModel
                            in
                            ( { model | heapTypeModel = updatedHeapModel }
                            , Cmd.map HeapTypeMsg heapCmd
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

                    -- Searching pages
                    LinearSearch ->
                        let
                            updatedTrack = LinearSearch.linearSearchStep model.sortingAlgorithm
                        in
                        ( { model | sortingAlgorithm = updatedTrack }, Cmd.none )

                    BinarySearch ->
                            let
                                updatedTrack = BinarySearch.binarySearchStep model.sortingAlgorithm
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

                    -- Heap Page
                    HeapType ->
                            let
                                (updatedHeapModel, heapCmd) =
                                    HeapType.update HeapifyStep model.heapTypeModel
                            in
                            ( { model | heapTypeModel = updatedHeapModel }
                            , Cmd.map HeapTypeMsg heapCmd
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
        
        -- Generate an ordered array and add to sortingAlgorithm
        GotOrderedArray orderedList ->
            ( { model | sortingAlgorithm = defaultSortingTrack orderedList }
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
                        -- Set gap to targetValue
                            -- Needed for indices under array to work correctly
                        , gap = targetValue
                        -- Set minIndex to last one in array for highlighting
                        , minIndex = 29
                    }

                -- Update model to reflect updatedSortingAlgorithm
                updatedModel =
                    { model | sortingAlgorithm = updatedSortingAlgorithm }
            in
            ( updatedModel, Cmd.none )

        -- Cmd.map to return a main model like other cases
        GotRandomTree newTree ->
            case model.currentPage of
                -- Generate new tree in treeTraversalModel
                TreeTraversal ->
                    let
                        (newTreeModel, treeCmd) =
                            TreeTraversal.update (TreeTraversal.SetTree newTree) model.treeTraversalModel
                    in
                    ( { model | treeTraversalModel = newTreeModel }
                    , Cmd.map TreeTraversalMsg treeCmd
                    )

                -- Generate a new tree in heapTypeModel
                HeapType ->
                    let
                        (newHeapTypeModel, heapCmd) =
                            HeapType.update (HeapType.SetTree newTree) model.heapTypeModel
                    in
                    ( { model | heapTypeModel = newHeapTypeModel }
                    , Cmd.map HeapTypeMsg heapCmd
                    )

                -- Default to not not updating anything
                _ ->
                    ( model, Cmd.none )

        -- Cmd.map to return a main model like other cases
        GotRandomGraph triplet ->
            case model.currentPage of
                Dijkstra ->
                    let
                        ( newDijkstraModel, cmd ) =
                            -- Triplet is a (Graph, Int, Int) to be passed to SetGraph
                            Dijkstra.update (Dijkstra.SetGraph triplet) model.dijkstraModel
                    in
                    -- Update local model
                    ( { model | dijkstraModel = newDijkstraModel }
                    , Cmd.map DijkstraMsg cmd
                    )

                MST ->
                    let
                        -- Break apart triplet into its parts
                        ( graph, source, target ) = triplet
                        ( newMSTModel, cmd ) =
                            -- Ignore target value because we only need graph and source
                            MST.update (MST.SetGraph ( graph, source )) model.mstModel
                    in
                    ( { model | mstModel = newMSTModel }
                    , Cmd.map MSTMsg cmd
                    )

                -- Default to not not updating anything
                _ ->
                    ( model, Cmd.none )

-- SUBSCRIPTIONS
subscriptions : Model -> Sub Msg
subscriptions model =
    case model.currentPage of
        -- Redirect Home subscriptions to Home.elm
        Home ->
            Home.subscriptions model.homeModel
                |> Sub.map HomeMsg

        -- Redirect TreeTraversal subscriptions to TreeTraversal.elm
        TreeTraversal ->
            TreeTraversal.subscriptions model.treeTraversalModel
                |> Sub.map TreeTraversalMsg

        HeapType ->
            HeapType.subscriptions model.heapTypeModel
                |> Sub.map HeapTypeMsg

        Dijkstra ->
            Dijkstra.subscriptions model.dijkstraModel
                |> Sub.map DijkstraMsg

        MST ->
            MST.subscriptions model.mstModel
                |> Sub.map MSTMsg

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
                Light ->
                    "light-theme"

                Dark ->
                    "dark-theme"
    in
    Browser.Document "Algorithms & Data Structures"
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

                    BinarySearch ->
                        BinarySearch.view model.sortingAlgorithm model.running ControlMsg

                    -- Tree Traversal Page points to TreeTraversal.elm
                    TreeTraversal ->
                        Html.map TreeTraversalMsg (TreeTraversal.view model.treeTraversalModel)

                    HeapType ->
                        Html.map HeapTypeMsg (HeapType.view model.heapTypeModel)
                    
                    Dijkstra ->
                        Html.map DijkstraMsg (Dijkstra.view model.dijkstraModel)

                    MST ->
                        Html.map MSTMsg (MST.view model.mstModel)

                    SQ ->
                        Html.map SQMsg (StackQueue.view model.sqModel)
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
        -- Home button
        [ button [ class "home-button", onClick (NavigateTo Home) ]
            [ text "🏠" ]
        , div [ class "nav" ]
            -- Comparisons
            [ div [ class "dropdown-group" ]
                [ div [ class "dropdown-label" ] [ text "Comparison-based" ]
                , ul [ class "dropdown-content" ]
                    [ li [] 
                        [ button [ onClick (SelectAlgorithm "Bubble Sort") ] [ text "Bubble Sort" ] ]
                    , li []
                        [ button [ onClick (SelectAlgorithm "Selection Sort") ] [ text "Selection Sort" ] ]
                    , li []
                        [ button [ onClick (SelectAlgorithm "Insertion Sort") ] [ text "Insertion Sort" ] ]
                    , li []
                        [ button [ onClick (SelectAlgorithm "Shell Sort") ] [ text "Shell Sort" ] ]
                    ]
                ]
            
            -- Divide and Conquer
            , div [ class "dropdown-group" ]
                [ div [ class "dropdown-label" ] [ text "Divide & Conquer" ]
                , ul [ class "dropdown-content" ]
                    [ li [] 
                        [ button [ onClick (SelectAlgorithm "Merge Sort") ] [ text "Merge Sort" ] ]
                    , li []
                        [ button [ onClick (SelectAlgorithm "Quick Sort") ] [ text "Quick Sort" ] ]
                    ]
                ]

            -- Searches
            , div [ class "dropdown-group" ]
                [ div [ class "dropdown-label" ] [ text "Searches" ]
                , ul [ class "dropdown-content" ]
                    [ li [] 
                        [ button [ onClick (SelectAlgorithm "Linear Search") ] [ text "Linear Search" ] ]
                    , li []
                        [ button [ onClick (SelectAlgorithm "Binary Search") ] [ text "Binary Search" ] ]
                    ]
                ]
            
            -- Trees
            , div [ class "dropdown-group" ]
                [ div [ class "dropdown-label" ] [ text "Trees" ]
                , ul [ class "dropdown-content" ]
                    [ li []
                        [ button [ onClick (SelectAlgorithm "Tree Traversal") ] [ text "Traversals" ] ]
                    , li []
                        [ button [ onClick (SelectAlgorithm "Heap Type" ) ] [ text "Heaps" ] ]
                    ]
                ]

            -- Graphs
            , div [ class "dropdown-group" ]
                [ div [ class "dropdown-label" ] [ text "Graphs" ]
                , ul [ class "dropdown-content" ]
                    [ li []
                        [ button [ onClick (SelectAlgorithm "Dijkstra") ] [ text "Dijkstra's" ] ]
                    , li []
                        [ button [ onClick (SelectAlgorithm "MST") ] [ text "MSTs" ] ]
                    ]
                ]
            
            -- Data Structures
            , div [ class "dropdown-group" ]
                [ div [ class "dropdown-label" ] [ text "Data Structures" ]
                , ul [ class "dropdown-content" ]
                    [ li [] 
                        [ button [ onClick (SelectAlgorithm "StacksQueues") ] [ text "Stacks/Queues" ] ]
                    ]
                ]
            ]
        ]

-- Bottom right theme toggle
viewThemeToggle : Model -> Html Msg
viewThemeToggle model =
    let
        ( icon, tooltip ) =
            if model.homeModel.theme == Light then
                ( "☼", "Switch to Dark Mode" )
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
        [ text "An educational platform built by "
        , a
            -- Open GitHub profile in a new tab
            [ href "https://github.com/dinosaur-oatmeal"
            , target "_blank"
            -- Keep text white and underlined
            , class "underline"
            ]
            [ text "Will Maberry" ]
        ]


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
