import React from 'react'; 

const tutorial_steps = [
  {
    target: '#selectCellButton',
    title: 'Create a new cell type',
    content: <p>Click on the + above Cell</p>
  },
  {
    target: '#BallStick_HHCellTemplate',
    title: 'Create a new cell type',
    content: (
      <p>Click on the menu item to select the "Ball and stick HH cell" template</p>
    )
  },
  {
    target: '#CellType0',
    title: 'Edit the new cell type properties',
    content: (
      <p>Click on CellType0 to edit its properties via the panel on the right.</p>
    )
  },
  {
    target: '#cellRuleName',
    validation: 'input[value="pyr"]',
    title: 'Edit the new cell type properties',
    content: (
      <p>Rename the cell type to "pyr" (for pyramidal).</p>
      ),
    validation: 'pyr'
  },
  {
    target: '#newSectionButton',
    title: 'Explore the new cell type properties',
    content: (
      <p>Click on Section to see the sections (compartments) of this cell type</p>
    )
  },
  {
    target: 'input[value*="soma"]',
    title: "Explore the new cell type properties",
    content: (
      <p>We can see that the name of this section is "soma"</p>
    )
  },
   {
    target: '#Geometry', // check
    title: "Explore the new cell type properties",
    content: (
      <p>In the geometry tab we can see the dimensions of this section (cylinder of 12 by 12 um)</p>
    )
  },
  {
    target: 'img[src*="popParams.svg"]',
    title: 'Create a cell population',
    content: (
      <>
        <p>Click on the Populations icon.</p>
        <p>You can also find each sidebar icons as a tab in the top panel</p>
      </>
    )
  },
  // {
  //   target: 'div.flexlayout__tabset_tabbar_inner.flexlayout__tabset_tabbar_inner_top > div > div:nth-child(2)',
  //   title: (
  //     <div>Populations component</div>
  //   ),
  //   content: (
  //     <div>
  //       <p>Click on the Populations tab or its icon in the sidebar</p>
  //     </div>
  //   ),
  // },
  {
    target: '#newPopulationButton',
    title: 'Cell Population Creation',
    content: (
      <p>Click on the + above Population</p>
    )
  },
  // {
  //   target: '#Population0',
  //   content: (
  //     <div>
  //       <p>Select the first population</p>
  //     </div>
  //   )
  // },
  {
    target: 'div.MuiBox-root.scrollbar.scrollchild > div.MuiBox-root > div',
    title: 'Cell Population Creation',
    content: (
      <p>Change the population name to “E” for excitatory</p>
    ),
    validation: 'input[value="E"]',
  },
  {
    target: 'div[id*="netParamspopParams"][id*="cellType"]',
    title: 'Cell Population Creation',
    content: (
      <p>Select the cell type to the one we created earlier ("pyr")</p>
      // <p>Set the Cell type to the "pyr" cell we imported earlier</p>
    ),
    waitFor: 'click',
    grabGlobalClick: true
  },
  {
    target: 'li[data-value^="pyr"]',
    title: (
      <div>Population Creation</div>
    ),
    content: (
      <p>Select "pyr"</p>
    )
  },
  {
    target: 'input[id*="numCells"]',
    title: 'Cell Population Creation',
    content: (
      <p>Enter 40 for the number of cells</p>
    ),
    validation: '40',
  },
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: 'Network Creation',
    content: (
      <p>Once we have a population with cells, we can create our network and visualize it</p>
    )
  },
  {
    target: 'flexlayout__tab_button flexlayout__tab_button_top flexlayout__tab_button--selected',
    title: 'Network Visualization',
    content: (
      <>
        <p>You can see the layout of our 40 pyr cells</p>
        <p>You can rotate, pan, and zoom</p>
        <p>You can choose colors from the control panel</p>
        <p>Most analysis plots (sidebar) are useless without having run a simulation</p>
      </>
    )
  },
  {
    target: 'img[src*="d2NetPlot"]',
    title: '2D Net Plot Panel',
    content: (
      <>
        <p>The 2D net plot shows cell positions</p>
        <p>No connectivity has been added yet</p>
        <p>Explore the interactive plot</p>
        <p>Explore moving and reshaping tabs (drag from the tab title)</p>
      </>
    ),
  },
  {
    target: 'MuiButtonBase-root MuiButton-root MuiButton-contained',
    title: 'Model Modifications',
    content: (
      <p>Click on Back To Edit</p>
    ),
    collectionIndex: 6
  },
  {
    target: 'img[src*="synMechParams.svg"]',
    title: 'Synaptic Mechanism Creation',
    content: (
      <p>Click on Synaptic Mechanisms</p>
    ),
  },
  {
    target: '#newSynapseButton',
    title: 'Synaptic Mechanism Creation',
    content: (
      <p>Click on + above Synapse </p>
    )
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    title: 'Synaptic Mechanism Creation',
    content: (
      <p>Name the synapse “exc”</p>
    ),
    collectionIndex: 2,
    validation: 'exc'
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    title: 'Synaptic Mechanism Creation',
    content: (
      <p>Leave the default mechanism Exp2Syn</p>
    ),
    collectionIndex: 3
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    title: 'Synaptic Mechanism Creation',
    content: (
      <p>Enter 0.1 in Time constant for exponential 1 </p>
    ),
    collectionIndex: 4,
    validation: '0.1'
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    title: 'Synaptic Mechanism Creation',
    content: (
      <p>Enter 1.0 (or 1) in Time constant for exponential 2</p>
    ),
    collectionIndex: 5,
    validation: '1'
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    title: 'Synaptic Mechanism Creation',
    content: (
      <p>Enter 0 in Reversal potential </p>
    ),
    collectionIndex: 6,
    validation: '0'
  },
  {
    target: 'img[src*="connParams.svg"]',
    title: 'Connectivity Rules Creation',
    content: (
      <p>Click on Connectivity Rules in tabs or sidebar</p>
    ),
  },
  {
    target: '#newConnectivityRuleButton',
    title: 'Connectivity Rules Creation',
    content: (
      <p>Click on + above Connectivity Rule </p>
    )
  },
  { // ConnectivityName
    target: '#ConnectivityName',
    title: 'Connectivity Rules Creation',
    content: (
      <p>Name the rule "E-&gt;E" (without spaces)</p>
    ),
    validation: 'E->E'
  },
  {
    target: 'input[id*="netParamsconnParams"][id*="weight"]',
    title: 'Connectivity Rules Creation',
    content: (
      <>
        <p>Enter 0.005 in Weight of synaptic connection</p>
      </>
    ),
    validation: '0.005'
  },
  {
    target: 'input[id*="netParamsconnParams"][id*="probability"]',
    title: 'Connectivity Rules Creation',
    content: (
      <>
        <p>Enter 0.1 in Probability of connection</p>
      </>
    ),
    validation: '0.1'
  },
  {
    target: 'input[id*="netParamsconnParams"][id*="delay"]',
    title: 'Connectivity Rules Creation',
    content: (
      <>
        <p>Enter 5 in Connection delay</p>
      </>
    ),
    validation: '5'
  },
  {
    target: 'div[id*="netParamsconnParams"][id*="synMech"]',
    title: 'Connectivity Rules Creation',
    content: (
      <>
        <p>Select "exc" for Synaptic mechanism</p>
      </>
    ),
  },
  { // netParamsconnParamsConnectivityRule0sec
    target: 'input[id*="netParamsconnParams"][id*="sec"]',
    title: 'Connectivity Rules Creation',
    content: (
      <>
        <p>Add "dend" as new postsynaptic neuron section</p>
      </>
    ),
    validation: 'dend'
  },
  {
    target: 'button[id^="netParamsconnParams"][id$="sec-button"]',
    title: 'Connectivity Rules Creation',
    content: (
      <>
        <p>Click on "+" to add the value</p>
      </>
    ),
  },
  {
    target: 'input[id*="netParamsconnParams"][id*="loc"]',
    title: 'Connectivity Rules Creation',
    content: (
      <>
        <p>Enter 0.5 as new postsynaptic neuron location</p>
      </>
    ),
    validation: '0.5'
  },
  {
    target: 'button[id^="netParamsconnParams"][id$="loc-button"]',
    title: 'Connectivity Rules Creation',
    content: (
      <>
        <p>Click on "+" to add the value</p>
      </>
    ),
  },
  //
  // PRE SYNPTIC CELLS CONDITIONS
  //
  {
    target: '#preCondsConnTab > span',
    title: 'Connectivity Rules Creation',
    content: (
      <>
        <p>Click on PRE-SYNAPTIC CELLS CONDITIONS</p>
      </>
    ),
  },
  {
    target: 'div[id*="netParamsconnParams"][id*="preCondspop"]',
    title: 'Connectivity Rules Creation',
    content: (
      <>
        <p>Select E for the Population</p>
      </>
    )
  },
  //
  // POST SYNPTIC CELLS CONDITIONS
  //
  {
    target: '#postCondsConnTab > span',
    title: 'Connectivity Rules Creation',
    content: (
      <>
        <p>Click on POST-SYNAPTIC CELLS CONDITIONS</p>
      </>
    ),
  },
  {
    target: 'div[id*="netParamsconnParams"][id*="postCondspop"]',
    title: 'Connectivity Rules Creation',
    content: (
      <>
        <p>Select E for the Population</p>
      </>
    )
  }
  , {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: 'Network Creation',
    content: (
      <>
        <p>Click on "CREATE NETWORK" (or "UPDATE NETWORK")</p>
      </>
    ),
  }
  , {
    target: 'img[src*="d2NetPlot.svg"]',
    title: 'Plot Display',
    content: (
      <>
        <p>Generate the 2D Net Plot</p>
      </>
    ),
  }
  , {
    target: 'div [class*="SwitchPageButton"] .MuiButton-root',
    title: 'Model Modification',
    content: (
      <>
        <p>Now we can see our connectivity</p>
        <p>Click "BACK TO EDIT" when you are ready to continue</p>
      </>
    ),
  },
  {
    target: 'img[src*="stimSourceParams.svg"]',
    title: 'Stimulation Sources Creation',
    content: (
      <>
        <p>Open the Stimulation Sources panel</p>
      </>
    ),
  },
  {
    target: '#newStimulationSourceButton',
    title: 'Stimulation Sources Creation',
    content: (
      <>
        <p>Click on + above Source</p>
      </>
    ),
  },
  //
  // Stimulation input rules
  //
  {
    target: 'div.MuiCardContent-root div.MuiInputBase-formControl > input:not([id])',
    title: 'Stimulation Sources Creation',
    content: (
      <>
        <p>Type "IClamp1" in The name of the stimulation source</p>
      </>
    ),
    validation: 'IClamp1'
  },
  {
    target: '#stimSourceSelect',
    title: 'Stimulation Sources Creation',
    content: (
      <>
        <p>Set the Point process used as stimulator</p>
      </>
    ),
    waitFor: 'click',
    grabGlobalClick: true
  },
  {
    target: 'li[data-value^="IClamp"]',
    title: 'Stimulation Sources Creation',
    content: (
      <>
        <p>Select "IClamp" as the Point process</p>
      </>
    ),
  },
  {
    target: 'input[id^="netParamsstimSourceParams"][id$="del"]',
    title: 'Stimulation Sources Creation',
    content: (
      <>
        <p>Set Current clamp delay to 20</p>
      </>
    ),
    validation: '20'
  },
  {
    target: 'input[id^="netParamsstimSourceParams"][id$="dur"]',
    title: 'Stimulation Sources Creation',
    content: (
      <>
        <p>Set Current clamp duration to 5</p>
      </>
    ),
    validation: '5'
  },
  {
    target: 'input[id^="netParamsstimSourceParams"][id$="amp"]',
    title: 'Stimulation Sources Creation',
    content: (
      <>
        <p>Set Current clamp amplitude to 0.1 </p>
      </>
    ),
    validation: '0.1'
  },
  //
  // Simulation targets
  //
  {
    target: 'img[src$="stimTargetParams.svg"]',
    title: 'Stimulation Targets Creation',
    content: (
      <>
        <p>Open the on Stimulation Targets</p>
      </>
    ),
  },
  {
    target: '#newStimulationTargetButton',
    title: 'Stimulation Targets Creation',
    content: (
      <>
        <p>Click on + above Target</p>
      </>
    )
  },
  {
    target: 'div.layoutVerticalFitInner div.MuiInputBase-formControl > input:not([id])',
    title: 'Stimulation Targets Creation',
    content: (
      <>
        <p>Type “IClamp1-&gt;cell0” in The name of the stimulation target </p>
      </>
    ),
    validation: 'IClamp1->cell0'
  },
  {
    target: 'div[id*="netParamsstimTargetParams"][id*="source"]',
    title: 'Stimulation Targets Creation',
    content: (
      <>
        <p>Set Stimulation source to IClamp1</p>
      </>
    ),
  },
  {
    target: 'input[id*="netParamsstimTargetParams"][id*="sec"]',
    title: 'Stimulation Targets Creation',
    content: (
      <>
        <p>Type “dend” in Target section</p>
      </>
    ),
    validation: 'dend'
  },
  {
    target: 'input[id*="netParamsstimTargetParams"][id*="loc"]',
    title: 'Stimulation Targets Creation',
    content: (
      <>
        <p>Enter 1 in Target location</p>
      </>
    ),
    validation: '1'
  },
  //
  // Conditions tab
  //
  {
    target: '#stimTargetCondsTab',
    title: 'Conditions Setup',
    content: (
      <>
        <p>Click on CONDITIONS</p>
      </>
    )
  },
  {
    target: 'input[id*="netParamsstimTargetParams"][id*="condscellList"]',
    title: 'Conditions Setup',
    content: (
      <>
        <p>Enter 0 as new Target cell global indices</p>
      </>
    ),
    validation: '0'
  },
  {
    target: 'button[id*="netParamsstimTargetParams"][id*="condscellList-button"]',
    title: 'Conditions Setup',
    content: (
      <>
        <p>Click the "+" to add the new target cell global indice</p>
      </>
    )
  },
  //
  // Configuration panel
  //
  {
    target: 'img[src*="simConfig.svg"]',
    title: 'Simulation Configuration',
    content: (
      <>
        <p>Open the configuration panel</p>
      </>
    ),
  },
  // Simulation configuration
  {
    target: '#simConfigduration',
    title: 'Simulation Configuration',
    content: (
      <>
        <p>Change the Duration to 200</p>
      </>
    ),
    validation: '200'
  },
  {
    target: '#simConfigdt',
    title: 'Simulation Configuration',
    content: (
      <>
        <p>Change the Time Step to 0.1</p>
      </>
    ),
    validation: '0.1'
  },
  {
    target: '#configRecord',
    title: 'Simulation Configuration',
    content: (
      <>
        <p>Click on RECORD</p>
      </>
    ),
  },
  {
    target: '#simConfigrecordCells',
    title: 'Simulation Configuration',
    content: (
      <>
        <p>Enter 0 as new Cells to record traces from</p>
      </>
    ),
    validation: '0'
  },
  {
    target: '#simConfigrecordCells-button',
    title: 'Simulation Configuration',
    content: (
      <>
        <p>Click the "+" to add the value</p>
      </>
    )
  },
  {
    target: '#simConfigrecordTraces',
    title: 'Simulation Configuration',
    content: (
      <>
        <p>Type "{"V_dend: {sec: dend, loc: 1.0, var: v}"}"</p>
        <p>(note: the tutorial input validation is case and space sensitive)</p>
      </>
    ),
    validation: 'V_dend: {sec: dend, loc: 1.0, var: v}'
  },
  {
    target: '#simConfigrecordTraces-button',
    title: 'Simulation Configuration',
    content: (
      <>
        <p>Click the "+" to add the expression</p>
      </>
    )
  },
  //
  // Plot Settings
  //
  {
    target: 'img[src$="analysis.svg"]',
    title: 'Plot Settings',
    content: (
      <>
        <p>We want to overlay the voltage traces from soma and dend</p>
        <p>Go to Plot Settings</p>
      </>
    ),
  }
  , {
    target: 'div.MuiAccordionSummary-root div.breadcrumb button.MuiButtonBase-root.MuiFab-root.MuiFab-sizeSmall.MuiFab-primary:not([id])',
    title: 'Plot Settings',
    content: (
      <>
        <p>Click the "+" to create a new plot</p>
      </>
    ),
  }
  , {
    target: 'li[value="iplotTraces"]',
    title: 'Plot Settings',
    content: (
      <>
        <p>Select Traces Plot</p>
      </>
    ),
  }
  , {
    target: 'div.MuiPaper-elevation0 div.MuiBox-root div.MuiFormControl-root input.MuiFilledInput-input:not([id])',
    title: 'Plot Settings',
    content: (
      <>
        <p>Click on "Cells to include"</p>
      </>
    ),
    waitFor: 'click',
    collectionIndex: 1
  },
  {
    target: 'li[value="gids"]',
    title: 'Plot Settings',
    content: (
      <>
        <p>Hover on "gids" then select "cell 0"</p>
      </>
    ),
    waitFor: 'fieldEdition'
  },
  {
    target: 'div.MuiPaper-elevation0 div.MuiBox-root div.MuiFormControl-root input.MuiFilledInput-input:not([id])',
    title: 'Plot Settings',
    content: (
      <>
        <p>Click again on "Cells to include" to validate the selection</p>
        <p>Click then on "Next" to continue the tutorial</p>
      </>
    ),
    // waitFor: 'click',
    collectionIndex: 1
  },
  {
    target: '#simConfiganalysisiplotTracesoverlay',
    title: 'Plot Settings',
    content: (
      <>
        <p>Check the box next to overlay data</p>
      </>
    )
  },
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: 'Updating',
    content: (
      <>
        <p>Click on UPDATE NETWORK</p>
      </>
    ),
  },
  //
  // run simulation
  //
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: 'Simulation',
    content: (
      <>
        <p>Click SIMULATE</p>
        <p>Alternatively, in the menu bar, click Model and then Simulate network</p>
        <p>Explore the analysis plots</p>
      </>
    ),
  },
  //
  // plots
  //
  {
    target: 'img[src*="rasterPlot"]',
    title: 'Observe the different plots',
    content: (
      <>
        <p>Open the Raster plot panel</p>
      </>
    ),
  },
  {
    target: 'img[src$="tracesPlot.svg"]',
    title: 'Observe the different plots',
    content: (
      <>
        <p>Open the Cell traces panel to see the voltages</p>
      </>
    ),
  },
  {
    target: 'img[src*="spikePlot"]',
    title: 'Observe the different plots',
    content: (
      <>
        <p>Open the Spike histogram panel</p>
      </>
    ),
  },
  {
    target: 'img[src$="connectionPlot.svg"]',
    title: 'Observe the different plots',
    content: (
      <>
        <p>Open the Connectivity panel</p>
      </>
    ),
  },
  //
  // Clear the GUI
  //
  {
    target: '#File',
    title: 'Clear the kernel',
    content: (
      <>
        <p>In the menu bar, select "File"</p>
      </>
    )
  },
  {
    target: '#New',
    title: 'Clear the kernel',
    content: (
      <>
        <p>Then click on "New"</p>
        <p>This is necessary to clear the kernel when changing models</p>
      </>
    )
  },
  {
    target: '#appBarPerformActionButton',
    title: 'Clear the kernel',
    content: (
      <p>Finally, click on "CREATE" to clear the kernel</p>
    )
  }
]
export default tutorial_steps;
