import React from 'react';
import Joyride from 'react-joyride';

export default function TutorialJoyride() {

  const callbackHandler = (data) => {
    const { action, index, type, size } = data;
    
    if (action === 'close' && tourRunning ) {
      stopTutorialStep();
    } 
  }

  return (
    <Joyride 
      steps={[
        {
          target: '#mainContainer',
          content: (
            <div>
              <p>Import a simple cell model</p>
              <p>Click on the + above Cell</p>
            </div>
          )
        },
        {
          target: '#BallStick_HHCellTemplate',
          content: (
            <div>
              <p>Click on Ball and stick HH cell</p>
            </div>
          )
        }
      ]} 
      run={true} 
      callback={callbackHandler}
    ></Joyride>
  )
}