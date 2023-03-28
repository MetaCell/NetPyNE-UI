import React from 'react';
const tutorial_steps = [
  {
    target: '#selectCellButton',
    content: (
      <div>
        <p>Import a simple cell model</p>
        <p>Click on the + above Cell</p>
      </div>
    )
  },
  {
    target: '#BallStick_HHCellTemplate',
    content: (
      <div>
        <p>Click on Ball and stick HH cell</p>
      </div>
    )
  },
  {
    target: '#CellType0',
    content: (
      <div>
        <p>Click on CellType0 and the panel on the right will appear</p>
        <p>Rename the cell type: “pyr” for pyramidal</p>
      </div>
    )
  },
  {
    target: '#newSectionButton',
    content: (
      <div>
        <p>Click on Section to see the sections that make up this imported cell type</p>
      </div>
    )
  },
  {
    target: 'flexlayout__tab_button_content',
    content: (
      <div>
        <p>Click on the Populations tab or its icon in the sidebar</p>
      </div>
    ),
    collectionIndex: 1
  },
  {
    target: '#newPopulationButton',
    content: (
      <div>
        <p>Click on the + above Population</p>
      </div>
    )
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Change the population name to “E” for excitatory</p>
      </div>
    ),
    collectionIndex: 2
  },
  {
    target: '#netParamspopParamsPopulation0cellType',
    content: (
      <div>
        <p>Set the Cell type to the pyr cell we imported earlier</p>
      </div>
    )
  },
  {
    target: '#netParamspopParamsPopulation0numCells',
    content: (
      <div>
        <p>Enter 40 for the number of cells</p>
      </div>
    )
  },
  {
    target: 'MuiButtonBase-root MuiButton-root MuiButton-contained MuiButtonGroup-grouped MuiButtonGroup-groupedHorizontal MuiButtonGroup-groupedContained MuiButtonGroup-groupedContainedHorizontal MuiButtonGroup-groupedContainedPrimary MuiButton-containedPrimary',
    content: (
      <div>
        <p>Once we have a population with cells, we can create our network and visualize it</p>
      </div>
    )
  },
  {
    target: 'canvas',
    content: (
      <div>
        <p>You can see the layout of our 40 pyr cells</p>
        <p>You can rotate, pan, and zoom</p>
        <p>You can choose colors from the control panel</p>
        <p>Most analysis plots (sidebar) are useless without having run a simulation</p>
      </div>
    ),
    collectionIndex: 0 
  },
  {
    target: 'material-icons MuiIcon-root',
    content: (
      <div>
        <p>The 2D net plot shows cell positions</p>
        <p>No connectivity has been added yet</p>
        <p>Explore the interactive plot</p>
        <p>Explore moving and reshaping tabs (drag from the tab title)</p>
      </div>
    ),
    collectionIndex: 2 
  },
  {
    target: 'MuiButtonBase-root MuiButton-root MuiButton-contained',
    content: (
      <div>
        <p>Click on Back To Edit</p>
      </div>
    ),
    collectionIndex: 6 
  },
  {
    target: 'flexlayout__tab_button_content',
    content: (
      <div>
        <p>Click on Synaptic Mechanisms in tabs</p>
      </div>
    ),
    collectionIndex: 2 
  },
  {
    target: '#newSynapseButton',
    content: (
      <div>
        <p>Click on + above Synapse </p>
      </div>
    )
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Name the synapse “exc”</p>
      </div>
    ),
    collectionIndex: 2
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Leave the default mechanism Exp2Syn</p>
      </div>
    ),
    collectionIndex: 3
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Enter 0.1 in Time constant for exponential 1 </p>
      </div>
    ),
    collectionIndex: 4
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Enter 1.0 in Time constant for exponential 2</p>
      </div>
    ),
    collectionIndex: 5
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Enter 0 in Reversal potential </p>
      </div>
    ),
    collectionIndex: 6
  },
  {
    target: 'flexlayout__tab_button_content',
    content: (
      <div>
        <p>Click on Connectivity Rules in tabs or sidebar</p>
      </div>
    ),
    collectionIndex: 3 
  },
  {
    target: '#newConnectivityRuleButton',
    content: (
      <div>
        <p>Click on + above Connectivity Rule </p>
      </div>
    )
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Select “exc” for Synaptic mechanism</p>
      </div>
    ),
    collectionIndex: 8 
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Enter 0.1 in Probability of connection</p>
      </div>
    ),
    collectionIndex: 9 
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Enter 0.005 in Weight of synaptic connection</p>
      </div>
    ),
    collectionIndex: 10 
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Enter 5 in Connection delay</p>
      </div>
    ),
    collectionIndex: 11 
  },
  {
    target: 'MuiBottomNavigationAction-wrapper',
    content: (
      <div>
        <p>Click on PRE-SYNAPTIC CELLS CONDITIONS</p>
      </div>
    ),
    collectionIndex: 1 
  },
  {
    target: 'MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiSelect-filled MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Select “exc” for Synaptic mechanism</p>
      </div>
    ),
    collectionIndex: 1 
  },
  {
    target: 'MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiSelect-filled MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Enter 0.1 in Probability of connection</p>
      </div>
    ),
    collectionIndex: 2 
  },
  {
    target: 'MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiSelect-filled MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Enter 0.005 in Weight of synaptic connection</p>
      </div>
    ),
    collectionIndex: 3 
  },
  {
    target: 'MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiSelect-filled MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Enter 5 in Connection delayS</p>
      </div>
    ),
    collectionIndex: 4 
  }  
  ,{
    target: 'MuiBottomNavigationAction-wrapper',
    content: (
      <div>
        <p>Click on POST-SYNAPTIC CELLS CONDITIONS</p>
      </div>
    ),
    collectionIndex: 2 
  },
  ,{
    target: 'netParamsconnParamsConnectivityRule0postCondspop',
    content: (
      <div>
        <p>Select E for the Population</p>
      </div>
    )
  }
  ,{
    target: 'MuiButtonBase-root MuiButton-root MuiButton-contained MuiButtonGroup-grouped MuiButtonGroup-groupedHorizontal MuiButtonGroup-groupedContained MuiButtonGroup-groupedContainedHorizontal MuiButtonGroup-groupedContainedPrimary MuiButton-containedPrimary',
    content: (
      <div>
        <p>CREATE NETWORK</p>
      </div>
    ),
    collectionIndex: 0 
  }
  ,{
    target: 'MuiButtonBase-root MuiListItem-root makeStyles-selected-23 MuiListItem-dense MuiListItem-button',
    content: (
      <div>
        <p>Generate a 2D Net Plot</p>
      </div>
    ),
    collectionIndex: 2 
  }
  ,{
    target: 'MuiButtonBase-root MuiButton-root MuiButton-contained',
    content: (
      <div>
        <p>Now we can see our connectivity</p>
        <p>Click BACK TO EDIT when you are ready to continue</p>
      </div>
    ),
    collectionIndex: 6
  }
  ,{
    target: 'flexlayout__tab_button_content',
    content: (
      <div>
        <p>Click on Stim. Sources in tabs or sidebar</p>
      </div>
    ),
    collectionIndex: 4
  }
  , {
    target: '#newStimulationSourceButton',
    content: (
      <div>
        <p>Click on + above Source</p>
      </div>
    ),
    collectionIndex: 4
  }
  //stimulation input rules
  , {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Type “IClamp1” in The name of the stimulation source</p>
      </div>
    ),
    collectionIndex: 2
  }
  , {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Leave the default IClamp as the Point process used as stimulator</p>
      </div>
    ),
    collectionIndex: 3
  }
  , {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Set Current clamp delay to 20</p>
      </div>
    ),
    collectionIndex: 4
  }
  , {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Set Current clamp duration to 5</p>
      </div>
    ),
    collectionIndex: 5
  }
  , {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Set Current clamp amplitude to 0.1 </p>
      </div>
    ),
    collectionIndex: 6
  }
  //steam targets
  , {
    target: 'flexlayout__tab_button_content',
    content: (
      <div>
        <p>Click on Stim. Targets in tabs or sidebar</p>
      </div>
    ),
    collectionIndex: 5
  }
  , {
    target: '#newStimulationTargetButton',
    content: (
      <div>
        <p>CClick on + above Target</p>
      </div>
    )
  }
  , {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Type “IClamp1->cell0” in The name of the stimulation target </p>
      </div>
    ),
    collectionIndex: 10
  }
  , {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Set Stimulation source to IClamp1</p>
      </div>
    ),
    collectionIndex: 11
  }
  , {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Type “dend” in Target section</p>
      </div>
    ),
    collectionIndex: 12
  }
  , {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Enter 1 in Target location</p>
      </div>
    ),
    collectionIndex: 13
  }
  //conditions tab
  , {
    target: '#stimTargetCondsTab',
    content: (
      <div>
        <p>Click on CONDITIONS</p>
      </div>
    )
  }
  , {
    target: '#netParamsstimTargetParamsstim_target0condscellList',
    content: (
      <div>
        <p>Enter 0 in Add new Target cell global indices</p>
        <p>Click the + on the right</p>
      </div>
    )
  }
  , {
    target: 'MuiInputBase-input MuiFilledInput-input',
    content: (
      <div>
        <p>Click on Configuration in the tabs or sidebar</p>
      </div>
    ),
    collectionIndex: 8
  }
  //COnfiguration
]
export default tutorial_steps ;