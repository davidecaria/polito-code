#include <iostream>
#include <map>
#include <list>

using namespace std;


int main(){

    map<int,list<int>> m;

    list<int> lista;
    lista.push_back(3);
    lista.push_back(2);
    lista.push_back(1);

    m.emplace(1,lista);

    cout << m.count(2) << endl;


}