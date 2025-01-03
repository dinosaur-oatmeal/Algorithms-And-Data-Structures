module Pages.SelectionSort exposing (view, selectionSortStep)

-- HTML Imports
import Html exposing (Html, div, text, button)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)

import Array exposing (Array)

-- Import necessary structures to track state
import Structs exposing (SortingTrack)

-- Import visualization for graph
import Visualization exposing (renderComparison)

-- One step of SelectionSort
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

-- View
view : SortingTrack -> msg -> Html msg
view track nextSelectionSortMsg =
    div [ class "sort-page" ]
        [ div [ class "title" ]
            [ text "Selection Sort" ]
        , div [ class "description" ]
            [ text """Selection Sort...""" ]
        -- Calls Visualization.elm
        , renderComparison
            track.array
            "Walk through the steps below"
            track.sorted
            track.outerIndex
            track.currentIndex
            (Just track.minIndex)
        , div [ class "indices" ]
            [ text ("Outer Index: " ++ String.fromInt track.outerIndex)
            , text (" | Current Index: " ++ String.fromInt track.currentIndex)
            , text (" | Min Index: " ++ String.fromInt track.minIndex)
            , text (" | Element Swapped: " ++ (if track.didSwap then "Yes" else "No"))
            , text (" | Sorted: " ++ (if track.sorted then "Yes" else "No"))
            ]
        , div [ class "step-button" ]
            [ button [ onClick nextSelectionSortMsg, class "next-step-button" ]
                [ text "Next Step" ]
            ]
        , div [ class "description" ]
            [ text """Description...""" ]
        ]
