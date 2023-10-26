/*
A program can execute four different threads, namely TP (thread plus), TM (thread minus), TS (thread
star), and TNL (thread newline). Each thread is organized through an infinite cycle containing
synchronization instructions but a single I/O instruction:
1. Thread TP includes instruction printf ("+")
2. Thread TM includes instruction printf ("-")
3. Thread TS includes instruction printf ("*")
4. Thread TNL includes instruction printf ("\n").

Synchronize the four threads to print the following sequence of lines:
++++++++++
----------
**********
++++++++++
----------
**********
etc.
where the number of characters on each row is equal to a constant value N (that is, 10 in the previous
example).
*/

#include <semaphore.h>
#include <threads.h>
#include <pthread.h>
#include <stdio.h>

#define N 10

int pl,mi,mu,nl;
sem_t sem_pl,sem_mi,sem_mu,sem_nl;
int carusel = 0;

void *thread_plus();
void *thread_minus();
void *thread_multiply();
void *thread_new_line();

int main(){
    
    pthread_t thread_pl, thread_mi, thread_mu, thread_nl;
    
    sem_init(&sem_pl,0,1);
    sem_init(&sem_mi,0,0);
    sem_init(&sem_mu,0,0);
    sem_init(&sem_nl,0,0);

    pthread_create(&thread_pl,NULL,thread_plus,NULL);
    pthread_create(&thread_mi,NULL,thread_minus,NULL);
    pthread_create(&thread_mu,NULL,thread_multiply,NULL);
    pthread_create(&thread_nl,NULL,thread_new_line,NULL);

    pthread_exit(0);
}

void *thread_plus(){

    while(1){
        sem_wait(&sem_pl);
        for(pl=0;pl<N;pl++){
            fprintf(stdout,"+");
        }
        carusel = 1;
        sem_post(&sem_nl);
    }

    return 0;
}
void *thread_minus(void){
    
    while(1){
        sem_wait(&sem_mi);
        for(pl=0;pl<N;pl++){
            fprintf(stdout,"-");
        }
        carusel = 2;
        sem_post(&sem_nl);
    }

    return 0;
}
void *thread_multiply(void){

    while(1){
        sem_wait(&sem_mu);
        for(pl=0;pl<N;pl++){
            fprintf(stdout,"*");
        }
        carusel = 0;
        sem_post(&sem_nl);
    }

    return 0;
}
void *thread_new_line(void){
    while(1){
        sem_wait(&sem_nl);
        fprintf(stdout,"\n");

        switch (carusel){
        case 0:
            sem_post(&sem_pl);
            break;
        case 1:
            sem_post(&sem_mi);
            break;
        case 2:
            sem_post(&sem_mu);
            break;
        default:
            break;
        }

    }

    return 0;
}