module Trees.TreeTraversal exposing (..)

-- HTML Imports
import Html exposing (Html, div, button, text, ul, li)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)

-- Random for generating new trees
import Random exposing (Generator)
import Random.List exposing (shuffle)

-- Import necessary structure to track state
import MainComponents.Structs exposing (Tree(..))

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
    , index : Int
    -- Whether traversal is running or not
    , running : Bool
    }

-- MESSAGES
type Msg
    -- Generates a new tree (reset button)
    = GenerateRandomTree
    -- Helper to generate new trees (used in update)
    | GotRandomTree Tree
    -- Update traversal to something new
    | ChangeTraversal TraversalType
    -- Button messages for traversals (Controls.elm)
    | ControlMsg ControlMsg

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
    , index = 0
    -- Don't immediately run
    , running = False
    }

-- UPDATE
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        -- Generate new tree
        GenerateRandomTree ->
            ( model, randomTreeCmd )

        -- Update Model to hold new tree
        GotRandomTree newTree ->
            let
                newTraversal = getTraversal model.currentTraversal newTree
            in
            ( { model
                | tree = newTree
                , traversalResult = newTraversal
                , index = 0
              }
            , Cmd.none
            )

        -- Update traversal selected
        ChangeTraversal tType ->
            let
                newTraversal = getTraversal tType model.tree
            in
            ( { model
                | currentTraversal = tType
                , traversalResult = newTraversal
                , index = 0
              }
            , Cmd.none
            )

        -- Run traversal
        ControlMsg Run ->
            ( { model | running = True }, Cmd.none )

        -- Pause traversal
        ControlMsg Pause ->
            ( { model | running = False }, Cmd.none )

        -- One step of traversal
        ControlMsg Step ->
            -- Move to next visited node in the traversal
            if model.index < List.length model.traversalResult then
                ( { model | index = model.index + 1 }, Cmd.none )
            else
                ( model, Cmd.none )

        -- Reset and generate new tree
        ControlMsg Reset ->
            ( { model
                | tree = Empty
                , traversalResult = []
                , index = 0
                , running = False
              }
            -- Call to generate new tree
            , randomTreeCmd
            )

-- Call to generate a new tree and update model with it
randomTreeCmd : Cmd Msg
randomTreeCmd =
    Random.generate GotRandomTree randomTreeGenerator

-- Generates tree
randomTreeGenerator : Generator Tree
randomTreeGenerator =
    -- Between 10 and 30 nodes in tree
    let
        sizeGenerator : Generator Int
        sizeGenerator =
            Random.int 10 31
    in
    Random.andThen
        (\n ->
            -- All values in tree are 1 - 50 with no duplicates
                -- No duplicates needed for highlighting
            Random.map
                (\shuffledList ->
                    let
                        values = List.take n shuffledList
                    in
                        buildTree values 0 0
                )
                (shuffle (List.range 1 50))
        )
        sizeGenerator

-- Builds binary tree from list of values
buildTree : List Int -> Int -> Int -> Tree
buildTree values index depth =
    -- No more than 5 levels to the tree
    if index >= List.length values || depth >= 5 then
        Empty
    else
        let
            val =
                case List.drop index values of
                    -- Default (shouldn't ever occur)
                    [] ->
                        0
                    x :: _ ->
                        x

            -- Builds left subtree recursively
            leftSubtree =
                buildTree values (2 * index + 1) (depth + 1)

            -- Builds right subtree recursively
            rightSubtree =
                buildTree values (2 * index + 2) (depth + 1)
        in
        -- Create node with value pointing to subtrees
        Node val leftSubtree rightSubtree

-- Updates traversal depending on what's selected
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
preorder t =
    case t of
        Empty ->
            []

        Node val left right ->
            val :: (preorder left) ++ (preorder right)

-- Inorder Traversal
inorder : Tree -> List Int
inorder t =
    case t of
        Empty ->
            []

        Node val left right ->
            (inorder left) ++ [ val ] ++ (inorder right)

-- Postorder Traversal
postorder : Tree -> List Int
postorder t =
    case t of
        Empty ->
            []

        Node val left right ->
            (postorder left) ++ (postorder right) ++ [ val ]

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

          -- Description
        , div [ class "description" ]
              [ text """Tree Traversals are the process of visiting each node once in a tree data structure.
                  Walk through three different types of traversals below."""
              ]

        -- Traversal Buttons
        , div []
            [ button [ onClick (ChangeTraversal Preorder) ]  [ text "Preorder" ]
            , button [ onClick (ChangeTraversal Inorder) ]   [ text "Inorder" ]
            , button [ onClick (ChangeTraversal Postorder) ] [ text "Postorder" ]
            ]

        -- Call TreeVisualization.elm for tree diagram
            -- Also shows progress in traversal
        , Visualization.view
            model.tree
            model.index
            model.traversalResult
            model.running

        -- Algorithm step buttons
        , Controls.view model.running (ControlMsg >> identity)

        -- Step Counter
        , div [ class "indices" ]
              [ text ("Current Step: " ++ String.fromInt model.index)
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
