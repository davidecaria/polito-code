/*

A stack is a LIFO (Last-In First-out) structure in which
the last inserted element is the first to be extracted.
Although the C++ library includes a stack container, implement
your version of a stack allowing the insertion (push) and
extraction (pop) of integer values.
The stack must deliver the following methods:

- push, to insert a new integer into the stack
- pop, to extract the last integer that has been inserted into
  the stack
- visit, to display all elements contained by the stack
- getSize, which returns the number of integers in the stack
- empty, which returns true if the stack is empty.

Suggestion
----------
Use a vector<int> to implement the stack.

*/

#include <iostream>
#include <vector>

using namespace std;

void pushToStack(int i, vector<int> &vector){

  vector.push_back(i);

  return;
}

int popFromStack(vector<int> &vector){

  int toReturn = vector.back();
  vector.pop_back();

  return toReturn;
}

void visitStack(vector<int> &vector){

  std::cout << "The vector elements are : ";

  for(int i=0; i < vector.size(); i++)
    std::cout << vector.at(i) << ' ';

  return;
}

int getSizeStack(vector<int> &vector){

  return vector.size();
}

bool isEmpty(vector<int> &vector){
  return vector.size() == 0 ? true : false;
}

int main() {

  vector<int> v1;

  cout << isEmpty(v1) << '\n';

  for(int i=0;i<10;i++){
    pushToStack(i,v1);
    cout << getSizeStack(v1) << ' ';
  }
  cout << isEmpty(v1) << '\n';
  visitStack(v1);

  return 0;
}