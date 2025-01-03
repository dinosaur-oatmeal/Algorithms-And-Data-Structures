{-  All files need access to the sorting track.
    Keeping it in a separate file removes the potential
        of circular imports.
-}
module Structs exposing (SortingTrack, defaultSortingTrack)

import Array exposing (Array)

type alias SortingTrack =
    { array : Array Int
    , outerIndex : Int
    , currentIndex : Int
    , minIndex : Int
    , stack : List ( Int, Int )
    , sorted : Bool
    , didSwap : Bool
    , currentStep : Int
    }

defaultSortingTrack : SortingTrack
defaultSortingTrack =
    { array = Array.fromList
        [9, 6, 16, 5, 13, 14, 8, 19, 2, 1, 15, 17, 4, 10, 20, 12, 3, 11, 18, 7]
    , outerIndex = 0
    , currentIndex = 1
    , minIndex = 0
    , stack = []
    , sorted = False
    , didSwap = False
    , currentStep = 0
    }
