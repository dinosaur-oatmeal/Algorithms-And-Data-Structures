{-  All files need access to the sorting track.
    Keeping it in a separate file removes the potential
        of circular imports.
-}
module MainComponents.Structs exposing (..)

-- Random List Generation
import Random exposing (Generator, float, map2, int)
import Random.List exposing (shuffle)
import Random.Extra
import Dict exposing (Dict)
import Set

-- Needed for orderedListCmd
import Task exposing (Task, succeed)

import Array exposing (Array)

-- SORTING TRACK

-- Record to hold all data for sorting and searching algorithms
type alias SortingTrack =
    { array : Array Int
    , outerIndex : Int
    , currentIndex : Int
    , sorted : Bool
    , minIndex : Int
    , gap : Int
    , stack : List ( Int, Int )
    , didSwap : Bool
    , currentStep : Int
    }

-- Turn List into SortingTrack for random arrays to work
defaultSortingTrack : List Int -> SortingTrack
defaultSortingTrack list =
    { array = Array.fromList list
    , outerIndex = 0
    , currentIndex = 1
    , sorted = False
    , minIndex = 0
    -- Initialize for ShellSort
    , gap = (List.length list) // 2
    -- Initialize to Array Size for QuickSort
    , stack = [ ( 0, List.length list - 1 ) ]
    -- Initialize for BubbleSort
    , didSwap = False
    , currentStep = 0
    }

-- GENERATORS for various pages

-- Generate an ordered array
orderedListCmd : (List Int -> msg) -> Cmd msg
orderedListCmd toMsg =
    let
        orderedList =
            List.range 1 30
    in
    -- Converts msg to Cmd msg for Main.elm Update
    Task.succeed orderedList
        |> Task.perform toMsg

-- Shuffle list for arrays
randomListGenerator : Generator (List Int)
randomListGenerator =
    shuffle (List.range 1 30)

-- Grab a random int for target in searching
randomTargetGenerator : Generator Int
randomTargetGenerator =
    Random.int 1 30

-- TREE
type Tree
    -- No node with no children
    = Empty
    -- TreeNode, value, left child, right child
    | TreeNode Int Tree Tree

-- Generates tree
randomTreeGenerator : Int -> Int -> Generator Tree
randomTreeGenerator intOne intTwo =
    -- Generates a tree with random number of nodes between inputs
        -- Allows 31 nodes for traversals and 30 for heaps
    let
        sizeGenerator : Generator Int
        sizeGenerator =
            Random.int intOne intTwo
    in
    Random.andThen
        (\n ->
            -- All values in tree are 1 - 50 with no duplicates
                -- No duplicates needed for highlighting
            Random.map
                (\shuffledList ->
                    let
                        values = List.take n shuffledList
                    in
                        buildTree values 0 0
                )
                (shuffle (List.range 1 99))
        )
        sizeGenerator

