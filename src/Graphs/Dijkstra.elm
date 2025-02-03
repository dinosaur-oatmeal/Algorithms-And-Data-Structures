module Graphs.Dijkstra exposing (..)

-- HTML Imports
import Html exposing (Html, div, button, text, ul, li)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)

-- Needed for "Run" and "Pause"
import Time
import Random

-- Needed for algorithm
import Set exposing (Set)
import Dict exposing (Dict)

-- Import necessary structure to track state
import MainComponents.Structs exposing (Graph, GraphNode, Edge, randomGraphGenerator)

-- Import GraphVisualization for visualization
import Graphs.GraphVisualization as Visualization exposing (view)

-- Import for control buttons (used in view)
import MainComponents.Controls as Controls exposing (ControlMsg(..), view)

-- Store all necessary data for walkthrough together
type alias DijkstraState =
    -- Graph being processed
    { graph : Graph
    -- List of nodes that have been visited
    , visitedNodes : List Int
    -- Current node being processed
    , currentNode : Maybe Int
    -- Stores node IDs with their shortest paths
    , distances : Dict Int Int
    -- Maps nodes to their previous nodes
        -- needed for reconstructing final path
    , previous : Dict Int Int
    -- Priority queue that stores unvisited nodes with their distances
        -- Shows us options that we could take and in ascending order
    , options : List ( Int, Int )
    -- Shortest path from source to target
    , finalCost : Maybe Int
    -- List of edges that were explored
        -- Needed for highlighting
    , traversedEdges : List (Int, Int)
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
    -- Source node that we'll start at
    , source : Maybe Int
    -- Target node that we'll traverse to
    , target : Maybe Int
    }

type Msg
    -- Update graph to something new
    = GenerateGraph
    -- Update graph, source, and target in model (needed in Main.elm for updates)
    | SetGraph (Graph, Int, Int)
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
    -- No source node because no graph
    , source = Nothing
    -- No target node because no graph
    , target = Nothing
    }

