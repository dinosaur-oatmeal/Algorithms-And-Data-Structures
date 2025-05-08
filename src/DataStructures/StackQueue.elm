module DataStructures.StackQueue exposing (..)

-- HTML Imports
import Html exposing (Html, div, button, text, input, ul, li)
import Html.Attributes exposing (class, type_, placeholder, value)
import Html.Events exposing (onClick, onInput)

-- List for stacks and queues
import List exposing (length)

-- Types of data structures
type DSType
    = Stack
    | Queue

-- MODEL
type alias Model =
    { elements : List Int
    , dataStructure : DSType
    , inputValue : String
    }

type Msg
    -- Take input value from user
    = SetInput String
    -- Add item to data structure
    | AddItem
    -- Remove item from data structure
    | RemoveItem
    -- Change type of data structure
    | ChangeDataStructure DSType

-- INIT
initModel : Model
initModel =
    { elements = []
    , dataStructure = Stack
    , inputValue = ""
    }

-- UPDATE
update : Msg -> Model -> Model
update msg model =
    case msg of
        -- Set model's user value to input
        SetInput val ->
            { model | inputValue = val }

        AddItem ->
            -- Try to convert input to an int
                -- Cap inputs to 10 ints
            if length model.elements < 10 then
                case String.toInt model.inputValue of
                    Just num ->
                        let
                            newElements =
                                case model.dataStructure of
                                    -- Push to front for stack
                                    Stack ->
                                        num :: model.elements

                                    -- Push to back for Queue
                                    Queue ->
                                        model.elements ++ [ num ]
                        in
                        -- Update model and reset inputValue
                        { model | elements = newElements, inputValue = "" }

                    _ -> model
                    
            -- Don't update model once 10 elements in data structure
            else
                model

        RemoveItem ->
            case model.elements of
                -- Don't update for empty list
                [] -> model

                -- Always remove first element in list
                _ :: rest ->
                    { model | elements = rest }

        -- Change data structure to new one
        ChangeDataStructure newStructure ->
            ( { model | dataStructure = newStructure } )

{-
    Basic page view for Data Structures
        Title, Description, Buttons, User Input, Delete, Diagram, Breakdown, & Big-O Notation
        (ControlMsg -> msg) is ControlMsg in Main.elm
-}
view : Model -> Html Msg
view model =
    let
        orderedElements =
            -- Reverse the list of elements for stacks
            if model.dataStructure == Stack then
                List.reverse model.elements
            else
                model.elements
    in
    div [ class "sort-page" ]
        [ -- Title
          div [ class "sort-title" ]
              [ text "Stacks and Queues" ]

        , div [ class "description" ]
              [ text (getDescription model.dataStructure) ]

        -- Update class to change button color
        , div [ class "traversal-controls" ]
              [ button
                  [ class "traversal-button"
                  , if model.dataStructure == Stack then class "selected" else class ""
                  , onClick (ChangeDataStructure Stack)
                  ]
                  [ text "Stack (LIFO)" ]
              , button
                  [ class "traversal-button"
                  , if model.dataStructure == Queue then class "selected" else class ""
                  , onClick (ChangeDataStructure Queue)
                  ]
                  [ text "Queue (FIFO)" ]
              ]

        , div [ class "insert-delete-container" ]
              [ -- Row containing input and buttons
              div [ class "insert-delete-row" ]
                  -- Add Button
                  [ button [ onClick AddItem ]
                    [ text (if model.dataStructure == Queue then "Add" else "Push") ]

                  -- Input field
                  , input
                      [ type_ "text"
                      , placeholder "Enter number"
                      , value model.inputValue
                      , onInput SetInput
                      ]
                      []

                  -- Remove button
                  , button [ onClick RemoveItem ]
                    [ text (if model.dataStructure == Queue then "Remove" else "Pop") ]
                  ]

              -- Disclaimer text
              , div [ class "disclaimer" ]
                  [ text (infoTextFor model.dataStructure) ]
              ]

        -- Current visualization
        , div [ class "element-container" ]
            -- Show empty container to keep bottom text aligned
            (if List.isEmpty orderedElements then
                [ div [ class "element-placeholder" ] [ text " " ] ]
            -- Show actual list of rendered elements
            else
                List.indexedMap (renderElement orderedElements model.dataStructure) orderedElements
            )

        -- Breakdown
        , div [ class "variable-list" ]
              [ ul []
                  [ li [] [ text "Element under the arrow will be removed first." ] ]
              ]

        -- Big-O Notation
        , div [ class "big-o-title" ] [ text "Big(O) Notation" ]
        , div [ class "big-o-list" ]
            [ bigOItem "Insert" (getInsert model.dataStructure)
            , bigOItem "Remove" (getRemove model.dataStructure)
            ]
        , div [ class "space-complexity" ]
            [ text "Space Complexity: O(n)" ]
        ]

-- Get a specific label for data structure
getLabel : DSType -> Int -> Int -> String
getLabel dsType index len =
    case dsType of
        Stack ->
            if index == len - 1 then "Top"
            else if index == 0 then "Bottom"
            else ""

        Queue ->
            if index == 0 then "Front"
            else if index == len - 1 then "Back"
            else ""


-- Render an element in the data structure
renderElement : List Int -> DSType -> Int -> Int -> Html Msg
renderElement list dsType index value =
    let
        -- Get length and label for data structure
        len = List.length list
        label = getLabel dsType index len

        -- Create stack and queue arrows
        stackArrow =
            if label == "Top" && dsType == Stack then
                div [ class "stack-arrow" ] [ text "↓" ]
            else
                text ""

        queueArrow =
            if index == 0 && dsType == Queue then
                div [ class "queue-arrow" ] [ text "↓" ]
            else
                text ""
    in
    div [ class "element-box" ]
        -- Create element arrow, label, and value
        [ stackArrow
        , queueArrow
        , div [ class "element-label" ] [ text label ]
        , div [ class "element-value" ] [ text (String.fromInt value) ]
        ]

-- BIG-O HELPERS
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
        Stack  -> "O(1) Push (End at Top)"
        Queue -> "O(1) Insert (End)"

-- Cost for Removal
getRemove : DSType -> String
getRemove ds =
    case ds of
        Stack  -> "O(1) Pop (End at Top)"
        Queue -> "O(1) Remove (Beginning)"

-- Change description based on traversal type
getDescription : DSType -> String
getDescription dsType =
    case dsType of
        Stack ->
            """Stack: A data structure that follows the LIFO principle (Last In, First Out).
                Think of it like a stack of plates: the last plate you put on top is the first one you take off."""

        Queue ->
            """Queue: A data structure that follows the FIFO principle (First In, First Out).
                Imagine a line at a grocery store: the first person to get in line is the first to be served."""

-- Little text below buttons
infoTextFor : DSType -> String
infoTextFor ds =
    case ds of
        Stack -> "Stack: elements are removed from the top (last added)."
        Queue -> "Queue: elements are removed from the front (first added)."
