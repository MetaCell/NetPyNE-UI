import React from "react";

const TutorialBubble = ({ element, content, steps, onClose, ...rest }) => {
  let target = null ;

  if (element[0] == '#') 
    target = document.getElementById(element.replace('#', ''));
  else
    target = document.getElementsByClassName(element);

  if (!target) {
    return null;
  }
  //if there's a collection we got no choise than passing the element index as configuration
  if (target instanceof HTMLCollection)
  {
    const targetConfig = steps.find( t => t.target == element );
    target = target[targetConfig?.collectionIndex || 0 ]
  }

  const targetRect = target.getBoundingClientRect();

  return (
    <div style={{ position: "relative" }} id="tutorialBubble">
      <div
        style={{
          position: "absolute",
          top: targetRect.bottom + 10 - window.innerHeight,
          left: targetRect.left,
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
          padding: "16px",
          maxWidth: "300px",
          fontSize: "16px",
          lineHeight: "1.5",
          zIndex: 9999,
          ...rest
        }}
      >
        <div>{content}</div>
        <button onClick={onClose}           
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