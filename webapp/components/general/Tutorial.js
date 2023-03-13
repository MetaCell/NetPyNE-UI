import React from 'react';
import Joyride from 'react-joyride';

export default function Tutorial(props) {
  const {
    steps,
    tourStep,
    tourRunning
  } = props;

  return ( 
    <div>
      <Joyride 
        steps={steps} 
        stepIndex={tourStep}
        styles={{
          options: {
            arrowColor: '#e3ffeb',
            backgroundColor: '#e3ffeb',
            overlayColor: 'rgba(79, 26, 0, 0.4)',
            primaryColor: '#000',
            textColor: '#004a14',
            width: 900,
            zIndex: 10000,
          }
        }}
        run={tourRunning} 
        callback={() => { 
          console.log('completed step')
        }}
        />
    </div>
  );
}