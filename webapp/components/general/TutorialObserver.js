import React, {useEffect, useState} from 'react';
import tutorial_steps from '../../redux/reducers/data/tutorial_steps';
import TutorialBubble from './TutorialBubble';

export default function TutorialObserver(props) {

  const {
    steps,
    tourStep,
    tourRunning,
    startTutorialStep,
    stopTutorialStep,
    addDiscoveredStep,
    incrementTutorialStepCallback,
    children
  } = props;

  const [ nodeIdList, setNodeIdList] = useState([]);
  const [target, setTarget] = useState('');
  const [content, setContent] = useState('');
  const [lastRenderStep, setLastRenderStep] = useState(tourStep);

  const search =  tutorial_steps.map( s => s.target ); 

  const traverseNodes = (nodes, search) => {
    nodes.forEach((node) => {
      // Check if the node has the desired property
      search.forEach( s => {
        const attr_name  = s.indexOf('#') > -1 ? 'id' : 'className';
        const attr_value = s.split(/[#]/).join("");
        if (node[attr_name] === attr_value) {
          // Add a new step to the steps array
          let nodeId = node[attr_name] ;
          if (nodeIdList.indexOf(nodeId) == -1)
            setNodeIdList([...nodeIdList, nodeId]);
        }
      })

      // Recursively traverse the node's children
      if (node.childNodes) {
        traverseNodes(node.childNodes, search);
      }
    });
  };

  useEffect(() => {
    // Listen for new components being added to the DOM
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (
          mutation.type === "childList" &&
          mutation.addedNodes.length > 0
        ) {
          // Traverse the added nodes and their descendants
          traverseNodes(mutation.addedNodes, search);
        }
      });
    });

    // Start observing the DOM
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    // Stop observing the DOM when the component unmounts
    return () => observer.disconnect();
  }, []);

  if(nodeIdList.length > 0)
    addDiscoveredStep({ nodeIdList })
  
  const callbackHandler = () => {
    stopTutorialStep();
    incrementTutorialStepCallback();
  }

  const startTutorialCallBack = () => {
    startTutorialStep();  
  }

  if ( tourStep > 0 && tourStep > lastRenderStep ) //prevent infinite rendering loop
  {
    setTarget(steps[tourStep-1].target);
    setContent(steps[tourStep-1].content)
    setLastRenderStep(tourStep);
  }

  return ( 
    <>
      {children}
      <button onClick={ () => { startTutorialCallBack() }}>RESET TUTORIAL</button>
      { 
        tourRunning && <TutorialBubble
        element={target}
        content={content}
        steps={steps}
        onClose={callbackHandler}
      />
      }
    </>
  );
}