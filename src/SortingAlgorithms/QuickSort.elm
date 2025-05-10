module SortingAlgorithms.QuickSort exposing (view, quickSortStep)

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

quickSortStep : SortingTrack -> SortingTrack
quickSortStep track =
    case track.stack of
        [] ->
            -- Sorted if stack is empty
            { track
                | sorted = True
            }

        (low, high) :: rest ->
            -- Range is valid to be sorted
            if low < high then
                let
                    -- Partition array and get pivot index
                    (pivotIndex, newTrack) = partition low high track

                    -- Push left and right subarrays onto stack
                    newStack =
                        (low, pivotIndex - 1) :: (pivotIndex + 1, high) :: rest
                in
                -- Update track for next pass in
                { newTrack
                    | stack = newStack
                    , currentStep = track.currentStep + 1
                    , outerIndex = pivotIndex
                    , currentIndex = low
                }
            else
                -- Invalid range (already sorted), delete subarrays on stack
                { track
                    | stack = rest
                }

partition : Int -> Int -> SortingTrack -> (Int, SortingTrack)
partition low high track =
    let
        -- Pivot is rightmost element
        pivot = Array.get high track.array |> Maybe.withDefault 0
        
        -- Helper function to process each element in subarray
        loop (currentTrack, partitionIndex) currentIndex =
            let
                -- Get currentElement being processed
                currentElement = Array.get currentIndex currentTrack.array |> Maybe.withDefault 0
            in
            if currentElement < pivot then
                let
                    -- Swap current element with partition index if < pivot value
                    updatedArray = swap currentIndex partitionIndex currentTrack.array
                in
                ( { currentTrack |
                    array = updatedArray }
                    , partitionIndex + 1
                )
            else
                -- Don't do anything if current element >= partition index
                (currentTrack, partitionIndex)

        -- Iterate through range of subarray
        (newTrack, pivotIndex) =
            List.foldl
                (\currentIndex acc -> loop acc currentIndex)
                (track, low)
                (List.range low (high - 1))

        -- Swap pivot element into correct position at end
        finalArray = swap pivotIndex high newTrack.array
    in
    -- Return final pivot index and updated SortingTrack
    ( pivotIndex, { newTrack | array = finalArray } )

-- Helper function to swap two elements in an array
swap : Int -> Int -> Array Int -> Array Int
swap indexOne indexTwo arr =
    let
        -- Grab Elements to be swapped
        elementOne = Array.get indexOne arr |> Maybe.withDefault 0
        elementTwo = Array.get indexTwo arr |> Maybe.withDefault 0
    in
    arr
        -- Swap position of elements in array
        |> Array.set indexOne elementTwo
        |> Array.set indexTwo elementOne


{-
    Basic page view for Quick Sort
        Title, Description, Graph, Buttons, Variables, Breakdown, & Big-O Notation
        (ControlMsg -> msg) is ControlMsg in Main.elm
-}
view : SortingTrack -> Bool -> (ControlMsg -> msg) -> Html msg
view track running toMsg =
    div [ class "sort-page" ]
        [ -- Title
          div [ class "sort-title" ]
              [ text "Quick Sort" ]

          -- Description
        , div [ class "description" ]
              [ text """Quick Sort selects a pivot element and partitions the array around it
                (the rightmost element in this example).
                During partitioning, elements that are smaller than the pivot are to the left,
                and elements larger than the pivot are to the right.
                The algorithm recursively applies the partitioning to the left and right subarrays
                until the greater array is fully sorted (one element in the left subarray).""" ]

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

        -- Current action
        , renderAction track

          -- Variables
        , div [ class "indices" ]
              [ text ("Pivot Index: " ++ String.fromInt track.outerIndex)
              , text (" | Current Index: " ++ String.fromInt track.currentIndex)
              , text (" | Sorted: " ++ (if track.sorted then "Yes" else "No"))
              ]

          -- Breakdown
        , div [ class "variable-list" ]
              [ ul []
                  [ li [] [ text "Pivot Index: the index where the pivot is." ]
                  , li [] [ text "Current Index: the leftmost index of the subarray." ]
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
            [ text "Space Complexity: O(n)" ]
        ]

-- Convert SortingTrack to a string
renderAction : SortingTrack -> Html msg
renderAction track =
    case track.stack of
        (low, high) :: _ ->
            div [ class "current-action quick" ]
                [ text ("Partitioning: [" ++ String.fromInt low ++ " - " ++ String.fromInt high ++ "]") ]

        [] ->
            div [ class "current-action done" ]
                [ text "Sorting complete!" ]
