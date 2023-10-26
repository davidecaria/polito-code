/*
In linear algebra, the multiplication of matrices is the operation that
produces a new matrix C by making the product rows for columns of two
given matrices A and B.
More in detail, if A has size [r, x] and B has size [x, c], then C will
have size [r, c], and each of its position elements (i, j) will be
computed as:

C[i][j] = \sum_{k=0}^{x-1} A[i][k] x B[k][j]

Write a multithreaded function:

void mat_mul (int **A, int **B, int r, int x, int c, int **C);

able to generate the matrix C, running a thread to compute
each one of its elements.
Each thread will calculate the value of the element, making the product
rows by columns previously specified.
Properly define the data structure required to run the threads.
*/
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <math.h>
#include <threads.h>
#include <pthread.h>
#include <semaphore.h>
#include <time.h>

int **A, **B, **C;

typedef struct THREAD_DATA{
    int id;
    int col;
    int row;
    int common;
    int **A;
    int **B;
    int **C;
} thread_data_t;


void mat_mul (int **A, int **B, int r, int x, int c, int **C);
void *thread_function(void *arg);

int main(int argc, char *argv[]){

    if(argc!=4){
        execlp("echo","echo","Error: execute the program as <prg name> <size r> <size x> <size c>\n",(char *) 0);
    }

    int r = atoi(argv[1]);
    int x = atoi(argv[2]);
    int c = atoi(argv[3]);
    mat_mul(A,B,r,x,c,C);


    return 0;
}

void mat_mul (int **A, int **B, int r, int x, int c, int **C){

    A = (int **)malloc(r*sizeof(int *));
    for(int i=0;i<r;i++){
        A[i]=(int *)malloc(x*sizeof(int));
    }

    B = (int **)malloc(x*sizeof(int *));
    for(int i=0;i<x;i++){
        B[i]=(int *)malloc(c*sizeof(int));
    }

    C = (int **)malloc(r*sizeof(int *));
    for(int i=0;i<r;i++){
        C[i]=(int *)malloc(c*sizeof(int));
    }

    srand(time(NULL));

    for(int i=0;i<r;i++){
        for(int j=0;j<x;j++){
            A[i][j] = rand()%10;
        }
    }
    
    for(int i=0;i<x;i++){
        for(int j=0;j<c;j++){
            B[i][j] = rand()%10;
        }
    }

    printf("Matrix A\n");
    for(int i=0;i<r;i++){
        for(int j=0;j<x;j++){
            printf("%d ",A[i][j]);
        }
        printf("\n");
    }
    printf("\n");
    printf("Matrix B\n");
    for(int i=0;i<x;i++){
        for(int j=0;j<c;j++){
            printf("%d ",B[i][j]);
        }
        printf("\n");
    }
    printf("\n");

    /* The number of thread is x, which is the common size*/
    pthread_t *threadList;
    thread_data_t *threadDatas;
    int i,j;
    threadList = (pthread_t *)malloc((r*c)*sizeof(pthread_t));
    threadDatas = (thread_data_t *)malloc((r*c)*sizeof(thread_data_t));

    printf(("Generating threads:\n"));
    for(i=0;i<r;i++){
        for(j=0;j<c;j++){
            threadDatas[i*c+j].id = i*c+j;
            threadDatas[i*c+j].row = i;
            threadDatas[i*c+j].col = j;
            threadDatas[i*c+j].common = x;
            threadDatas[i*c+j].A = A;
            threadDatas[i*c+j].B = B;
            threadDatas[i*c+j].C = C;
            printf("Id: %d - Row: %d - Col: %d - Common: %d \n", threadDatas[i*c+j].id,threadDatas[i*c+j].row, threadDatas[i*c+j].col,threadDatas[i*c+j].common);
            pthread_create(&threadList[i*c+j],NULL,thread_function,(void *)&(threadDatas[i*c+j]));
        }
    }
    printf("Waiting for the threads\n");

    for(i=0;i<r;i++){
        for(j=0;j<c;j++){
            pthread_join(threadList[i*c+j],NULL);
        }
    }
    
    printf("All threads terminated\n");

    printf("Matrix result:\n");
    for(int i=0;i<r;i++){
        for(int j=0;j<c;j++){
            printf("%d ",C[i][j]);
        }
        printf("\n");
    }

    return;
}
void *thread_function(void *arg){

    int sumPar;
    thread_data_t *data = (thread_data_t *)arg;

    sumPar=0;
    
    for(int i=0;i<data->common;i++){
     
        sumPar += data->A[data->row][i] * data->B[i][data->col];
    }

    data->C[data->row][data->col]=sumPar;

    pthread_exit(NULL);
}