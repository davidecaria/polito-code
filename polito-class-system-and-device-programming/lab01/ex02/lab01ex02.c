#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void findMatch(char *fileName,int n,int toFind);
void findAndReplace(char *fileName,int n,int toFind, char *mat, char *name, char *surname, int voto);

int main(int argc, char *argv[]){

    if(argc != 2){
        fprintf(stderr,"Error!\n");
        exit(EXIT_FAILURE);
    }

    fprintf(stdout,"Scegli un opzione: \n");
    fprintf(stdout,"-R \n-W \n-E \n");

    char option;
    int number;

    char mat[7];
    char name[10];
    char surname[10];
    int voto;

    fprintf(stdout,"Waiting for an option: ");
    fscanf(stdin,"%c %d", &option,&number);

    switch (option)
    {
    case 'R':
        findMatch(argv[1],4,number);
        break;
    
    case 'W':
        fscanf(stdin,"%s %s %s %d",mat,name,surname, &voto);
        findAndReplace(argv[1],4,number,mat,name,surname,voto);
        break;
    
    case 'E':
        exit(EXIT_SUCCESS);
        break;

    default:
        break;
    }

    FILE *fp;
    if((fp = fopen(argv[1], "rb"))== NULL){
        fprintf(stderr,"Problemi! Problemi!");
    }
    char string2[31];

    for(int i=0;i<4;i++){
        fread(string2,sizeof(string2),1,fp);
        fprintf(stdout,"%s",string2);
    }
    
    fclose(fp);

    return 0;
}

void findMatch(char *fileName,int n,int toFind){


    FILE *fp_in;
    fp_in = fopen(fileName,"rb");

    if(fp_in==NULL){
        fprintf(stderr,"Error2!\n");
        exit(EXIT_FAILURE);
    }

    char string2[31];

    for(int i=0;i<n;i++){
        fread(string2,sizeof(string2),1,fp_in);
        if(atoi(&string2[0])==toFind){
            fprintf(stdout,"%s",string2);
        }
    }

    fclose(fp_in);

    return;
}

void findAndReplace(char *fileName,int n,int toFind, char *mat, char *name, char *surname, int voto){


    FILE *fp_in;
    fp_in = fopen(fileName,"r+");

    if(fp_in==NULL){
        fprintf(stderr,"Error2!\n");
        exit(EXIT_FAILURE);
    }

    fprintf(stdout,"Hello3\n");
    char string2[31];

    fseek(fp_in,ftell(fp_in)+(toFind-1)*31,SEEK_SET);

    sprintf(string2,"%d %s %s %s %d\n",toFind,mat,name,surname,voto);
    fwrite(string2,sizeof(string2),1,fp_in);

    fclose(fp_in);
    return;
}