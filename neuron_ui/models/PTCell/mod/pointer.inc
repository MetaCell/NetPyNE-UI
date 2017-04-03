: $Id: pointer.inc,v 1.2 2003/02/12 22:29:39 billl Exp $
TITLE provide pointer to an object

COMMENT
use with strobj.obj(PP.ptr) to get object access
ENDCOMMENT

NEURON {
  RANGE p
}

ASSIGNED {
  p
}

PROCEDURE setptr() {
  VERBATIM  
  { extern Object** hoc_objgetarg();
    p =     (double)(unsigned long)*hoc_objgetarg(1);
  }  
  ENDVERBATIM  
}
