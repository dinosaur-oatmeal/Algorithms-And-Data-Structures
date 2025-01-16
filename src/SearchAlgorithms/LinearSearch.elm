module SearchAlgorithms.LinearSearch exposing (linearSearchStep, view)

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

linearSearchStep : SortingTrack -> SortingTrack
linearSearchStep track =
    let
        arr = track.array
        -- Current index being looked at
        scanningIndex = track.outerIndex
        -- Target index to find
        target = track.currentIndex
        length = Array.length arr
    in
    -- Don't update if value found
    if track.sorted then
        track
    else
        if scanningIndex == target then
            -- Found target index
            { track
                | sorted = True
            }
        else if scanningIndex + 1 < length then
            -- Continue scanning for index
            { track
                | outerIndex = scanningIndex + 1
                , currentStep = track.currentStep + 1
            }
        else
            -- Reached end without finding target index
            { track
                | sorted = False
                , currentStep = track.currentStep
            }

{-
    Basic page view for Linear Search
        Title, Description, Graph, Buttons, Variables, Breakdown, & Big-O Notation
        (ControlMsg -> msg) is ControlMsg in Main.elm
-}
view : SortingTrack -> Bool -> (ControlMsg -> msg) -> Html msg
view track running toMsg =
    div [ class "sort-page" ]
        [ -- Title
          div [ class "sort-title" ]
              [ text "Linear Search" ]

          -- Description
        , div [ class "description" ]
              [ text """Linear Search is the easiest searching algorithm.
              It starts at the first element in the list and searches the list until it finds the target element or hits the end of the list.
              If the target element in found, the searching stops and sees that the element is in the list.""" ]

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
              , text (" | Target: " ++ String.fromInt track.gap)
              , text (" | Element Found: " ++ (if track.sorted then "Yes" else "No"))
              ]

          -- Breakdown
        , div [ class "variable-list" ]
              [ ul []
                  [ li [] [ text "Current Index: index being compared to what we're searching for." ]
                  , li [] [ text "Target: element we want to find." ]
                  , li [] [ text "Element Found: tells us whether or not the element has been found in the list." ]
                  ]
              ]

          -- Big-O Notation
        , div [ class "big-o-title" ]
              [ text """Big(O) Notation""" ]
        , div [ class "big-o-list" ]
            [ div [ class "big-o-item" ]
                [ div [] [ text "Best-Case" ]
                , div [] [ text "O(1)" ]
                ]
            , div [ class "big-o-item" ]
                [ div [] [ text "Average-Case" ]
                , div [] [ text "O(n)" ]
                ]
            , div [ class "big-o-item" ]
                [ div [] [ text "Worst-Case" ]
                , div [] [ text "O(n)" ]
                ]
            ]
        ]
