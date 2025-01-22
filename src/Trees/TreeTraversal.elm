module Trees.TreeTraversal exposing (..)

-- HTML Imports
import Html exposing (Html, div, button, text, ul, li)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)

-- Needed for "Run" and "Pause"
import Time

import Random

-- Import necessary structure to track state
import MainComponents.Structs exposing (Tree(..), randomTreeGenerator)

-- Import TreeVisualization for visualization
import Trees.TreeVisualization as Visualization exposing (view)

-- Import for control buttons (used in view)
import MainComponents.Controls  as Controls exposing (ControlMsg(..), view)

-- Types of traversals
type TraversalType
    = Preorder
    | Inorder
    | Postorder

-- MODEL
type alias Model =
    -- Root node in tree structure
    { tree : Tree
    -- Type of traversal done on tree
    , currentTraversal : TraversalType
    -- Result of traversal from tree
    , traversalResult : List Int
    -- Index traversal is pointing to
    , index : Maybe Int
    -- Algorithm running or not (needed for Controls.elm)
    , running : Bool
    }

-- MESSAGES
type Msg
    -- Update traversal to something new
    = ChangeTraversal TraversalType
    -- Update tree in model (needed in Main.elm for updates)
    | SetTree Tree
    -- One step of chosen traversal
    | TraversalStep
    -- Timing for running the algorithm
    | Tick Time.Posix
    -- Run Button
    | StartTraversal
    -- Pause Button
    | StopTraversal
    -- Reset Button
    | ResetTraversal
    -- Generate a new tree (needed for Reset)
    | TreeGenerated Tree

-- INIT
initModel : Model
initModel =
    -- No tree
    { tree = Empty
    -- Always default to Inorder
    , currentTraversal = Inorder
    -- No result from traversal
    , traversalResult = []
    -- Start at first index (root)
    , index = Just 0
    -- Running should be False
    , running = False
    }

-- UPDATE
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        -- Update type of traversal on tree
        ChangeTraversal traversalType ->
            let
                -- Call getTraversal helper function
                newTraversal = getTraversal traversalType model.tree
            in
            ( { model
                | currentTraversal = traversalType
                , traversalResult = newTraversal
                , index = Just 0
              }
            , Cmd.none
            )

        -- Update tree in the model (used in Main.elm update)
        SetTree newTree ->
            let
                newResult =
                -- Call getTraversal helper function
                    getTraversal model.currentTraversal newTree
            in
            ( { model
                | tree = newTree
                , traversalResult = newResult
                , index = Just 0
              }
            , Cmd.none
            )

        -- One step of specific traversal
        TraversalStep ->
            let
                -- Safely increment the index if it exists
                newIndex =
                    case model.index of
                        Just i ->
                            Just (i + 1)

                        Nothing ->
                            Nothing

                totalSteps = List.length model.traversalResult
                updatedModel =
                    case newIndex of
                        Just ni ->
                            if ni < totalSteps then
                                { model | index = Just ni }
                            else
                                { model | index = Just ni, running = False }

                        Nothing ->
                            model  -- No change if index is Nothing
            in
            ( updatedModel, Cmd.none )
        
        -- One step of traversal each second
        Tick _ ->
            let
                -- Safely increment the index if it exists
                newIndex =
                    case model.index of
                        Just i ->
                            Just (i + 1)

                        Nothing ->
                            Nothing

                totalSteps = List.length model.traversalResult
                updatedModel =
                    case newIndex of
                        Just ni ->
                            if ni < totalSteps then
                                { model | index = Just ni }
                            else
                                { model | index = Just ni, running = False }

                        Nothing ->
                            model  -- No change if index is Nothing
            in
            ( updatedModel, Cmd.none )

        -- Run button
        StartTraversal ->
            ( { model | running = True }, Cmd.none )

        -- Pause button
        StopTraversal ->
            ( { model | running = False }, Cmd.none )

        -- Reset button
        ResetTraversal ->
            let
                -- Call to generate new tree
                cmd = Random.generate TreeGenerated randomTreeGenerator
            in
            ( { model
                | running = False
                , index = Just 0
                , traversalResult = []
              }
            , cmd
            )

        -- Generate new tree
        TreeGenerated newTree ->
            let
                -- Update array showing result to new tree
                newResult = getTraversal model.currentTraversal newTree
            in
            ( { model
                | tree = newTree
                , traversalResult = newResult
                , index = Just 0
              }
            , Cmd.none
            )

