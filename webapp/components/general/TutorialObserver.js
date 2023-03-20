import React, {useEffect, useState} from 'react';
import Joyride from 'react-joyride';

export default function TutorialObserver(props) {
  const [ nodes, setNodes] = useState([]);

  const {
    steps,
    tourStep,
    tourRunning,
    stopTutorialStep,
    children
  } = props;

  useEffect(() => {
    // Listen for new components being added to the DOM
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        // If a new node is added to the DOM, add it to the steps array
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          const node = mutation.addedNodes[0];
          setNodes((prevSteps) => [...prevSteps, { target: node }]);
        }
      });
    });

    // Start observing the DOM
    observer.observe(document.body, { childList: true, subtree: true });

    // Stop observing the DOM when the component unmounts
    return () => observer.disconnect();
  }, []);
  
  const callbackHandler = (data) => {
    const { action, index, type, size } = data;
    
    if (action === 'close' && tourRunning ) {
      stopTutorialStep();
    } 
  }

  return ( 
    <>
      {children}
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
        callback={callbackHandler}
        />
    </>
  );
}