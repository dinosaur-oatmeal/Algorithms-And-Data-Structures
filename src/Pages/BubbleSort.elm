module Pages.BubbleSort exposing (view, bubbleSortStep)

-- HTML Imports
import Html exposing (Html, div, text, button)
import Html.Attributes exposing (style, class)
import Html.Events exposing (onClick)

import Array exposing(Array)

-- Import necessary structures to track state
import Structs exposing (SortingTrack)

-- Import visualization for graph
import Visualization exposing (renderComparison)

-- One step of BubbleSort
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
                (Just outerValue, Just currentValue) ->
                    if outerValue > currentValue then
                        let
                            -- Swap elements in array
                            updatedArray =
                                Array.set outerIndex currentValue (Array.set currentIndex outerValue arr)
                        in
                        -- Update track to reflect new array
                        { track
                            | array = updatedArray
                            , outerIndex = outerIndex + 1
                            , didSwap = True
                            , currentIndex = currentIndex + 1
                        }
                    -- Go to next element in array
                    else
                        { track
                            | outerIndex = outerIndex + 1
                            , didSwap = track.didSwap
                            , currentIndex = currentIndex + 1
                        }

                -- Default constructor
                _ ->
                    track

        -- Go to next pass and update to see if the array is sorted
        else
            let
                -- Determine if array is sorted based on swaps
                isSorted = not track.didSwap
            in
            -- Update track to reflect sorted state
            { track
                | outerIndex = 0
                , currentIndex = 1
                , sorted = isSorted
                , didSwap = False
            }

-- The 'view' function now takes the track and **a single message** to dispatch
view : SortingTrack -> msg -> Html msg
view track nextBubbleSortMsg =
    div [ class "bubble-sort-page" ]
        [ div [ class "description" ]
            [ text "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the array is sorted. The algorithm is known for its simplicity but is not suitable for large datasets." ]
        , renderComparison track.array "Bubble Sort Visualization" track.sorted track.outerIndex track.currentIndex Nothing
        , div [ class "indices" ]
            [ text ("Outer Index: " ++ String.fromInt track.outerIndex)
            , text (" | Current Index: " ++ String.fromInt track.currentIndex)
            , text (" | Did Swap: " ++ (if track.didSwap then "Yes" else "No"))
            , text (" | Sorted: " ++ (if track.sorted then "Yes" else "No"))
            ]
        , div [ class "step-button" ]
            [ button [ onClick nextBubbleSortMsg, class "next-step-button" ]
                [ text "Next Step" ]
            ]
        ]