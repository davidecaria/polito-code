/*
A queue is a FIFO (First-In First-out) structure in which
the first inserted element is the first to be extracted.
Although the C++ library includes a queue containers, implement
your version of a queue allowing the insertion (enqueue) and
extraction (dequeue) of strings.
The queue must deliver the following methods:

- enqueue, to insert a new string into the queue
- dequeue, to extract the last string that has been inserted into the
  queue
- visit, to display all elements contained by the queue
- getSize, which returns the number of strings in the queue
- empty, which returns true if the queue is empty.

Suggestion
----------
Use a list<string> or dueue<string> to implement the queue.

*/

#include <iostream>
#include <vector>
#include <list>

using namespace std;
void pushToStack(int i,list<int> &queue){

  queue.push_back(i);

  return;
}

int popFromStack(list<int> &queue){

    int toReturn = queue.front();
    queue.pop_front();

    return toReturn;
}

void visitStack(list<int> &queue){

  std::cout << "The vector elements are : ";

  for(auto e : queue){
    cout << e << ' ';
  }

  return;
}

int getSizeStack(list<int> &queue){

  return queue.size();
}

bool isEmpty(list<int> &queue){
  return queue.size() == 0 ? true : false;
}

int main() {

  list<int> v1;

  cout << isEmpty(v1) << '\n';

  for(int i=0;i<10;i++){
    pushToStack(i,v1);
    cout << getSizeStack(v1) << ' ';
  }
  cout << isEmpty(v1) << '\n';
  visitStack(v1);

  return 0;
}