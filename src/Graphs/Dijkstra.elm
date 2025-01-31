module Graphs.Dijkstra exposing (..)

-- HTML Imports
import Html exposing (Html, div, button, text)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)

-- Needed for "Run" and "Pause"
import Time
import Random

-- Import necessary structure to track state
import MainComponents.Structs exposing (Graph, GraphNode, Edge, randomGraphGenerator)

-- Import GraphVisualization for visualization
import Graphs.GraphVisualization as Visualization exposing (view)

-- Import for control buttons (used in view)
import MainComponents.Controls as Controls exposing (ControlMsg(..), view)

-- Graph, list of visited nodes, and current node being looked at
type alias DijkstraState =
    { graph : Graph
    , visitedNodes : List Int
    , currentNode : Maybe Int
    }

-- MODEL
type alias Model =
    -- Graph that is currently being displayed
    { graph : Graph
    -- List of states during algorithm
    , dijkstraSteps : List DijkstraState
    -- Index in list of algorithm
    , index : Int
    -- Algorithm running or not (needed for Controls.elm)
    , running : Bool
    }

type Msg
    -- Update graph to something new
    = GenerateGraph
    -- Update graph in model (needed in Main.elm for updates)
    | SetGraph Graph
    -- One step of Dijkstra's
    | DijkstraStep
    -- Timing for running the algorithm
    | Tick Time.Posix
    -- Run Button
    | StartDijkstra
    -- Stop Button
    | StopDijkstra
    -- Reset Button
    | ResetGraph

-- INIT
initModel : Model
initModel =
    -- No graph
    { graph =
        { nodes = []
        , edges = []
        }
    -- No steps done yet
    , dijkstraSteps = []
    -- Start at first index in list
    , index = 0
    -- Running should be false
    , running = False
    }

-- UPDATE
update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        -- Generate a new graph
        GenerateGraph ->
            resetAndGenerateGraph model

        -- Needed for Main.elm when page selected
        SetGraph newGraph ->
            let
                steps = buildDijkstraSteps newGraph
            in
            ( { model
                | graph = newGraph
                , dijkstraSteps = steps
                , index = 0
                , running = False
              }
            , Cmd.none
            )

        -- One step of Dijkstra's
        DijkstraStep ->
            let
                -- Increase index
                newIndex =
                    model.index + 1

                totalSteps =
                    List.length model.dijkstraSteps
            in
            -- Update if more steps
            if newIndex < totalSteps then
                ( { model | index = newIndex }, Cmd.none )
            else
                -- don't update at last step
                ( model, Cmd.none )

        -- Update when algorithm running
        Tick _ ->
            let
                -- Increase index
                newIndex =
                    model.index + 1
                totalSteps =
                    List.length model.dijkstraSteps
            in
            -- Update if more steps
            if newIndex < totalSteps then
                ( { model | index = newIndex }, Cmd.none )
            else
                -- Turn off when last step hit
                ( { model | running = False }, Cmd.none )

        -- Run button
        StartDijkstra ->
            ( { model | running = True }, Cmd.none )

        -- Pause Button
        StopDijkstra ->
            ( { model | running = False }, Cmd.none )

        -- Reset Button
        ResetGraph ->
            resetAndGenerateGraph model

-- Runs algorithm when selected
subscriptions : Model -> Sub Msg
subscriptions model =
    if model.running then
        -- Update every 2 seconds
        Time.every 2000 Tick
    else
        Sub.none

-- VIEW
view : Model -> Html Msg
view model =
    div [ class "sort-page" ]
        [ -- Title
            div [ class "sort-title" ]
            [ text "Dijkstra's Algorithm" ]

            , div [ class "description" ]
                [ text "Dijkstra's algorithm is a graph search algorithm used to find the shortest path between nodes in a weighted graph." ]
            , let
                -- Show current snapshot or fall back to a default
                maybeCurrentStep =
                    List.drop model.index model.dijkstraSteps
                        |> List.head

                currentState =
                    Maybe.withDefault
                        { graph = model.graph
                        , visitedNodes = []
                        , currentNode = Nothing
                        }
                        maybeCurrentStep
            in
            -- Visualization: pass highlights to your GraphVisualization
            Visualization.view
                currentState.graph
                currentState.currentNode
                currentState.visitedNodes
                []
                False
            
            -- The run/pause/step/reset controls from your shared Controls module
            , Controls.view model.running convertControlMsg

            -- Show the "step" index
            , div [] [ text ("Step: " ++ String.fromInt model.index) ]

            -- Big-O Notation
            , div [ class "big-o-title" ]
                [ text """Big(O) Notation""" ]
            , div [ class "big-o-list" ]
                [ div [ class "big-o-item" ]
                    [ div [] [ text "Best-Case" ]
                    , div [] [ text "O((V + E) log V)" ]
                    ]
                , div [ class "big-o-item" ]
                    [ div [] [ text "Average-Case" ]
                    , div [] [ text "O((V + E) log V)" ]
                    ]
                , div [ class "big-o-item" ]
                    [ div [] [ text "Worst-Case" ]
                    , div [] [ text "O(n²)" ]
                    ]
                ]

            , div [ class "space-complexity" ]
                [ text "Space Complexity: O(V) or O(V + E)" ]
        ]

-- Convert messages from Controls.elm to local messages
convertControlMsg : ControlMsg -> Msg
convertControlMsg control =
    case control of
        Run ->
            StartDijkstra

        Pause ->
            StopDijkstra

        Step ->
            DijkstraStep

        Reset ->
            ResetGraph

-- Reset graph (used for SetGraph and Reset)
resetAndGenerateGraph : Model -> (Model, Cmd Msg)
resetAndGenerateGraph model =
    let
        -- Command to generate a new random graph
        cmd = Random.generate SetGraph (randomGraphGenerator)
    in
    ( { model
        | running = False
        , index = 0
        , dijkstraSteps = []
      }
    , cmd
    )


-- Build a list of steps later
buildDijkstraSteps : Graph -> List DijkstraState
buildDijkstraSteps g =
    []
