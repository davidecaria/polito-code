#include <set>
#include <string>
using namespace std;

class Player
{
private:
    string playerName;
    int playerScore;

public:
    Player(string playerName, int playerScore);
    string getPlayerName();
    int getPlayerScore();
    void upDateScore(int newScore);
    bool operator<(const Player& other) const {
        return playerScore > other.playerScore;
    }
};

class LeaderBoard
{
private:
    set<Player> leaderBoard;
public:
    LeaderBoard();
    void addNewPlayer(string name, int score);
    void addExistingPlayer(Player p);
    void removePlayer(string name);
    void updatePlayerScore(string name, int newScore);
    void printTopPlayers(int limit);
};


