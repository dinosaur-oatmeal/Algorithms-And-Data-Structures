module SortingAlgorithms.ShellSort exposing (view, shellSortStep)

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

shellSortStep : SortingTrack -> SortingTrack
shellSortStep track =
    let
        arr = track.array
        length = Array.length arr
        outer = track.outerIndex
        current = track.currentStep
        gap = track.gap
    in
    -- Array already sorted or gap too small
    if track.sorted || gap <= 0 then
        { track
            | sorted = True
        }

    else
        -- Pass finished (end of array hit)
        if outer >= length then
            let
                -- Reduce to 0 if 1 to be sorted
                newGap =
                    if gap == 1 then
                        0
                    else
                        -- Half gap
                        gap // 2
            in
            -- Update track for next pass with new gap
            { track
                | outerIndex = newGap
                , currentStep = newGap
                , gap = newGap
            }

        else
            -- All elements compared (pass complete), so go to next element
            if current < gap then
                { track
                    | outerIndex = outer + 1
                    , currentStep = outer + 1
                }
            else
                -- Compare current element to (current - gap) element
                case ( Array.get current arr, Array.get (current - gap) arr ) of
                    ( Just currentValue, Just gapValue ) ->
                        if currentValue < gapValue then
                            let
                                -- Swap values if currentValue < gapValue
                                updatedArray =
                                    arr
                                        |> Array.set (current - gap) currentValue
                                        |> Array.set current gapValue
                            in
                            -- Update track with new array and currentStep to previous position
                            { track
                                | array = updatedArray
                                , currentIndex = current - gap
                                , currentStep = current - gap
                            }

                        else
                            -- No Swap, so move to next element
                            { track
                                | outerIndex = outer + 1
                                , currentStep = outer + 1
                            }

                    -- Default constructor
                    _ ->
                        track

{-
    Basic page view for Shell Sort
        Title, Description, Graph, Buttons, Variables, Breakdown, & Big-O Notation
        (ControlMsg -> msg) is ControlMsg in Main.elm
-}
view : SortingTrack -> Bool -> (ControlMsg -> msg) -> Html msg
view track running toMsg =
    div [ class "sort-page" ]
        [ -- Title
          div [ class "sort-title" ]
              [ text "Shell Sort" ]

          -- Description
        , div [ class "description" ]
              [ text """Shell Sort is an optimization of Insertion Sort.
              It utilizes a gap variable to move element larger than the gap to the right side of if and elements less than the gap to the left side.
              Once the gap is decremented to 1, a final pass is done to move every element into the correct position.
              This is optimal over Insertion Sort because elements far apart in the array can be swapped in O(1) time rather than O(n).""" ]

          -- Graph
        , renderComparison
              track.array
              "Walk through the steps below"
              track.sorted
              track.outerIndex
              track.currentIndex
              (Just track.gap)

          -- Buttons (calls Controls.elm to be rendered)
            -- Allows button actions to be routed to Main.elm
        , Controls.view running toMsg

          -- Variables
        , div [ class "indices" ]
              [ text ("Outer Index: " ++ String.fromInt track.outerIndex)
              , text (" | Current Index: " ++ String.fromInt track.currentIndex)
              , text (" | Gap: " ++ String.fromInt track.gap)
              , text (" | Sorted: " ++ (if track.sorted then "Yes" else "No"))
              ]

          -- Breakdown
        , div [ class "variable-list" ]
              [ ul []
                  [ li [] [ text "Outer Index: tracks the last element of the sorted section of the array." ]
                  , li [] [ text "Current index: tracks the element being moved to it's correct relative location." ]
                  , li [] [text "Gap: tracks the gap elements are being swapped from in the array."]
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
                , div [] [ text "O(n²)" ]
                ]
            ]

        , div [ class "space-complexity" ]
            [ text "Space Complexity: O(1)" ]
        ]
