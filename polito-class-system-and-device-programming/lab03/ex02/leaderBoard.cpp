#include "leaderBoard.h"
#include <string>
#include <iostream>

/*
PLAYER CLASS
*/

Player::Player(string playerName, int playerScore){
    this->playerName = playerName;
    this->playerScore = playerScore;
}

string Player::getPlayerName(){
    
    return playerName;
}

int Player::getPlayerScore(){

    return playerScore;
}

void Player::upDateScore(int newScore){
    playerScore = newScore;

    return;
}

/*
LEADERBOARD CLASS
*/
LeaderBoard::LeaderBoard(){

};

void LeaderBoard::addNewPlayer(string name, int score){
    Player tmp(name,score);
    leaderBoard.insert(tmp);

    return;
}

void LeaderBoard::addExistingPlayer(Player p){
    leaderBoard.insert(p);

    return;
}

void LeaderBoard::removePlayer(string name){
    for(auto e : leaderBoard){
        if(e.getPlayerName()==name){
            leaderBoard.erase(e);
            return;
        }
    }

    return;
} 

void LeaderBoard::updatePlayerScore(string name, int newScore){
    for(auto e : leaderBoard){
        if(e.getPlayerName()==name){
            e.upDateScore(newScore);
            return;
        }
    }


    return;
}

void LeaderBoard::printTopPlayers(int limit){
    int counter=0;
    for(auto itr = leaderBoard.begin(); itr != leaderBoard.end(); ++itr){
        if(counter>=limit){
            return;
        }
        Player p = *itr;
        cout << p.getPlayerScore() << " ";

        counter++;
    }

    return;
}

