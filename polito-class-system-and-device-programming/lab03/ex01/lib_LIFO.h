#include <iostream>
#include <vector>

using namespace std;

template <class T>
class lib_LIFO
{
private:
    vector<T> stack;
public:
    void pushToStack(T &element){
        stack.push_back(element);

        return;
    }
    T popFromStack(){
        if(stack.empty()){
            cout << "Stack is empty";
        }
        T temp = stack.back();
        //cout << temp << " popped from stack!";
        stack.pop_back();

        return temp;
    }
    void visitStack(){
        for(auto &single : stack){
            cout << single << " ";
        }
        cout << "\n";
        
        return;
    }
    int getSizeStack(){

        return stack.size();
    }
    bool isStackEmpty(){

        return stack.empty();
    }
};