-- Builds binary tree from list of values
buildTree : List Int -> Int -> Int -> Tree
buildTree values index depth =
    -- No more than 5 levels to the tree
    if index >= List.length values || depth >= 5 then
        Empty
    else
        let
            val =
                case List.drop index values of
                    -- Default (shouldn't ever occur)
                    [] ->
                        0
                    x :: _ ->
                        x

            -- Builds left subtree recursively
            leftSubtree =
                buildTree values (2 * index + 1) (depth + 1)

            -- Builds right subtree recursively
            rightSubtree =
                buildTree values (2 * index + 2) (depth + 1)
        in
        -- Create node with value pointing to subtrees
        TreeNode val leftSubtree rightSubtree

-- GRAPH

-- Node
type alias GraphNode =
    { id : Int }

-- Edge
type alias Edge =
    -- Track what nodes the edge connects and a weight for algorithms
        -- Edges are NOT directed
    { from : Int
    , to : Int
    , weight : Int
    }

-- Graph is a list of nodes and edges
type alias Graph =
    { nodes : List GraphNode
    , edges : List Edge
    }

-- Graph generator
randomGraphGenerator : Random.Generator Graph
randomGraphGenerator =
    let
        -- Between 5 and 7 nodes in graph
        sizeGenerator =
            Random.int 9 9
    in
    Random.andThen
        (\n ->
            -- Create n nodes with IDs [1..n] (makes reading graph easier)
            let
                nodes =
                    List.map (\id -> { id = id }) (List.range 1 n)

                -- List of all pairs of nodes
                allPairs =
                    allUniquePairs (List.range 1 n)

                -- Generate a random weight for each pair (edges)
                edgeGenerators =
                    List.map
                        (\(a, b) ->
                            Random.int 15 99
                                |> Random.map (\w -> { from = a, to = b, weight = w })
                        )
                        allPairs

                -- Generate all edges
                allEdgesGenerator =
                    Random.Extra.sequence edgeGenerators
            in
            Random.andThen
                (\allEdges ->
                    let
                        -- Build MST using with Kruskal's algorithm
                        ( mstEdges, leftover ) =
                            kruskalMST n allEdges

                        -- Add random extra edges so graph isn't an MST
                        extraEdgesGenerator =
                            randomSubset 0.1 leftover
                    in
                    Random.map
                        (\extraEdges ->
                            { nodes = nodes
                            -- Add required (mstEdges) with random (extraEdges) for all edges in final graph
                            , edges = mstEdges ++ extraEdges
                            }
                        )
                        extraEdgesGenerator
                )
                allEdgesGenerator
        )
        sizeGenerator

-- Pick a random subset from a list
    -- Each eleemnt has probability to be in the subset
    -- Used to add extra edges to the graph
randomSubset : Float -> List set -> Random.Generator (List set)
randomSubset probability subset=
    let
        -- Generate a list of numbers (0 or 1) for each index and map to false or true, respectively
            -- True: probability            False: 1 - probability
        boolListGen : Random.Generator (List Bool)
        boolListGen = Random.list (List.length subset) (Random.float 0 1 |> Random.map (\x -> x < probability))
    in
    -- Take original list and booleans, zip together, and pick indices that are true
    Random.map2 (\bools elements -> List.map2 (\b e -> if b then Just e else Nothing) bools elements
                    |> List.filterMap identity)
                boolListGen
                (Random.constant subset)

-- Find all unordered pairs from list of integers
allUniquePairs : List Int -> List (Int, Int)
allUniquePairs ids =
    case ids of
        -- Pair x with every element in r and append output to allUniquePairs
        x :: rest ->
            (List.map (\r -> (x, r)) rest)
                ++ allUniquePairs rest

        -- Empty list shouldn't return anything
        _ ->
            []

-- Kruskal's algorithm to find MST
    -- Takes n nodes and list of edges, returns edges for MST and extra edges for graph
kruskalMST : Int -> List Edge -> ( List Edge, List Edge )
kruskalMST n edges =
    let
        -- Sort edges by weight and store in list
        sortedEdges =
            List.sortBy .weight edges

        -- Disjoint set to find cycles in MST (not allowed)
        initialUnion =
            unionInit n

        -- Take current edge being processed and state of MST
            -- Union being worked on, edges we've included, and edges we've discarded
        step : Edge -> ( Union, List Edge, List Edge ) -> ( Union, List Edge, List Edge )
        step edge ( union, included, discarded ) =
            let
                fromRoot =
                    unionFind union edge.from

                toRoot =
                    unionFind union edge.to
            in
            -- If node goes to itself, discard it (forms a cycle)
            if fromRoot == toRoot then
                -- Append edge to discarded and return
                ( union, included, edge :: discarded )
            else
                let
                    -- Add edge to union data structure
                    updatedUnion = unionCheck union fromRoot toRoot
                in
                -- Append new included edge to edge list
                ( updatedUnion, edge :: included, discarded )

        -- Fold over sorted edges applying step
        ( _, mst, leftover ) =
            List.foldl step ( initialUnion, [], [] ) sortedEdges
    in
    -- Reverse mst for included edges in MST and leftover edges not used
    ( List.reverse mst, leftover )



{- UNION FIND (DISJOINT SET) HELPERS -}

-- Keep a dictionary mapping of each node to its parent in MST
    -- If a node is its own parent, it's the root
type alias Union =
    Dict.Dict Int Int


-- Initialize each node to map to itself (all roots)
unionInit : Int -> Union
unionInit size =
    List.range 1 size
        -- Make list where value points to itself
        |> List.map (\value -> ( value, value ))
        -- Convert to dictionary
        |> Dict.fromList


-- Find the root of a specific node
unionFind : Union -> Int -> Int
unionFind union node =
    case Dict.get node union of
        Just parent ->
            -- Return same node if its parent is itself (root)
            if parent == node then
                node
            -- Recursively call function to find root of tree it belongs to
            else
                unionFind union parent

        -- Default to return itself
        _ ->
            node


-- Union two sets together to merge disjoint trees
unionCheck : Union -> Int -> Int -> Union
unionCheck union firstInt secondInt =
    -- Make second value parent of first value and add to dictionary
    Dict.insert secondInt firstInt union
