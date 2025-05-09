module Trees.BST exposing (..)

-- HTML Imports
import Html exposing (Html, div, button, text, input, ul, li)
import Html.Attributes exposing (class, type_, placeholder, value)
import Html.Events exposing (onClick, onInput)

-- Needed for "Run" and "Pause"
import Time exposing (Posix)

import Random

-- Import necessary structure to track state
import MainComponents.Structs exposing (Tree(..), randomBSTGenerator)

-- Import TreeVisualization for visualization
import Trees.TreeVisualization as Visualization exposing (view)

-- Import for control buttons (used in view)
import MainComponents.Controls as Controls exposing (ControlMsg(..), view)

-- MODEL
type alias Model =
    -- Root node in tree structure
    { tree : Tree
    -- List of ints visited
    , traversalResult : List Int
    -- Current index in list
    , index : Maybe Int
    -- Algorithm running or not (needed for Controls.elm)
    , running : Bool
    -- Input from user to search
    , searchInput : String
    -- See if target is found
    , targetFound : Bool
    }

type Msg
    -- Update tree in model (needed in Main.elm for updates)
    = SetTree Tree
    -- One step of BST traversal
    | TraversalStep
    -- Timing for running the algorithm
    | Tick Posix
    -- Run button
    | StartTraversal
    -- Pause button
    | StopTraversal
    -- Reset button
    | ResetTraversal
    -- Binary search tree generated so steps are valid
    | TreeGenerated Tree
    -- User input for model to use
    | SetSearchInput String
    -- Start the search
    | StartSearch

-- INIT
initModel : Model
initModel =
    -- No tree
    { tree = Empty
    -- No list of traversal results
    , traversalResult = []
    -- Start at root
    , index = Just 0
    -- Running hsould be false
    , running = False
    -- No text typed
    , searchInput = ""
    -- Target isn't found
    , targetFound = False
    }

-- Helper function for steps
stepTraversal : Bool -> Model -> Model
stepTraversal isAuto model =
    case model.index of
        Just i ->
            let
                pathLength = List.length model.traversalResult
                maxIndex = if model.targetFound then pathLength - 1 else pathLength
                done = i >= maxIndex
            in
            if done then
                -- Don't update model once traversal complete
                model
            else
                let
                    -- Go to next index in list
                    nextIdx = i + 1
                    -- flag that the algorithm is done
                    newDone = nextIdx > maxIndex
                in
                { model
                    | index = Just nextIdx
                    , running = if isAuto then not newDone else False
                }

        -- Don't update if no valid index
        _ ->
            model

-- Helper function for finding correct path
searchPath : Int -> Tree -> List Int
searchPath target tree =
    case tree of
        TreeNode value left right ->
            -- Target found
            if value == target then
                [ value ]
            -- Target < value at current node
            else if target < value then
                -- Look down left subtree
                value :: searchPath target left
            -- Target > value at current node
            else
                -- Look down right subtree
                value :: searchPath target right

        -- Default
        _ ->
            []

-- UPDATE
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        -- Update to a new tree (Main.elm)
        SetTree newTree ->
            ( { model
                | tree = newTree
                , traversalResult = []
                , index = Just 0
              }
            , Cmd.none
            )

        -- Do one traversal step
        TraversalStep ->
            ( stepTraversal False model, Cmd.none )

        -- One step of automatically running
        Tick _ ->
            ( stepTraversal True model, Cmd.none )

        -- Run button
        StartTraversal ->
            ( { model | running = True }, Cmd.none )

        -- Pause button
        StopTraversal ->
            ( { model | running = False }, Cmd.none )

        -- Reset button
        ResetTraversal ->
            let
                -- Generate a new BST
                cmd = Random.generate TreeGenerated (randomBSTGenerator 9 31)
            in
            ( { model
                | running = False
                , index = Just 0
                , traversalResult = []
                , searchInput = ""
              }
            , cmd
            )

        -- Update tree locally
        TreeGenerated newTree ->
            ( { model
                | tree = newTree
                , index = Just 0
              }
            , Cmd.none
            )

        -- Set user input to search automatically
        SetSearchInput str ->
            -- Convert input to int
            case String.toInt str of
                Just tgt ->
                    -- Determine path to search node and update model
                    let
                        path = searchPath tgt model.tree
                    in
                    ( { model
                        | searchInput = str
                        , traversalResult = path
                        , index = Just 0
                        , running = False
                    }
                    , Cmd.none
                    )

                -- Default if invalid
                _ ->
                    ( { model
                        | searchInput = str
                        , traversalResult = []
                        , index = Just 0
                        , running = False
                    }
                    , Cmd.none )

        -- Start the search
        StartSearch ->
            case String.toInt model.searchInput of
                Just tgt ->
                    let
                        path = searchPath tgt model.tree

                        -- See if target is found
                        found =
                            case List.reverse path of
                                last :: _ -> last == tgt
                                [] -> False
                    
                    in
                    ( { model
                        | traversalResult = path
                        , index = Just 0
                        , running = False
                        , targetFound = found
                    }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

-- SUBSCRIPTIONS
subscriptions : Model -> Sub Msg
subscriptions model =
    if model.running then
        Time.every 1000 Tick
    else
        Sub.none


-- VIEW
view : Model -> Html Msg
view model =
    div [ class "sort-page" ]
        [ --Title
            div [ class "sort-title" ]
            [ text "Binary Search Tree" ]

        , div [ class "description" ]
              [ text """Binary search trees are a special type of tree where every node has a maximum of two child nodes.
              Additionally, left hcild nodes are always smaller than the parent, while right child nodes are always larger.""" ]

        , div [ class "insert-delete-container" ]
            [ -- Row containing input and buttons
            div [ class "insert-delete-row" ]
                [ input
                    [ type_ "text"
                    , placeholder "Value to find"
                    , value model.searchInput
                    , onInput SetSearchInput
                    ]
                    []
                ]
            ]

        -- Current visualization
        , Visualization.view
            model.tree
            model.index
            Nothing
            model.traversalResult
            model.running

        -- Control buttons
        , Controls.view model.running convertMsg

        -- Step counter
        , div [ class "indices" ]
            [ text ("Current Step: " ++ String.fromInt (Maybe.withDefault 0 model.index)) ]

        -- Breakdown
        , div [ class "variable-list" ]
              [ ul []
                  [ li [] [ text "Current Step: number of steps taken in the traversal." ]
                  ]
              ]

        -- Big-O Notation
        , div [ class "big-o-title" ]
            [ text "Big(O) Notation" ]
        , div [ class "big-o-list" ]
            [ div [ class "big-o-item" ]
                [ div [] [ text "Time Complexity (search)" ]
                , div [] [ text "O(n)" ]
                ]
            ]
        , div [ class "space-complexity" ]
            [ text "Space Complexity (tree): O(n)" ]
        ]


-- Convert messages from Controls.elm to local messages
convertMsg : ControlMsg -> Msg
convertMsg control =
    case control of
        Run ->
            StartTraversal

        Pause ->
            StopTraversal

        Step ->
            TraversalStep

        Reset ->
            ResetTraversal
