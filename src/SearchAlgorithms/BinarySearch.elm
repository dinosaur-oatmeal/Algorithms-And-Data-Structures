module SearchAlgorithms.BinarySearch exposing (binarySearchStep, view)

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

binarySearchStep : SortingTrack -> SortingTrack
binarySearchStep track =
    let
        arr = track.array
        left = track.outerIndex
        right = track.minIndex
        target = track.currentIndex
        length = Array.length arr

        mid =
            -- Middle element between left and right
            if right >= left then
                (left + right) // 2

            -- Value not found in array (0)
            else
                -1

        -- Value in middle index
        midVal = 
            if mid >= 0 && mid < length then
                Array.get mid arr
            else
                Nothing
    in
    -- Don't update if value found
    if track.sorted then
        track
    else
        if left <= right then
            case midVal of
                -- Middle value found
                Just value ->
                    -- Target found
                    if value == target then
                        { track
                            | sorted = True
                        }

                    -- Target in right half
                    else if value < target then
                        { track
                            -- Move left pointer
                            | outerIndex = mid + 1
                            , currentStep = track.currentStep + 1
                        }

                    -- Target in left half
                    else
                        { track
                            -- Move right pointer
                            | minIndex = mid - 1
                            , currentStep = track.currentStep + 1
                        }

                -- Default constructor
                _ ->
                    { track
                        | sorted = False
                        , currentStep = track.currentStep
                    }
        else
            -- left > right = value not found
            { track
                | sorted = False
                , currentStep = track.currentStep
            }

{-
    Basic page view for Binary Search
        Title, Description, Graph, Buttons, Variables, Breakdown, & Big-O Notation
        (ControlMsg -> msg) is ControlMsg in Main.elm
-}
view : SortingTrack -> Bool -> (ControlMsg -> msg) -> Html msg
view track running toMsg =
    div [ class "sort-page" ]
        [ -- Title
          div [ class "sort-title" ]
              [ text "Binary Search" ]

          -- Description
        , div [ class "description" ]
              [ text """Binary Search efficiently finds a target value within a sorted array by repeatedly dividing the search interval in half.
              If the value of the midpoint is less than the target, it searches the right half; otherwise, it searches the left half.""" ]

        -- Graph
        , Visualization.renderComparison
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
              [ text ("Left index: " ++ String.fromInt track.outerIndex)
              , text (" | Right index: " ++ String.fromInt track.minIndex)
              , text (" | Target Value: " ++ String.fromInt track.gap)
              , text (" | Element Found: " ++ (if track.sorted then "Yes" else "No"))
              ]

          -- Breakdown
        , div [ class "variable-list" ]
              [ ul []
                  [ li [] [ text "Left Index: left bound of our current search window." ]
                  , li [] [ text "Right Index: right bound of our current search window." ]
                  , li [] [ text "Target Value: the element we want to find (must be in sorted array)." ]
                  , li [] [ text "Found: indicates if we’ve located the target." ]
                  ]
              ]

          -- Big-O Notation
        , div [ class "big-o-title" ]
              [ text "Big(O) Notation" ]
        , div [ class "big-o-list" ]
            [ div [ class "big-o-item" ]
                [ div [] [ text "Best-Case" ]
                , div [] [ text "O(1)" ]
                ]
            , div [ class "big-o-item" ]
                [ div [] [ text "Average-Case" ]
                , div [] [ text "O(log n)" ]
                ]
            , div [ class "big-o-item" ]
                [ div [] [ text "Worst-Case" ]
                , div [] [ text "O(log n)" ]
                ]
            ]
        ]
