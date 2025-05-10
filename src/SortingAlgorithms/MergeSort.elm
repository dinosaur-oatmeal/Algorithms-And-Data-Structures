module SortingAlgorithms.MergeSort exposing (view, mergeSortStep)

-- HTML Imports
import Html exposing (Html, div, text, ul, li)
import Html.Attributes exposing (class)

import Array exposing (Array, length, get, slice, append, fromList, empty)
import List exposing (drop, length)

-- Import necessary structure to track state
import MainComponents.Structs exposing (SortingTrack)

-- Import SortingVisualization for graph
import SortingAlgorithms.SortingVisualization as Visualization exposing (renderComparison)

-- Import for control buttons (used in view)
import MainComponents.Controls  as Controls exposing (ControlMsg, view)

-- Whether to split subarray or merge subarray
type Action
    = Split Int Int
    | Merge Int Int

-- Build list of splits and merges to make
generateActions : Int -> Int -> List Action
generateActions start len =
    -- Don't make an action for nothing
    if len <= 1 then
        []
    else
        let
            -- Find midpoint and left and right subarrays
            mid = start + (len // 2)
            leftLen  = mid - start
            rightLen = start + len - mid
        in
        -- Split subarrays and recursively call again
        [ Split start len ]
            ++ generateActions start leftLen
            ++ generateActions mid rightLen
            -- Finally merge 2 subarrays together
            ++ [ Merge start len ]

-- Do a single step of merge sort
mergeSortStep : SortingTrack -> SortingTrack
mergeSortStep track =
    -- Don't update track if sorted
    if track.sorted then
        track
    else
        let
            -- Generate all actions to take
            length = Array.length track.array
            actions = generateActions 0 length
            total = List.length actions
            idx = track.currentStep
        in
        -- Mark sorted as true
        if idx >= total then
            { track | sorted = True }
        else
            let
                -- Pick current action
                action =
                    case drop idx actions of
                        a :: _ -> a
                        _ -> Split 0 1

                -- Step to next action
                nextStep = idx + 1

                -- Decode start and length
                ( start, len ) =
                    case action of
                        Split s l  -> ( s, l )
                        Merge s l  -> ( s, l )

                -- Compute middle and end position
                mid = start + (len // 2)
                end = start + len - 1

                newArray =
                    case action of
                        -- Don't update for split (just for visuals)
                        Split _ _ ->
                            track.array

                        -- Slice left and right halves
                        Merge s l ->
                            let
                                -- Left and right halves to be merged
                                left  = slice s mid track.array
                                right = slice mid (end + 1) track.array

                                -- Two pointers to merge back into a single array
                                merged =
                                    let
                                        step li ri acc =
                                            case ( get li left, get ri right ) of
                                                ( Just lv, Just rv ) ->
                                                    -- Append left and then right
                                                    if lv < rv then
                                                        step (li + 1) ri (append acc (fromList [ lv ]))
                                                    -- Append right and then left
                                                    else
                                                        step li (ri + 1) (append acc (fromList [ rv ]))

                                                -- Just append left values
                                                ( Just lv, Nothing ) ->
                                                    step (li + 1) ri (append acc (fromList [ lv ]))

                                                -- Just append right values
                                                ( Nothing, Just rv ) ->
                                                    step li (ri + 1) (append acc (fromList [ rv ]))

                                                -- Return fully-merged result
                                                ( Nothing, Nothing ) ->
                                                    acc

                                    in
                                    step 0 0 empty

                                -- Splice back into before ++ merged ++ after
                                before = slice 0 s track.array
                                after  = slice (end + 1) length track.array
                            in
                            append (append before merged) after
            in
            { track
                -- Update array to new version
                | array        = newArray
                , currentStep  = nextStep
                , outerIndex   = start
                , currentIndex = mid - 1
                , minIndex     = end
                , sorted       = False
            }

view : SortingTrack -> Bool -> (Controls.ControlMsg -> msg) -> Html msg
view track running toMsg =
    div [ class "sort-page" ]
        [ -- Title
          div [ class "sort-title" ]
              [ text "Merge Sort" ]

          -- Description
        , div [ class "description" ]
              [ text """Merge Sort is a divide-and-conquer sorting algorithm
                that recursively splits an array into smaller subarrays.
                This splitting occurs until each subarray contains one element.
                Then, it merges these subarrays together in sorted order.
                Every merge step ensures that the combined subarrays are sorted,
                resulting in the larger array being fully sorted.""" ]

          -- Visualization
        , renderComparison
              track.array
              "Walk through the steps below"
              track.sorted
              track.outerIndex
              track.currentIndex
              (Just track.minIndex)

          -- Buttons (calls Controls.elm to be rendered)
            -- Allows button actions to be routed to Main.elm
        , Controls.view running toMsg

          -- Variables
        , div [ class "indices" ]
            [ text ("Start: " ++ String.fromInt track.outerIndex)
            , text (" | Mid: " ++ String.fromInt track.currentIndex)
            , text (" | End: " ++ String.fromInt track.minIndex)
            , text (" | Sorted: " ++ (if track.sorted then "Yes" else "No"))
            ]

          -- Breakdown
        , div [ class "variable-list" ]
            [ ul []
                [ li [] [ text "Start: the inclusive start index of this action." ]
                , li [] [ text "Mid: the midpoint (exclusive for the left slice)." ]
                , li [] [ text "End: the inclusive end index of this action." ]
                , li [] [ text "Sorted: true once we’ve run out of actions." ]
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
                , div [] [ text "O(n log(n))" ]
                ]
            ]
        , div [ class "space-complexity" ]
            [ text "Space Complexity: O(n)" ]
        ]
