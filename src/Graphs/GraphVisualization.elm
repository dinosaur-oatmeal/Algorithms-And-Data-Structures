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
view : Graph -> Maybe Int -> List Int -> List (Int, Int) -> List (Int, Int) -> Bool -> Html msg
view graph maybeCurrentNode visited traversedEdges finalRouteEdges running =
    let
        -- Build dictionary for each node that stores (x, y) position in SVG frame
        positionsDict =
            buildPositionsDict graph.nodes
    in
    div [ class "graph-page" ]
        [ svg
            -- Width and height for SVG frame
            [ width "1000"
            , height "500"
            -- Ease into new colors
            , Svg.Attributes.style "transition: fill 0.6s ease"
            ]
            -- Call functions to draw edges and nodes in the SVG frame
            ( drawEdges graph.edges positionsDict traversedEdges finalRouteEdges
                ++ drawNodes graph.nodes positionsDict maybeCurrentNode visited
            )
        ]

-- Put positions for each node in a dictionary
nodePositions : Dict Int (Float, Float)
nodePositions =
    Dict.fromList
        [ (1, (200, 150))
        , (2, (800, 150))
        , (3, (200, 300))
        , (4, (800, 300))
        , (5, (500, 50))
        , (6, (300, 400))
        , (7, (700, 400))
        , (8, (500, 250))
        ]

-- Builds a dictionary that stores node positions in the SVG frame
buildPositionsDict : List GraphNode -> Dict Int (Float, Float)
buildPositionsDict nodes =
    List.foldl
        (\node dict ->
            Dict.insert node.id
                (Dict.get node.id nodePositions
                    |> Maybe.withDefault (50, 50)
                )
                dict
        )
        Dict.empty
        nodes


-- Draws all edges on graph
    -- List of edges, dictionary for each ID of node, and list of edges to highlight
drawEdges : List Edge -> Dict Int (Float, Float) -> List (Int, Int) -> List (Int, Int) -> List (Svg msg)
drawEdges edges positionsDict traversedEdges finalRouteEdges =
    edges
        |> List.map
            (\edge ->
                let
                    -- Find first position of edge in dictionary
                    ( x1Pos, y1Pos ) =
                        Dict.get edge.from positionsDict
                            |> Maybe.withDefault (0, 0)

                    -- Find second position of edge in dectionary
                    ( x2Pos, y2Pos ) =
                        Dict.get edge.to positionsDict
                            |> Maybe.withDefault (0, 0)
                            
                    -- Check if the edge is in the final route.
                    isFinalRoute =
                        List.member (edge.from, edge.to) finalRouteEdges
                            || List.member (edge.to, edge.from) finalRouteEdges

                     -- Otherwise, check if the edge was traversed.
                    isTraversed =
                        List.member (edge.from, edge.to) traversedEdges
                            || List.member (edge.to, edge.from) traversedEdges

                    color =
                        if isFinalRoute then
                            "#81C784"  -- Final route highlighted in green.
                        else if isTraversed then
                            "#ff5722"  -- Traversed edges (but not in final route) in red.
                        else
                            "#adb5bd"  -- All others in gray.

                    -- Find distance and direction of the edge
                    dx = x2Pos - x1Pos
                    dy = y2Pos - y1Pos
                    dist = sqrt (dx * dx + dy * dy) + 0.1

                    -- Determine where text should be written on edge
                    labelBias = 0.75
                    gapSize = 15

                    -- Gap position for text on edge
                    gapX = x1Pos + dx * labelBias
                    gapY = y1Pos + dy * labelBias

                    -- Shorten values for edge
                    shortenX = (dx / dist) * gapSize
                    shortenY = (dy / dist) * gapSize

                    -- 2 lines to represent edge with gap in-between them
                    (x1New, y1New) = (gapX - shortenX, gapY - shortenY)
                    (x2New, y2New) = (gapX + shortenX, gapY + shortenY)

                    -- Angle of edge (write text in-line with edge)
                    angleRad = atan2 dy dx

                    -- Angle in degrees
                    angleDeg =
                        let
                            rawAngle = angleRad * 180 / pi
                        in

                        -- Ensure no text is upside-down
                        if rawAngle > 90 then
                            rawAngle - 180
                        else if rawAngle < -90 then
                            rawAngle + 180
                        else
                            rawAngle

                    -- Text for edge
                    edgeLabel =
                        Svg.text_
                            [ x (String.fromFloat gapX)
                            -- Perfectly in-line with edge
                            , y (String.fromFloat (gapY + 4))
                            , fill "#adb5bd"
                            , fontSize "12"
                            , textAnchor "middle"
                            -- Rotate text to be in-line with edge line
                            , Svg.Attributes.transform ("rotate(" ++ String.fromFloat angleDeg ++ " " ++ String.fromFloat gapX ++ " " ++ String.fromFloat gapY ++ ")")
                            ]
                            [ Svg.text (String.fromInt edge.weight) ]
                in
                -- Render two solid lines with gap
                Svg.g []
                    [ Svg.line
                        [ x1 (String.fromFloat x1Pos)
                        , y1 (String.fromFloat y1Pos)
                        , x2 (String.fromFloat x1New)  -- First segment
                        , y2 (String.fromFloat y1New)
                        , stroke color
                        , strokeWidth "2"
                        ]
                        []
                    , Svg.line
                        [ x1 (String.fromFloat x2New)  -- Second segment
                        , y1 (String.fromFloat y2New)
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
