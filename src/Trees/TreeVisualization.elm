module Trees.TreeVisualization exposing (view)

-- HTML Imports
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)

-- SVG imports for creating tree
import Svg exposing (Svg, svg)
import Svg.Attributes exposing
    ( x1, y1, x2, y2
    , cx, cy, r, fill, stroke, strokeWidth
    , width, height, style
    , x, y, textAnchor, fontSize
    )

-- Import necessary structure for visualization
import MainComponents.Structs exposing (Tree(..))

-- PositionedTree (binary tree type)
type PositionedTree
    = PositionedNode
        -- Value at of node
        { val : Int
        -- Coordinate in X direction
        , x : Float
        -- Coordinate in Y direction
        , y : Float
        -- Left child (if any)
        , left : Maybe PositionedTree
        -- Right child (if any)
        , right : Maybe PositionedTree
        }

-- VIEW
view : Tree -> Int -> List Int -> Bool -> Html msg
view tree currentIndex traversalResult running =
    let
        -- Node to be highlighted in tree
            -- Don't highlight before Run or Step
        maybeActiveVal =
            currentIndexNode traversalResult currentIndex

        -- Total nodes in the tree
        totalNodes =
            countNodes tree

        -- Compute startX to center the tree
        startX =
            -- Get root node close to center to ensure whole tree visible
            if totalNodes > 0 then
                (1000 - (toFloat totalNodes * 25) + 25) / 2
            
            -- Empty tree (should never occur)
            else
                500

        -- Compute tree positioning
            -- Root should always be positioned
        ( maybePositionedRoot, _ ) =
            -- Get coordinated as PositionedTree type
                -- startX, tree, initial Y, update to Y
            layoutHelper tree startX 25 40 75
    in
    div [ class "tree-page" ]
        [ case maybePositionedRoot of
            -- Root not positioned (shouldn't occur)
            Nothing ->
                div [] 
                    [ text "Empty Tree" ]

            -- Root positioned and tree generated
            Just positionedRoot ->
                -- Renders SVG onto the screen
                svg
                    -- Size of SVG viewport
                    [ width "1000"
                    , height "375"
                    ]
                    -- Receive lists of SVG elements to render
                    (lines positionedRoot ++ nodes positionedRoot maybeActiveVal)

        -- Display traversal progress
        , div []
            [ text ("Traversal so far: " ++ renderHighlighted traversalResult currentIndex) ]
        ]

-- Finds node to highlight
currentIndexNode : List Int -> Int -> Maybe Int
currentIndexNode traversal idx =
    if idx > 0 && idx <= List.length traversal then
        -- Last node in traversal list
        List.head (List.drop (idx - 1) traversal)

    -- Don't highlight anything if traversal list is empty
    else
        Nothing

-- Counts nodes in a tree
countNodes : Tree -> Int
countNodes node =
    case node of
        -- Tree is empty
        Empty -> 0

        -- Add 1 and recursively call countNodes for children
        Node _ left right -> 1 + countNodes left + countNodes right

-- Renders the highlighted node
renderHighlighted : List Int -> Int -> String
renderHighlighted xs idx =
    let
        visited =
            List.take idx xs

        visitedStr =
            "[" ++ String.join ", " (List.map String.fromInt visited) ++ "]"
    in
    visitedStr

-- Get X and Y coordinates of each node in the tree (in-order traversal)
layoutHelper : Tree -> Float -> Float -> Float -> Float -> (Maybe PositionedTree, Float)
layoutHelper tree x dx y dy =
    case tree of
        -- No root positioned if tree is empty
        Empty ->
            ( Nothing, x )

        -- Process the node to find coordinates
        Node val left right ->
            let
                -- Layout left subtree
                ( maybeLeftTree, nextXAfterLeft ) =
                    layoutHelper left x dx (y + dy) dy

                -- Calculate X coordinate for current node
                currentX =
                    nextXAfterLeft

                -- Layout right subtree
                ( maybeRightTree, nextXAfterRight ) =
                    layoutHelper right (currentX + dx) dx (y + dy) dy

                -- Create positioned node
                positionedNode =
                    PositionedNode
                        { val = val
                        , x = currentX
                        , y = y
                        -- Only children if not a leaf
                        , left = maybeLeftTree
                        , right = maybeRightTree
                        }
            -- Return entire tree of Nodes with X and Y coordinates
            in
            ( Just positionedNode, nextXAfterRight )

-- Draw lines from parent nodes to children
    -- Return a list of SVG elements to be rendered
lines : PositionedTree -> List (Svg msg)
lines tree =
    case tree of
        PositionedNode node ->
            let
                -- return an SVG line from parent X/Y to child X/Y
                parentToChild childNode =
                    Svg.line
                        [ x1 (String.fromFloat node.x)
                        , y1 (String.fromFloat node.y)
                        , x2 (String.fromFloat childNode.x)
                        , y2 (String.fromFloat childNode.y)
                        -- Color and width of line
                        , stroke "#808080"
                        , strokeWidth "2"
                        ]
                        []

                -- Left child lines
                leftLines =
                    case node.left of
                        -- Internal nodes
                        Just childTree ->
                            case childTree of
                                PositionedNode childNode ->
                                    -- Recursively call lines to draw child's children etc.
                                    parentToChild childNode :: lines childTree

                        -- Leaf nodes
                        _ ->
                            []

                -- Handle the right child
                rightLines =
                    case node.right of
                        -- Internal nodes
                        Just childTree ->
                            case childTree of
                                PositionedNode childNode ->
                                    -- Recursively call lines to draw child's children etc.
                                    parentToChild childNode :: lines childTree

                        -- Leaf nodes
                        _ ->
                            []
            
            -- Add lists together
            in
            leftLines ++ rightLines

-- Draw nodes in tree
    -- Change color if they're selected
nodes : PositionedTree -> Maybe Int -> List (Svg msg)
nodes tree maybeActive =
    case tree of
        PositionedNode node ->
            let
                isActive =
                    case maybeActive of
                        -- Node should be highlighted
                        Just x ->
                            x == node.val

                        -- Node should not be highlighted
                        _ ->
                            False

                -- Determine circle color if node active
                circleColor =
                    if isActive then
                        "#FF5722"
                        
                    else
                        "#64B5F6"

                -- Draw circle at X/Y coordinates given in PositionedNode
                myCircle =
                    Svg.circle
                        [ cx (String.fromFloat node.x)
                        , cy (String.fromFloat node.y)
                        , r "15"
                        , fill circleColor
                        ]
                        []

                -- Draw text at X/Y coordinates given in PositionedNode
                label =
                    Svg.text_
                        [ x (String.fromFloat node.x)
                        -- Add to Y to center text
                        , y (String.fromFloat (node.y + 5))
                        , fill "white"
                        , fontSize "14"
                        , textAnchor "middle"
                        ]
                        [ Svg.text (String.fromInt node.val) ]


                -- Recursively call left child nodes to be drawn
                leftNodes =
                    case node.left of
                        Just l ->
                            nodes l maybeActive

                        -- Leaf nodes
                        _ ->
                            []

                -- Recursively call right child nodes to be drawn
                rightNodes =
                    case node.right of
                        Just r ->
                            nodes r maybeActive

                        -- Leaf nodes
                        _ ->
                            []
            
            -- Add root, and children nodes together
            in
            [ myCircle, label ] ++ leftNodes ++ rightNodes
