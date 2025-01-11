[Visit The Website Here](https://dinosaur-oatmeal.github.io/Sorting-Algorithm-Website/)

# Algorithm Website in Elm

This project walks through various algorithms using the **Elm programming language**, a functional programming language designed for building web applications. This project demonstrates how functional programming techniques can be applied to implement and visualize various algorithms in an interactive way using charts and graphs.

## Key Features

- **Functional Programming Paradigm**: All algorithms and visualizations are implemented without mutable states or side effects, adhering to Elm's philosophy of immutability and pure functions.
- **Interactive Visualizations**: Watch algorithms in action step-by-step, allowing users to see the inner workings of the algorithms.
- **Modular Design**: Each algorithm is encapsulated in its own module for clarity and reusability, ensuring multiple algorithms may be run in tandem.

---

## Current Algorithms

### Sorting Algorithms
The following sorting algorithms are included:

#### **1. Bubble Sort**
- A simple sorting algorithm that repeatedly steps through the array, compares adjacent elements, and swaps them if left > right.  
- **Time Complexity**: $O(n^2)$ in the worst case.  
- **Space Complexity**: $O(1)$ (in-place).  

#### **2. Insertion Sort**
- Builds a sorted portion of the list incrementally. Starting with the second element, each element is compared to those in the sorted portion (left of the current element) and moved into its correct position.  
- **Time Complexity**: $O(n^2)$ in the worst case.  
- **Space Complexity**: $O(1)$ (in-place).  

#### **3. Selection Sort**
- Divides the list into sorted and unsorted parts, finds the smallest element in the unsorted part, and swaps it with the first unsorted element.  
- **Time Complexity**: $O(n^2)$ in all cases.  
- **Space Complexity**: $O(1)$ (in-place).  

#### **4. Merge Sort**
- A divide-and-conquer algorithm that recursively divides the list into halves until each sublist contains a single element. It then merges the sublists back together, sorting them when merging.  
- **Time Complexity**: $O(n \log n)$ in all cases.  
- **Space Complexity**: $O(n)$ due to auxiliary arrays being used during merging.  

#### **5. Quick Sort**
- A divide-and-conquer algorithm that selects a "pivot" element (rightmost), partitions the list into two sublists (elements less than the pivot and elements greater than the pivot), and recursively sorts the sublists.  
- **Time Complexity**: $O(n \log n)$ on average and $O(n^2)$ in the worst case (bad pivot).  
- **Space Complexity**: $O(\log n)$ on average for recursion stack.  

#### **6. Shell Sort**
- Compares and exchanges elements at specific intervals (gaps). The gaps are reduced over iterations, and the algorithm ends with a standard insertion sort (gap = 1). This is an optimization of insertion sort because it allows far-apart elements to be swapped immediately with one another without having to "walk" through the array.  
- **Time Complexity**: Depends on the gap sequence; $O(n \log n)$ or $O(n \log n)$ with common sequences; $O(n^2)$ in the worst case.  
- **Space Complexity**: $O(1)$ (in-place).  

### Search Algorithms

#### **1. Linear Search**
- A straightforward search algorithm that checks each element of the list sequentially until the target element is found.  
- **Time Complexity**: $O(n)$ in the worst case.  
- **Space Complexity**: $O(1)$.  

#### **2. Binary Search** (Planned)
- A search algorithm that works on sorted arrays by repeatedly dividing the search interval in half. If the target value is less than the middle element, search in the left half; otherwise, search in the right half.
- **Time Complexity**: $O(\log n)$.
- **Space Complexity**: $O(1)$ for iterative implementation, $O(\log n)$ for recursive implementation.

---

## Upcoming Features

### **Trees**
#### **Tree Traversals** (Planned)
- **In-order Traversal**: Visits nodes in ascending order.
- **Pre-order Traversal**: Visits the root node first, then the left subtree, and finally the right subtree.
- **Post-order Traversal**: Visits the left subtree, the right subtree, and then the root node.

### **Heaps**
#### **Heap Data Structure** (Planned)
- Visualizations for min-heaps and max-heaps, with heapify.

### **Graph Algorithms**
#### **Graph Traversals** (Planned)
- **Depth-First Search (DFS)**: Explores as far as possible along each branch before backtracking.
- **Breadth-First Search (BFS)**: Explores all neighbors of a node before moving on to the next level.

#### **Shortest Path Algorithms** (Planned)
- **Dijkstra’s Algorithm**: Finds the shortest path from a source node to all other nodes in a weighted graph.

#### **Minimum Spanning Tree** (Planned)
- **Kruskal’s Algorithm**: Finds a minimum spanning tree using edge sorting.
- **Prim’s Algorithm**: Finds a minimum spanning tree by growing it one edge at a time.
