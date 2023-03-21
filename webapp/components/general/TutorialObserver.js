import React, {useEffect, useState} from 'react';
import Joyride from 'react-joyride';
import tutorial_steps from '../../redux/reducers/data/tutorial_steps';

export default function TutorialObserver(props) {
  const [ nodeIdList, setNodeIdList] = useState([]);

  const {
    steps,
    tourStep,
    tourRunning,
    discoveredSteps,
    runControlledStep,
    stopTutorialStep,
    addDiscoveredStep,
    children
  } = props;

  const search =  tutorial_steps.map( s => s.target ); 

  const traverseNodes = (nodes, search) => {
    nodes.forEach((node) => {
      // Check if the node has the desired property
      search.forEach( s => {
        const attr_name  = s.indexOf('#') > -1 ? 'id' : 'className';
        const attr_value = s.split(/[#.]/).join("");
        if (node[attr_name] === attr_value) {
          // Add a new step to the steps array
          const match_id = node.id ; 
          if (nodeIdList.indexOf(match_id) == -1)
            setNodeIdList([...nodeIdList, match_id]);
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

  const nodes_length = nodeIdList.length  ;
  if(nodes_length > 0)
    addDiscoveredStep({ nodeIdList })

  console.log(discoveredSteps); //manage logic
  
  const callbackHandler = (data) => {
    const { action, index, type, size } = data;
    
    if (action === 'close' && tourRunning ) {
      stopTutorialStep();
    } 
  }

  return ( 
    <>
      {children}
      <Joyride 
        steps={steps} 
        stepIndex={tourStep}
        styles={{
          options: {
            arrowColor: '#e3ffeb',
            backgroundColor: '#e3ffeb',
            overlayColor: 'rgba(79, 26, 0, 0.4)',
            primaryColor: '#000',
            textColor: '#004a14',
            width: 900,
            zIndex: 10000,
          }
        }}
        run={tourRunning} 
        callback={callbackHandler}
        />
    </>
  );
}