-- Runs algorithm when selected
subscriptions : Model -> Sub Msg
subscriptions model =
    if model.running then
        -- Update every 1 second
        Time.every 1000 Tick
    else
        Sub.none

{-
    Basic page view for Tree Traversals
        Title, Description, Traversal Buttons, Diagram, Algorithm Buttons, Step Counter, Breakdown, & Big-O Notation
        (ControlMsg -> msg) is ControlMsg in Main.elm
-}
view : Model -> Html Msg
view model =
    div [ class "sort-page" ]
        [ -- Title
          div [ class "sort-title" ]
              [ text "Tree Traversal" ]

        , div [ class "description" ]
              [ text (getDescription model.currentTraversal) ]

        -- Update class to change button color
        , div [ class "traversal-controls" ]
            [ button 
                [ class "traversal-button"
                , if model.currentTraversal == Preorder then class "selected" else Html.Attributes.class ""
                , onClick (ChangeTraversal Preorder)
                ]  
                [ text "Preorder" ]
            , button 
                [ class "traversal-button"
                , if model.currentTraversal == Inorder then class "selected" else Html.Attributes.class ""
                , onClick (ChangeTraversal Inorder)
                ]   
                [ text "Inorder" ]
            , button 
                [ class "traversal-button"
                , if model.currentTraversal == Postorder then class "selected" else Html.Attributes.class ""
                , onClick (ChangeTraversal Postorder)
                ] 
                [ text "Postorder" ]
            ]

          -- Tree Visualization (creates SVG and traversal steps)
        , Visualization.view
            model.tree
            model.index
            Nothing
            model.traversalResult
            model.running

          -- Algorithm step buttons
        , Controls.view model.running convertMsg

          -- Step Counter
        , div [ class "indices" ]
              [ case model.index of
                    Just idx ->
                        text ("Current Step Number: " ++ String.fromInt idx)

                    Nothing ->
                        text "Current Step Number: 0"
              ]

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
                [ div [] [ text "Traversal Time Complexity" ]
                , div [] [ text "O(n)" ]
                ]
            ]

        , div [ class "space-complexity" ]
            [ text "Space Complexity: O(h) | h = height of tree" ]
        ]

-- Updates traversal depending on which one is selected
getTraversal : TraversalType -> Tree -> List Int
getTraversal traversalType tree =
    case traversalType of
        Preorder ->
            preorder tree

        Inorder ->
            inorder tree

        Postorder ->
            postorder tree

-- Preorder Traversal
preorder : Tree -> List Int
preorder node =
    -- Don't update empty nodes
    case node of
        -- Recursively call parent, then left, then right
        Node val left right ->
            val :: (preorder left) ++ (preorder right)

        -- Base case that returns empty array for leaf nodes
        _ ->
            []

-- Inorder Traversal
inorder : Tree -> List Int
inorder node =
    case node of
        Node val left right ->
            (inorder left) ++ [ val ] ++ (inorder right)

        _ ->
            []

-- Postorder Traversal
postorder : Tree -> List Int
postorder node =
    case node of
        Node val left right ->
            (postorder left) ++ (postorder right) ++ [ val ]

        _ ->
            []

-- Change description based on traversal type
getDescription : TraversalType -> String
getDescription traversal =
    case traversal of
        Preorder ->
            "Preorder Traversal visits nodes in the order: Root, Left Subtree, Right Subtree. It's useful for creating a copy of the tree."

        Inorder ->
            "Inorder Traversal visits nodes in the order: Left Subtree, Root, Right Subtree. It's useful for binary search trees."

        Postorder ->
            "Postorder Traversal visits nodes in the order: Left Subtree, Right Subtree, Root. It's useful for deleting trees."

-- Convert messages from Controls.elm to local messages
convertMsg : ControlMsg -> Msg
convertMsg msg =
    case msg of
        Run ->
            StartTraversal

        Pause ->
            StopTraversal

        Step ->
            TraversalStep

        Reset ->
            ResetTraversal
            