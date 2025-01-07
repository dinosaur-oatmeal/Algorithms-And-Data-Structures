module Pages.InsertionSort exposing (view, insertionSortStep)

-- HTML Imports
import Html exposing (Html, div, text, ul, li)
import Html.Attributes exposing (class)

import Array exposing (Array)

-- Import necessary structure to track state
import Structs exposing (SortingTrack)

-- Import visualization for graph
import Visualization exposing (renderComparison)

import Controls exposing (ControlMsg, view)

{-
  One step of insertion sort. Takes the current Tracking state
  and returns an updated state.
-}
insertionSortStep : SortingTrack -> SortingTrack
insertionSortStep track =
    let
        arr = track.array
        outer = track.outerIndex
        current = track.currentIndex
        length = Array.length arr
    in
    -- Array already sorted or end of array reached
    if track.sorted || outer >= length then
        { track
            | sorted = True
        }
    else
        if current <= 0 then
            -- Done inserting element at outerIndex, move to next element
            { track
                | outerIndex = outer + 1
                , currentIndex = outer + 1
            }
        else
            -- Get current value and previous value
            case (Array.get current arr, Array.get (current - 1) arr) of
                (Just currentValue, Just previousValue) ->
                    -- See if current < previous
                    if currentValue < previousValue then
                        let
                            -- Swap elements where smaller goes left
                            swappedArray =
                                Array.set (current - 1) currentValue (Array.set current previousValue arr)
                        in
                        -- Decrement currentIndex to move toward front of array
                        { track
                            | array = swappedArray
                            , currentIndex = current - 1
                        }
                    else
                        -- No swap needed, so insertion for element is done
                        { track
                            | outerIndex = outer + 1
                            , currentIndex = outer + 1
                        }

                -- Default constructor
                _ ->
                    track

{-
  Basic page view for Insertion Sort
    Title, Description, Graph, Buttons, Variables, Breakdown
    (ControlMsg -> msg) is ControlMsg in Main.elm
-}
view : SortingTrack -> Bool -> (ControlMsg -> msg) -> Html msg
view track running toMsg =
    div [ class "sort-page" ]
        [ -- Title
          div [ class "sort-title" ]
              [ text "Insertion Sort" ]

          -- Description
        , div [ class "description" ]
              [ text """Insertion Sort moves an element toward the beginning of the array until a smaller element is found in the sorted section of the array.
              This allows the algorithm to move elements into their correct relative positions one at a time until the array is sorted.""" ]

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
              [ text ("Outer Index: " ++ String.fromInt track.outerIndex)
              , text (" | Current Index: " ++ String.fromInt track.currentIndex)
              , text (" | Sorted: " ++ (if track.sorted then "Yes" else "No"))
              ]

          -- Breakdown
        , div [ class "variable-list" ]
              [ ul []
                  [ li [] [ text "Outer Index: tracks the last element of the sorted section of the array." ]
                  , li [] [ text "Current index: tracks the element being moved to it's correct relative location." ]
                  , li [] [ text "Sorted: tells us once the array is sorted." ]
                  ]
              ]

          -- Big-O Notation
        , div [ class "big-o-title" ]
              [ text """Big(O) Notation""" ]
        , div [ class "big-o-list" ]
            [ div [ class "big-o-item" ]
                [ div [] [ text "Best-Case" ]
                , div [] [ text "O(n)" ]
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
