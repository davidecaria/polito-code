/*

A social network (i.e., an undirected graph) is stored in a file with the following format.
Each line of the file indicates a friendship relationship (i.e., an edge of the graph) as

sX_nX sY_nY

This line indicates that the individual sX_nX (surname X name X) is a friend of sY_nY
(surname Y name Y) and vice-versa.

Write a C++ program that:

- Reads the social network from the file and stores it in a proper data structure
  (i.e., an adjacency list).

- Displays the list of all enrolled individuals in the social network in lexicographical
  order.

- Given an individual's name, displays all his/her friends in lexicographic order.

- Given two individuals X and Y, displays whether they are related in the social network,
  i.e., a list of individual friends that lead X to Y.
  For example, if A has B as a friend, B has C as a friend, and C has D as a friend,
  then A and D are related in the social network.

Suggestions
-----------
Implement the adjacency list using a map (of graph vertices) of sets (of adjacency nodes).
Use a standard visit (either a DFS, Depth-First Search, or a BFS, Breadt-First Search)
to discover relationships between two individuals.

*/
#include <iostream>
#include "socialNetwork.h"

int main(){

    SocialNetwork socialNetwork;

    socialNetwork.loadFromFile("input.txt");
    socialNetwork.displayEnrolled();

    return 1;
}


