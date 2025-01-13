module Trees.TreeVisualization exposing (view)

-- HTML Imports
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, style)

-- Import necessary structure to track state
import MainComponents.Structs exposing (Tree(..))

-- Wrapper for Tree Page
view : Tree -> Int -> List Int -> Bool -> Html msg
view tree currentIndex traversalResult running =
    div [ class "tree-page" ]
        [ div [ class "tree-info" ]
            -- Render tree
            [ renderTree tree (currentIndexNode traversalResult currentIndex) ]
        , div []
            -- Show traversal progress
            [ text ("Traversal so far: " ++ renderHighlighted traversalResult currentIndex) ]
        ]

-- Value of node being highlighted
currentIndexNode : List Int -> Int -> Maybe Int
currentIndexNode traversal idx =
    if idx > 0 && idx <= List.length traversal then
        List.head (List.drop (idx - 1) traversal)
    -- No active node
    else
        Nothing


-- Highlights selected node and shows visited and remaining values
renderHighlighted : List Int -> Int -> String
renderHighlighted xs idx =
    let
        visited = List.take idx xs
        remaining = List.drop idx xs
        visitedStr = "[" ++ String.join ", " (List.map String.fromInt visited) ++ "]"
        remainingStr = "[" ++ String.join ", " (List.map String.fromInt remaining) ++ "]"
    in
    visitedStr ++ " | " ++ remainingStr

-- Renders the tree
renderTree : Tree -> Maybe Int -> Html msg
renderTree tree maybeActive =
    case tree of
        -- Nothing rendered because tree is empty
        Empty ->
            div [ class "tree-empty" ] []

        -- Render given root node
        Node val left right ->
            let
                -- Value to be highlighted
                isActive =
                    case maybeActive of
                        Just x ->
                            x == val

                        Nothing ->
                            False
            in
            div [ class "tree-node-wrapper" ]
                [ div
                    ([ class "tree-node" ]
                        ++ if isActive then [ class "active-node" ] else []
                    )
                    [ text (String.fromInt val) ]
                -- Recursive call to render more children nodes
                , div [ class "tree-children" ]
                    [ renderTree left maybeActive
                    , renderTree right maybeActive
                    ]
                ]
