#include <map>
#include <set>
#include <iostream>
#include <string>

using namespace std;

class User
{
private:
    string name;
public:
    User();  
    User(string name);
    string getName() const;
    void modifyName(string name);
    bool operator<(const User& other) const{
        return name < other.name;
    }
};

class SocialNetwork
{
private:
    map<User,set<User>> socialNetwork;
    const User* getUserByName(string name);
    void linkFriends(string friendA, string friendB);
public:
    SocialNetwork();
    bool loadFromFile(string fileName);
    void displayEnrolled();
    bool findRelationship(User a, User b);

};

