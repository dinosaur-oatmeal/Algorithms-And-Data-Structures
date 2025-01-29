module Graphs.GraphVisualization exposing (view)

-- HTML Imports
import Html exposing (Html, div)
import Html.Attributes exposing (class)

-- SVG imports for creating tree
import Svg exposing (Svg, svg)
import Svg.Attributes exposing
    ( x1, y1, x2, y2
    , cx, cy, r, fill, stroke, strokeWidth
    , width, height, style
    , x, y, textAnchor, fontSize
    )

-- Needed for storing node positions
import Dict exposing (Dict)

-- Import necessary structure for visualization
import MainComponents.Structs exposing (Graph, GraphNode, Edge)

-- VIEW
view : Graph -> Maybe Int -> List Int -> List (Int, Int) -> Bool -> Html msg
view graph maybeCurrentNode visited highlightEdges running =
    let
        -- Build dictionary for each node that stores (x, y) position in SVG frame
        positionsDict =
            buildPositionsDict graph.nodes
    in
    div [ class "graph-container" ]
        [ svg
            -- Width and height for SVG frame
            [ width "1000"
            , height "500"
            ]
            -- Call functions to draw edges and nodes in the SVG frame
            ( drawEdges graph.edges positionsDict highlightEdges
                ++ drawNodes graph.nodes positionsDict maybeCurrentNode visited
            )
        ]


-- Builds a dictionary that stores node positions in the SVG frame
buildPositionsDict : List GraphNode -> Dict Int (Float, Float)
buildPositionsDict nodes =
    let
        -- Sort by ID so 1 always top left, 2 top middle, 3 top right, etc
        sortedNodes =
            List.sortBy .id nodes

        -- Pair each node with indices starting at 0 and store in a map
        indexed =
            List.indexedMap (\index node -> ( index, node )) sortedNodes

        -- 3 columns and 3 rows for a max of 9 nodes
        cellWidth = 1000 / 3
        cellHeight = 400 / 3
        -- Margin to ensure a bit of extra spacing
        margin = 30
    in
    indexed
        |> List.foldl
            (\( index, node ) dict ->
                let
                    -- Determine row and column for each node depending on index in map
                    row = index // 3
                    col = modBy 3 index

                    -- Base grid position for starting node (1 in top left)
                    xPos =
                        margin + (cellWidth * toFloat col) + (cellWidth / 2)

                    yPos =
                        margin + (cellHeight * toFloat row) + (cellHeight / 2)

                    -- Nudge specific nodes to avoid overlapping lines
                    ( nx, ny ) =
                        nudgePosition node.id ( xPos, yPos )
                in
                -- Add node locations to dictionary
                Dict.insert node.id ( nx, ny ) dict
            )
            Dict.empty


-- Shifts nodes accordingly to avoid overlap depending on ID
nudgePosition : Int -> (Float, Float) -> (Float, Float)
nudgePosition nodeId (x, y) =
    case nodeId of
        2 ->
            -- Move up and left
            ( x - 120, y - 60 )

        4 ->
            -- Move down and right
            ( x + 80, y + 60 )

        5 ->
            -- Move up
            (x, y - 60)

        6 ->
            -- Move up and left
            ( x - 80, y - 60 )

        8 ->
            -- Move down and right
            ( x + 120, y + 60 )

        _ ->
            ( x, y )

-- Draws all edges on graph
    -- List of edges, dictionary for each ID of node, and list of edges to highlight
drawEdges : List Edge -> Dict Int (Float, Float) -> List (Int, Int) -> List (Svg msg)
drawEdges edges positionsDict highlightEdges =
    edges
        |> List.map
            (\edge ->
                let
                    -- Find first position of edge in dictionary
                    ( x1Pos, y1Pos ) =
                        Dict.get edge.from positionsDict
                            -- Default never used
                            |> Maybe.withDefault (0, 0)

                    -- Find second position of edge in dictionary
                    ( x2Pos, y2Pos ) =
                        Dict.get edge.to positionsDict
                            -- Default never used
                            |> Maybe.withDefault (0, 0)

                    -- See if edge is in list to be highlighted
                    isHighlighted =
                        -- Bi-directional checking to ensure highlights
                        List.member (edge.from, edge.to) highlightEdges
                            || List.member (edge.to, edge.from) highlightEdges

                    color =
                        if isHighlighted then
                            "#ff5722" -- Red if active
                        else
                            "#adb5bd" -- Gray by default

                    -- Midpoint of line to print weight
                    midX =
                        (x1Pos + x2Pos) / 2

                    midY =
                        (y1Pos + y2Pos) / 2

                    edgeLabel =
                        Svg.text_
                            [ x (String.fromFloat midX)
                            , y (String.fromFloat (midY - 5))
                            , fill "#adb5bd"
                            , fontSize "12"
                            , textAnchor "middle"
                            ]
                            [ Svg.text (String.fromInt edge.weight) ]
                in
                -- Group line and text together as one element
                    -- Add edges to g element for SVG to render
                Svg.g []
                    [ Svg.line
                        [ x1 (String.fromFloat x1Pos)
                        , y1 (String.fromFloat y1Pos)
                        , x2 (String.fromFloat x2Pos)
                        , y2 (String.fromFloat y2Pos)
                        , stroke color
                        , strokeWidth "2"
                        ]
                        []
                    , edgeLabel
                    ]
            )

-- Draw all nodes on graph
    -- List of nodes, dictionary for (x, y) coordinates, highlight node, and list of visited nodes
drawNodes : List GraphNode -> Dict Int (Float, Float) -> Maybe Int -> List Int -> List (Svg msg)
drawNodes nodes positionsDict maybeCurrentNode visited =
    nodes
        |> List.map
            (\node ->
                let
                    -- Find node's position for rendering
                    ( xPos, yPos ) =
                        Dict.get node.id positionsDict
                            -- Default never used
                            |> Maybe.withDefault (0, 0)

                    -- Check to see if node is active
                    isActive =
                        case maybeCurrentNode of
                            Just activeId ->
                                activeId == node.id

                            Nothing ->
                                False

                    -- Add node to list of visited nodes if it's been active
                    isVisited =
                        List.member node.id visited

                    circleColor =
                        if isActive then
                            "#ff5722"  -- Red if active
                        else if isVisited then
                            "#adb5bd"  -- Gray if visited
                        else
                            "#64b5f6"  -- Blue by default

                    -- Draw a circle at (x, y) in SVG frame
                    myCircle =
                        Svg.circle
                            [ cx (String.fromFloat xPos)
                            , cy (String.fromFloat yPos)
                            , r "15"
                            , fill circleColor
                            , style "transition: fill 0.5s ease"
                            ]
                            []

                    -- Label with node ID in middle of circle
                    label =
                        Svg.text_
                            [ x (String.fromFloat xPos)
                            , y (String.fromFloat (yPos + 5))
                            , fill "white"
                            , fontSize "14"
                            , textAnchor "middle"
                            ]
                            [ Svg.text (String.fromInt node.id) ]
                in
                -- Return a list for each node with the circle and label
                [ myCircle, label ]
            )
        -- Concatenate lists together to return a single list for rendering
        |> List.concat
