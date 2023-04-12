import React, { useState, useRef, useEffect } from 'react';
import { Button, Grid } from '@material-ui/core';
import {
  primaryColor, secondaryColor, bgLight, bgDark, primaryTextColor, secondaryTextColor, fontColor,
} from '../../theme';

const rectMargin = 4;

const TutorialBubble = ({
  requestedTourStep, steps, lastCheckRender, stopTutorial, incrementTutorialStep, validateTutorialStep, currentTourStep
}) => {
  const tutorialTarget = useRef(null)

  useEffect(() => {
    return () => {
      tutorialTarget.current = null;
    }
  }, [])

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

  const { target, title, content } = tourStep;


  const DOMtarget = getDOMTarget(target, tourStep);
  const visible = DOMtarget?.checkVisibility();

  if (!visible) {
    return <></>;
  }

  // validateTutorialStep({ tourStep: requestedTourStep });
  const isEditable = (el) => {
    if (el && ~['input','textarea'].indexOf(el.tagName.toLowerCase())) {
      return !el.readOnly && !el.disabled;
    }
    el = getSelection().anchorNode;
    if (!el){
      return false;
    }
    return el.parentNode.isContentEditable;
  }

  const isAnyEditable = (element) => {
    if (isEditable(element)) {
      return true;
    }

    for (const child of element.children) {
      if (isAnyEditable(child)) {
        return true;
      }
    }
    return false;
  }

  const listen = (event) => {
    tutorialTarget.current = null;
    incrementTutorialStep();
  }

  const stop = (event) => {
    stopTutorial(event);
    tutorialTarget.current = null;
  }

  if (currentTourStep === requestedTourStep) {
    tutorialTarget.current = null;
  }

  if (!tutorialTarget.current && currentTourStep !== requestedTourStep) {
    tutorialTarget.current = DOMtarget;
    let waitFor = tourStep.waitFor;
    if (!waitFor) {
      waitFor = isAnyEditable(DOMtarget) ? 'fieldEdition' : 'click'
    }
    switch (waitFor) {
      case 'click':
        if (requestedTourStep === steps.length) {
          DOMtarget.addEventListener('click', stop, {once: true, capture: true});
        } else {
          DOMtarget.addEventListener('click', listen, {once: true, capture: true});
        }
        break;
      case 'fieldEdition': // Do nothing, we wait for a click on "next"
        break;
      default:
        break;
    }
  }

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
          zIndex: 1501,  // Just over the menus items (1500)
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
            zIndex: 1501,  // Just over the menus items (1500)
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
              alignItems="flex-start"
              justifyContent="flex-start"
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
              alignItems="flex-end"
              justifyContent="flex-end"
            >
              <Grid item xs={12}>
                <Button
                  onClick={stop}
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
                  onClick={listen}
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
