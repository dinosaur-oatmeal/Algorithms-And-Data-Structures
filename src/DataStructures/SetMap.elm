module DataStructures.SetMap exposing (..)

-- HTML imports
import Html exposing (Html, div, button, text, input, ul, li)
import Html.Attributes exposing (class, type_, placeholder, value)
import Html.Events exposing (onClick, onInput)

-- Dict and Set for maps and sets
import Dict exposing (Dict)
import Set exposing (Set)

-- Types of data structures
type DSType
    = SetType
    | MapType

-- MODEL
type alias Model =
    { set : Set Int
    , map : Dict String String
    , keyInput : String
    , valInput : String
    , dataStructure : DSType
    }

type Msg
    -- Set key to user input
    = SetKeyInput String
    -- Set value to user input
    | SetValInput String
    -- Add item to data structure
    | AddItem
    -- Reset data structure
    | ResetStruct
    -- Change type of data structure
    | ChangeDataStructure DSType

-- INIT
initModel : Model
initModel =
    { set = Set.empty
    , map = Dict.empty
    , keyInput = ""
    , valInput = ""
    , dataStructure = SetType
    }

-- UPDATE
update : Msg -> Model -> Model
update msg model =
    case msg of
        -- Set model's user key to input (maps)
        SetKeyInput val ->
            { model | keyInput = val }

        -- Set model's user value to input
        SetValInput val ->
            { model | valInput = val }

        AddItem ->
            case model.dataStructure of
                SetType ->
                    -- Try to conver input to an int
                    case String.toInt model.keyInput of
                        -- Update value with no key
                        Just number ->
                            { model | set = Set.insert number model.set, keyInput = "" }

                        _ ->
                            model

                MapType ->
                    -- Set input key to value and reset user inputs
                    if model.keyInput /= "" then
                        { model
                            | map = Dict.insert model.keyInput model.valInput model.map
                            , keyInput = ""
                            , valInput = ""
                        }

                    else
                        model

        -- Reset (clear) both data structures
        ResetStruct ->
            { model
                | set = Set.empty
                , map = Dict.empty
                , keyInput = ""
                , valInput = ""
            }

        -- Change data structure to new one
        ChangeDataStructure ds ->
            { model | dataStructure = ds }

-- VIEW
view : Model -> Html Msg
view model =
    -- Title
    div [ class "sort-page" ]
        [ div [ class "sort-title" ] [ text "Sets and Maps" ]

        , div [ class "description" ] [ text (getDescription model.dataStructure) ]

        -- Update class to change button color
        , div [ class "traversal-controls" ]
            [ button
                [ class "traversal-button"
                , if model.dataStructure == SetType then class "selected" else class ""
                , onClick (ChangeDataStructure SetType)
                ]
                [ text "Set" ]
            , button
                [ class "traversal-button"
                , if model.dataStructure == MapType then class "selected" else class ""
                , onClick (ChangeDataStructure MapType)
                ]
                [ text "Map" ]
            ]
        
        , div [ class "insert-delete-container" ]
              [ -- Row containing input and buttons
              div [ class "insert-delete-row" ]
                  (case model.dataStructure of
                    SetType ->
                        -- Add Button
                        [ button [ onClick AddItem ] [ text "Add" ]
                        -- Input Field
                        , input
                            [ placeholder "Enter number"
                            , value model.keyInput
                            , onInput SetKeyInput
                            ]
                            []
                        -- Reset Button
                        , button [ onClick ResetStruct ] [ text "Reset" ]
                        ]

                    MapType ->
                        -- Add Button
                        [ button [ onClick AddItem ] [ text "Add" ]
                        -- Key Input
                        , input
                            [ placeholder "Key"
                            , value model.keyInput
                            , onInput SetKeyInput
                            ]
                            []
                        -- Value Input
                        , input
                            [ placeholder "Value"
                            , value model.valInput
                            , onInput SetValInput
                            ]
                            []
                        -- Reset Button
                        , button [ onClick ResetStruct ] [ text "Reset" ]
                        ]
                  )
              ]

        -- Current Visualization
        , div [ class "element-container" ]
            (case model.dataStructure of
                SetType ->
                    -- Show empty container to keep bottom text aligned
                    if Set.isEmpty model.set then
                        [ div [ class "element-placeholder" ] [ text " " ] ]
                    -- Show actual set of elements
                    else
                        Set.toList model.set
                            |> List.map
                                (\n ->
                                    div [ class "element-box" ]
                                        [ div [ class "element-label" ] [ text "Value" ]
                                        , div [ class "element-value" ] [ text (String.fromInt n) ]
                                        ]
                                )

                MapType ->
                    -- Show empty container to keep bottom text aligned
                    if Dict.isEmpty model.map then
                        [ div [ class "element-placeholder" ] [ text " " ] ]
                    -- Show actual map of elements
                    else
                        Dict.toList model.map
                            |> List.map
                                (\(k, v) ->
                                    div [ class "element-box" ]
                                        [ div [ class "element-label" ] [ text ("Key: " ++ k) ]
                                        , div [ class "element-value" ] [ text v ]
                                        ]
                                )
            )

        -- Breakdown
        , div [ class "variable-list" ]
            [ ul []
                [ li [] [ text "Set: Similar to a list but doesn't allow duplicates." ]
                , li [] [ text "Map: A special type of set that has key-value pairs." ]
                ]
            ]

        -- Big-O Notation
        , div [ class "big-o-title" ] [ text "Big(O) Notation" ]
        , div [ class "big-o-list" ]
            [ bigOItem "Insert" (getInsert model.dataStructure)
            , bigOItem "Remove" (getRemove model.dataStructure)
            , bigOItem (getAccessLabel model.dataStructure) (getAccess model.dataStructure)
            ]
        , div [ class "space-complexity" ] [ text "Space Complexity: O(n)" ]
        ]

-- Big-O Helper
bigOItem : String -> String -> Html msg
bigOItem kind cost =
    div [ class "big-o-item" ]
        [ div [] [ text kind ]
        , div [] [ text cost ]
        ]

-- Cost for insertion
getInsert : DSType -> String
getInsert ds =
    case ds of
        SetType -> "O(1) avg | O(n) worst"
        MapType -> "O(1) avg | O(n) worst"

-- Cost for removal
getRemove : DSType -> String
getRemove ds =
    case ds of
        SetType -> "O(1) avg | O(n) worst"
        MapType -> "O(1) avg | O(n) worst"

-- Cost for access
getAccess : DSType -> String
getAccess ds =
    case ds of
        SetType -> "O(1) avg | O(n) worst"
        MapType -> "O(1) avg | O(n) worst"

-- Get correct label for sets and maps
getAccessLabel : DSType -> String
getAccessLabel ds =
    case ds of
        SetType -> "Membership Test"
        MapType -> "Access"

-- Change description based on data structure
getDescription : DSType -> String
getDescription ds =
    case ds of
        SetType ->
            """Set: An unordered collection of unique elements, typically implemented using hash tables.
            Sets automatically enforce uniqueness and provide fast insertion, deletion, and lookup."""

        MapType ->
            """Hash Map: A collection of key-value pairs with fast access, insertion, and deletion.
            Keys must be unique, and values are retrieved by hashing the key to a location in memory."""
