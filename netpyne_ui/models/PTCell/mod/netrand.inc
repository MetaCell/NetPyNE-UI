: $Id: netrand.inc,v 1.5 2010/02/23 15:39:27 billl Exp $

VERBATIM
#include "misc.h"
static char *name;
static Symbol* cbsv;
typedef struct ID0 { // extra RANGE variables
  double *tsp;
  double *wsp;
} id0;
#define IDP (*((id0**) &(_p_sop)))
static id0 *ip, *qp, *rp;
ENDVERBATIM

NEURON {
  RANGE g, Erev, fflag
  NONSPECIFIC_CURRENT i
  POINTER sop                          :::: Structure pointer for other range vars
  GLOBAL Cdur, Alpha, Beta, Rinf, Rtau
}

UNITS {
  (nA) = (nanoamp)
  (mV) = (millivolt)
  (umho) = (micromho)
  (mM) = (milli/liter)
}

PARAMETER {
  fflag = 0
}

ASSIGNED {
  v		(mV)		: postsynaptic voltage
  i 		(nA)		: current = g*(v - Erev)
  g 		(umho)		: conductance
  Rinf				: steady state channels open
  Rtau		(ms)		: time constant of channel binding
  synon
  sop
}

STATE {Ron Roff}

INITIAL {
  PROTECT Rinf = Alpha / (Alpha + Beta)
  PROTECT Rtau = 1 / (Alpha + Beta)
  synon = 0
}

CONSTRUCTOR {
VERBATIM
  cbsv=0x0;
  _p_sop = (void*)ecalloc(1, sizeof(id0)); // important that calloc sets all flags etc to 0
  ip = IDP;
ENDVERBATIM
}

DESTRUCTOR {
  VERBATIM 
  free(IDP);
  ENDVERBATIM
}


BREAKPOINT {
  SOLVE release METHOD cnexp
  g = (Ron + Roff)*1(umho)
  i = g*(v - Erev)
}

DERIVATIVE release {
  Ron' = (synon*Rinf - Ron)/Rtau
  Roff' = -Beta*Roff
}

: following supports both saturation from single input and
: summation from multiple inputs
: if spike occurs during CDur then new off time is t + CDur
: ie. transmitter concatenates but does not summate
: Note: automatic initialization of all reference args to 0 except first

NET_RECEIVE (weight, on, nspike, r0, t0 (ms)) {
  : flag is an implicit argument of NET_RECEIVE and  normally 0
  if (t>0) { : bug fix so that init doesn't send a false event
    if (flag == 0) { : a spike, so turn on if not already in a Cdur pulse
      nspike = nspike + 1
      if (!on) {
        r0 = r0*Exp1(-Beta*(t - t0))
        t0 = t
        on = 1
        synon = synon + weight
        Ron = Ron + r0
        Roff = Roff - r0
      }
      : come again in Cdur with flag = current value of nspike
      net_send(Cdur, nspike)
    }
    if (flag == nspike) { : if this associated with last spike then turn off
      r0 = weight*Rinf + (r0 - weight*Rinf)*Exp1(-(t - t0)/Rtau)
      t0 = t
      synon = synon - weight
      Ron = Ron - r0
      Roff = Roff + r0
      on = 0
    }
  }
}

PROCEDURE initrnd () {
  VERBATIM
  int i,j,max;
  if (hoc_is_str_arg(i=1)) { 
    i++;
    cbsv=hoc_lookup(gargstr(1));
  }
  j=vector_arg_px(i++, &ip->tsp);
  max=vector_arg_px(i++, &ip->wsp);
  if (max!=j) {printf("initrnd ERR: vecs of different size: %d %d\n",max,j); hxe();}
  if (max==0) {printf("initrnd ERR: vec not initialized\n"); hxe();}
  ENDVERBATIM
}

FUNCTION Exp1(x) {   
  if (x < -100) {
    Exp1  = 0
  } else if (x > 100) {
    Exp1 = exp(100)
  } else{
    Exp1 = exp(x)
  }
}
