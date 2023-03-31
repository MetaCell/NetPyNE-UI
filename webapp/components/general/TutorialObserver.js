import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TutorialBubble from './TutorialBubble';

export default function TutorialObserver(props) {
  const tourRunning = useSelector((state) => state.tutorial.tourRunning);
  const [observer, setObserver] = useState(null);

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
    if (!tourRunning) {
      // Stop observing the DOM when the component unmounts
      // console.log("Stopping tutorial")
      observer?.disconnect();
      return;
    }
    // Listen for new components being added to the DOM
    // console.log("Creating tutorial")
    const obs = new MutationObserver((mutationsList) => {
      if(mutationsList.length > 0) {
        bubbleUpdate();
        // console.log("Listening to updates")
      }
    });

    // Start observing the DOM
    obs.observe(document.body, { childList: true, subtree: true, attributes: true });
    setObserver(obs);
  }, [tourRunning]);

  const startTutorialCallBack = () => {
    startTutorialStep();
  }

  const stopTutorial = () => {
    stopTutorialStep();
  }

  const doIncrementTutorialStep = () => {
    validateTutorialStep({ tourStep: requestedTourStep })
    incrementTutorialStep()
  }

  return (
    <>
      {children}
      {tourRunning && (
        <>
        <button onClick={ () => { startTutorialCallBack() }}>RESET TUTORIAL</button>
          <TutorialBubble
            requestedTourStep={requestedTourStep}
            steps={steps}
            stopTutorial={() => stopTutorial()}
            incrementTutorialStep={doIncrementTutorialStep}
            validateTutorialStep={validateTutorialStep}
            lastCheckRender={lastCheckRender}
          />
        </>)}
    </>
  );
}