{-  All files need access to the sorting track.
    Keeping it in a separate file removes the potential
        of circular imports.
-}
module MainComponents.Structs exposing (..)

-- Random List Generation
import Random exposing (Generator)
import Random.List exposing (shuffle)
import Random.Extra

import Array exposing (Array)

-- Record to hold all data for sorting and searching algorithms
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
    -- Initialize for ShellSort
    , gap = 10 // 2
    -- Initialize to Array Size for QuickSort
    , stack = [ ( 0, List.length list - 1 ) ]
    -- Initialize for BubbleSort
    , didSwap = False
    , currentStep = 0
    }

-- Shuffle list for arrays
randomListGenerator : Generator (List Int)
randomListGenerator =
    shuffle (List.range 1 10)

-- Grab a random int for target in searching
randomTargetGenerator : Generator Int
randomTargetGenerator =
    Random.int 1 10
