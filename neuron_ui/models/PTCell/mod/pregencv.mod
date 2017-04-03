: $Id: pregencv.mod,v 1.5 1998/10/18 19:02:05 billl Exp $
: Id: pregen.mod,v 1.1 1998/07/01 21:11:23 hines Exp 
: comments at end

INDEPENDENT {t FROM 0 TO 1 WITH 1 (ms)}

NEURON	{ 
  POINT_PROCESS SpikeGenerator
  RANGE x,num
  RANGE fast_invl, slow_invl, burst_len, start, end
  RANGE noise
  GLOBAL dummy : prevent vectorization for use with CVODE
}

PARAMETER {
	fast_invl	= 1		: time between spikes in a burst (msec)
	slow_invl	= 50		: burst period (msec)
: actually, above is interburst period in conformity with original version
: see
	burst_len	= 10		: burst length (# spikes)
	start		= 50		: start of first interburst interval
	end		= 1e10		: time to stop bursting
	noise		= 0		: amount of randomness (0.0 - 1.0)
}

ASSIGNED {
	x
        num
	burst
	event
	burst_off
	burst_on
	toff
	dummy
}

PROCEDURE seed(x) {
	set_seed(x)
}

INITIAL {
  num = 0 : currently not used -- for callback
  toff = 1e9
  x = -90
  burst = 0
  event = start-slow_invl
  event_time()
  while (event < 0) { event_time() }
  generate()
}

BREAKPOINT {
	SOLVE generate METHOD cvode_t
}

FUNCTION interval(mean (ms)) (ms) {
	if (mean <= 0.) {
		mean = .01 : I would worry if it were 0.
	}
	if (noise == 0) {
		interval = mean
	}else{
		interval = (1. - noise)*mean + noise*exprand(mean)
	}
}

PROCEDURE event_time() {
	if (burst != 0.) {
		event = event + interval(fast_invl)
		if (event > burst_on + burst_off) {
			burst = 0.
		}
	}else{
		burst = 1.
: if slow_invl from beginning of burst to beginning of burst
:		event = event + interval(slow_invl - (burst_len-1)*fast_invl)
: use following if slow_invl is interburst interval
		event = event + interval(slow_invl)
		burst_on = event
		burst_off = interval((burst_len - 1)*fast_invl)-1e-6
	}
	if (event > end) {
		event = -1e5
	}
}

PROCEDURE generate() {
	if (at_time(event)) {
          VERBATIM
          {char func[8] = "pregencv_c";
            Symbol* s = hoc_lookup(func);
            if (s) {
              hoc_pushx(num);
              hoc_call_func(s, 1);
          }}
          ENDVERBATIM
            x = 20
            toff = event + .1
            event_time()
	}
	if (at_time(toff)) {
		x = -90
	}
}

COMMENT
Presynaptic spike generator
---------------------------

This mechanism has been written to be able to use synapses in a single
neuron receiving various types of presynaptic trains.  This is a "fake"
presynaptic compartment containing a fast spike generator.  The trains
of spikes can be either periodic or noisy (Poisson-distributed), and 
either tonic or bursting.

Parameters;
   noise: 	between 0 (no noise-periodic) and 1 (fully noisy)
   fast_invl: 	fast interval, mean time between spikes (ms)
   slow_invl:	slow interval, mean burst silent period (ms), 0=tonic train
   burst_len: 	mean burst length (nb. spikes)

Written by Z. Mainen, modified by A. Destexhe, The Salk Institute

Modified by Michael Hines for use with CVode

ENDCOMMENT

