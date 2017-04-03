: $Id: ppsav.inc,v 1.19 2002/12/18 03:41:48 billl Exp $

COMMENT
USAGE: saving 'state variables' from artificial cells

  MOD file:
      add call to 'recval()' at end of INIT and BREAKPOINT sections

      INCLUDE "ppsav.inc"

  HOC files:
    initialize with : 
      PP.record(&PP.var,vec)
    turn off with :
      PP.record()
ENDCOMMENT

NEURON { 
  RANGE savnum
}

PARAMETER {
  savnum = 0 : values to save in vector
}

ASSIGNED {
  index
  space0
  space1
  space2
  space3
}

VERBATIM
extern double* vector_vec();
extern int vector_capacity();
extern void* vector_arg();
extern double* hoc_pgetarg();
extern Object** hoc_objgetarg();
extern char* hoc_object_name(Object*);
double *a1, *a2, *a3;
Object *tvec, *tmpvec;
char str[100];
ENDVERBATIM

PROCEDURE recval () {
VERBATIM	
  { void* vv; int i, size; double* px;
    if (savnum==0) { return; }
    vv = *((void**)(&space0));
    if (! vv) { hoc_execerror("ERR: no time vector defined for PP::recval.\n",0); }

    i = (int)index;
    vector_resize(vv, i+1);
    px = vector_vec(vv);
    px[i] = t;

    vv = *((void**)(&space1));
    vector_resize(vv, i+1);
    px = vector_vec(vv);
    px[i] = *a1;

    if (savnum>1) { 
      vv = *((void**)(&space2));
      vector_resize(vv, i+1);
      px = vector_vec(vv);
      px[i] = *a2;
    }

    if (savnum>2) { 
      vv = *((void**)(&space3));
      vector_resize(vv, i+1);
      px = vector_vec(vv);
      px[i] = *a3;
    }

    index += 1.;
  }
ENDVERBATIM
}

: record(&val1,vec1,&val2,vec2)
PROCEDURE record() {
VERBATIM
{
  void** vv;

  if (! ifarg(1)) { savnum=0; return; 
  } 

  if (ifarg(3)) { /* nice place to save time */
    if (savnum==0) {
      vv = (void**)(&space0);
      *vv = vector_arg(3);
      tvec = *hoc_objgetarg(3);
      sprintf(str,"%s",hoc_object_name(tvec));
    } else {
      hoc_assign_str(hoc_pgargstr(3), str);
    }
  }
  if (savnum==0) {
    a1 = hoc_pgetarg(1);
    vv = (void**)(&space1);
    *vv = vector_arg(2);
    savnum=1;
  } else if (savnum==1) {
    a2 = hoc_pgetarg(1);
    vv = (void**)(&space2);
    *vv = vector_arg(2);
    savnum=2;
  } else if (savnum==2) {
    a3 = hoc_pgetarg(1);
    vv = (void**)(&space3);
    *vv = vector_arg(2);
    savnum=3;
  } else {
    printf("ERR -- no more space; PP.savnum=%g\n", savnum);
  }
}
ENDVERBATIM
}

