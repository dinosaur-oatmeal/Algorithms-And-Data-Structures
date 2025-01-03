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
        , style "width" "150%"
        , style "height" "200px"
        , style "padding" "10px"
        ]
        [ div 
            [ style "font-size" "20px" -- Larger font for title
            , style "margin-bottom" "10px"
            , style "font-weight" "bold"
            ]
            [ text title ]
        , div 
            [ style "display" "flex"
            , style "align-items" "flex-end"
            , style "justify-content" "center"
            , style "height" "300px"
            , style "padding" "10px"
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
                "linear-gradient(180deg, #4CAF50, #81C784)" -- Gradient green when sorted
            else if isOuter then
                "linear-gradient(180deg, #FF5722, #FF8A65)" -- Gradient red for outer index
            else if isMin then
                "linear-gradient(180deg, #FFA500, #FFD54F)" -- Gradient orange for minIndex
            else if isCurrent then
                "linear-gradient(180deg, #FFC107, #FFE082)" -- Gradient yellow for currentIndex
            else
                "linear-gradient(180deg, #2196F3, #64B5F6)" -- Gradient blue otherwise

    in
    div 
    -- Wrapper for the bar and value
    [ style "display" "flex"
    , style "flex-direction" "column"
    , style "align-items" "center"
    , style "margin" "2px"
    ]
    [ div 
        -- Styling for each bar in chart
        [ class "sorting-bar"
        , style "height" (String.fromInt (value * 10) ++ "px")
        , style "background-image" barColor -- Use `background-image` for gradients
        , style "width" "40px"
        , style "border-radius" "5px"
        , style "transition" "height 0.5s ease, background-color 0.5s ease"
        ]
        []
    , div
        -- Styling for the value text below the bar
        [ class "indices"
        , style "font-size" "16px"
        , style "margin-top" "10px"
        ]
        [ text (String.fromInt value) ]
    ]
