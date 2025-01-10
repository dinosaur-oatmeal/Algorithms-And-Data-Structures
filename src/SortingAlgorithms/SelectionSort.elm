module SortingAlgorithms.SelectionSort exposing (view, selectionSortStep)

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

selectionSortStep : SortingTrack -> SortingTrack
selectionSortStep track =
    let
        arr = track.array
        outer = track.outerIndex
        current = track.currentIndex
        minimum = track.minIndex
        length = Array.length arr
    in
    -- Array already sorted or end of array reached
    if track.sorted || outer >= length then
        { track
            | sorted = True
        }
    else
        if current < length then
            -- Compare element at current with element at minimum
            case (Array.get current arr, Array.get minimum arr) of
                (Just currentValue, Just minimumValue) ->
                    if currentValue < minimumValue then
                        -- Found a new minimum, so set minIndex to current and increase currentIndex
                        { track
                            | currentIndex = current + 1, minIndex = current
                        }
                    else
                        -- Current element isn't smaller than min, so increase currentIndex
                        { track
                        | currentIndex = current + 1
                        }

                -- Default constructor
                _ ->
                    track

        else
            -- currentIndex reached end of array so swap minIndex with outerIndex
            case (Array.get outer arr, Array.get minimum arr) of
                (Just outerValue, Just minimumValue) ->
                    let
                        updatedArray =
                            -- Swap outerValue with minimumValue if smaller
                            if minimum /= outer then
                                Array.set outer minimumValue (Array.set minimum outerValue arr)
                            -- Return array if not smaller
                            else
                                arr
                    in
                    -- Update track to reflect changes
                    { track
                        | array = updatedArray
                        , outerIndex = outer + 1
                        , currentIndex = outer + 2
                        , minIndex = outer + 1
                    }

                -- Default constructor
                _ ->
                    track

{-
    Basic page view for Selection Sort
        Title, Description, Graph, Buttons, Variables, Breakdown, & Big-O Notation
        (ControlMsg -> msg) is ControlMsg in Main.elm
-}
view : SortingTrack -> Bool -> (ControlMsg -> msg) -> Html msg
view track running toMsg =
    div [ class "sort-page" ]
        [ -- Title
          div [ class "sort-title" ]
              [ text "Selection Sort" ]

          -- Description
        , div [ class "description" ]
              [ text """Selection Sort starts at the first element in the array and looks through the entire array to find the smallest element.
                  Once the smallest element is found, it swaps with the current element before moving on.
                  This type of algorithnm allows there to be a sorted section of the array and unsorted section of the array.""" ]

          -- Graph
        , renderComparison
              track.array
              "Walk through the steps below"
              track.sorted
              track.outerIndex
              track.currentIndex
              (Just track.minIndex)

          -- Buttons
        , Controls.view running toMsg

          -- Variables
        , div [ class "indices" ]
              [ text ("Current Index: " ++ String.fromInt track.outerIndex)
              , text (" | Compare Index: " ++ String.fromInt track.currentIndex)
              , text (" | Minimum Index: " ++ String.fromInt track.minIndex)
              , text (" | Element Swapped: " ++ (if track.didSwap then "Yes" else "No"))
              , text (" | Sorted: " ++ (if track.sorted then "Yes" else "No"))
              ]

        -- Breakdown Description
        , div [ class "variable-list" ]
              [ ul []
                  [ li [] [ text "Current Index:  the index that will be swapped at the end of the pass." ]
                  , li [] [ text "Compare Index: the index being compared to see if it's smaller." ]
                  , li [] [ text "Minimum Index: the index with the smallest value in the array during this pass."]
                  , li [] [ text "Sorted: tells us once the array is sorted." ]
                  ]
              ]

          -- Big-O Notation
        , div [ class "big-o-title" ]
              [ text """Big(O) Notation""" ]
        , div [ class "big-o-list" ]
            [ div [ class "big-o-item" ]
                [ div [] [ text "Best-Case" ]
                , div [] [ text "O(n²)" ]
                ]
            , div [ class "big-o-item" ]
                [ div [] [ text "Average-Case" ]
                , div [] [ text "O(n²)" ]
                ]
            , div [ class "big-o-item" ]
                [ div [] [ text "Worst-Case" ]
                , div [] [ text "O(n²)" ]
                ]
            ]

        , div [ class "space-complexity" ]
            [ text "Space Complexity: O(1)" ]
        ]
