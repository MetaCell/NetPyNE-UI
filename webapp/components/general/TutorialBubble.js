import React, {useState, useRef} from "react";


const rectMargin = 4;

const TutorialBubble = ({ requestedTourStep, steps, lastCheckRender, stopTutorial, incrementTutorialStep, validateTutorialStep  }) => {

  const [count, setCount] = useState(0);

  const forceUpdate = () => {
    setCount(count);
  };


  const getDOMTarget = (target, config) => {
    // We query the DOM with the selector
    let DOMtargets = document.querySelectorAll(target)

    if (!DOMtargets || DOMtargets.length == 0) {
      DOMtargets = document.getElementsByClassName(target);
      if (!DOMtargets || DOMtargets.length == 0) {
        DOMtargets = document.getElementsByTagName(target);
      }
    }

    // if there is no DOM element, we stop the tutorial
    if (!DOMtargets || DOMtargets.length == 0) {
      stopTutorial();
      return null;
    }

    // we pass the element index as configuration or 0 by default
    return DOMtargets[config?.collectionIndex || 0 ];
  }

  function calculateVisiblePosition(rect1, width2, height2) {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    let x = rect1.left + (rect1.width / 2) - (width2 / 2);
    let y = (rect1.top  - windowHeight) + rect1.height;

    // Check if element2 is outside the viewport horizontally
    if (x + width2 > windowWidth) {
      x = rect1.left - width2 ;
    }

    if (x < 0) {
      x = rect1.left + rect1.width + (2 * rectMargin);
      y = rect1.top - windowHeight - rect1.height - rectMargin;
    }

    // Check if element2 is outside the viewport vertically
    if (y + height2 > windowHeight) {
      y =  - height2 ;
    }

    return { x, y };
  }

  const tourStep = steps[requestedTourStep-1];
  if (!tourStep) {
    return null ;
  }

  const target   = tourStep.target ;
  const content  = tourStep.content ;

  const DOMtarget = getDOMTarget(target, tourStep);
  const visible    = DOMtarget?.checkVisibility();

  if (!visible) {
    stopTutorial();
    return null ;
  } else {
    validateTutorialStep({ tourStep: requestedTourStep });
  }

  const targetRect = DOMtarget.getBoundingClientRect();
  const { x, y } = calculateVisiblePosition(targetRect, 150, 300);

  return (
    <div>
      <div id="tutorialTargetRectangle"
        style={{
          position: "absolute",
          top: targetRect.top - rectMargin,
          left: targetRect.left - rectMargin,
          pointerEvents: "none",
          border: "solid 3px red",
          width: targetRect.width + (2 * rectMargin),
          height: targetRect.height + (2 * rectMargin),
          zIndex: 9999
        }}
      />
      <div style={{ position: "relative" }} id="tutorialBubble">
        {lastCheckRender}

        <div
          style={{
            position: "absolute",
            top: y,
            left: x,
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            padding: "16px",
            maxWidth: "150px",
            maxHeight: "300px",
            fontSize: "16px",
            lineHeight: "1.5",
            zIndex: 9999
          }}
        >
          <div>{content}</div>
          <button onClick={incrementTutorialStep}
          style={{
              display: "block",
              margin: "0 auto",
              backgroundColor: "#333",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: "pointer",
            }}>
            Skip
          </button>
          <p>{requestedTourStep}/{steps.length}</p>
        </div>
      </div>
    </div>
  );
};

export default TutorialBubble;