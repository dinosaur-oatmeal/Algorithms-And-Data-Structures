-- Expose everything needed by Main.elm
module Pages.Home exposing (Model, Theme(..), Msg(..), initModel, update, view, subscriptions)

-- HTML imports
import Html exposing (Html, div, text, h1)
import Html.Attributes exposing (class)

-- Used for typing and array swap effects
import Array exposing (Array)
import String
import Random
import Time

-- Used to render background bar chart
import Visualization exposing(renderBackgroundBars)

-- Theme type for dark/light mode
type Theme
    = Dark
    | Light

-- MODEL
type alias Model =
    -- Website theme
    { theme : Theme
    -- Array for swaps to take place
    , backgroundArray : Array Int
    -- Index of typing simulation for title
    , typingIndex : Int
    -- Final string typed before deleting
    , targetString : String
    -- Determines whether to add or remove letter from string
    , typingFlag : Bool
    }

-- HOME-SPECIFIC MESSAGES
type Msg
    -- Update theme
    = ToggleTheme
    -- Title typing updates
    | TypingSimulation
    -- Grab and Swap indices in background array
    | SwapNeeded
    -- Swaps indices in array
    | IndexSwap ( Int, Int )

-- INIT (initial state of model)
initModel : Model
initModel =
    -- Default to the superior theme
    { theme = Dark
    -- Start with this array
    , backgroundArray = Array.fromList [ 5, 3, 7, 10, 2, 1, 9, 6, 3, 12, 4, 11, 8, 2, 7, 5, 3, 9, 6, 10 ]
    -- Start at the first index
    , typingIndex = 0
    -- Complete title
    , targetString = "Algorithms and Data Structures"
    -- Whole word has not yet been typed
    , typingFlag = False
    }


-- UPDATE
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        -- Swap theme as needed
        ToggleTheme ->
            let
                switched =
                    case model.theme of
                        Light ->
                            Dark

                        Dark ->
                            Light
            in
            ( { model | theme = switched }, Cmd.none )

        -- Typing Effect on title
        TypingSimulation ->
            -- Add letters to String
            if model.typingIndex < String.length model.targetString && not model.typingFlag then
                ( { model | typingIndex = model.typingIndex + 1 }, Cmd.none )

            -- Remove letters from String
            else if model.typingIndex > 1 && model.typingFlag then
                ( { model | typingIndex = model.typingIndex - 1 }, Cmd.none )

            -- Change directions
            else
                ( { model | typingFlag = not model.typingFlag }, Cmd.none )

        -- Retrives and swaps values in array
        SwapNeeded ->
            let
                arrLength =
                    Array.length model.backgroundArray

                randomCmd =
                    -- Call IndexSwap on random indices
                    Random.generate IndexSwap
                        (Random.pair
                            (Random.int 0 (arrLength - 1))
                            (Random.int 0 (arrLength - 1))
                        )
            in
            ( model, randomCmd )

        -- Swap indices in array
        IndexSwap ( indexOne, indexTwo ) ->
            -- Call swap function for elements
            ( { model | backgroundArray = swap indexOne indexTwo model.backgroundArray }, Cmd.none )


-- SUBSCRIPTIONS
subscriptions : Model -> Sub Msg
subscriptions model =
    -- Only ran on Home Page
    Sub.batch
        -- Update typing every 0.2 seconds
        [ Time.every 200 (always TypingSimulation)
        -- Update array every 1 second
        , Time.every 1000 (always SwapNeeded)
        ]


-- HELPER to swap array elements
swap : Int -> Int -> Array Int -> Array Int
swap indexOne indexTwo array =
        case ( Array.get indexOne array, Array.get indexTwo array ) of
            -- Values are swapped
            ( Just valueOne, Just valueTwo ) ->
                array
                    |> Array.set indexOne valueTwo
                    |> Array.set indexTwo valueOne

            -- Default (never used)
            _ ->
                array


-- VIEW
view : Model -> Html Msg
view model =
    div [ class "home-container" ]
        [ -- Renders the background bar chart given the array
          renderBackgroundBars model.backgroundArray

          -- Title string
        , h1 [ class "home-typed-title" ]
            [ text (String.left model.typingIndex model.targetString) ]

          -- 
        , div [ class "home-text" ]
            [ text "Select and algorithm to learn about from the dropdown above." ]
        ]
