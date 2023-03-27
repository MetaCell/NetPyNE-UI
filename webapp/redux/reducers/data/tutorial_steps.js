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
    stepIndex: 0 
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
    stepIndex: 2 
  },
  {
    target: 'flexlayout__tab_button_content',
    content: (
      <div>
        <p>Click on Synaptic Mechanisms in tabs</p>
      </div>
    ),
    stepIndex: 2 
  },
  {
    target: 'flexlayout__tab_button_content',
    content: (
      <div>
        <p>Click on Synaptic Mechanisms in tabs</p>
      </div>
    ),
    stepIndex: 2 
  },
  {
    target: 'Synapse0',
    content: (
      <div>
        <p>Click on + above Synapse </p>
      </div>
    )
  }
]
export default tutorial_steps ;