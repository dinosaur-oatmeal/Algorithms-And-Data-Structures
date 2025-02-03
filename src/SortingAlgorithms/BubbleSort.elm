module SortingAlgorithms.BubbleSort exposing (view, bubbleSortStep)

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

bubbleSortStep : SortingTrack -> SortingTrack
bubbleSortStep track =
    let
        arr = track.array
        outerIndex = track.outerIndex
        currentIndex = track.currentIndex
        length = Array.length arr
    in

    -- Array already sorted
    if track.sorted then
        track

    else
        if currentIndex < length then
            -- Compare outer and current values
            case (Array.get outerIndex arr, Array.get currentIndex arr) of
                (Just leftVal, Just rightVal) ->
                    if leftVal > rightVal then
                        let
                            -- Swap elements in array
                            swappedArray =
                                Array.set outerIndex rightVal
                                    (Array.set currentIndex leftVal arr)
                        in
                        -- Update track to reflect new array
                        { track
                            | array = swappedArray
                            , outerIndex = outerIndex + 1
                            , currentIndex = currentIndex + 1
                            , didSwap = True
                        }

                    -- Go to next Element in array
                    else
                        { track
                            | outerIndex = outerIndex + 1
                            , currentIndex = currentIndex + 1
                        }

                -- Default constructor
                _ ->
                    track
        -- Go to next pass and update to see if the array is sorted
        else
            { track
                | outerIndex = 0
                , currentIndex = 1
                , sorted = not track.didSwap
                , didSwap = False
            }


{-
    Basic page view for Bubble Sort
        Title, Description, Graph, Buttons, Variables, Breakdown, & Big-O Notation
        (ControlMsg -> msg) is ControlMsg in Main.elm
-}
view : SortingTrack -> Bool -> (ControlMsg -> msg) -> Html msg
view track running toMsg =
    div [ class "sort-page" ]
        [ -- Title
          div [ class "sort-title" ]
              [ text "Bubble Sort" ]

          -- Description
        , div [ class "description" ]
              [ text """Bubble Sort is one of the simplest sorting algorithms. It steps through the array one element at a time,
                comparing and swapping adjacent elements if the right one is less than the left one.
                It does this repeatedly until the array is sorted.""" ]

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
              [ text ("Current Index: " ++ String.fromInt track.outerIndex)
              , text (" | Next Index: " ++ String.fromInt track.currentIndex)
              , text (" | Element Swapped: " ++ (if track.didSwap then "Yes" else "No"))
              , text (" | Sorted: " ++ (if track.sorted then "Yes" else "No"))
              ]

          -- Breakdown
        , div [ class "variable-list" ]
              [ ul []
                  [ li [] [ text "Current Index: the left index being compared." ]
                  , li [] [ text "Next Index: the right index being compared." ]
                  , li []
                      [ text "Element Swapped: tells us if an element has been swapped on the current pass of the array." 
                      , ul []
                          [ li [] [ text "If no elements were swapped, then the array is sorted." ] ]
                      ]
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
