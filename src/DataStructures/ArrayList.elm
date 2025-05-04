module DataStructures.ArrayList exposing (Model, Msg, initModel, update, view)

-- HTML Imports
import Html exposing (Html, div, button, text, input, ul, li)
import Html.Attributes exposing (class, type_, placeholder, value)
import Html.Events exposing (onClick, onInput)
import List exposing (length, range, take, indexedMap, isEmpty, map)
import Array exposing (Array, fromList, get)

-- Types of data structures
type DSType
    = ListType
    | ArrayType

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
    , dataStructure = ListType
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
                                model.elements ++ [ num ]
                        in
                        { model | elements = newElements, inputValue = "" }

                    _ ->
                        model
            
            -- Don't update model once 10 elements in data structure
            else
                model

        RemoveItem ->
            let
                newElems =
                    let
                        len = length model.elements
                    in
                    if len > 0 then
                        -- Take last element from array
                        take (len - 1) model.elements
                    -- Length 0 array shouldn't change
                    else
                        []
            in
            { model | elements = newElems }

        -- Change data structure to new one
        ChangeDataStructure ds ->
            { model | dataStructure = ds }


-- VIEW
view : Model -> Html Msg
view model =
    let
        -- Keep head at the left
        orderedElements =
            model.elements

        -- Build 10 slots for array elements
        arr : Array Int
        arr =
            fromList model.elements

        -- Helper function to build wireframe for array
        arraySlots : List (Maybe Int)
        arraySlots =
            map (\i -> get i arr) (range 0 9)
    in
    div [ class "sort-page" ]
        -- Title
        [ div [ class "sort-title" ]
              [ text "Arrays and Lists" ]

        , div [ class "description" ]
              [ text (getDescription model.dataStructure) ]

        -- Update class to change button color
        , div [ class "traversal-controls" ]
            [ button
                [ class "traversal-button"
                , if model.dataStructure == ListType then class "selected" else class ""
                , onClick (ChangeDataStructure ListType)
                ]
                [ text "List" ]
            , button
                [ class "traversal-button"
                , if model.dataStructure == ArrayType then class "selected" else class ""
                , onClick (ChangeDataStructure ArrayType)
                ]
                [ text "Array" ]
            ]


        , div [ class "insert-delete-container" ]
              [ -- Row containing input and buttons
              div [ class "insert-delete-row" ]
                  -- Add Button
                  [ button [ onClick AddItem ] [ text "Add" ]

                  -- Input field
                  , input
                      [ type_ "text"
                      , placeholder "Enter number"
                      , value model.inputValue
                      , onInput SetInput
                      ]
                      []

                  -- Remove button
                  , button [ onClick RemoveItem ] [ text "Remove" ]
                  ]

              -- Disclaimer text
              , div [ class "disclaimer" ]
                  [ text (infoTextFor model.dataStructure) ]
              ]

        -- Current Visualization
        , div [ class "element-container" ]
            (case model.dataStructure of
                ListType ->
                    -- Show empty container to keep bottom text aligned
                    if isEmpty orderedElements then
                        [ div [ class "element-placeholder" ] [ text " " ] ]
                    -- Show actual list of elements
                    else
                        indexedMap (\i v -> renderElement orderedElements ListType i v) orderedElements

                ArrayType ->
                    indexedMap
                        -- Show indices of array positions
                        (\i mVal ->
                            let
                                label = String.fromInt i
                                display =
                                    case mVal of
                                        Just n  -> String.fromInt n
                                        -- Fill empty box with empty unicode character
                                        _ -> "‎"
                            in
                            div [ class "element-box wireframe-slot" ]
                                [ div [ class "element-label" ] [ text label ]
                                , div [ class "element-value" ] [ text display ]
                                ]
                        )
                        arraySlots
            )
        
        -- Breakdown
        , div [ class "variable-list" ]
            [ ul []
                [ li [] [ text "List: Allow data to be stored non-contiguously." ]
                , li [] [ text "Array: Data is contiguous, so random access is supported." ]
                ]
            ]

        -- Big-O Notation
        , div [ class "big-o-title" ] [ text "Big(O) Notation" ]
        , div [ class "big-o-list" ]
            [ bigOItem "Insert" (getInsert model.dataStructure)
            , bigOItem "Remove" (getRemove model.dataStructure)
            , bigOItem "Access" (getAccess model.dataStructure)
            ]
        , div [ class "space-complexity" ] [ text "Space Complexity: O(n)" ]
        ]


-- Render an element in the data structure
renderElement : List Int -> DSType -> Int -> Int -> Html Msg
renderElement list dsType index value =
    let
        -- Get first and last element of the list
        len = length list
        isFirst = index == 0
        isLast = index == len - 1

        label =
            case dsType of
                -- Names for first and last list indices
                ListType ->
                    if isFirst then "Head"
                    else if isLast then "Tail"
                    else ""

                -- No names for array indices
                ArrayType ->
                    ""
    in
    div [ class "element-box" ]
        -- Create element label and value
        [ div [ class "element-label" ] [ text label ]
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
        ListType  -> "O(1) Head | O(n) Tail"
        ArrayType -> "O(n) Beginning | O(1) End"

-- Cost for Removal
getRemove : DSType -> String
getRemove ds =
    case ds of
        ListType  -> "O(1) Head | O(n) Tail"
        ArrayType -> "O(n) Beginning | O(1) End"

-- Cost to access
getAccess : DSType -> String
getAccess ds =
    case ds of
        ListType  -> "O(n)"
        ArrayType -> "O(1)"

-- Change description based on traversal type
getDescription : DSType -> String
getDescription ds =
    case ds of
        ListType ->
            """Linked List: A linear data structure where elements (nodes) are stored in the heap and linked together using pointers.
                Lists don't require a fixed size like arrays."""

        ArrayType ->
            """Array: A fixed-size, index-based data structure stored in contiguous memory on the stack.
                Arrays are ideal when element positions are known and performance is critical."""

-- Little text below buttons
infoTextFor : DSType -> String
infoTextFor ds =
    case ds of
        ListType  -> "List: elements can be added and removed as needed thanks to using the heap."
        ArrayType -> "Array: elements are bounded to the length allocated thanks to using the stack."
