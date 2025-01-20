module Heaps.HeapType exposing (..)

-- HTML Imports
import Html exposing (Html, div, button, text, input, ul, li)
import Html.Attributes exposing (class, type_, placeholder, value)
import Html.Events exposing (onClick, onInput)

-- Needed for "Run" and "Pause"
import Time

import Random

-- Import necessary structure to track state
import MainComponents.Structs exposing (Tree(..), randomTreeGenerator)

-- Import TreeVisualization for visualization
import Trees.TreeVisualization as Visualization exposing (view)

-- Import for control buttons (used in view)
import MainComponents.Controls as Controls exposing (ControlMsg(..), view)

-- Types of heaps
type HeapType
    = MinHeap
    | MaxHeap

-- MODEL
type alias Model =
    -- Root node in tree structure
    { tree : Tree
    -- Type of heap being looked at
    , heapType : HeapType
    -- List of trees generated during heapify (needed for step)
    , heapifySteps : List Tree
    -- Index of list we're at (needed for step)
    , index : Int
    -- Algorithm running or not (needed for Controls.elm)
    , running : Bool
    -- Value that can be added to heap
    , newValue : String
    }


type Msg
    -- Update heap to something new
    = ChangeHeapType HeapType
    -- Update tree in model (needed in Main.elm for updates)
    | SetTree Tree
    -- Update typed text from user
    | UpdateNewValue String
    -- Adds a node to the heap
    | AddNode
    -- Deletes the root node of the heap
    | DeleteRoot
    -- One step of heapify
    | HeapifyStep
    -- Timing for running the algorithm
    | Tick Time.Posix
    -- Run Button
    | StartHeapify
    -- Pause Button
    | StopHeapify
    -- Reset Button
    | ResetHeap
    -- Heapify tree generated so steps are valid
    | TreeGenerated Tree

-- INIT
initModel : Model
initModel =
    -- No tree
    { tree = Empty
    -- Default to a min heap
    , heapType = MinHeap
    -- No steps done yet
    , heapifySteps = []
    -- Start at root
    , index = 0
    -- Running should be false
    , running = False
    -- No text typed
    , newValue = ""
    }

