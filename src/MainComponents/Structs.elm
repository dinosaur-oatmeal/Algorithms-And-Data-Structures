{-  All files need access to the sorting track.
    Keeping it in a separate file removes the potential
        of circular imports.
-}
module MainComponents.Structs exposing (..)

-- Random List Generation
import Random exposing (Generator)
import Random.List exposing (shuffle)
import Random.Extra

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
    , gap = 10 // 2
    -- Initialize to Array Size for QuickSort
    , stack = [ ( 0, List.length list - 1 ) ]
    -- Initialize for BubbleSort
    , didSwap = False
    , currentStep = 0
    }

-- TREE
type Tree
    -- No node with no children
    = Empty
    -- Node, value, left child, right child
    | Node Int Tree Tree

-- GENERATORS for various pages

-- Shuffle list for arrays
randomListGenerator : Generator (List Int)
randomListGenerator =
    shuffle (List.range 1 10)

-- Grab a random int for target in searching
randomTargetGenerator : Generator Int
randomTargetGenerator =
    Random.int 1 10

-- Generates tree
randomTreeGenerator : Generator Tree
randomTreeGenerator =
    -- Between 10 and 20 nodes in tree
        -- Keep size down for smaller screens
    let
        sizeGenerator : Generator Int
        sizeGenerator =
            Random.int 9 31
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
                (shuffle (List.range 1 50))
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
        Node val leftSubtree rightSubtree
