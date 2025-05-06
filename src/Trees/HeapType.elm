module Trees.HeapType exposing (..)

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

-- Tree and swapped indices in a given step
type alias HeapifySteps =
    { tree : Tree
    , swappedIndices : Maybe (Int, Int)
    }

-- MODEL
type alias Model =
    -- Root node in tree structure
    { tree : Tree
    -- Type of heap being looked at
    , heapType : HeapType
    -- List of trees and swapped indices generated during heapify (needed for step)
    , heapifySteps : List HeapifySteps
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
        -- Update type of heap and generate new heap
        ChangeHeapType newHeapType ->
            resetAndGenerateTree newHeapType model

        -- Needed for Main.elm when page selected
        SetTree newTree ->
            resetAndGenerateTree model.heapType model

        -- Update typed value in model
        UpdateNewValue val ->
            ( { model | newValue = val }, Cmd.none )

        AddNode ->
            case String.toInt model.newValue of
                Just num ->
                    let
                        -- Convert tree to array
                        arrayBefore =
                            treeToLevelArray model.tree

                        -- Only insert if not at capacity and don't allow duplicates
                            -- No duplicates due to highlighting
                        canInsert =
                            List.length arrayBefore < 31 && not (List.member num arrayBefore)
                    in
                    -- Don't update model if at capacity
                    if not canInsert then
                        ( model, Cmd.none )
                    else
                        let
                            -- Append new value at end of array
                            arrayWithNew = arrayBefore ++ [ num ]

                            -- Build entire list of (tree, maybeSwappedValues) after insertion
                            steps = buildHeapSteps arrayWithNew model.heapType
                        in
                        ( { model
                            | heapifySteps = steps
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
                -- Convert tree to array
                arrayBefore =
                    treeToLevelArray model.tree
            in
            case arrayBefore of
                -- Don't delete root if only one node in tree
                [ int ] ->
                    ( model, Cmd.none )

                _ ->
                    let
                        -- Compute steps and swapped values to delete root
                        steps = deleteRoot arrayBefore model.heapType
                    in
                    ( { model
                        | heapifySteps = steps
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
                                last.tree

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

        -- Update when algorithm running
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
                                last.tree

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
            resetAndGenerateTree model.heapType model

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
                        -- Last snapshot of heap
                        lastStep :: _ ->
                            -- Convert final tree to array
                            treeToLevelArray lastStep.tree

                        -- Empty states, fallback to original array
                        _ ->
                            arr

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
            -- Don't update model or highlights if list is empty
            if List.isEmpty model.heapifySteps then
                { tree = model.tree, swappedIndices = Nothing}
            else
                -- Take first item in list if not empty
                List.drop model.index model.heapifySteps
                    |> List.head
                    |> Maybe.withDefault { tree = model.tree, swappedIndices = Nothing}
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

        , div [ class "insert-delete-container" ]
            [ -- Row containing input and buttons
            div [ class "insert-delete-row" ]
                -- Insert Button
                [ button [ onClick AddNode ] [ text "Insert" ]
                
                -- Input field
                , input
                    [ type_ "text"
                    , placeholder "Value To Add"
                    , value model.newValue
                    , onInput UpdateNewValue
                    ]
                    []

                -- Delete Root Button
                , button [ onClick DeleteRoot ] [ text "Delete" ]
                ]

            -- Disclaimer text
            , div [ class "disclaimer" ]
                [ text "Duplicates are not allowed." ]
            ]

        -- Current visualization
            -- Keep array empty (will be implemented later)
        , let
            -- Curred state of heap in list
            currentStep =
                case List.drop model.index model.heapifySteps of
                    step :: _ ->
                        step

                    -- Default case (never used)
                    _ ->
                        { tree = model.tree, swappedIndices = Nothing }
        in
        -- Call Visualization.elm to render heap (tree)
        Visualization.view currentStep.tree Nothing currentStep.swappedIndices [] model.running


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
                , div [] [ text "O(log n)" ]
                ]
            , div [ class "big-o-item" ]
                [ div [] [ text "Deletion Complexity" ]
                , div [] [ text "O(log n)" ]
                ]
            ]
        , div [ class "space-complexity" ]
            [ text "Space Complexity (heap): O(n)" ]
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

-- Reset tree (used for ChangeHeapType, SetTree, and Reset)
resetAndGenerateTree : HeapType -> Model -> (Model, Cmd Msg)
resetAndGenerateTree newHeapType model =
    let
        -- Command to generate a new random tree
        cmd = Random.generate TreeGenerated (randomTreeGenerator 9 30)
    in
    ( { model
        | running = False
        , heapType = newHeapType
        , index = 0
        , heapifySteps = []
        , newValue = ""
      }
    , cmd )


-- Change description based on traversal type
getDescription : HeapType -> String
getDescription heapType =
    case heapType of
        MinHeap ->
            """Min Heap: A binary tree where the smallest element is always the root.
                Elements get larger as the tree levels get deeper,
                ensuring parent nodes are smaller than their children."""

        MaxHeap ->
            """Max Heap: A binary tree where the largest element is always the root.
                Elements get smaller as the tree levels get deeper,
                ensuring parent nodes are larger than their children."""


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
                TreeNode val left right ->
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
                TreeNode actualVal
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
buildHeapSteps : List Int -> HeapType -> List HeapifySteps
buildHeapSteps arr heapType =
    let
        length = List.length arr

        -- All indices that aren't leaves (start at bottom and go up)
        indices = List.reverse (List.range 0 ((length // 2) - 1))

        -- initial step with no swaps
        initialStep : HeapifySteps
        initialStep =
            { tree = levelArrayToTree arr
            , swappedIndices = Nothing
            }
    
        -- Helper function to process each index and accumulate steps
        processIndex : Int -> (List Int, List HeapifySteps) -> (List Int, List HeapifySteps)
        processIndex index (currentArr, stepsSoFar) =
            let
                -- Apply heapify to the current array at the given index
                newStates = heapifySteps currentArr index length heapType

                -- Get updated array from the last step
                updatedArr =
                    case List.reverse newStates of
                        -- Last step in list
                        step :: _ ->
                            treeToLevelArray step.tree

                        -- Default
                        _ ->
                            currentArr
            in
                ( updatedArr, stepsSoFar ++ newStates )
    in
    -- Don't update if no indices
    if length == 0 then
        []
    else
        let
            -- Fold over the indices, starting with original array and initial step
            (_, steps) = List.foldl processIndex (arr, [ initialStep ]) indices
        in
        steps

-- Get states at current index in heap
    -- Array, index, length, type of heap
heapifySteps : List Int -> Int -> Int -> HeapType -> List HeapifySteps
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
                -- Get values for highlighting
                oldValue = get arr index
                newValue = get arr target2

                swappedArray = swapIndices arr index target2

                subsequentStates =
                    -- Recursively call heapifySteps for current index
                    heapifySteps swappedArray target2 size heapType

                -- Step for immediate swap
                currentStep : HeapifySteps
                currentStep =
                    { tree = levelArrayToTree swappedArray
                    , swappedIndices = Just (oldValue, newValue)
                    }
            in
            currentStep :: subsequentStates
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
deleteRoot : List Int -> HeapType -> List HeapifySteps
deleteRoot arr heapType =
    let
        n = List.length arr
    in
    case n of

        -- Don't remove final node in heap
        1 ->
            []

        _ ->
            let
                lastIndex = n - 1
                rootVal   = List.head arr |> Maybe.withDefault -1
                lastVal   = List.head (List.drop lastIndex arr) |> Maybe.withDefault -1

                -- Swap root value and last value
                swapped   = swapIndices arr 0 lastIndex

                -- Remove last value from array
                removed   = List.take lastIndex swapped

                -- Reheapify steps after root altered
                reheapifySteps = heapifySteps removed 0 (List.length removed) heapType

                -- Swap root with last value step
                swapStep : HeapifySteps
                swapStep =
                    { tree = levelArrayToTree swapped
                    , swappedIndices = Just (rootVal, lastVal)
                    }

                -- Deleting last index step
                removeStep : HeapifySteps
                removeStep =
                    { tree = levelArrayToTree removed
                    -- Only highlight root (lastVal in original array)
                    , swappedIndices = Just (lastVal, lastVal)
                    }
            in
            -- Combine steps and append reheapify ones
            swapStep :: removeStep :: reheapifySteps
