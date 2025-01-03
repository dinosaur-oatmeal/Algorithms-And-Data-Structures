module Pages.Home exposing (Model, Theme(..), Msg(..), view, update)

import Html exposing (Html, div, text, h1)
import Html.Attributes exposing (class)

-- Theme type for dark/light mode
type Theme
    = Dark
    | Light


-- Model
type alias Model =
    { theme : Theme }


-- Only message is changing the theme
type Msg
    = ToggleTheme


-- Update
update : Msg -> Model -> Model
update msg model =
    case msg of
        ToggleTheme ->
            { model
                | theme =
                    if model.theme == Light then
                        Dark
                    else
                        Light
            }


-- View
view : Model -> Html Msg
view model =
    div [ class "home-container" ]
        [ h1 [ class "home-title" ]
            [ text "Welcome to the Sorting Visualizer Home Page!" ]
        , div [ class "home-text" ]
            [ text "Use the dropdown above to select a sorting algorithm, "
            , text "and the circular icon in the bottom-right to toggle themes."
            ]
        ]