-- UPDATE
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        -- Update type of heap
        ChangeHeapType newHeapType ->
            ( { model | heapType = newHeapType }, Cmd.none )

        SetTree newTree ->
            ( { model | tree = newTree, heapifySteps = [], index = 0 }, Cmd.none )

        -- Update typed value in model
        UpdateNewValue val ->
            ( { model | newValue = val }, Cmd.none )

        -- Add a node to the heap (add at end)
        AddNode ->
            case String.toInt model.newValue of
                Just num ->
                    let
                        -- Turn tree into an array
                        arrayBefore = treeToLevelArray model.tree
                    in
                    if List.length arrayBefore >= 31 then
                        -- No more than 31 nodes (5 layers)
                            -- Due to svg view restrictions
                        ( model, Cmd.none )
                    else
                        let
                            -- Append new value to end of array
                            arrayWithNew = arrayBefore ++ [ num ]
                            arrayStates = buildHeapSteps arrayWithNew model.heapType
                            -- Convert intermediate arrays back into a tree to be visualized
                            treeStates = List.map levelArrayToTree arrayStates
                        in
                        ( { model
                            | heapifySteps = treeStates
                            , index = 0
                            , running = False
                            , newValue = ""
                          }
                        , Cmd.none
                        )

                -- Ignore anything that isn't an int
                _ ->
                    ( model, Cmd.none )

        -- Delete root node in heap
        DeleteRoot ->
            let
                -- Convert tree into an array
                arrayBefore = treeToLevelArray model.tree
            in
            case arrayBefore of
                -- Don't delete root if only one node in tree
                [ int ] ->
                    ( model, Cmd.none )


                -- Delete root (more than 1 node)
                _ ->
                    let

                       -- Find all states used to delete root in tree 
                        allStates = deleteRoot arrayBefore model.heapType

                        -- Convert arrays into trees
                        treeSteps = List.map levelArrayToTree allStates
                    in
                    ( { model
                        | heapifySteps = treeSteps
                        , index = 0
                        , running = False
                      }
                    , Cmd.none
                    )

        -- One step of heapify
        HeapifyStep ->
            let
                -- Increase index and total steps
                newIndex = model.index + 1
                -- Total number of steps possible
                totalSteps = List.length model.heapifySteps
            in
            -- Update if current step (index) < total steps
            if newIndex < totalSteps then
                -- Go to next index (snapshot) of heapifySteps (list)
                ( { model | index = newIndex }, Cmd.none )

            -- Don't update at last step
            else
                let
                    finalTree =
                        case List.reverse model.heapifySteps of
                            -- Last snapshot of heap
                            last :: _ ->
                                last

                            -- Empty tree (never used)
                            _ ->
                                model.tree
                in
                ( { model
                    -- Don't increase index (steps) anymore
                    | index = newIndex - 1
                    , running = False
                    , tree = finalTree
                  }
                , Cmd.none
                )

        Tick _ ->
            let
                -- Increase index and total steps
                newIndex = model.index + 1
                -- Total number of steps possible
                totalSteps = List.length model.heapifySteps
            in
            -- Update if current step (index) < total steps
            if newIndex < totalSteps then
                -- Go to next index (snapshot) of heapifySteps (list)
                ( { model | index = newIndex }, Cmd.none )

            -- Don't update at last step
            else
                let
                    finalTree =
                        case List.reverse model.heapifySteps of
                            -- Last snapshot of heap
                            last :: _ ->
                                last

                            -- Empty tree (never used)
                            _ ->
                                model.tree
                in
                ( { model
                    -- Don't increase index (steps) anymore
                    | index = newIndex - 1
                    , running = False
                    , tree = finalTree
                  }
                , Cmd.none
                )

        -- Run button
        StartHeapify ->
            ( { model | running = True }, Cmd.none )

        -- Pause button
        StopHeapify ->
            ( { model | running = False }, Cmd.none )

        -- Reset button
        ResetHeap ->
            let
                -- Call to generate new tree
                cmd = Random.generate TreeGenerated randomTreeGenerator
            in
            ( { model
                | running = False
                , index = 0
                , heapifySteps = []
                -- Reset user input
                , newValue = ""
              }
            , cmd )

        -- Heapify tree generated immediately after being made
        TreeGenerated newTree ->
            let
                -- Convert tree to array
                arr = treeToLevelArray newTree

                -- Find all states in heapify
                states = buildHeapSteps arr model.heapType

                -- Final array from heapify steps
                finalArr =
                    case List.reverse states of
                        a :: _ -> a
                        _ -> arr

                -- Convert final array into a tree
                finalTree = levelArrayToTree finalArr
            in
            ( { model
                -- Final tree from heapify
                | tree = finalTree
                -- Reset heapifySteps for user input
                , heapifySteps = []
                , index = 0
              }
            , Cmd.none
            )

-- Runs algorithm when selected
subscriptions : Model -> Sub Msg
subscriptions model =
    if model.running then
        -- Update every 1 second
        Time.every 1000 Tick
    else
        Sub.none

{-
    Basic page view for Heaps
        Title, Description, Heap Buttons, User Input, Delete, Diagram, Algorithm Buttons, Step Counter, Breakdown, & Big-O Notation
        (ControlMsg -> msg) is ControlMsg in Main.elm
-}
view : Model -> Html Msg
view model =
    let
        -- Current tree in heapifySteps list to be shown (index stores which one to show)
        currentTree =
            case List.drop model.index model.heapifySteps of
                step :: _ ->
                    step
                _ ->
                    model.tree
    in
    div [ class "sort-page" ]
        [ -- Title
          div [ class "sort-title" ]
          [ text "Heap Operations" ]

        , div [ class "description" ]
            [ text (getDescription model.heapType) ]

        -- Update class to change button color
        , div [ class "traversal-controls" ]
            [ button
                [ class "traversal-button"
                , if model.heapType == MinHeap then class "selected" else class ""
                , onClick (ChangeHeapType MinHeap)
                ]
                [ text "MinHeap" ]
            , button
                [ class "traversal-button"
                , if model.heapType == MaxHeap then class "selected" else class ""
                , onClick (ChangeHeapType MaxHeap)
                ]
                [ text "MaxHeap" ]
            ]

        -- User Input
        , div [ class "insert-node" ]
            [ input
                [ type_ "text"
                , placeholder "Value to insert..."
                -- Update value in Model to reflect what's typed
                , value model.newValue
                , onInput UpdateNewValue
                ]
                []
            -- Call AddNode when button clicked
            , button [ onClick AddNode ] [ text "Insert" ]
            ]

        -- Delete
        , div [ class "delete-root" ]
            -- Call DeleteRoot when button clicked
            [ button [ onClick DeleteRoot ] [ text "Delete Root" ] ]

        -- Current visualization
            -- Keep array empty (will be implemented later)
        , Visualization.view currentTree model.index [] model.running

        -- Algorithm step buttons
        , Controls.view model.running convertMsg

        -- Step counter
        , div [ class "indices" ]
            [ text ("Current Step: " ++ String.fromInt model.index) ]

        -- Breakdown
        , div [ class "variable-list" ]
              [ ul []
                  [ li [] [ text "Current Step: number of steps taken in the traversal." ]
                  ]
              ]

        -- Big-O Notation
        , div [ class "big-o-title" ]
            [ text "Big(O) Notation" ]
        , div [ class "big-o-list" ]
            [ div [ class "big-o-item" ]
                [ div [] [ text "Insertion Complexity" ]
                , div [] [ text "O(n)" ]
                ]
            , div [ class "big-o-item" ]
                [ div [] [ text "Deletion Complexity" ]
                , div [] [ text "O(log n)" ]
                ]
            ]
        , div [ class "space-complexity" ]
            [ text "Space Complexity: O(n)" ]
        ]

