import React, {useEffect, useState, useRef} from 'react';
import TutorialBubble from './TutorialBubble';

export default function TutorialObserver(props) {

  const {
    steps,
    requestedTourStep,
    startTutorialStep,
    stopTutorialStep,
    incrementTutorialStep,
    validateTutorialStep,
    checkBubbleRender,
    lastCheckRender,
    children
  } = props;

  const bubbleUpdate = () => {
    checkBubbleRender({ epoch: Date.now() })
  };

  useEffect(() => {
    // Listen for new components being added to the DOM
    const observer = new MutationObserver((mutationsList) => {
      if(mutationsList.length > 0)
        bubbleUpdate();
    });

    // Start observing the DOM
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    // Stop observing the DOM when the component unmounts
    return () => observer.disconnect();
  }, []);

  const startTutorialCallBack = () => {
    startTutorialStep();
  }

  return (
    <>
      {children}
      <button onClick={ () => { startTutorialCallBack() }}>RESET TUTORIAL</button>
        <TutorialBubble
          requestedTourStep={requestedTourStep}
          steps={steps}
          stopTutorial={stopTutorialStep}
          incrementTutorialStep={incrementTutorialStep}
          validateTutorialStep={validateTutorialStep}
          lastCheckRender={lastCheckRender}
        />
    </>
  );
}