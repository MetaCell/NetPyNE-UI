: $Id: synmq.inc,v 1.13 1995/02/14 17:21:37 billl Exp $
: see end for extensive comments

INDEPENDENT {t FROM 0 TO 1 WITH 1 (ms)}

NEURON {
  RANGE R, g, gmax, delay
  RANGE Ron, Roff, synon  : accessible for debugging
  NONSPECIFIC_CURRENT i
  GLOBAL Cdur, Alpha, Beta, Erev, Prethresh, Deadtime, Rinf, Rtau
}
 
INCLUDE "synarr.inc"  : array management routines

UNITS {
  (nA) = (nanoamp)
  (mV) = (millivolt)
  (umho) = (micromho)
  (mM) = (milli/liter)
}

ASSIGNED {
  v		(mV)		: postsynaptic voltage
  i 		(nA)		: current = g*(v - Erev)
  g 		(umho)		: conductance
  R				: fraction of open channels, Ron + Roff
  Ron                           : activation state while syn's turned on
  Roff                          : activation state for decaying syns
  Rinf				: steady state channels open
  Rtau		(ms)		: time constant of channel binding
  synon                         : number of syns turned on at a time
  drive                         : drive for ODE toward Rinf
  edt                           : rate factor for Ron
  edb                           : decay factor for Roff
  edc                           : rate factor for increasing Rcurr
  dt
}

INITIAL {
  VERBATIM
  if (nsyn == 0) {
    hoc_execerror("Synapse pointers not initialized; Run init_array(), setptr().", 0); 
  }
  ENDVERBATIM
  initq()   
  synon = 0
  R = 0
  Ron = 0
  Roff = 0
  Rinf = Alpha / (Alpha + Beta)
  Rtau = 1 / (Alpha + Beta)
  edt = exp(-dt/Rtau)
  edb = exp(-Beta * dt)
  edc = exp(-Cdur/Rtau)
  drive = Rinf * (1. - edt)
}

BREAKPOINT {
  SOLVE release
  R = Ron + Roff
  g = gmax * R
  i = g*(v - Erev)
}

PROCEDURE release() { 
  VERBATIM 
  static int ii,who;
  static QueU *pqueu;
  static SynS *ppre;

  pqueu = (QueU *)((unsigned long) queu);
  ppre = (SynS *)((unsigned long) pre);

  /* check all presyn voltages for a spike */
  for (ii=0; ii<nsyn;ii++) { 
    if (! ppre[ii].spk && *(ppre[ii].ptr) > Prethresh) { /*  new spike occured? */
      ppre[ii].spk = 1;
      pushq(t+delay,(double)ii);  /*  save all spikes */
    } else if (ppre[ii].spk && *(ppre[ii].ptr) < Prethresh) { /*  spike over? */
      ppre[ii].spk = 0; 
    }
  }

  while (t >= pqueu[(int)begsyn].time) { /*  somebody spiked delay time ago */
    who = pqueu[(int)begsyn].index;   /* who spiked? */
    if (t < ppre[who].last + Deadtime) {   /* going or in deadtime */
      popqh1(0.);  /* throw away this value */
    } else {       /* start new release */
      /* calculate the decay that occurred since last activity ended */
      ppre[who].Rcurr *= exptable(-Beta*(t-ppre[who].last));
      /* transfer the value from Roff to Ron */
      Ron += ppre[who].Rcurr;
      Roff -= ppre[who].Rcurr;

      synon++;		/*  another syn */
      ppre[who].last = t + Cdur; /* time when syn will turn off */
      popqh1(Cdur);     /* next (also add Cdur to value on the queu) */
    }
  }

  while (t >= pqueu[(int)endsyn].time) { /*  somebody needs to be turned off */
    who = pqueu[(int)endsyn].index;   /* who spiked? */
    /* solve Rcurr forward in time till end of syn activity */
    ppre[who].Rcurr = Rinf*(1.-edc) + ppre[who].Rcurr*edc;
    Ron -= ppre[who].Rcurr;
    Roff += ppre[who].Rcurr;  /* transfer from on to off */
    synon--;
    popqh2();  /* next */
  }

  /*  update R */
  if (synon > 0) {		/*  one or more synapses turned on? */
    Ron = synon*drive + Ron * edt; /*  drive R toward Rinf */
  } 
  Roff *= edb;			/*  Roff always decays toward 0 */
  return 0;
  ENDVERBATIM
}

: only gets called for negative numbers
FUNCTION exptable(x) { 
  TABLE  FROM -10 TO 0 WITH 1000
  
  if ((x > -10) && (x < 0)) {
    exptable = exp(x)
  } else {
    exptable = 0.
  }
}

COMMENT
Multiple synapses in a single POINT_PROCESS
Adapted from Alain Destexhe and Zach Meinen (see syn.inc and synq.inc
for further comments):

Destexhe, A., Mainen, Z. and Sejnowski, T.J.  An efficient method for 
computing synaptic conductances based on a kinetic model of receptor binding.
Neural Computation, 6: 14-18, 1994.

During the arrival of the presynaptic spike (detected by threshold 
crossing), it is assumed that there is a brief pulse (duration=Cdur)
of neurotransmitter C in the synaptic cleft (the maximal concentration
of C is 1).  Then, C is assumed to bind to a receptor Rc according 
to the following first-order kinetic scheme:

Rc + C ---(Alpha)--> Ro
       <--(Beta)--- 

where Rc and Ro are respectively the closed and open form of the 
postsynaptic receptor, Alpha and Beta are the forward and backward
rate constants.  If R represents the fraction of open gates Ro, 
then one can write the following kinetic equation:

dR/dt = Alpha * C * (1-R) - Beta * R
dR/dt = (Rinf - R)/tauR
  where Rinf = Alpha*C /(Alpha*C + Beta)
        tauR = 1 /(Alpha*C + Beta)
        (ala HH eqns)

The postsynaptic current is given by:
Isyn = gmax * R * (V-Erev)
C is assumed to occur as a square wave.
One can solve the kinetic equation exactly:

   R = Rinf * [1-exp(-dt/tauR)] + R * exp(-dt/tauR)

(This would be a step-wise integration if Rinf and tauR were varying
as they are in the HH eqns. In this case, the analytic soln could be
calculated as was previously done.  However, the stepwise integ has
the advantage of not requiring repeated table lookups for exponents.)

After the pulse (t>t1), C = 0 => Rinf = 0 and tauR = 1/Beta

   R = R * exp(-Beta*dt)  // exponential decay

When presynaptic voltage crosses the threshold value given by
Prethresh, a pulse of C is generated for a duration of Cdur.
Another event is not allowed to occur for Deadtime milliseconds
following after pre rises above threshold.
*****************************************************************************
    NEURON {
      POINT_PROCESS NAME
    }

    PARAMETER {

      Cdur	= 1.08	(ms)		: transmitter duration (rising phase)
      Alpha	= 1	(/ms mM)	: forward (binding) rate
      Beta	= 0.02	(/ms)		: backward (unbinding) rate
      Erev	= -80	(mV)		: reversal potential
      Prethresh = 0 			: voltage level nec for release
      delay = 0
      Deadtime = 1	(ms)		: mimimum time between release events
      gmax		(umho)		: maximum conductance
    }

    
    INCLUDE "synq.inc"
*****************************************************************************

ENDCOMMENT

