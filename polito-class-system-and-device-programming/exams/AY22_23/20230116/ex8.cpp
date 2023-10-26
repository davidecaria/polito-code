/*
Write a C++ program that operates on a vector of integers v.
You should manage the correct synchronization of the following threads:
- a thread “writer” that adds a random number between 1 and 10 to the vector every 5 seconds;
- a thread “worker” that executes the commands received from console (if valid);
- a thread “ui” that constantly checks for user input from console; the valid commands are the following ones:
    0 = terminate the program;
    1 = print all elements in the vector;
    2 = print last element of the vector;
    3 = delete all elements from the vector.
The function to put a thread in the sleep status (e.g., for 1 second) is the following one:
std::this_thread::sleep_for (std::chrono::seconds(1))
Write the code of the program and manage threads synchronization.
Make sure all threads finish running before the main program terminates.
If you do not remember the exact syntax of C++ synchronization primitives, you can write down a mock version (with
same sense...). Correctness is strictly required in the template syntax which is required to be right, as well as in any
basic C++ syntax
*/

/*
SOLUTION DRAFT

We need 3 thread that perform different operations. They need to be syncrhonized.

When one of the thread is working the others should wait and not act. 
The only exception is for the input part which should be independent up until the command itself is issued.

We need a mutex to synchonize the 3 thread and a condition variable to implement a correct solution
*/

#include <thread>
#include <vector>
#include <condition_variable>
#include <iostream>

using namespace std;


// Function prototypes of the therads

void thread_writer(void);
void thread_worker(void);
void thread_ui(void);

// Mutex and condition variables to synchronize, command variable shared among the threads

mutex mx;
condition_variable cv;
int command;
bool keep_looping = true;

// Vector on which writer has to operate

vector<int> vt;

// Main function

int main(){

    // Create the 3 thread which start as soon as they are created
    
    thread thread_writ(thread_writer);
    thread thread_work(thread_worker);
    thread thread_user(thread_ui); 

    thread_user.join();
    thread_work.join();
    thread_writ.join();

    cout << "End" << endl;

    return 0;
}

/*
ACTUAL IMPLEMENTATION OF THE FUNCTIONS

Each thread must acquire the mutex before starting to work

We can use the wrapper unique_lock so that we are sure that the lock and unlock of the mutex
is done when the constructor and destructor are called


*/


void thread_writer(void){

    while (keep_looping){
        
        this_thread::sleep_for(chrono::milliseconds(5000));
        unique_lock<mutex> lock_write(mx);
        vt.emplace_back(rand()%100+1);
        lock_write.unlock();
    }
    cout << "Thread WRITER terminating" << endl;

}
void thread_worker(void){

    while(keep_looping){
        unique_lock<mutex> lock_work(mx);
        cv.wait(lock_work);
                
        //Here the thread is up and after the wait the lock has been aquired
        switch(command){
            case 0:
                //If the command is 0 I shut down this thread and I wake up all the threads waiting on the cv
                //In this situation only one
                cout << "Thread WORKER terminating" << endl;
                keep_looping = false;
                break;
            case 1:
                //Print the entire vector up to now
                if(vt.empty()){
                    cout << "The vector is empty";
                }else{
                    for(const auto& num : vt){
                        cout << num << " ";
                    }
                }
                cout << endl;
                break;
            case 2:
                //Print only the last element of the vector
                if(!vt.size()){
                    cout << "The vector is empty";
                }else{
                    cout << vt.back();
                }
                cout << endl;
                break;
            case 3:
                //Removing all elements in a vector
                vt.clear();
                break;
            default:
                cout << "Error in the command line" << endl;
            break;
        }
        lock_work.unlock();

    }

}
void thread_ui(void){

    int input;
    
    while(keep_looping){
        
        cout << "Command options: " << endl;
        cout << "0. to shutdown the process" << endl;
        cout << "1. to print the entire vector" << endl;
        cout << "2. to print the last element of the vector" << endl;
        cout << "3. to delete all elements from the vector" << endl;
        cout << "Input command: ";
        cin >> input;

        //Once the command is acquired I have to aquire the mutex and set the value of the command
        unique_lock<mutex> lock_ui(mx);

        if(!input){
            keep_looping = false;
            command = input;
            cout << "Thread UI terminating" << endl;
            cv.notify_one();
        }else{
            command = input;
            cv.notify_one();
        }
        //Now the lock should be released
        lock_ui.unlock();
    }

}