module SortingAlgorithms.SortingVisualization exposing (renderComparison, renderBackgroundBars)

-- HTML Elements
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, style)

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
        [ class "bar-chart"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "align-items" "center"
        , style "width" "150%"
        , style "height" "400px"
        , style "padding" "10px"
        ]
        [ div 
            [ style "font-size" "20px"
            , style "margin-bottom" "35px"
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
            -- Render each bar in chart
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
                _ -> False

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
        , style "border-radius" "5px"
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

-- Renders background from Home.elm
    -- Needs to be different from previous renders for z-index and blur
renderBackgroundBars : Array Int -> Int -> Int -> Html msg
renderBackgroundBars array indexOne indexTwo =
    div
        [ style "position" "absolute"
        , style "top" "0"
        , style "left" "0"
        , style "width" "100%"
        , style "height" "100%"
        , style "display" "flex"
        , style "justify-content" "center"
        , style "align-items" "flex-end"
        , style "z-index" "-1"
        , style "filter" "blur(10px) opacity(0.9)"
        , style "pointer-events" "none"
        ]
        (Array.toList array
            |> List.indexedMap
                (\idx val ->
                    let
                        -- Booleans to determine what color to make each bar
                        isOne = idx == indexOne
                        isTwo = idx == indexTwo

                        -- Set bar color accordingly
                        barColor =
                            if isOne then
                                "linear-gradient(180deg, #FF5722, #FF8A65)" -- Index one color
                            else if isTwo then
                                "linear-gradient(180deg, #FFC107, #FFE082)" -- Index two color
                            else
                                "linear-gradient(180deg, #2196F3, #64B5F6)" -- Default color
                    in
                    div
                        [ style "width" "100px"
                        , style "margin" "0 10px"
                        -- Increase Height for home page
                        , style "height" (String.fromInt (val * 30) ++ "px")
                        , style "background-image" barColor
                        , style "transition" "height 0.5s ease"
                        ]
                        []
                )
        )
