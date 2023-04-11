import React, { useState, useRef } from 'react';
import { Button, Grid } from '@material-ui/core';
import {
  primaryColor, secondaryColor, bgLight, bgDark, primaryTextColor, secondaryTextColor, fontColor,
} from '../../theme';

const rectMargin = 4;

const TutorialBubble = ({
  requestedTourStep, steps, lastCheckRender, stopTutorial, incrementTutorialStep, validateTutorialStep,
}) => {
  const [count, setCount] = useState(0);

  const forceUpdate = () => {
    setCount(count);
  };

  const getDOMTarget = (target, config) => {
    // We query the DOM with the selector
    let DOMtargets = document.querySelectorAll(target);

    if (!DOMtargets || DOMtargets.length == 0) {
      DOMtargets = document.getElementsByClassName(target);
      if (!DOMtargets || DOMtargets.length == 0) {
        DOMtargets = document.getElementsByTagName(target);
      }
    }

    // if there is no DOM element, we stop the tutorial
    if (!DOMtargets || DOMtargets.length == 0) {
      return null;
    }

    // we pass the element index as configuration or 0 by default
    return DOMtargets[config?.collectionIndex || 0];
  };

  function calculateVisiblePosition (rect1, width2, height2) {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    let x = rect1.left + (rect1.width / 2) - (width2 / 2);
    let y = (rect1.top - windowHeight) + rect1.height;

    // Check if element2 is outside the viewport horizontally
    if (x + width2 > windowWidth) {
      x = rect1.left - width2;
    }

    if (x < 0) {
      x = rect1.left + rect1.width + (2 * rectMargin);
      y = rect1.top - windowHeight - rect1.height - rectMargin;
    }

    // Check if element2 is outside the viewport vertically
    if (y + height2 > windowHeight) {
      y = (rect1.top - windowHeight) + rect1.height - height2;
    }

    return { x, y };
  }

  const tourStep = steps[requestedTourStep - 1];
  if (!tourStep) {
    return null;
  }

  const { target } = tourStep;
  const { title } = tourStep;
  const { content } = tourStep;

  const DOMtarget = getDOMTarget(target, tourStep);
  const visible = DOMtarget?.checkVisibility();

  if (!visible) {
    return <></>;
  }

  // validateTutorialStep({ tourStep: requestedTourStep });

  const targetRect = DOMtarget.getBoundingClientRect();
  const { x, y } = calculateVisiblePosition(targetRect, 150, 300);

  const hasOtherSteps = requestedTourStep < steps.length;

  return (
    <div>
      <div
        id="tutorialTargetRectangle"
        style={{
          position: 'absolute',
          top: targetRect.top - rectMargin,
          left: targetRect.left - rectMargin,
          width: targetRect.width + (2 * rectMargin),
          height: targetRect.height + (2 * rectMargin),
          borderRadius: '4px',
          pointerEvents: 'none',
          border: `solid 3px ${primaryColor}`,
          zIndex: 9999,
        }}
      />
      <div style={{ position: 'relative' }} id="tutorialBubble">
        {lastCheckRender}
        <div
          style={{
            position: 'absolute',
            top: y,
            left: x,
            backgroundColor: '#434343',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            padding: '16px',
            minWidth: '150px',
            maxWidth: '300px',
            maxHeight: '300px',
            fontSize: '16px',
            lineHeight: '1.5',
            zIndex: 9999,
          }}
        >
          <h3
            style={{
              marginTop: 0,
              color: fontColor,
            }}
          >
            {title}
          </h3>

          <div
            style={{
              color: fontColor,
              paddingBottom: '20px',
            }}
          >
            {content}
          </div>

          <Grid alignItems="flex-start" container spacing={1}>
            <Grid
              container
              direction="column"
              item
              xs={3}
              spacing={1}
              alignItems="left"
              justifyContent="left"
            >
              <Grid item xs={12}>
                <p style={{ color: '#fff' }}>
                  {requestedTourStep}
                  /
                  {steps.length}
                </p>
              </Grid>
            </Grid>
            <Grid
              container
              direction="column"
              item
              xs={9}
              spacing={1}
              alignItems="right"
              justifyContent="right"
            >
              <Grid item xs={12}>
                <Button
                  onClick={stopTutorial}
                  color="primary"
                  style={{
                    display: 'block',
                    margin: '0 auto',
                    color: primaryColor,
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    position: 'absolute',
                    right: '85px',
                    bottom: '25px',
                  }}
                >
                  {hasOtherSteps ? 'Skip' : 'Close'}
                </Button>
                {hasOtherSteps
                && (
                <Button
                  onClick={incrementTutorialStep}
                  style={{
                    display: 'block',
                    margin: '0 auto',
                    backgroundColor: primaryColor,
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    position: 'absolute',
                    right: '15px',
                    bottom: '25px',
                  }}
                >
                  Next
                </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default TutorialBubble;
