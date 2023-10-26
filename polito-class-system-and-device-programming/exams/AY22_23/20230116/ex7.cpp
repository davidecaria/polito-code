/*
In which lines of the main the move constructor is called?
Note that a wrong answer might imply a negative score
1. Line 1
2. Line 2
3. Line 3
4. Line 4
5. It is never called

#include <iostream>
using namespace std;
class Y {
public: //the five copy-control members
//constructors
    Y() { std::cout << "dc " << std::endl; } //default constructor dc
    Y(const Y &) { std::cout << "cc" << std::endl; } //copy constructor cc
    Y(Y &&) noexcept { std::cout << "mc" << std::endl; }; //move constructor mc
//assignments
    Y &operator=(const Y &) { std::cout << "ca" << std::endl; } //copy assignment ca
    Y &operator=(Y &&) {std::cout << "ma" << std::endl;} //move assignment ma
//destructor
    ~Y() { std::cout << "d" << std::endl; } //destructor d
};

Y* f_a(){ return new(Y);}
Y f_b(Y& y_b){ return Y(y_b);}

int main() {
    Y y0; // line 1
    Y *y1 = f_a(); // line 2
    Y y2 = f_b(y0); // line 3
    delete(y1); // line 4
    return 0; //line 5
}
*/

/*
Solution:

In line 1 the varialbe y0 is just declared, so no constructor is called
In line 2 the variable y1 is assigned with a newly created Y so a default constructor is called
In line 3 the variable y2 is assigned with the return of the f_b function, so a copy constructor is called
In line 4 the variable y1 is destroyed so the destructor is called
In linr 5 the function returns, nothing called

The solution is option 5

*/