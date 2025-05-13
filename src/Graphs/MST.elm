module Graphs.MST exposing (..)

-- HTML Imports
import Html exposing (Html, button, div, li, text, ul)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)

-- Needed for "Run" and "Pause"
import Time
import Random

-- Needed for algorithm
import Dict exposing (Dict)

-- Import necessary structure and functions
import MainComponents.Structs exposing (Graph, Edge, Union, unionInit, unionFind, unionCheck, randomGraphGenerator)

-- Import GraphVisualization for visualization
import Graphs.GraphVisualization as Visualization exposing (view)

-- Import for control buttons (used in view)
import MainComponents.Controls as Controls exposing (ControlMsg(..), view)

-- Types of minimum spanning trees
type MSTAlgorithm
    = Prim
    | Kruskal

-- Store all necessary data for walkthrough
type alias MSTState =
    -- Graph being processed
    { graph : Graph
    -- Edges in the MST
    , treeEdges : List Edge
    -- List of nodes already visited
    , visitedNodes : List Int
    -- Edge being processed
    , currentEdge : Maybe Edge
    -- Remaining edges to be processed
    , edgeQueue : List Edge
    -- Total cost once the MST is built
    , finalCost : Maybe Int
    -- Union for Kruskal
    , union : Union
    }

-- MODEL
type alias Model =
    -- Graph that's currently being displayed
    { graph : Graph
    -- List of states during algorithm
    , mstSteps : List MSTState
    -- Index in list of algorithm
    , index : Int
    -- Algorithm running or not (needed for Controls.elm)
    , running : Bool
    -- Algorithm selected to run
    , selectedAlgorithm : MSTAlgorithm
    -- Starting node for algorithm
    , startNode : Int
    }

type Msg
    -- Update graph t osomething new
    = GenerateGraph
    -- Update graph and source in model (needed in Main.elm for updates)
    | SetGraph ( Graph, Int )
    -- One step of MST
    | MSTStep
    -- Timing for running the algorithm
    | Tick Time.Posix
    -- Run Button
    | StartMST
    -- Pause Button
    | StopMST
    -- Reset Button
    | ResetGraph
    -- Choose Prim's algorithm
    | SelectPrim
    -- Choose Kruskal's algorithm
    | SelectKruskal

-- INIT
initModel : Model
initModel =
    -- No graph
    { graph =
        { nodes = []
        , edges = []
        }
    -- No steps done yet
    , mstSteps = []
    -- Start at first index in list
    , index = 0
    -- Running should be false
    , running = False
    -- Default to Prim's
    , selectedAlgorithm = Prim
    -- Start node for search
    , startNode = 0
    }

-- UPDATE
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        -- Generate a new graph
        GenerateGraph ->
            resetAndGenerateGraph model

        -- When a new graph is generated, the generator produces a new graph
        SetGraph ( newGraph, startNode ) ->
            let
                steps =
                    case model.selectedAlgorithm of
                        -- If Kruskal, generate steps
                        Kruskal ->
                            generateKruskalSteps newGraph

                        -- If Prim, default for now
                        Prim ->
                            generatePrimSteps newGraph startNode
            -- Update graph and steps
            in
            ( { model
                | graph = newGraph
                , startNode = startNode
                , mstSteps = steps
                , index = 0
                , running = False
              }
            , Cmd.none
            )

        -- One step of MST algorithm
        MSTStep ->
            let
                -- Increase index
                newIndex = model.index + 1
                totalSteps = List.length model.mstSteps
            in
            -- Update if more steps
            if newIndex < totalSteps then
                ( { model | index = newIndex }, Cmd.none )
            else
                -- Don't update at last step
                ( model, Cmd.none )

        -- Update when algorithm running
        Tick _ ->
            let
                -- Increase Index
                newIndex = model.index + 1
                totalSteps = List.length model.mstSteps
            in
            -- Update if more steps
            if newIndex < totalSteps then
                ( { model | index = newIndex }, Cmd.none )
            else
                ( { model | running = False }, Cmd.none )

        -- Run button
        StartMST ->
            ( { model | running = True }, Cmd.none )

        -- Pause button
        StopMST ->
            ( { model | running = False }, Cmd.none )

        -- Reset button
        ResetGraph ->
            resetAndGenerateGraph model

        -- Prim selected for algorithm
        SelectPrim ->
            let
                -- Generate new graph
                ( newModel, cmd ) = resetAndGenerateGraph model
            in
            ( { newModel | selectedAlgorithm = Prim }, cmd )

        -- Kruskal selected for algorithm
        SelectKruskal ->
            let
                -- Generate new graph
                ( newModel, cmd ) = resetAndGenerateGraph model
            in
            ( { newModel | selectedAlgorithm = Kruskal }, cmd )

