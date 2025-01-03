module Controls exposing (ControlMsg(..), view)

-- HTML imports
import Html exposing (Html, button, div, text)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)

-- Button messages for controls
type ControlMsg
    = Run
    | Pause
    | Reset
    | Step

-- VIEW
view : Bool -> (ControlMsg -> msg) -> Html msg
view running toMsg =
    div [ class "control-buttons" ]
        -- Show "Pause" if running, else show "Run"
        [ if running then
            button [ class "sorting-button", onClick (toMsg Pause) ] [ text "Pause" ]
          else
            button [ class "sorting-button", onClick (toMsg Run) ] [ text "Run" ]
        , button [ class "sorting-button", onClick (toMsg Step) ] [ text "Step" ]
        , button [ class "sorting-button", onClick (toMsg Reset) ] [ text "Reset" ]
        ]
