[Visit The Website Here](https://www.willmaberry.com/Algorithms-And-Data-Structures/)

# Algorithm Learning Platform in Elm

This project was initially created to **help college students** gain a strong conceptual understanding of how common algorithms and data structures throughout the field of computer science function. Built entirely using Elm, a **functional programming language** designed for building web applications, the educational platform demonstrates how functional programming techniques can be applied to implement and visualize various algorithms and data structures interactively using charts and graphs.

This project's impact has superseded students' learning on their own volition. Currently, **Tenured faculty are utilizing this platform during lectures** to demonstrate the intricacies of complex algorithms, including sorting, searching, creating heaps, and traversing trees and graphs. Furthermore, local faculty recommend this platform as supplemental learning material for UT-Arlington's CSE 3318 Data Structures and Algorithms class.

## Key Features

- **Functional Programming Paradigm**: With an interest in learning about different programming techniques outside of my college classes, I decided to take a deep dive into Elm and the functional programming paradigm as a whole with this project. In doing so, I have followed the core of the Elm language: Model, Update, and View. Rather than juggling half a dozen JavaScript libraries, everything from the back end to the front end is built with Elm's architecture, adhering to the philosophy of immutability and pure functions. As a result, I've been able to spend more time focusing on building the platform instead of debugging library incompatibilities.
  
- **Interactive Visualizations**: My greatest struggle when taking Algorithms and Data Structures was the lack of interactivity while studying. Whether it was trying to follow a series of images on a website that did a mediocre job explaining how they correlate to one another or manually charting the intricacies of the algorithms I was learning about in class, I knew there had to be a better way to see what was happening behind the scenes. No one should struggle to learn how data structures and algorithms function as I did due to a lack of fundamental educational content on their internal structures. With a passion and hope that I'll be the last person to spend hours manually charting how these algorithms work, I have crafted in-depth step-by-step visualizations for every algorithm and data structure found throughout the project.
  
- **Modular Design**: Connected by Main.elm, each algorithm and data structure is encapsulated in its own class, ensuring a modular codebase. Not only are algorithms disjoint from one another, making bugs easy to catch, but they also share common data structures. For instance, every sorting and searching algorithm uses the same SortingTrack data structure, and heaps/tree traversals utilize a single tree data structure to work on. The ability to reuse components like these has reduced the amount of code for the project, mitigating inconsistencies between implementations and saving disk space.

---

## Algorithms

### Sorting Algorithms

#### **1. Bubble Sort**
- Bubble Sort is one of the simplest sorting algorithms. It steps through the array one element at a time, comparing and swapping adjacent elements if the right one is less than the left one. It does this repeatedly until the array is sorted. 
- **Time Complexity**: $O(n^2)$
- **Space Complexity**: $O(1)$ 

#### **2. Selection Sort**
- Selection Sort loops through the entire array, tracking the location of the smallest found element. Once the pass over the array is complete, the smallest element is swapped with the current location being looked at. As a result, there is always a sorted and unsorted section of the array on either side of the current index.
- **Time Complexity**: $O(n^2)$ 
- **Space Complexity**: $O(1)$
  
#### **3. Insertion Sort**
- Insertion Sort moves elements from their current locations toward the beginning of the array. An element is moved until a smaller element is found in the sorted section of the array. This allows the algorithm to move elements into their correct relative positions one at a time until the array is sorted. 
- **Time Complexity**: $O(n^2)$
- **Space Complexity**: $O(1)$

#### **4. Shell Sort**
- Shell Sort is an optimized version of insertion sort and works by sorting elements that are far apart in the array first. As the algorithm runs, the gap between elements being compared reduces, resulting in elements moving toward their correct positions more quickly than insertion sort. 
- **Time Complexity**: $O(n \log n)$ or $O(n \log n)$ to $O(n^2)$
- **Space Complexity**: $O(1)$

#### **5. Merge Sort**
- Merge Sort is a divide-and-conquer sorting algorithm that recursively splits an array into smaller subarrays. This splitting occurs until each subarray contains one element. Then, it merges these subarrays together in sorted order. Every merge step ensures that the combined subarrays are sorted, resulting in the larger array being fully sorted.
- **Time Complexity**: $O(n \log n)$ 
- **Space Complexity**: $O(n)$

#### **6. Quick Sort**
- Quick Sort selects a pivot element and partitions the array around it (the rightmost element in this example). During partitioning, elements that are smaller than the pivot are to the left, and elements larger than the pivot are to the right. The algorithm recursively applies the partitioning to the left and right subarrays until the greater array is fully sorted (one element in the left subarray).
- **Time Complexity**: $O(n \log n)$ to $O(n^2)$ 
- **Space Complexity**: $O(n)$

### Search Algorithms

#### **1. Linear Search**
- As the easiest searching algorithm to implement, linear search starts at the first element in the array and searches until it finds the target element or hits the end of the array. If the target element is found, the algorithm stops and returns the index of the element. If the element isn't found, the algorithm returns -1 indicating it's not in the array.
- **Time Complexity**: $O(n)$
- **Space Complexity**: $O(1)$

#### **2. Binary Search**
- Binary Search is more efficient than linear search but requires the array to be sorted. The algorithm functions by repeatedly dividing the search range in half, comparing whether the target value is less than or greater than the current pointer value. If the current pointer value is less than the target, it searches the right half; otherwise, it searches the left half.
- **Time Complexity**: $O(\log n)$
- **Space Complexity**: $O(1)$

### **Trees & Heaps**

#### **1. Tree Traversals**

##### **Types of Traversals**
- **In-order**: visits the nodes in the order: (Left → Root → Right). This type of traversal is useful for binary search trees because it traverses the tree in ascending/descending for sorted trees.
  
- **Pre-order**: visits the nodes in the order: (Root → Left → Right). This type of traversal is useful for creating a copy of the tree because it starts at the topmost root node and works toward the leaf nodes.
  
- **Post-order**: visits nodes in the order: (Left → Right → Root). This type of traversal is useful for deleting trees because it starts at the leaf nodes and works toward the root of the tree.

##### **Complexities:** 
- **Time Complexity**: $O(n)$
- **Space Complexity**: $O(h)$ | $h$ = height of tree

#### **2. Heaps**:

##### **Types of Heaps**
- **Min-Heaps**: supports insertion of new nodes, deletion of the root node, and step-by-step heapify.
  
- **Max-Heaps**: supports insertion of new nodes, deletion of the root node, and step-by-step heapify.

##### **Supported Operations**  
- **Insertion**: Inserts a new node at the end of the heap.
  
- **Deletion**: Removes the root node of the heap.
  
- **Heapify**: Walks through the heapify steps after insertion or deletion.  

##### **Complexities:**
- **Time Complexity**: $O(\log n)$
- **Space Complexity**: $O(n)$

#### **3. Binary Search Trees**

- Binary search trees are a special type of tree where every node has a maximum of two child nodes. Additionally, left hcild nodes are always smaller than the parent, while right child nodes are always larger.

##### **Complexities:**
- **Time Complexity**: $O(n)$
- **Space Complexity**: $O(n)$

### **Graphs**

#### **1. Shortest Path Algorithm**

##### **Dijkstra’s Algorithm**
- Dijkstra's algorithm traverses weighted graphs, finding the shortest path between a source node and target node. This algorithm implements a priority queue, selecting the closest unvisited node until the target node is found. By utilizing a priority queue, the most optimal path between the source node and target node is always found first.

##### **Complexities:**
- **Time Complexity**: $O((V + E) log V)$
- **Space Complexity**: $O(V)$ or $O(V + E)$

#### **2. Minimum Spanning Trees**

##### **Prim's Algorithm**
- Prim's algorithm constructs a Minimum Spanning Tree (MST) by expanding from a starting node, always selecting the cheapest edge that connects to an unvisited node. Using a priority queue, Prim's gradually forms a spanning tree with the minimal total weight.

##### **Complexities:**
- **Time Complexity**: $O((V + E) log V)$
- **Space Complexity**: $O(V + E)$

##### **Kruskal's Algorithm**
- Kruskal's algorithm builds a Minimum Spanning Tree (MST) by sorting edges by weight and adding them one by one, ensuring no cycles form. By utilizing a union structure, Kruskal's always selects the cheapest available edge to achieve the minimal total weight.

##### **Complexities:**
- **Time Complexity**: $O(E log E)$
- **Space Complexity**: $O(V + E)$
  
---

## **Data Structures**

### Linear Structures

#### **Arrays**
- An ordered collection of elements accessible by index stored on the stack that supports random access. All arrays require bounds and can't change size as needed.

##### **Complexities:**
- **Time Complexity**:
  - Insert: $O(n)$ Beginning | $O(1)$ End
  - Remove: $O(n)$ Beginning | $O(1)$ End
  - Access: $O(1)$
- **Space Complexity**: $O(n)$


#### **Linked Lists**
- A sequence of nodes where each node points to the next, stored in the heap. All lists can change their size as needed and don't require contiguous memory.

##### **Complexities:**
- **Time Complexity**:
  - Insert: $O(1)$ Beginning | $O(n)$ End
  - Remove: $O(1)$ Beginning | $O(n)$ End
  - Access: $O(n)$
- **Space Complexity**: $O(n)$

#### **Stacks**
- A special type of list that follows the Last-In, First-Out (LIFO) structure. This data structure is how function call stacks work.

##### **Complexities:**
- **Time Complexity**:
  - Insert (Push): $O(1)$ (Only End at Top)
  - Remove (Pop): $O(1)$ (Only End at Top)
- **Space Complexity**: $O(n)$

#### **Queues**  
- A special type of list that follows the First-In, First-Out (FIFO) structure. This data structure is similar to how lines in a grocery store work.

##### **Complexities:**
- **Time Complexity**:
  - Insert: $O(1)$ (Only End)
  - Remove: $O(1)$ (Only Beginning)
- **Space Complexity**: $O(n)$

### Associative Structures

#### **Hash Sets**
- An unordered collection of unique elements, typically used for quick membership checking as hash sets.

##### **Complexities:**
- **Time Complexity**:
  - Insert: $O(1)$ Average | $O(n)$ Worst
  - Remove: $O(1)$ Average | $O(n)$ Worst
  - Membership Test: $O(1)$ Average | $O(n)$ Worst
- **Space Complexity**: $O(n)$


#### **Hash Maps**
- A collection of key-value pairs with fast access, insertion, and deletion. Keys must be unique, and values are retrieved by hashing the key to a location in memory.

##### **Complexities:**
- **Time Complexity**:
  - Insert: $O(1)$ Average | $O(n)$ Worst
  - Remove: $O(1)$ Average | $O(n)$ Worst
  - Access: $O(1)$ Average | $O(n)$ Worst
- **Space Complexity**: $O(n)$

## Work In Progress (WIP)

#### **Tree Traversals** 

- **Depth-First Search (DFS)**: Explores as far as possible along each branch before backtracking.
- **Breadth-First Search (BFS)**: Explores all neighbors of a node before moving on to the next level.

---

## Upcoming Features

- (nothing here right now)
---
