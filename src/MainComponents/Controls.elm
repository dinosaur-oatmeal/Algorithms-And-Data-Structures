module MainComponents.Controls exposing (ControlMsg(..), view)

-- HTML imports
import Html exposing (Html, button, div, text, span)
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
    -- Control button container
    div [ class "control-buttons" ]
        [ if running then
            -- Pause if algorithm is running
            button [ class "sorting-button", onClick (toMsg Pause) ]
                [ span [ class "button-text" ] [ text "Pause" ] ]
          else
            -- Run if algorithm isn't running
            button [ class "sorting-button", onClick (toMsg Run) ]
                [ span [ class "button-text" ] [ text "Run" ] ]
        , button [ class "sorting-button", onClick (toMsg Step) ]
            [ span [ class "button-text" ] [ text "Step" ] ]
        , button [ class "sorting-button", onClick (toMsg Reset) ]
            [ span [ class "button-text" ] [ text "Reset" ] ]
        ]
