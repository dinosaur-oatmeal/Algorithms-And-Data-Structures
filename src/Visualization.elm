module Visualization exposing (renderComparison)

-- HTML Elements
import Html exposing (Html, div, text)
import Html.Attributes exposing (style, class)

-- Array
import Array exposing (Array)


renderComparison : 
    -- Array being sorted
    Array Int 
    -- Name of sorting algorithm
    -> String 
    -- Flag if the array is currently sorted
    -> Bool 
    -- outerIndex for nested loops
    -> Int
    -- currentIndex to see current value being sorted
    -> Int
    -- minIndex for SelectionSort
    -> Maybe Int
    -- Output an HTML message
    -> Html msg

renderComparison array title sorted outerIndex currentIndex maybeMinIndex =
    div 
        [ style "display" "flex"
        , style "flex-direction" "column"
        , style "align-items" "center"
        , style "width" "100%"
        , style "height" "250px"
        , style "padding" "10px"
        ]
        [ div 
            [ style "font-size" "15px"
            , style "margin-bottom" "5px"
            , style "font-weight" "bold"
            ]
            [ text title ]
        , div 
            [ style "display" "flex"
            , style "align-items" "flex-end"
            , style "justify-content" "center"
            , style "height" "150px"
            , style "padding" "5px"
            ]
            (Array.toList array |> List.indexedMap (renderBar sorted outerIndex currentIndex maybeMinIndex))
        ]

renderBar :
    -- Flag if the array is currently sorted
    Bool 
    -- outerIndex for nested loops
    -> Int 
    -- currentIndex to see current value being sorted
    -> Int 
    -- minIndex for SelectionSort
    -> Maybe Int 
    -- Position for coloring
    -> Int 
    -- Value for value in current index
    -> Int 
    -> Html msg

renderBar sorted outerIndex currentIndex maybeMinIndex position value =
    let
        -- Outer index position
        isOuter = position == outerIndex
        
        -- Current index position
        isCurrent = 
            case currentIndex of
                ci -> position == ci

        -- Minimum index position (if used)
        isMin = 
            case maybeMinIndex of
                Just mi -> position == mi
                Nothing -> False

        barColor =
            if sorted then
                "#4CAF50" -- Green when sorted
            else if isOuter then
                "#FF5722" -- Red for outer index
            else if isMin then
                "#FFA500" -- Orange for minIndex in selection sort
            else if isCurrent then
                "#FFC107" -- Yellow for currentIndex
            else
                "#2196F3" -- Blue otherwise
    in
    div 
        -- Styling for each bar in chart
        [ class "sorting-bar"
        , style "height" (String.fromInt (value * 5) ++ "px")
        , style "background-color" barColor
        , style "margin" "1px"
        , style "transition" "height 0.5s ease, background-color 0.5s ease"
        ]
        []
