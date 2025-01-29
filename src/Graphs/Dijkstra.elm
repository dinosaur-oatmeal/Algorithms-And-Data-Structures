module Graphs.Dijkstra exposing (..)

-- HTML Imports
import Html exposing (Html, div, button, text)
import Html.Events exposing (onClick)

import Random

-- Import necessary structure to track state
import MainComponents.Structs exposing (Graph, GraphNode, Edge, randomGraphGenerator)

-- Import GraphVisualization for visualization
import Graphs.GraphVisualization as Vizualization

-- MODEL
type alias Model =
    -- Graph that is being rendered
    { graph : Graph
    -- Current index of algorithm to highlight
    , currentIndex : Int
    -- Flag if algorithm is running or not
    , running : Bool
    }


type Msg
    -- Generate a new graph
    = GenerateGraph
    -- Helper to set model's graph to new graph
    | GotGraph Graph

-- INIT
initModel : Model
initModel =
    { graph = { nodes = [], edges = [] }
    , currentIndex = 0
    , running = False
    }

-- UPDATE
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        -- Call to generate new graph
        GenerateGraph ->
            ( model, Random.generate GotGraph randomGraphGenerator )

        -- Update graph in model and reset model
        GotGraph newGraph ->
            ( { model
                | graph = newGraph
                , currentIndex = 0
                , running = False
              }
            , Cmd.none
            )

-- VIEW
view : Model -> Html Msg
view model =
    -- Generate a new graph
    div []
        [ button [ onClick GenerateGraph ] [ text "Generate Random Graph" ]

        -- Visualization
        , Vizualization.view
            model.graph
            Nothing
            []
            []
            False
        ]
