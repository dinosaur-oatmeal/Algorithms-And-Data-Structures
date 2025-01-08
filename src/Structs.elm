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
    , sorted : Bool
    , minIndex : Int
    , gap : Int
    , stack : List ( Int, Int )
    , didSwap : Bool
    , currentStep : Int
    }

defaultSortingTrack : SortingTrack
defaultSortingTrack =
    { array = Array.fromList
        [9, 6, 5, 8, 2, 1, 4, 10, 3, 7]
    , outerIndex = 0
    , currentIndex = 1
    , sorted = False
    , minIndex = 0
    , gap = 10 // 2
    -- Initialize to Array Size for QuickSort
    , stack = [ ( 0, 9 ) ]
    , didSwap = False
    , currentStep = 0
    }
