import React from "react";

const TutorialBubble = ({ element, content, onClose, ...rest }) => {
  const target = document.getElementById(element);
  if (!target) {
    return null;
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