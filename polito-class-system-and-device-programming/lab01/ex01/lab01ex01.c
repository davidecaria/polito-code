#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main(int argc, char *argv[]){
 
    if(argc != 4){
        fprintf(stderr,"Error!\n");
        exit(EXIT_FAILURE);
    }

    FILE *fp_in, *fp_out;

    fp_in = fopen(argv[1],"r");
    fp_out = fopen(argv[2],"wb");

    if(fp_in == NULL && fp_out == NULL){
        fprintf(stderr,"Error2!\n");
        exit(EXIT_FAILURE);
    }


    char string[31];
    int n=0;

    while(fgets(string,31,fp_in) != NULL){
        fwrite(string,sizeof(string),1,fp_out);
        n++;
    }

    fclose(fp_in);
    fclose(fp_out);

    fp_in = fopen(argv[2],"rb");
    fp_out = fopen(argv[3],"w");

    if(fp_in == NULL && fp_out == NULL){
        fprintf(stderr,"Error2!\n");
        exit(EXIT_FAILURE);
    }

    char string2[31];

    for(int i=0;i<n;i++){
        fread(string2,sizeof(string2),1,fp_in);
        fprintf(fp_out,"%s",string2);
    }


    return 0;
}