-- Runs algorithm when selected
subscriptions : Model -> Sub Msg
subscriptions model =
    if model.running then
        Time.every 2000 Tick
    else
        Sub.none

-- VIEW
view : Model -> Html Msg
view model =
    let
        -- Find current step we're on in list
        maybeState =
            List.drop model.index model.mstSteps |> List.head

        -- Default to initial state if current step is invalid
        currentState =
            Maybe.withDefault (initialKruskalState model.graph) maybeState

        -- Name of algorithm
        algorithmName =
            case model.selectedAlgorithm of
                Kruskal -> "Kruskal's Algorithm"
                Prim -> "Prim's Algorithm"

        -- Only show cost once it's calculated
        costText =
            case currentState.finalCost of
                Just cost ->
                    " | Total Cost: " ++ String.fromInt cost

                Nothing ->
                    ""

        -- Print queue
        queueText =
            currentState.edgeQueue
                |> List.map (\edge -> "(" ++ String.fromInt edge.from ++ ", " ++ String.fromInt edge.to ++ ")")
                |> String.join ", "
    in
    div [ class "sort-page" ]
        [ -- Title
          div [ class "sort-title" ]
            [ text ("Minimum Spanning Tree") ]

        -- Description
        , div [ class "description" ]
            [ text (getDescription model.selectedAlgorithm) ]

        -- Update class to change button color
        , div [ class "traversal-controls" ]
            [ button
                [ class "traversal-button"
                , if model.selectedAlgorithm == Prim then class "selected" else class ""
                , onClick (SelectPrim)
                ]
                [ text "Prim's" ]
            , button
                [ class "traversal-button"
                , if model.selectedAlgorithm == Kruskal then class "selected" else class ""
                , onClick (SelectKruskal)
                ]
                [ text "Kruskal's" ]
            ]

        , -- Pass data needed to render SVG
          Visualization.view
            currentState.graph
            Nothing
            currentState.visitedNodes
            -- Map tree edges to correct format
            (List.map (\edge -> ( edge.from, edge.to )) currentState.treeEdges)
            []
            False

        -- Controls from Controls.elm
        , Controls.view model.running convertControlMsg

        -- Variables
        , div [] [ text ("Current Step: " ++ String.fromInt model.index ++ costText) ]
        , div [] [ text ("MST Edges: " ++ edgesToString currentState.treeEdges) ]

        -- Breakdown
        , div [ class "variable-list" ]
            [ ul []
                [ li [] [ text "Current Step: number of simulation steps taken." ]
                , li [] [ text "Total Cost: cumulative weight of the MST (when complete)." ]
                , li [] [ text "MST Edges: list of edges that have been added to the minimum spanning tree." ]
                ]
            ]

        -- Big-O-Notation
        , div [ class "big-o-title" ] [ text "Big(O) Notation" ]
        , div [ class "big-o-list" ]
            [ div [ class "big-o-item" ]
                [ div [] [ text "Prim's Algorithm:" ]
                , div [] [ text "O((V + E) log V)" ]
                ]
            , div [ class "big-o-item" ]
                [ div [] [ text "Kruskal's Algorithm:" ]
                , div [] [ text "O(E log E)" ]
                ]
            ]
        , div [ class "space-complexity" ]
            [ text "Space Complexity: O(V + E)" ]
        ]

-- Convert messages from Controls.elm to local messages
convertControlMsg : Controls.ControlMsg -> Msg
convertControlMsg control =
    case control of
        Controls.Run ->
            StartMST

        Controls.Pause ->
            StopMST

        Controls.Step ->
            MSTStep

        Controls.Reset ->
            ResetGraph

-- Reset graph (used for SetGraph and Reset)
resetAndGenerateGraph : Model -> ( Model, Cmd Msg )
resetAndGenerateGraph model =
    let
        cmd =
            Random.generate
                -- Get rid of target because it isn't needed
                (\( graph, source, target ) -> SetGraph ( graph, source ))
                randomGraphGenerator
    in
    ( { model | running = False, index = 0, mstSteps = [] }
    , cmd
    )

