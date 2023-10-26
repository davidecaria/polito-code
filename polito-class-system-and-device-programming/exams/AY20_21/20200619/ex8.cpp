/*
Write a small C++ example with three threads:
1. Thread take_value takes a number from the command line.
2. Thread check_if_prime checks whether the number is prime.
3. Thread give_answer prints the answer to standard output.
Thread communication should be made using promises and futures.
If you do not remember the exact syntax of C++ synchronization primitives, you can write
down a mock version (with same sense...). Correctness is strictly required in the template
syntax which is required to be right, as well as in any basic C++ syntax
*/


/*
PROPOSED SOLUTION:
The idea is to have 2 contact points between the three threads:
Contact point 1 (CP1) between thread 1 and thread 2,
Contatc point 2 (CP2) between thread 2 and thread 3,

the program does not specify and cyclic behavious so we can assume that the program ends as the three threads have finished


input_thread ---- CP1 ---- check_thread ---- CP2 ---- output_thread


CP1 and CP2 are realized with the use of promises and futures

Remember that promises are used to supply values and futures to get them:

input_thread:
    will receive a promise and once it has finished it will set the value of the promise
check_thread:
    will receive a future and a promise
    it will wait for the value of the future (coming from the promise of input_thread)
    once the value is checked it will set the value of its promise
output_thread:
    will receive a future and it will wait for the value to be set from the previous promise
*/

#include <iostream>
#include <thread>
#include <vector>
#include <future>

void input_thread(std::promise<int>& input_promise) {
    int number;
    std::cout << "Input thread started" << std::endl;
    std::cout << "Write a number: ";
    std::cin >> number;

    input_promise.set_value(number);

    //exit(EXIT_SUCCESS);
}

void check_thread(std::promise<bool>& check_promise, std::future<bool>& input_future) {
    int number = input_future.get();
    std::cout << "Thread checker starts" << std::endl;

    // If the number is prime, only 1 and itself will divide it
    for (int i = 2; i < number; i++) {
        if (number % i == 0) {
            check_promise.set_value(false);
            exit(EXIT_SUCCESS);
        }
    }

    check_promise.set_value(true);
    //exit(EXIT_SUCCESS);
}

void output_thread(std::future<bool>& check_future) {
    bool isPrime;
    isPrime = check_future.get();

    if (isPrime) {
        std::cout << "The number is prime!" << std::endl;
    } else {
        std::cout << "The number is not prime!" << std::endl;
    }
    //exit(EXIT_SUCCESS);
}

int main() {
    // I bind the promise with the related future 
    std::promise<int> input_promise;
    std::thread t_in(input_thread, std::ref(input_promise));
    std::future<int> input_future = input_promise.get_future();

    std::promise<bool> check_promise;
    std::thread t_ch(check_thread, std::ref(check_promise), std::ref(input_future));
    std::future<bool> check_future = check_promise.get_future();

    // I generate the three threads and wait for them
    std::thread t_ou(output_thread, std::ref(check_future));

    t_in.join();
    t_ch.join();
    t_ou.join();

    return 1;
}
