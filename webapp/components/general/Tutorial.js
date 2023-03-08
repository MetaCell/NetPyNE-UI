import React from 'react';
import Joyride from 'react-joyride';

export default function Tutorial(props) {
  const {
    steps,
    tourStep,
    tourRunning,
    incrementTutorialStep,
  } = props;

  return ( 
    <div>
      <Joyride 
        steps={steps} 
        run={tourRunning} 
        stepIndex={tourStep} 
        callback={incrementTutorialStep}
        />
    </div>
  );
}