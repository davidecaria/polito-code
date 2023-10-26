/*

Code implementation with processes
----------------------------------

Write a C program that receives two integer values on the command line,
h and n, and it generates a process tree of height h and degree n.

For example, if h=3 and n=2:
- the primary process creates two processes
- each one of these two processes creates two other processes
- each one of these four processes creates two other processes
at this point, eight processes run on the tree leaf, and the program
stops.

More in detail, each node of the tree is a process.
The initial process generates n child jobs and ends.
All child processes must do the same thing, causing a number of
processes on the tree leaves equal to n^h.
Processes on the leaves must all display their own PID and end.

*/
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

void create_child_processes(int n, int h, int level) {
    if (level == h) {  // base case
        printf("PID: %d\n", getpid());
        exit(0);
    }

    for (int i = 0; i < n; i++) {
        __pid_t pid = fork();

        if (pid == -1) {
            perror("fork");
            exit(1);
        } else if (pid == 0) {  // child process
            create_child_processes(n, h, level + 1);
        }
    }
    exit(0);
}

int main(int argc, char *argv[]) {
    if (argc != 3) {
        printf("Usage: %s <height> <degree>\n", argv[0]);
        exit(1);
    }

    int h = atoi(argv[1]);
    int n = atoi(argv[2]);

    create_child_processes(n, h, 0);

    return 0;
}
