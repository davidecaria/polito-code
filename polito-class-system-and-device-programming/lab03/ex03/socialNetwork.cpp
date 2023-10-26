#include "socialNetwork.h"
#include <string>
#include <iostream>
#include <fstream>

/*
USER CLASS
*/

User::User(){

    return;
}

User::User(string name){
    this->name=name;

    return;
}

string User::getName() const{
    
    return this->name;
}

void User::modifyName(string name){
    this->name=name;

    return;
}

/*
SOCIAL NETWORK CLASS
*/

SocialNetwork::SocialNetwork(){

    return;
}

const User* SocialNetwork::getUserByName(string name){

    for(const auto& e : socialNetwork){
        if(e.first.getName() == name){
            
            return &(e.first);
        }
    }

    return nullptr;
}

bool SocialNetwork::loadFromFile(string fileName){
    ifstream fileIn(fileName);

    if(!fileIn.is_open()){
        return false;
    }

    string userA, userB;
    while(fileIn >> userA >> userB){
        //Creating the user if the don't exists
        if(getUserByName(userA)==nullptr){
            //Create new user
            socialNetwork.insert(make_pair(User(userA),set<User>()));
        }
        if(getUserByName(userB)==nullptr){
            //Create new user
            socialNetwork.insert(make_pair(User(userB),set<User>()));
        }
        //Linking the users
        const User uA = *(getUserByName(userA));
        const User uB = *(getUserByName(userB));

        socialNetwork[uA].insert(uB);
        socialNetwork[uB].insert(uA);
    }


    return true;
}

void SocialNetwork::displayEnrolled(){
    for(auto& elem : socialNetwork){
        cout << elem.first.getName() << " is enrolled!" << endl;
    }
}

bool SocialNetwork::findRelationship(User a, User b){
    return false;
}