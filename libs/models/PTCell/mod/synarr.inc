: $Id: synarr.inc,v 1.9 1995/01/18 19:08:48 billl Exp $

COMMENT
manage arrays used in synmq.in
ENDCOMMENT

NEURON {
  RANGE maxsyn, nsyn, qlen                   : scalars
  RANGE pre, queu                            : arrays
  RANGE begsyn, endsyn, newspk
  GLOBAL SPKSTORE
}

PARAMETER {
  SPKSTORE = 5                  : max number of spikes expected during max delay
}

ASSIGNED {
  pre 				: pointer to presynaptic array
  queu                          : a struct with indices
  qlen                          : maxsyn*SPKSTORE
  maxsyn
  nsyn
  begsyn                        : index into queu that tells time to start syn
  endsyn                        : index into queu that tells time to end syn
  newspk                        : index into queu to place spk time + delay
}

VERBATIM
#define PRECAST ((SynS *)((unsigned long) pre))
#define QUECAST ((QueU *)((unsigned long) queu))

typedef struct SynS {
  double *ptr;  /* points to presyn voltage, set by user */
  short index;  /* for user convenience, arbitrary index */
  double del;   /* individualized delay set by user */
  short spk;    /* nrn spiking?, internal */
  double Rcurr; /* holds current value of R (release status), internal */
  double last;  /* time last syn will end, internal */
} SynS;

typedef struct QueU {
  double time;  /* records spike time + delay */
  short index;  /* records index of associated SynS struct */
} QueU;
ENDVERBATIM

PROCEDURE init_arrays(num) {
  maxsyn = num
  nsyn = 0
  VERBATIM {
    int ii;
    qlen = SPKSTORE*maxsyn;
    printf("Initializing arrays: Syn= %d bytes,Queue= %d bytes.\n",
    (int)maxsyn*sizeof(SynS),(int)qlen, sizeof(QueU)); 
    printf("WARNING: do not reinitialize, cannot free arrays\n");
    pre = (double)((unsigned long) ecalloc((int)maxsyn, sizeof(SynS))); 
    queu = (double)((unsigned long)ecalloc((int)qlen, sizeof(QueU))); 
 } 
 ENDVERBATIM
}

PROCEDURE setptr() {
  : 4 arguments - synapse, address, code, delay
  : 3 arguments - synapse, address, code
  : 2 arguments - synapse, address
  : 0 arguments - help
  VERBATIM { 
    static int x;
    extern double* hoc_pgetarg();
    if (ifarg(1)) {
      x = (int)*getarg(1);
      if (x >= maxsyn) {
	hoc_execerror("array index out of bounds", 0);
      } else if (x >= nsyn) {
	if (x > nsyn) {
	  hoc_execerror("Can't leave empty pointers: see nsyn for current array index.", 0);
	}
	nsyn++;
      }
      (PRECAST[x]).ptr = hoc_pgetarg(2);
      if (ifarg(3)) {
	(PRECAST[x]).index = (int)*getarg(3);
      } else {
	(PRECAST[x]).index = 0;
      }
      if (ifarg(4)) {
	(PRECAST[x]).del = *getarg(4);
      } else {
	(PRECAST[x]).del = delay;
      }
      (PRECAST[x]).Rcurr = 0.;
    } else { /* help */
      printf("\t\t4 arguments - synapse, address, code, delay\n\
\t\t3 arguments - synapse, address, code\n\
\t\t2 arguments - synapse, address\n\
\t\t0 arguments - this help\n\
\t\te.g.: setptr(4,&col[15].cell[3].dend[4].soma.v(0.5),150304,3.7)\n\
\t\tThis will set synapse #4. \n\
\t\tNote that a useful code for this case can be produced with \n\
\t\t\t i*10000+j*100+k \n\
\t\tto indicate all 3 indices in one number \n");
    }
  }
  ENDVERBATIM
}

FUNCTION getind(x) {
  VERBATIM { 
    if (_lx >= nsyn) {
      hoc_execerror("array index out of bounds", 0);
    }
    _lgetind = (PRECAST[(int)_lx]).index;
  } 
  ENDVERBATIM
}
 
PROCEDURE getptr(x) {
  VERBATIM { 
    if (_lx >= nsyn) {
      hoc_execerror("array index out of bounds", 0);
    }
    printf("Index:\t%d\nVpre:\t%g\ndelay:\t%g\nR:\t%g\n",
      (PRECAST[(int)_lx]).index,
      *((PRECAST[(int)_lx]).ptr),
      (PRECAST[(int)_lx]).del,
      (PRECAST[(int)_lx]).Rcurr);
  } 
  ENDVERBATIM
}
 
PROCEDURE initq() { 
  VERBATIM {
  int ii;
  begsyn = endsyn = newspk = 0.;
  for (ii=0;ii<qlen;ii++) {
    QUECAST[ii].time = 1.e20;
  }
  for (ii=0;ii<nsyn;ii++) {
    PRECAST[ii].Rcurr = 0.;
    PRECAST[ii].last = -1.e2;
  }}
  ENDVERBATIM
}

PROCEDURE pushq(val,ind) { 
  VERBATIM
  if (QUECAST[(int)newspk].time == 1e20) {
    QUECAST[(int)newspk].time = _lval;
    QUECAST[(int)newspk].index = (int)_lind;
    newspk++;
    if (newspk == qlen) { newspk = 0.; }
  } else {
    hoc_execerror("Error: queue full.\n",0);
  }
  ENDVERBATIM
}

: begsyn is the top of the line when the spike is first utilized to generate synapse
: updates the value in the queue so endsyn can detect the end of the syn pulse
: doesn't return value (since in a struct)
PROCEDURE popqh1(aug) { 
  VERBATIM {  
    if (QUECAST[(int)begsyn].time == 1e20) {
      hoc_execerror("Error: queue exhausted.\n",0);
    } else {
      if (_laug == 0.) { /* clear it out */
	QUECAST[(int)begsyn].time = 1e20; 
	if (begsyn==endsyn) { /* don't leave endsyn pointing to a null */
	  endsyn++;
	  if (endsyn == qlen) { endsyn = 0.; }}
      } else {            /* retain the time to detect end of pulse */
	QUECAST[(int)begsyn].time += _laug;
      }
      begsyn++;
      if (begsyn == qlen) { begsyn = 0.; }
    }
  }
  ENDVERBATIM
}
 
: endsyn is queried for the termination time of the synaptic square wave
PROCEDURE popqh2() { 
  VERBATIM {  
    QUECAST[(int)endsyn].time = 1.e20;  /* clear the entry */
    endsyn++;
    if (endsyn == qlen) { endsyn = 0.; }
    /* move forward till reach a valid entry or reach the spk pointer */
    while (endsyn != begsyn && QUECAST[(int)endsyn].time == 1e20) { 
      endsyn++; 
      if (endsyn == qlen) { endsyn = 0.; }
    }
  }
  ENDVERBATIM
}

FUNCTION getq(x) {
  VERBATIM { 
    if (_lx >= qlen) {
      hoc_execerror("array index out of bounds", 0);
    }
    _lgetq = (QUECAST[(int)_lx]).time;
  } 
  ENDVERBATIM
}
 
: for debugging only
FUNCTION getR(x) {
  VERBATIM
    _lgetR = (PRECAST[(int)_lx]).Rcurr;
  ENDVERBATIM
}
 
