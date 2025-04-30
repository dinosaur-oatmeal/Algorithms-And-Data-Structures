-- Expose everything needed by Main.elm
module MainComponents.Home exposing (..)

-- HTML imports
import Html exposing (Html, div, text, h1)
import Html.Attributes exposing (class)

-- Used for typing and array swap effects
import Array exposing (Array)
import String
import Random
import Time

import MainComponents.Structs exposing (HomeState, Theme(..), defaultHomeState)

-- Used to render background bar chart
import SortingAlgorithms.SortingVisualization as Visualization exposing(renderBackgroundBars)

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
initModel : HomeState
initModel =
    defaultHomeState


-- UPDATE
update : Msg -> HomeState -> ( HomeState, Cmd Msg )
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
            -- Add letters to String (keep string fully typed for a bit longer)
            if model.typingIndex < ( String.length model.targetString + 5 ) && not model.typingFlag then
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
            ( { model
                | backgroundArray = swap indexOne indexTwo model.backgroundArray
                , indexOne = indexOne
                , indexTwo = indexTwo
              }
            , Cmd.none
            )


-- SUBSCRIPTIONS
subscriptions : HomeState -> Sub Msg
subscriptions model =
    -- Only ran on Home Page
    Sub.batch
        -- Update typing every 0.2 seconds
        [ Time.every 200 (always TypingSimulation)
        -- Update array every 1 second
        , Time.every 1000 (always SwapNeeded)
        ]

-- VIEW
view : HomeState -> Html Msg
view model =
    div [ class "home-container" ]
        [ -- Renders the background bar chart given the array and indices being swapped
          renderBackgroundBars model.backgroundArray model.indexOne model.indexTwo

          -- Title string
        , h1 [ class "home-typed-title" ]
            [ text (String.left model.typingIndex model.targetString) ]

          -- Description text
        , div [ class "home-text" ]
            [ text "Select an algorithm to walkthrough from the dropdowns above." ]
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
                
