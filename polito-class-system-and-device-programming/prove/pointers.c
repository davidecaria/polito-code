#include <stdlib.h>
#include <stdio.h>

void modifica(int *valore);

int main(){

    int a;
    a = 3;

    int *ptr = &a;

    printf("%d \n",a);
    //modifica(&a);
    printf("%d \n",a);
    modifica(a);
    printf("%d \n",a);

    return 1;
}

void modifica(int *valore){

    // 4
    *valore = 4; 


    return;
}
