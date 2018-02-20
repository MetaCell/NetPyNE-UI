: $Id: queue.inc,v 1.5 1995/01/17 13:38:39 billl Exp $

COMMENT

Handle a synaptic queue used to store spike arrival times for
subsequent activation of a synapse after a delay.  Actually the time
that is stored is (arrival + delay).  

This is necessary because several spikes may arrive during the course
of synaptic activation.  These times must be kept track of if they are
to influence subsequent events.  A queue uses FIFO (first in, first
out; cf stack -> FILO) which allows times that are stored to be picked
up in the order that they are stored.

This is NOT a general use queue.  In particular the function of this
queue depends on the use of 1e20 as a default 'never' time that is
used by both 'popq' and 'pushq' to determine if the queue is
exhausted.  

USAGE:

initq()       : clears the queue and initializes head and tail pointers
pushq(val)    : adds val to the end (the tail) of the queue
val = popq()  : removes a val from the front (the head) of the queue

NOTES:

QLEN is the length of the queue.
If this is changed it must also be changed in the queue[] declaration
in the assigned block.

ENDCOMMENT

NEURON {
  RANGE head, tail, queu, delay :
  GLOBAL QLEN                   :
}

PARAMETER {
  delay = 0 (ms)                : delay till starting synapse
  QLEN = 10        : WARNING: if # is changed, then MUST change queu[] below
}

ASSIGNED {
  queu[10]			: QLEN is length of queue
  head                          :
  tail                          :
}

PROCEDURE initq() { 
  head = 0                 
  tail = 0                 
  FROM i = 0 TO (QLEN-1) { 
    queu[i] = 1.0e20       
  }                        
}

PROCEDURE pushq(val) { 
  if (queu[tail] == 1e20) {
    queu[tail] = val
    tail = tail + 1
    if (tail == QLEN) { tail = 0 }
  } else {
    VERBATIM
    hoc_execerror("Error: queue full.\n",0);
    ENDVERBATIM
  }
}

FUNCTION popq() { 
  popq = queu[head]
  if (popq == 1e20) {
    VERBATIM
    hoc_execerror("Error: queue exhausted.\n",0);
    ENDVERBATIM
  } else {
    queu[head] = 1.e20
    head = head + 1
    if (head == QLEN) { head = 0 }
  }
}
 
