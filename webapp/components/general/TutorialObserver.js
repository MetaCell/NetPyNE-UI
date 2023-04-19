import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TutorialBubble from './TutorialBubble';

export default function TutorialObserver (props) {
  const tourRunning = useSelector((state) => state.tutorial.tourRunning);
  const [observer, setObserver] = useState(null);

  const {
    steps,
    tourStep,
    requestedTourStep,
    startTutorialStep,
    stopTutorialStep,
    incrementTutorialStep,
    validateTutorialStep,
    checkBubbleRender,
    lastCheckRender,
    children,
  } = props;

  const bubbleUpdate = () => {
    checkBubbleRender({ epoch: Date.now() });
  };

  useEffect(() => {
    if (!tourRunning) {
      // Stop observing the DOM when the component unmounts
      // console.log("Tutorial is finished")
      observer?.disconnect();
      return;
    }
    // Listen for new components being added to the DOM
    // eslint-disable-next-line no-undef
    const obs = new MutationObserver((mutationsList) => {
      if (mutationsList.length > 0) {
        bubbleUpdate();
      }
    });

    // Start observing the DOM
    obs.observe(document.body, { childList: true, subtree: true, attributes: true });
    setObserver(obs);
  }, [tourRunning]);

  const startTutorialCallBack = () => {
    startTutorialStep();
  };

  const stopTutorial = () => {
    stopTutorialStep();
  };

  const doIncrementTutorialStep = () => {
    validateTutorialStep({ tourStep: requestedTourStep });
    incrementTutorialStep();
  };

  return (
    <>
      {children}
      {tourRunning && (
        <>
          <TutorialBubble
            requestedTourStep={requestedTourStep}
            currentTourStep={tourStep}
            steps={steps}
            stopTutorial={() => stopTutorial()}
            incrementTutorialStep={doIncrementTutorialStep}
            validateTutorialStep={validateTutorialStep}
            lastCheckRender={lastCheckRender}
          />
        </>
      )}
    </>
  );
}
