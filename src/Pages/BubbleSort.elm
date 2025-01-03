module Pages.BubbleSort exposing (view, bubbleSortStep)

-- HTML Imports
import Html exposing (Html, div, text, button)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)

import Array exposing (Array)

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
            case ( Array.get outerIndex arr, Array.get currentIndex arr ) of
                (Just outerValue, Just currentValue) ->
                    if outerValue > currentValue then
                        let
                            -- Swap elements in array
                            updatedArray =
                                Array.set outerIndex currentValue
                                    (Array.set currentIndex outerValue arr)
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


-- View
view : SortingTrack -> msg -> Html msg
view track nextBubbleSortMsg =
    div [ class "bubble-sort-page" ]
        [ div [ class "title" ]
            [ text "Bubble Sort" ]
        , div [ class "description" ]
            [ text """Bubble Sort is a simple sorting algorithm that steps through an array one element at a time.
            It compares adjacent elements and swaps them if the right one is less than the left one.
            It does this repeatedly until the array is sorted.""" ]
        -- Calls Visualization.elm
        , renderComparison
            track.array
            "Walk through the steps below"
            track.sorted
            track.outerIndex
            track.currentIndex
            Nothing
        , div [ class "indices" ]
            [ text ("Outer Index: " ++ String.fromInt track.outerIndex)
            , text (" | Current Index: " ++ String.fromInt track.currentIndex)
            , text (" | Element Swapped: " ++ (if track.didSwap then "Yes" else "No"))
            , text (" | Sorted: " ++ (if track.sorted then "Yes" else "No"))
            ]
        , div [ class "step-button" ]
            [ button [ onClick nextBubbleSortMsg, class "next-step-button" ]
                [ text "Next Step" ]
            ]
        , div [ class "description" ]
            [ text """Outer index is the left index being compared.
            Current index is the right index being compared.
            Checking if an element was swapped in the current pass is how we detect if it's sorted.
            If no elements were swapped in a pass, the array is sorted.""" ]
        ]
