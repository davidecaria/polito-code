/*
Adjust the stack and the queue programs written during laboratory number 2 to:
- Use templates
- Use both libraries together in the same programs.
Check whether it is possible to insert different data types in both containers from
the same client program.
*/
#include <iostream>
#include "lib_FIFO.h"
#include "lib_LIFO.h"

using namespace std;


int main(){

    lib_FIFO<int> myQueue;
    lib_LIFO<int> myStack;

    for(int i=0;i<10;i++){
        myQueue.pushToQueue(i);
        myStack.pushToStack(i);
    }

    for(int j=0;j<5;j++){
        cout << "Popping element: " << myQueue.popFromQueue() << " from the Queue ";
        cout << "end element: " << myStack.popFromStack() << " from the Stack" << endl;
    }

    cout << "Checking Queue and Stack status: " << myQueue.isQueueEmpty() << " " << myStack.isStackEmpty() << endl;

    return 0;
}
