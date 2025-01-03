module Pages.SelectionSort exposing (view, selectionSortStep)

import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Array exposing (Array)
import Structs exposing (SortingTrack)
import Visualization exposing (renderComparison)

{-
  One step of selection sort.
  Takes current track and returns new track.
-}
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
    Title, Description, Graph, Variables, Breakdown
-}
view : SortingTrack -> Html msg
view track =
    div [ class "sort-page" ]

        -- Title
        [ div [ class "title" ]
            [ text "Selection Sort" ]

        -- Description
        , div [ class "description" ]
            [ text "Selection Sort picks the smallest element and swaps it with the leftmost unsorted position." ]
        
        -- Calls Visualization.elm (Graph)
        , renderComparison
            track.array
            "Walk through the steps below"
            track.sorted
            track.outerIndex
            track.currentIndex
            -- Pass minIndex!
            (Just track.minIndex)

        -- Variables (track as state changes)
        , div [ class "indices" ]
            [ text ("Outer Index: " ++ String.fromInt track.outerIndex)
            , text (" | Current Index: " ++ String.fromInt track.currentIndex)
            , text (" | Min Index: " ++ String.fromInt track.minIndex)
            , text (" | Element Swapped: " ++ (if track.didSwap then "Yes" else "No"))
            , text (" | Sorted: " ++ (if track.sorted then "Yes" else "No"))
            ]
            
        -- Breakdown
        , div [ class "description" ]
            [ text """Breakdown...""" ]
        ]
