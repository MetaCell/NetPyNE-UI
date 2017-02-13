NEURON {  POINT_PROCESS AMPAr }

PARAMETER {
  Cdur	= 1	(ms)		: transmitter duration (rising phase)
  Alpha	= 1.	(/ms mM)	: forward (binding) rate
  Beta	= 0.5	(/ms)		: backward (unbinding) rate
  Erev	= 0	(mV)		: reversal potential
}

INCLUDE "netrand.inc"
 
:** NMDAr
