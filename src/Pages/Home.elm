module Pages.Home exposing (view, Msg(..))

-- HTML imports
import Html exposing (Html, div, h1, select, option, text)
import Html.Attributes exposing (class, style, attribute)
import Html.Events exposing (onInput)

-- Only message is the Algorithm selected
type Msg
    = SelectAlgorithm String

view : Html Msg
view =
    div [ class "landing-page" ]
        [ h1 [ class "title" ] [ text "Sorting Algorithm Visualizer" ]
        , div [ class "dropdown-container" ]
            [ select [ class "dropdown", onInput SelectAlgorithm ]
                [ 
                -- Default for dropdown
                option [ attribute "value" "" ] [ text "Select Algorithm" ]
                -- BubbleSort Page selected
                , option [ attribute "value" "Bubble Sort" ] [ text "Bubble Sort" ]
                ]
            ]
        , div [ class "footer" ]
            [ text "Learn and explore various sorting algorithms with interactive visualizations." ]
        ]
