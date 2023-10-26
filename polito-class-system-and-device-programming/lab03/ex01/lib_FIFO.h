#include <iostream>
#include <list>

using namespace std;

template <class T>
class lib_FIFO
{
private:
    list<T> queue;
public:
    void pushToQueue(T &element){
        queue.push_back(element);

        return;
    }
    T popFromQueue(){
        if(queue.empty()){
            cout << "Queue is empty";
        }
        T temp = queue.front();
        //cout << temp << " popped from queue!";
        queue.pop_front();

        return temp;
    }
    void visitQueue(){
        for(auto &single : queue){
            cout << single << " ";
        }
        cout << "\n";
        
        return;
    }
    int getSizeQueue(){

        return queue.size();
    }
    bool isQueueEmpty(){

        return queue.empty();
    }
};