-- Change description based on algorithm
getDescription : MSTAlgorithm -> String
getDescription algorithm =
    case algorithm of
        Prim ->
            """Prim's algorithm constructs a Minimum Spanning Tree (MST) by expanding from a starting node,
                always selecting the cheapest edge that connects to an unvisited node.
                Using a priority queue, Prim's gradually forms a spanning tree with the minimal total weight."""

        Kruskal ->
            """Kruskal's algorithm builds a Minimum Spanning Tree (MST) by sorting
                edges by weight and adding them one by one, ensuring no cycles form.
                By utilizing a union structure, Kruskal's always selects the cheapest
                available edge to achieve the minimal total weight."""

-- Convert a single edge to a string (used in view)
edgeToString : Edge -> String
edgeToString edge =
    "(" ++ String.fromInt edge.from ++ ", " ++ String.fromInt edge.to ++ ", " ++ String.fromInt edge.weight ++ ")"

-- Convert a list of edges to a string (used in view)
edgesToString : List Edge -> String
edgesToString edges =
    "[" ++ String.join ", " (List.map edgeToString edges) ++ "]"

-- Initial state for Kruskal's
initialKruskalState : Graph -> MSTState
initialKruskalState graph =
    let
        -- Sort edges for cheapest ones to be visited first
        sortedEdges =
            List.sortBy (\e -> e.weight) graph.edges

        -- Initialize union to length of nodes in graph
        union =
            unionInit (List.length graph.nodes)
    in
    -- Default MSTState
    { graph = graph
    , treeEdges = []
    , visitedNodes = []
    , currentEdge = Nothing
    , edgeQueue = sortedEdges
    , finalCost = Nothing
    , union = union
    }

-- KRUSKAL'S

-- Generate all steps of Kruskal's and store in a list
generateKruskalSteps : Graph -> List MSTState
generateKruskalSteps graph =
    let
        -- Initial state for graph
        initialState =
            initialKruskalState graph

        -- Process each edge in queue
        states =
            List.foldl
                (\edge acc ->
                    let
                        -- Get current state (first) in queue
                        current =
                            List.head acc |> Maybe.withDefault initialState

                        -- Update current state with next edge
                        newState =
                            updateStateWithEdge current edge
                    in
                    -- Prepend new state to accumulator list
                    newState :: acc
                )
                -- Start folding with the initialState
                [ initialState ]
                -- list of all edges to be processed
                initialState.edgeQueue
    in
    -- Reverse list because we prepend new states
    List.reverse states

-- Process one edge and update MSTState
updateStateWithEdge : MSTState -> Edge -> MSTState
updateStateWithEdge state edge =
    let
        -- Find roots for each endpoint
        fromRoot =
            unionFind state.union edge.from
        toRoot =
            unionFind state.union edge.to

        ( newTreeEdges, newunion, newVisited ) =
            if fromRoot == toRoot then
                -- If node points to itself, discard it (loops)
                ( state.treeEdges, state.union, state.visitedNodes )
            else
                let
                    -- Prepend new edge and merge sets
                    updatedTreeEdges = edge :: state.treeEdges
                    updatedUnion = unionCheck state.union fromRoot toRoot

                    -- Helper to add a node if it isn't in a list
                    addNode nodes node =
                        -- Don't add node if it's already in list
                        if List.member node nodes then
                            nodes
                        -- Prepend list with new node
                        else
                            node :: nodes

                    -- Update visited list by adding both endpoints (not directed)
                    updatedVisited =
                        state.visitedNodes
                            -- Calls addNode helper function above
                            |> (\visited -> addNode visited edge.from)
                            |> (\visited -> addNode visited edge.to)

                in
                ( updatedTreeEdges, updatedUnion, updatedVisited )

        -- Remove edge from processing queue
        remainingEdges =
            case state.edgeQueue of
                _ :: tail -> tail
                [] -> []

        -- Subtract number of edges needed for MST
        totalEdgesNeeded =
            (List.length state.graph.nodes) - 1

        -- Find cost of the whole tree once the last edge is added
        cost =
            if List.length newTreeEdges == totalEdgesNeeded then
                Just (List.foldl (\e acc -> acc + e.weight) 0 newTreeEdges)
            else
                Nothing
    in
    -- Updated state
    { state
        | treeEdges = newTreeEdges
        , visitedNodes = newVisited
        , currentEdge = Just edge
        , edgeQueue = remainingEdges
        , finalCost = cost
        , union = newunion
    }

