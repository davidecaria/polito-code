/*
A "leaderboard" displays the names and current scores of the leading competitors
in a tournament.
Implement a leaderboard using standard sets.

A name identifies each player and has a score associated with them.
It should be possible to add or remove players from the leaderboard and update
existing players' scores.
It should also be possible to display the top n players on the leaderboard, where
n is a positive integer value.

More specifically, the program should:

* Define a structure player (named Player) to hold a player's name and score.

* Define a custom comparison function or operator to order the player objects in
  the standard set based on their score.

* Implement a class to manage the leaderboard (Leaderboard).
  The class should have the following public methods:

  - void addPlayer(const std::string& name, int score)
    which adds a new player with the given name and score to the leaderboard.
    Suppose that names are unique.

  - void removePlayer(const std::string& name)
    which removes the player with the given name from the leaderboard.

  - void updateScore(const std::string& name, int newScore)
    which updates the player's score with the given name to the new score

  - void printTopPlayers(int n)
    which displays the names and scores of the top n players on the leaderboard (e.g,
    the standard output or a file).
    The players must be ordered by the score in descending order.
    In case ex aequo among players, define a possible order among them (e.g., based on
    the name or the insertion order in the laderboard).
    Display all players if there are fewer than n players on the leaderboard.

Suggestion
----------
Use a standard set to store the Player objects and keep them ordered by score.
When you define the custom comparison function or operator, consider
how ties in scores are solved.
For example, players with the same score can be ordered by the lexicographical
order of their names.

*/
#include <iostream>
#include "leaderBoard.h"

int main(){

    LeaderBoard leaderBoard;

    cout << "Adding players! " << endl;
    leaderBoard.addNewPlayer("John",10);
    leaderBoard.addNewPlayer("Paul",15);
    leaderBoard.addNewPlayer("Ringo",5);
    leaderBoard.addNewPlayer("George",7);

    cout << "Ordered leaderboard: " << endl;
    leaderBoard.printTopPlayers(4);

    cout << "Removing a player " << endl;
    leaderBoard.removePlayer("John");

    cout << "Ordered leaderboard: " << endl;
    leaderBoard.printTopPlayers(4);
  

    return 0;
}