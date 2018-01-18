#include<stdlib.h>

main(int cc, char**vargs) {
  puts(realpath(vargs[1], 0));
  exit(0);
}