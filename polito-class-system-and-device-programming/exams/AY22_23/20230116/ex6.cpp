/*

What are the elements of vector v after the execution of the while cycle?
Here is the signature of the function memcpy: void *memcpy(void *__dst, const void *__src, size_t __n)
Note that a wrong answer might imply a negative score
1. 0,2,4
2. 0,1,2
3. 1,2,3
4. 2,3,4
5. 2,4,6

#include <vector>
using namespace std;
int main() {

    int i = 0;
    vector<int> v{1,2,3};
    auto l = [&](int& a){ memcpy(&v[i],&a,1*sizeof(int));};
    int temp;

    while( i<3 ){
        temp = v[i]*2;
        cout << temp << endl;
        l(temp);
        i++;
    }
}

*/

/*
Solution:

l is a function that returns a void* and takes a pointer to an integer, then it calls the function memcpy.
The function memcpy writes on the dest the content of the source

Iteration 1 -> i=0

prints 1*2 => 2 on console
l(2) => 2 is wirtten in the vector on position 0
i++ => i=1

Iteration 2 -> i=1

prints 2*2 => 4 on console
l(4) => 4 is wirtten in the vector on position 1
i++ => i=2

Iteration 3 -> i=2

prints 3*2 => 6 on console
l(6) => 6 is wirtten in the vector on position 2
i++ => i=3

Termination condition is hit, the output of the vector is:

v = 2,4,6


*/