-- Convert messages from Controls.elm to local messages
convertMsg : ControlMsg -> Msg
convertMsg control =
    case control of
        Run ->
            StartHeapify

        Pause ->
            StopHeapify

        Step ->
            HeapifyStep

        Reset ->
            ResetHeap

-- Change description based on traversal type
getDescription : HeapType -> String
getDescription heapType =
    case heapType of
        MinHeap ->
            "Min Heap: The root is always the smallest element. Elements get larger as the tree levels get deeper."

        MaxHeap ->
            "Max Heap: The root is always the largest element. Elements get smaller as the tree levels get deeper."


-- Converts tree to an array (breadth-first)
treeToLevelArray : Tree -> List Int
treeToLevelArray tree =
    -- Calls helper function that adds to list level by level
        -- Queue with root node and accumulator list to be returned
    levelOrderHelper [ tree ] []

-- Adds values to accumulator list to convert tree into array
levelOrderHelper : List Tree -> List Int -> List Int
levelOrderHelper queue accumulatorList =
    case queue of
        tree :: rest ->
            case tree of
                -- Tree is valid, so enqueue children to be processed
                    -- Then, add value in node to accumulator list
                Node val left right ->
                    levelOrderHelper (rest ++ [ left, right ]) (accumulatorList ++ [ val ])

                -- Tree is empty so continue with the rest of the queue
                _ ->
                    levelOrderHelper rest accumulatorList

        -- Empty array (final pass should return whole tree in breadth-first order)
        _ ->
            accumulatorList


-- Convert array back into tree
levelArrayToTree : List Int -> Tree
levelArrayToTree arr =
    -- Calls helper function that builds tree from array
        -- Start at index 0 of array
    buildSubtree arr 0

-- Adds left and right children to parent nodes
buildSubtree : List Int -> Int -> Tree
buildSubtree arr index =
    -- Ensure index is valid
    if index < List.length arr then
        case List.head (List.drop index arr) of
            -- Valid value
            Just actualVal ->
                -- Create a Node structure
                Node actualVal
                    -- Recursively call buildSubtree with child nodes
                        -- 2 * index + 1 and 2 * index + 2 correctly points to child nodes in array
                    (buildSubtree arr (2 * index + 1))
                    (buildSubtree arr (2 * index + 2))

            -- No value at index (leaf nodes)
            _ ->
                Empty

    -- Used for leaf nodes
    else
        Empty

-- Build heap and tracks states to do so
    -- Takes an array and type of heap to build and returns list of states
