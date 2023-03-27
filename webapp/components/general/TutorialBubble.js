import React, {useState} from "react";

const TutorialBubble = ({ requestedTourStep, steps, lastCheckRender, stopTutorial, incrementTutorialStep, validateTutorialStep  }) => {

  const [count, setCount] = useState(0);

  const forceUpdate = () => {
    setCount(count);
  };

  const getDOMTarget = (target) => {
    let DOMtarget = null ;

    if (target[0] == '#') 
      DOMtarget = document.getElementById(target.replace('#', ''));
    else
    {
      DOMtarget = document.getElementsByClassName(target);
      //last attempt element name
      if (!DOMtarget || DOMtarget.length == 0 )
        DOMtarget = document.getElementsByTagName(target);
    }

    if (!DOMtarget || DOMtarget.length == 0 ) {
      stopTutorial();
      return null;
    }
    //if there's a collection we got no choise than passing the element index as configuration
    if (DOMtarget instanceof HTMLCollection)
    {
      const targetConfig = steps.find( t => t.target == target );
      DOMtarget = DOMtarget[targetConfig?.collectionIndex || 0 ]
    }

    return DOMtarget;
  }

  const tourStep  = steps[requestedTourStep-1];
  if(!tourStep)
    return null ;

  const target   = tourStep.target ;
  const content  = tourStep.content ;

  const  DOMtarget = getDOMTarget(target);
  const visible    = DOMtarget?.checkVisibility();

  if (!visible)
  {
    stopTutorial();
    return null ;
  }else{
    validateTutorialStep({ tourStep: requestedTourStep });
  }

  const targetRect = DOMtarget.getBoundingClientRect();

  return (
    <div style={{ position: "relative" }} id="tutorialBubble">
      {lastCheckRender}
      <div
        style={{
          position: "absolute",
          top: targetRect.top + 10 - window.innerHeight,
          left: targetRect.left,
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
          padding: "16px",
          maxWidth: "300px",
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
          Close
        </button>
      </div>
    </div>
  );
};

export default TutorialBubble;