--PRIM'S

-- Initial start state for Prim's
initialPrimState : Graph -> Int -> MSTState
initialPrimState graph startNode =
    let
        -- Visited is just startNode
        visited =
            [ startNode ]

        -- All edges from start node in weight order
        outgoingEdges = edgesFromNode graph startNode
            |> List.sortBy .weight
    in
    { graph = graph
    , treeEdges = []
    , visitedNodes = visited
    , currentEdge = Nothing
    , edgeQueue = outgoingEdges
    , finalCost = Nothing
    -- Union not needed for Prim's
    , union = unionInit 0
    }

-- Generate all steps of Prim's and store in a list
generatePrimSteps : Graph -> Int -> List MSTState
generatePrimSteps graph startNode =
    let
        -- Initial state for graph (startNode will be root for tree)
        initialState =
            initialPrimState graph startNode

        -- Recursively build list of steps
        states = unfoldPrimSteps initialState []
    in
    -- Reverse list because we prepend new states
    List.reverse states

-- Recursive function to get states for Prim's
unfoldPrimSteps : MSTState -> List MSTState -> List MSTState
unfoldPrimSteps state accumulator =
    let
        -- Number of visited nodes
        visitedCount =
            List.length state.visitedNodes

        -- Number of total nodes in graph
        totalNodes =
            List.length state.graph.nodes
    in
    -- All nodes visited
    if visitedCount == totalNodes then
        let
            -- Calculate final cost for all edges in queue
            maybeCost =
                    Just <| List.foldl (\e accumulatorCost -> accumulatorCost + e.weight) 0 state.treeEdges

            -- Add final cost to final state
            finalState =
                { state | finalCost = maybeCost }
        in
        -- Prepend final state to accumulator list
        finalState :: accumulator
    else
        let
            -- Get next state to add to queue
            nextState = pickNextPrimEdge state
        in
            -- Recursively call function prepending states to accumulator list
            unfoldPrimSteps nextState (state :: accumulator)

-- Pick cheapest edge leading from a visited node to an unvisited one
pickNextPrimEdge : MSTState -> MSTState
pickNextPrimEdge state =
    -- Find cheapest edge that connects visited node to an unvisited one
    case findValidPrimEdge state.visitedNodes state.edgeQueue of
        Just edge ->
            let
                -- Determine which node is unvisited from edge
                newNode =
                    if List.member edge.from state.visitedNodes then
                        edge.to
                    else
                        edge.from

                -- Add newNode to list of visited nodes
                newVisited =
                    newNode :: state.visitedNodes

                -- Remove edge from queue (can't be selected again)
                filteredQueue =
                    List.filter ((/=) edge) state.edgeQueue

                -- Add edges from new node that go to unvisited nodes to queue
                newEdges =
                    edgesFromNode state.graph newNode
                        |> List.filter (\e ->
                            not (List.member e.to newVisited && List.member e.from newVisited)
                        )

                -- Combine list of edges and sort by weight
                updatedQueue =
                    List.sortBy .weight (filteredQueue ++ newEdges)

                -- Add processed edge to MST's treeEdges
                updatedMSTEdges =
                    edge :: state.treeEdges
            in
            -- Update struct to reflect changes
            { state
                | treeEdges = updatedMSTEdges
                , visitedNodes = newVisited
                , currentEdge = Just edge
                , edgeQueue = updatedQueue
            }

        -- Default to no update
        _ ->
            state

-- Find edge that connects visited to unvisited node
findValidPrimEdge : List Int -> List Edge -> Maybe Edge
findValidPrimEdge visited edges =
    -- Grab first node in list
    List.head
        -- Filter to only edges connecting a visited not to non-visited one
        (List.filter
            (\edge ->
                -- Check both ways because graph isn't directed
                (List.member edge.from visited && not (List.member edge.to visited))
                    || (List.member edge.to visited && not (List.member edge.from visited))
            )
            -- Sort list by weight of edges
            (List.sortBy .weight edges)
        )

-- Find all edges from a node
edgesFromNode : Graph -> Int -> List Edge
edgesFromNode graph node =
    -- Filter both ways because graph isn't directional
    List.filter (\edge -> edge.from == node || edge.to == node) graph.edges