-- UPDATE
update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        -- Generate a new graph
        GenerateGraph ->
            resetAndGenerateGraph model

        -- When a new graph is generated, the generator produces a triple (graph, source, target).
            -- Needed for Main.elm when page selected
        SetGraph (newGraph, sourceId, targetId) ->
            ( { model
                | graph = newGraph
                , source = Just sourceId
                , target = Just targetId
                -- Build list of states for Dijkstra (similar to HeapType.elm)
                , dijkstraSteps = simulateDijkstra newGraph sourceId targetId
                , index = 0
                , running = False
              }
            , Cmd.none
            )

        -- One step of Dijkstra algorithm
        DijkstraStep ->
            let
                -- Increase index
                newIndex = model.index + 1
                totalSteps = List.length model.dijkstraSteps
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
                -- Increase index
                newIndex = model.index + 1
                totalSteps = List.length model.dijkstraSteps
            in
            -- Update if more steps
            if newIndex < totalSteps then
                ( { model | index = newIndex }, Cmd.none )
            else
                ( { model | running = False }, Cmd.none )

        -- Run button
        StartDijkstra ->
            ( { model | running = True }, Cmd.none )

        -- Pause button
        StopDijkstra ->
            ( { model | running = False }, Cmd.none )

        -- Reset button
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
    let
        -- Find current step we're on in list
        maybeCurrentStep =
            List.drop model.index model.dijkstraSteps |> List.head

        currentState =
            -- Default if current step invalid
            Maybe.withDefault
                { graph = model.graph
                , visitedNodes = []
                , currentNode = Nothing
                , distances = Dict.empty
                , previous = Dict.empty
                , options = []
                , finalCost = Nothing
                , traversedEdges = []
                }
                maybeCurrentStep

        -- Renders priority queue to help with visualization
        queueText : String
        queueText =
            -- (#, #)
            currentState.options
                |> List.map (\(node, cost) -> "(" ++ String.fromInt node ++ ", " ++ String.fromInt cost ++ ")")
                |> String.join ", "

        -- Check if a target has been reached
        finalRouteEdges =
            case ( currentState.finalCost, model.source, model.target ) of
                -- Target found so track the path from source to target for green highlighting
                ( Just _, Just src, Just tgt ) ->
                    let
                        nodePath = getPath currentState.previous src tgt
                    in
                    pairs nodePath

                -- Default to no target path found (no green highlights)
                _ ->
                    []
    in
    div [ class "sort-page" ]
        [ -- Title
            div [ class "sort-title" ]
            [ text "Dijkstra's Algorithm" ]

        -- Description
        , div [ class "description" ]
            [ text """Dijkstra's algorithm traverses weighted graphs, finding the shortest path between a source node and target node.
                This algorithm implements a priority queue, selecting the closest unvisited node until the target node is found.
                By utilizing a priority queue, the most optimal path between the source node and target node is always found first.""" ]
        
        -- Pass data needed to render SVG
        , Visualization.view
            currentState.graph
            currentState.currentNode
            currentState.visitedNodes
            currentState.traversedEdges
            finalRouteEdges
            False

        -- Controls from Controls.elm
        , Controls.view model.running convertControlMsg

        -- Variables
        , div [] [ text ("Current Step: " ++ String.fromInt model.index
                        ++ " | Source: " ++ (Maybe.withDefault "None" (Maybe.map String.fromInt model.source))
                        ++ " | Target: " ++ (Maybe.withDefault "None" (Maybe.map String.fromInt model.target))
                        -- Track total cost from source -> target once target is found
                        ++ case currentState.finalCost of
                            Just cost ->
                                " | Total Cost: " ++ String.fromInt cost

                            _ ->
                                ""
                    )
                ]
        , div [] [ text ("Queue: " ++ queueText) ]
        
        -- Breakdown
        , div [ class "variable-list" ]
              [ ul []
                  [ li [] [ text "Current Step: number of steps taken in the traversal." ]
                  , li [] [ text "Source: the starting node in the graph for the search." ]
                  , li [] [ text "Target: the node we're trying to find the optimal path to from the source node." ]
                  , ul []
                          [ li [] [ text "Total Cost: final cost to get from source node to the target node." ] ]
                  , li [] [ text "Queue: list in ascending order of weights of next edges to search." ]
                  ]
              ]

        -- Big-O Notation
        , div [ class "big-o-title" ] [ text "Big(O) Notation" ]
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
        cmd = Random.generate SetGraph randomGraphGenerator
    in
    ( { model
        | running = False
        , index = 0
        , dijkstraSteps = []
      }
    , cmd
    )

getNeighbors : Graph -> Int -> List ( Int, Int )
getNeighbors graph node =
    graph.edges
        -- Filter edge list to only find ones that connect to node
        |> List.filter (\edge -> edge.from == node || edge.to == node)
        
        -- Map edge to (neighborNodeID, edgeWeight)
        |> List.map
            (\edge ->
                -- Node is edge.from
                if edge.from == node then
                    ( edge.to, edge.weight )
                -- Node is edge.to
                else
                    ( edge.from, edge.weight )
            )

-- Find path from target -> source
getPath : Dict Int Int -> Int -> Int -> List Int
getPath previous source target =
    -- Source is the target (never happens)
    if source == target then
        [ source ]
    else
        case Dict.get target previous of
            -- Recursively walk the path from target node toward source node
            Just parent ->
                getPath previous source parent ++ [ target ]

            -- Default to return no path found (never used)
            _ ->
                []

-- Convert a list into pairs
    -- [1, 2, 3, 4] -> [(1, 2), (2, 3), (3, 4)]
pairs : List a -> List (a, a)
pairs list =
    case list of
        a :: b :: rest ->
            ( a, b ) :: pairs (b :: rest)
        _ ->
            []

-- Easy function to call that returns a list of states to be looked through for visualizations
simulateDijkstra : Graph -> Int -> Int -> List DijkstraState
simulateDijkstra graph source target =
    let
        -- Dictionary that maps ever node's ID to initial distance
        initialDistances =
            graph.nodes
                |> List.foldl
                    (\node dict ->
                        -- 0 if node is source or 10000 (infinity)
                        Dict.insert node.id (if node.id == source then 0 else 10000) dict
                    )
                    Dict.empty

        -- Empty dictionary because nothing has happened
        initialPrevious =
            Dict.empty

        -- Empty queue because nothing has happened
        initialQueue =
            [ ( source, 0 ) ]

        -- No nodes visited yet
        initialVisited =
            Set.empty
    in
    -- Call simulate with initial values
    simulate graph initialDistances initialPrevious initialQueue initialVisited [] [] target source

{- Does one full step of Dijkstra algorithm and returns a list of the states
    Graph, initial distances: Dict Int Int, initial previous: Dict Int, Int, initial queue: List (Int, Int)
    visited set: Set Int, steps so far: List DijkstraState, traversed edges: List(Int, Int)
    target: Int, source: int, output: DijkstraState List -}
simulate : Graph -> Dict Int Int -> Dict Int Int -> List (Int, Int) ->
    Set Int -> List DijkstraState -> List (Int, Int) ->
    Int -> Int -> List DijkstraState
simulate graph distances previous queue visited steps traversedEdges target source =
    -- If no more steps in queue, reverse the order because we've collected in reverse order
    case queue of
        [] ->
            List.reverse steps

        _ ->
            let
                -- Sort queue by distance to choose cheapest node next
                sortedQueue =
                    List.sortBy (\(_, dist) -> dist) queue
            in
            case sortedQueue of
                -- First node and distance pair in the queue
                ( node, distance ) :: rest ->
                    -- Grab the next node if we've already visited this one (prevents needless backtracking)
                    if Set.member node visited then
                        simulate graph distances previous rest visited steps traversedEdges target source
                    else
                        let
                            -- Add node to the set of visited nodes
                            newVisited =
                                Set.insert node visited

                            -- Find parend edge if possible
                            maybeEdge =
                                -- No parent because node is the source
                                if node == source then
                                    Nothing
                                -- Get the parent of the node
                                else
                                    Dict.get node previous

                            -- Parent found, so create a new edge in list of traversed edges
                            newTraversedEdges =
                                case maybeEdge of

                                    -- Add parent and node edge to list of traversed ones
                                    Just parent ->
                                        traversedEdges ++ [ ( parent, node ) ]
                                    
                                    -- Default to return what we already have
                                    _ ->
                                        traversedEdges

                            -- Get all neighbors of our current node
                            neighbors =
                                getNeighbors graph node

                            -- Folds over each neighbor and updates distance, previous, and queue
                            updateNeighbor ( neighbor, edgeWeight ) ( upDist, upPrev, upQueue ) =
                                let
                                    -- Get current distance to neighbor (defaults to 10000 to represent infinity)
                                    oldDist =
                                        Dict.get neighbor upDist |> Maybe.withDefault 10000

                                    -- Compute new distance through the current node
                                    newDist =
                                        distance + edgeWeight
                                in
                                if newDist < oldDist then
                                    -- Update distance, previous node, and queue if new distance shorter
                                    ( Dict.insert neighbor newDist upDist
                                    , Dict.insert neighbor node upPrev
                                    , (neighbor, newDist) :: upQueue
                                    )
                                else
                                    -- Keep existing values if newDist longer than old one
                                    ( upDist, upPrev, upQueue )

                            -- Update all neighbors of current node
                            ( newDistances, newPrevious, newQueueEntries ) =
                                List.foldl updateNeighbor ( distances, previous, [] ) neighbors

                            -- Add new entries into the queue
                            updatedQueue =
                                rest ++ newQueueEntries

                            -- Update DijkstraState capturing everything computed during this step
                            newStep =
                                -- Graph
                                { graph = graph
                                -- Update visited nodes to new list
                                , visitedNodes = Set.toList newVisited
                                -- Update current node to new node to be processed
                                , currentNode = Just node
                                -- Add new distances dictionary
                                , distances = newDistances
                                -- Update previous nodes dictionary
                                , previous = newPrevious
                                -- Add to queue with new possibilities
                                , options = sortedQueue
                                -- Determine final cost if node is target or return nothing
                                , finalCost = if node == target then Just distance else Nothing
                                -- Update edges already examined
                                , traversedEdges = newTraversedEdges
                                }
                        in
                        -- Return reversed list of steps because we build newest to oldest
                        if node == target then
                            List.reverse (newStep :: steps)
                        -- Recursively call simulate with updated structures
                        else
                            simulate graph newDistances newPrevious updatedQueue newVisited (newStep :: steps) newTraversedEdges target source
                
                -- Default to reverse and return steps (never used)
                _ ->
                    List.reverse steps
