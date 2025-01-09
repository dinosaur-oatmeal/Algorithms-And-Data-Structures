{-  All files need access to the sorting track.
    Keeping it in a separate file removes the potential
        of circular imports.
-}
module Structs exposing (SortingTrack, defaultSortingTrack, randomListGenerator)

-- Random List Generation
import Random exposing (Generator)
import Random.List exposing (shuffle)

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

-- Turn List into SortingTrack for random arrays to work
defaultSortingTrack : List Int -> SortingTrack
defaultSortingTrack list =
    { array = Array.fromList list
    , outerIndex = 0
    , currentIndex = 1
    , sorted = False
    , minIndex = 0
    , gap = 10 // 2
    -- Initialize to Array Size for QuickSort
    , stack = [ ( 0, List.length list - 1 ) ]
    , didSwap = False
    , currentStep = 0
    }

-- Generator helper function
randomListGenerator : Generator (List Int)
randomListGenerator =
    shuffle (List.range 1 10)