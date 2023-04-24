import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Button, Grid, Typography,
} from '@material-ui/core';
import {
  primaryColor, secondaryColor, bgLight, bgDark, primaryTextColor, secondaryTextColor, fontColor,
} from '../../theme';

const rectMargin = 4;

const TutorialBubble = ({
  requestedTourStep, steps, lastCheckRender, stopTutorial, incrementTutorialStep, validateTutorialStep, currentTourStep,
}) => {
  const tutorialTarget = useRef(null);

  useEffect(() => () => {
    tutorialTarget.current = null;
  }, []);

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

    // let x = rect1.left + (rect1.width / 2) - (width2 / 2); // bubble is aligned with center of the rectangle
    let x = rect1.left;  // bubble is aligned with the left of the rectangle
    let y = (rect1.top - windowHeight) + rect1.height + rectMargin;

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

  const nextTourStep = steps[requestedTourStep];
  const { target: nextTarget } = nextTourStep || { target: undefined };

  const { target, title, content } = tourStep;

  const DOMtarget = getDOMTarget(target, tourStep);
  const nextDOMtarget = getDOMTarget(nextTarget, nextTourStep);
  const visible = DOMtarget?.checkVisibility();

  if (!visible) {
    return <></>;
  }

  // validateTutorialStep({ tourStep: requestedTourStep });
  const isEditable = (el) => {
    if (el && ~['input', 'textarea'].indexOf(el.tagName.toLowerCase())) {
      return !el.readOnly && !el.disabled;
    }
    el = getSelection().anchorNode;
    if (!el) {
      return false;
    }
    return el.parentNode.isContentEditable;
  };

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
  };

  const listen = (event) => {
    tutorialTarget.current = null;
    incrementTutorialStep();
  };

  const stop = (event) => {
    tutorialTarget.current = null;
    stopTutorial(event);
  };

  if (currentTourStep === requestedTourStep) {
    tutorialTarget.current = null;
  }

  if (!tutorialTarget.current && currentTourStep !== requestedTourStep) {
    tutorialTarget.current = DOMtarget;
    let { waitFor } = tourStep;
    if (!waitFor) {
      waitFor = isAnyEditable(DOMtarget) ? 'fieldEdition' : 'click';
    }
    switch (waitFor) {
      case 'click':
        if (requestedTourStep === steps.length) {
          DOMtarget.addEventListener('click', stop, { once: true, capture: true });
        } else {
          DOMtarget.addEventListener('click', listen, { once: true, capture: true });
        }
        break;
      case 'fieldEdition': // Do nothing, we wait for a click on "next"
        break;
      default:
        break;
    }
  }

  const targetRect = DOMtarget.getBoundingClientRect();
  const { x, y } = calculateVisiblePosition(targetRect, 400, 184);

  const hasOtherSteps = requestedTourStep < steps.length;
  const nextIsVisible = nextDOMtarget?.checkVisibility();

  return (
    <Box className="tutorials">
      <Box
        className="tutorials_highlight"
        id="tutorialTargetRectangle"
        style={{
          top: targetRect.top - rectMargin,
          left: targetRect.left - rectMargin,
          width: targetRect.width + (2 * rectMargin),
          height: targetRect.height + (2 * rectMargin),
          borderColor: primaryColor,

        }}
      />

      <Box className="tutorials_wrapper" id="tutorialBubble">
        <Box
          className="tutorials_content"
          style={{
            top: y,
            left: x,
          }}
        >
          <Typography component="h3">
            {title}
          </Typography>

          {content}

          <Box pt={2.5} display="flex" alignItems="center" justifyContent="space-between">
            <Typography>
              {requestedTourStep}
              /
              {steps.length}
            </Typography>

            <Box display="flex" alignItems="center">
              <Button
                onClick={stop}
                color="primary"
              >
                {hasOtherSteps ? 'Skip' : 'Close'}
              </Button>

              {hasOtherSteps && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={listen}
                  disabled={!nextIsVisible}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TutorialBubble;
