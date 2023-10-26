/*

Implement a C program, thread_generation, that receives a command line parameter
n.
The parent thread creates two threads and waits for their termination.
Each further thread creates the other two threads, awaiting their termination. 
Tread creation stops after 2^n threads have been created, i.e., the ones that stand
on the leaves of a tree with 2^n leaves.

For example, if n=3
- the main thread creates two threads
- each one of these 2 threads creates two other threads
- each one of these 4 threads creates two other threads
at this point, 8 leaf treads are running and the program must stop.

Each leaf thread must print its generation tree, i.e., the sequence of thread
identifiers from the main thread (the tree root) to the leaf thread (the tree leaf).

The following is an example of the program execution: 

quer@quer-VirtualBox:~/current/sdp$ ./l01e05 3
140051327870720 140051311085312 140051224717056 
140051327870720 140051311085312 140051224717056 
140051327870720 140051311085312 140051233109760 
140051327870720 140051319478016 140051207931648 
140051327870720 140051311085312 140051233109760 
140051327870720 140051319478016 140051207931648 
140051327870720 140051319478016 140051216324352 
140051327870720 140051319478016 140051216324352 

where the numbers are the thread identifiers displayed as long integer values.

Suggestion
----------
Instead of printing (and storing) thread identifiers (tids) as "long integer" values,
you can store and display "user thread indentifier", e.g., integer number given by the
user to each thread.

*/

#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <math.h>
#include <threads.h>
#include <pthread.h>
#include <semaphore.h>

typedef struct THREAD_DATA{
    
    int depth;
    int currentDepth;
    long int *listOfAncestors;

} thread_data_t;

sem_t semaophore;
unsigned long int **listOfAncestors;
int depth;
int numT;

static void *generator(void *arg){
    
    thread_data_t *data, dataA, dataB;
    data = ((thread_data_t *)arg);
    
    if(data->currentDepth==data->depth){
        
        for(int i=0;i<data->depth;i++){
            fprintf(stdout,"%ld ",data->listOfAncestors[i]);
        }
        fprintf(stdout,"\n");
        pthread_exit(NULL);
    }

    pthread_t threadA, threadB;

    dataA.currentDepth = data->currentDepth+1;
    dataA.depth = data->depth;
    dataA.listOfAncestors = (long int *)malloc(dataA.currentDepth*sizeof(long int));

    dataB.currentDepth = data->currentDepth+1;
    dataB.depth = data->depth;
    dataB.listOfAncestors = (long int *)malloc(dataB.currentDepth*sizeof(long int));

    if(dataA.listOfAncestors==NULL || dataB.listOfAncestors==NULL){
        fprintf(stdout,"Error in allocation\n");
        return 0;
    }

    int i;
    for(i=0;i<data->currentDepth;i++){
        dataA.listOfAncestors[i]=data->listOfAncestors[i];
        dataB.listOfAncestors[i]=data->listOfAncestors[i];
    }

    dataA.listOfAncestors[i]=pthread_self();
    dataB.listOfAncestors[i]=pthread_self();
    
    pthread_create(&threadA,NULL,generator,(void *) &dataA);
    pthread_create(&threadB,NULL,generator,(void *) &dataB);

    pthread_join(threadA,NULL);
    pthread_join(threadB,NULL);

    free(dataA.listOfAncestors);
    free(dataB.listOfAncestors);
    
    pthread_exit(NULL);
}


int main(int argc, char *argv[]){

    fflush(stdout);
    if(argc!=2){
        execlp("echo","echo","Error: execute the program as <prg name> <number>\n",(char *) 0);
    }
    
    depth = atoi(argv[1]);
    numT = pow(2,depth);
    
    thread_data_t firstData;

    firstData.listOfAncestors = NULL;
    firstData.currentDepth=0;
    firstData.depth=atoi(argv[1]);
    
    pthread_t threadA;
    
    pthread_create(&threadA,NULL,generator,(void *)&firstData);

    pthread_join(threadA,NULL);
    
    return 0;
}