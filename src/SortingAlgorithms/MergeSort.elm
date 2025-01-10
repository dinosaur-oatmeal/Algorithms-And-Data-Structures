module SortingAlgorithms.MergeSort exposing (view, mergeSortStep)

-- HTML Imports
import Html exposing (Html, div, text, ul, li)
import Html.Attributes exposing (class)

import Array exposing (Array)

-- Import necessary structure to track state
import MainComponents.Structs exposing (SortingTrack)

-- Import SortingVisualization for graph
import SortingAlgorithms.SortingVisualization as Visualization exposing (renderComparison)

-- Import for control buttons (used in view)
import MainComponents.Controls  as Controls exposing (ControlMsg, view)

mergeSortStep : SortingTrack -> SortingTrack
mergeSortStep track =
    let
        array = track.array
        arrayLength = Array.length array
        currentStep = track.currentStep
        outerIndex = track.outerIndex

        -- Track steps to know when sorting is complete (log2 array length)
        totalSteps = ceiling (logBase 2 (toFloat arrayLength))

        -- Check if sorting is complete
        isSorted = currentStep > totalSteps

        -- Calculate halfStep (midpoint of current step)
        halfStep = 2 ^ currentStep // 2
        
        updatedArray =
            -- Perform one step of merging
            if not isSorted then
                -- One step of MergeSort
                processMergeStep currentStep halfStep array
            -- Don't update array if sorted
            else
                array

    -- Update track with necessary info for next step
    in
    { track
        | array = updatedArray
        -- Current step updates to know if sorting complete
        , currentStep =
            if isSorted then
                currentStep
            else
                currentStep + 1
        , currentIndex = currentStep
        , outerIndex = halfStep
        , sorted = isSorted
    }

-- Process one step of merging based on the current step
processMergeStep : Int -> Int -> Array Int -> Array Int
processMergeStep currentStep halfStep array =
    let
        arrayLength = Array.length array
        -- Size of arrays being merged
        stepSize = 2 ^ currentStep

        -- Recursively process each segment pair and merge them
        processSegments start acc =
            if start >= arrayLength then
                acc
            else
                let
                    -- Left: start to (start + halfStep)
                    left = Array.slice start (start + halfStep) array
                    -- Right: (start + halfStep) to (start + stepSize)
                    right = Array.slice (start + halfStep) (start + stepSize) array
                    -- Call mergeArrays function with subarrays
                    merged = mergeArrays left right
                in
                -- Recursively call processSegments (Divide)
                processSegments (start + stepSize) (Array.append acc merged)
    in
    -- Initial call to processSegments
    processSegments 0 Array.empty

-- Merge two sorted arrays into a single sorted array (Conquer)
mergeArrays : Array Int -> Array Int -> Array Int
mergeArrays leftArray rightArray =
    let
        -- Recursively merges elements
        mergeHelper leftIndex rightIndex combinedArray =
            case (Array.get leftIndex leftArray, Array.get rightIndex rightArray) of
                (Just leftValue, Just rightValue) ->
                    -- Append leftValue to new array if smaller and increment leftIndex
                    if leftValue < rightValue then
                        mergeHelper (leftIndex + 1) rightIndex (Array.append combinedArray (Array.fromList [leftValue]))
                    -- Append rightValue to new array if smaller and increment rightIndex
                    else
                        mergeHelper leftIndex (rightIndex + 1) (Array.append combinedArray (Array.fromList [rightValue]))

                -- Only leftArray has values, so apped the rest of leftArray
                (Just leftValue, Nothing) ->
                    mergeHelper (leftIndex + 1) rightIndex (Array.append combinedArray (Array.fromList [leftValue]))

                -- Only rightArray has values, so append the rest of rightArray
                (Nothing, Just rightValue) ->
                    mergeHelper leftIndex (rightIndex + 1) (Array.append combinedArray (Array.fromList [rightValue]))

                -- Both smaller arrays are empty, so return final array
                (Nothing, Nothing) ->
                    combinedArray
    in
    -- Initial call to mergeHelper
    mergeHelper 0 0 Array.empty

{-
    Basic page view for Merge Sort
        Title, Description, Graph, Buttons, Variables, Breakdown, & Big-O Notation
        (ControlMsg -> msg) is ControlMsg in Main.elm
-}
view : SortingTrack -> Bool -> (ControlMsg -> msg) -> Html msg
view track running toMsg =
    div [ class "sort-page" ]
        [ -- Title
          div [ class "sort-title" ]
              [ text "Merge Sort" ]

          -- Description
        , div [ class "description" ]
              [ text """Merge Sort is a divide and conquer sorting algorithm.
              First, it divides the array into subarrays until it can no longer be divided.
              Then, it conquers by sorting each subarray individually.
              Finally, it merges the subarray together until the array is sorted.""" ]

          -- Graph
        , renderComparison
              track.array
              "Walk through the steps below"
              track.sorted
              track.outerIndex
              track.currentIndex
              Nothing

          -- Buttons (calls Controls.elm to be rendered)
            -- Allows button actions to be routed to Main.elm
        , Controls.view running toMsg

          -- Variables
        , div [ class "indices" ]
              [ text ("Middle Index: " ++ String.fromInt track.outerIndex)
              , text (" | Outer Index: " ++ String.fromInt track.currentIndex)
              , text (" | Sorted: " ++ (if track.sorted then "Yes" else "No"))
              ]

          -- Breakdown
        , div [ class "variable-list" ]
              [ ul []
                  [ li [] [ text "Middle Index:  The middle of the subarrays being merged." ]
                  , li [] [ text "Outer Index: the rightmost index of the merging arrays." ]
                  , li [] [ text "Sorted: tells us once the array is sorted." ]
                  ]
              ]

          -- Big-O Notation
        , div [ class "big-o-title" ]
              [ text """Big(O) Notation""" ]
        , div [ class "big-o-list" ]
            [ div [ class "big-o-item" ]
                [ div [] [ text "Best-Case" ]
                , div [] [ text "O(n log(n))" ]
                ]
            , div [ class "big-o-item" ]
                [ div [] [ text "Average-Case" ]
                , div [] [ text "O(n log(n))" ]
                ]
            , div [ class "big-o-item" ]
                [ div [] [ text "Worst-Case" ]
                , div [] [ text "O(n log(n))" ]
                ]
            ]

        , div [ class "space-complexity" ]
            [ text "Space Complexity: O(n)" ]
        ]