buildHeapSteps : List Int -> HeapType -> List (List Int)
buildHeapSteps arr heapType =
    let
        length = List.length arr

        -- All indices that aren't leaves (start at bottom and go up)
        indices = List.reverse (List.range 0 ((length // 2) - 1))
    in
    case length of
        -- Return empty array for no array values (never used)
        0 ->
            [ [] ]

        -- 1 or more values in array
        _ ->
            let
                -- Initial array is first state
                initial = [ arr ]
            in
            List.foldl
                -- Take current index and list of states so far
                (\index statesSoFar ->
                    let
                        -- Grab last state in list
                        currentArray =
                            case List.head (List.reverse statesSoFar) of
                                Just array -> array

                                -- Default to empty
                                _ -> []

                        -- heapify currentArray at index
                            -- Returns a list of states
                        newStates =
                            heapifySteps currentArray index length heapType

                        finalArray =
                            if List.isEmpty newStates then
                                -- No heapify swaps, so don't update
                                currentArray
                            else
                                -- Reverse list to walk from last state to first state
                                List.head (List.reverse newStates)
                                    -- Default to showing currentArray because Maybe (List Int)
                                    |> Maybe.withDefault currentArray
                    in
                    statesSoFar
                        -- Append newStates
                        ++ newStates

                        -- Append finalArray if it's different from previous one
                            -- If the same, append an empty array
                        ++ (if finalArray /= currentArray then [ finalArray ] else [])
                )
                initial
                indices

-- Get states at current index in heap
    -- Array, index, length, type of heap
heapifySteps : List Int -> Int -> Int -> HeapType -> List (List Int)
heapifySteps arr index size heapType =
    let
        -- Calculate indices of children nodes
        left = 2 * index + 1
        right = 2 * index + 2

        -- Retreive value at input index
        get array idx =
            case List.head (List.drop idx array) of
                Just x -> x

                -- Default to -1 if no value found
                _ -> -1

        -- Find which value should be proiritized in heap
        compareIndex currentArr indexOne indexTwo =
            let
                valueOne = get currentArr indexOne
                valueTwo = get currentArr indexTwo
            in
            case heapType of
                MaxHeap ->
                    -- Child has larger value
                    if valueTwo > valueOne then
                        indexTwo
                    else
                        indexOne

                MinHeap ->
                    -- Child has smaller value
                    if valueTwo < valueOne then
                        indexTwo
                    else
                        indexOne

        -- Ensures that index is within bounds of the array
        withinBounds idx = idx < size
    in
    -- Return empty array if out of bounds
    if not (withinBounds index) then
        []
    else
        let
            -- Left child correct values to indices depending on heap
            target1 =
                if withinBounds left then
                    compareIndex arr index left

                -- Return parent if left child out of bounds
                else
                    index

            -- Right child correct values to indices depending on heap
            target2 =
                if withinBounds right then
                    compareIndex arr target1 right
                else
                    -- Return parent if right child out of bounds
                    target1
        in
        -- Check if swap is necessary
        if target2 /= index then
            let
                swapped = swapIndices arr index target2
                newState = swapped
                subsequentStates =
                    -- Recursively call heapifySteps for current index
                    heapifySteps newState target2 size heapType
            in
            newState :: subsequentStates
        -- Return empty array if heap property violated (should never happen)
        else
            []

-- Swaps indices in an array
swapIndices : List Int -> Int -> Int -> List Int
swapIndices arr indexOne indexTwo =
    -- Don't swap if indices are the same
    if indexOne == indexTwo then
        arr
    else
        let
            -- Get values at each index in array
            valueOne = List.head (List.drop indexOne arr)
            valueTwo = List.head (List.drop indexTwo arr)
        in
        case ( valueOne, valueTwo ) of
            ( Just x, Just y ) ->
                -- Swap values at given indices
                List.indexedMap
                    (\idx val ->
                        if idx == indexOne then
                            y
                        else if idx == indexTwo then
                            x
                        else
                            val
                    )
                    arr

            -- Default constructor (never used)
            _ ->
                arr

-- Deletes root in heap and replaces value with last index value
    -- Takes array to have root removed from, type of heap, and returns list of arrays
deleteRoot : List Int -> HeapType -> List (List Int)
deleteRoot arr heapType =
    case List.length arr of
        -- Empty array, so return empty array (never used)
        0 ->
            [ [] ]

        -- More than 1 element in array
        _ ->
            let
                -- Find last index in array
                lastIndex = List.length arr - 1
                -- Swap last index and root
                swapped = swapIndices arr 0 lastIndex
                -- Delete last index (value that was stored in root)
                removed = List.take lastIndex swapped

                -- Show the array right after swapping root last and pass to be heapified
                siftSteps = heapifySteps removed 0 (List.length removed) heapType
            in
            swapped :: removed :: siftSteps
