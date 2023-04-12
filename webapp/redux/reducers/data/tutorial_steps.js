import React from 'react';
const tutorial_steps = [
  {
    target: '#selectCellButton',
    title: (
      <div>Simple Cell Model Creation</div>
    ),
    content: (
      <div>
        Click on the + above Cell
      </div>
    )
  },
  {
    target: '#BallStick_HHCellTemplate',
    title: (
      <div>New Cell Addition</div>
    ),
    content: (
      <div>
        <p>Click on the menu item to add one Ball and stick HH cell</p>
      </div>
    )
  },
  {
    target: '#CellType0',
    title: (
      <div>Cell Customization</div>
    ),
    content: (
      <div>
        <p>Click on CellType0 and the panel on the right will appear.</p>
      </div>
    )
  },
  {
    target: '#cellRuleName',
    title: (
      <div>Cell Customization</div>
    ),
    content: (
      <div>
        <p>Rename the cell type: "pyr" for pyramidal.</p>
      </div>
    )
  },
  {
    target: '#newSectionButton',
    title: (
      <div>Check Cell's Sections</div>
    ),
    content: (
      <div>
        <p>Click on Section to see the sections that make up this imported cell type</p>
      </div>
    )
  },
  {
    target: 'input[value*="soma"]',
    title: (
      <div>Check Cell's Sections</div>
    ),
    content: (
      <div>
        <p>We can check that the name of the section is "soma"</p>
      </div>
    )
  },
  {
    target: 'img[src*="popParams.svg"]',
    title: (
      <div>Cell Population Creation</div>
    ),
    content: (
      <div>
        <p>Click on the Populations icon.</p>
        <p>You can also find the each sidebar icons as tab in the top panel</p>
      </div>
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
    title: (
      <div>Cell Population Creation</div>
    ),
    content: (
      <div>
        <p>Click on the + above Population</p>
      </div>
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
    title: (
      <div>Cell Population Creation</div>
    ),
    content: (
      <div>
        <p>Change the population name to “E” for excitatory</p>
      </div>
    )
  },
  {
    target: 'div[id*="netParamspopParams"][id*="cellType"]',
    title: (
      <div>Cell Population Creation</div>
    ),
    content: (
      <div>
        <p>Set the Cell type to the "pyr" cell we imported earlier</p>
      </div>
    )
  },
  {
    target: 'input[id*="numCells"]',
    title: (
      <div>Cell Population Creation</div>
    ),
    content: (
      <div>
        <p>Enter 40 for the number of cells</p>
      </div>
    )
  },
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: (
      <div>Network Creation</div>
    ),
    content: (
      <div>
        <p>Once we have a population with cells, we can create our network and visualize it</p>
      </div>
    )
  },
  {
    target: 'flexlayout__tab_button flexlayout__tab_button_top flexlayout__tab_button--selected',
    title: (
      <div>Network Visualization</div>
    ),
    content: (
      <div>
        <p>You can see the layout of our 40 pyr cells</p>
        <p>You can rotate, pan, and zoom</p>
        <p>You can choose colors from the control panel</p>
        <p>Most analysis plots (sidebar) are useless without having run a simulation</p>
      </div>
    )
  },
  {
    target: 'material-icons MuiIcon-root',
    title: (
      <div>2D Net Plot Panel</div>
    ),
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
    title: (
      <div>Model Modifications</div>
    ),
    content: (
      <div>
        <p>Click on Back To Edit</p>
      </div>
    ),
    collectionIndex: 6
  },
  {
    target: 'img[src*="synMechParams.svg"]',
    title: (
      <div>Synaptic Mechanism Creation</div>
    ),
    content: (
      <div>
        <p>Click on Synaptic Mechanisms</p>
      </div>
    ),
  },
  {
    target: '#newSynapseButton',
    title: (
      <div>Synaptic Mechanism Creation</div>
    ),
    content: (
      <div>
        <p>Click on + above Synapse </p>
      </div>
    )
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    title: (
      <div>Synaptic Mechanism Creation</div>
    ),
    content: (
      <div>
        <p>Name the synapse “exc”</p>
      </div>
    ),
    collectionIndex: 2
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    title: (
      <div>Synaptic Mechanism Creation</div>
    ),
    content: (
      <div>
        <p>Leave the default mechanism Exp2Syn</p>
      </div>
    ),
    collectionIndex: 3
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    title: (
      <div>Synaptic Mechanism Creation</div>
    ),
    content: (
      <div>
        <p>Enter 0.1 in Time constant for exponential 1 </p>
      </div>
    ),
    collectionIndex: 4
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    title: (
      <div>Synaptic Mechanism Creation</div>
    ),
    content: (
      <div>
        <p>Enter 1.0 in Time constant for exponential 2</p>
      </div>
    ),
    collectionIndex: 5
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    title: (
      <div>Synaptic Mechanism Creation</div>
    ),
    content: (
      <div>
        <p>Enter 0 in Reversal potential </p>
      </div>
    ),
    collectionIndex: 6
  },
  {
    target: 'img[src*="connParams.svg"]',
    title: (
      <div>Connectivity Rules Creation</div>
    ),
    content: (
      <div>
        <p>Click on Connectivity Rules in tabs or sidebar</p>
      </div>
    ),
  },
  {
    target: '#newConnectivityRuleButton',
    title: (
      <div>Connectivity Rules Creation</div>
    ),
    content: (
      <div>
        <p>Click on + above Connectivity Rule </p>
      </div>
    )
  },
  { // ConnectivityName
    target: '#ConnectivityName',
    title: (
      <div>Connectivity Rules Creation</div>
    ),
    content: (
      <div>
        <p>Name the rule "E-&gt;E" (without spaces)</p>
      </div>
    ),
  },
  { // netParamsconnParamsConnectivityRule0sec
    target: 'input[id*="netParamsconnParams"][id*="sec"]',
    title: (
      <div>Connectivity Rules Creation</div>
    ),
    content: (
      <div>
        <p>Add "dend" as new postsynaptic neuron section</p>
      </div>
    ),
  },
  {
    target: 'button[id^="netParamsconnParams"][id$="sec-button"]',
    title: (
      <div>Connectivity Rules Creation</div>
    ),
    content: (
      <div>
        <p>Click on "+" to add the value</p>
      </div>
    ),
  },
  {
    target: 'input[id*="netParamsconnParams"][id*="loc"]',
    title: (
      <div>Connectivity Rules Creation</div>
    ),
    content: (
      <div>
        <p>Enter 0.5 as new postsynaptic neuron location</p>
      </div>
    ),
  },
  {
    target: 'button[id^="netParamsconnParams"][id$="loc-button"]',
    title: (
      <div>Connectivity Rules Creation</div>
    ),
    content: (
      <div>
        <p>Click on "+" to add the value</p>
      </div>
    ),
  },
  {
    target: 'div[id*="netParamsconnParams"][id*="synMech"]',
    title: (
      <div>Connectivity Rules Creation</div>
    ),
    content: (
      <div>
        <p>Select "exc" for Synaptic mechanism</p>
      </div>
    ),
  },
  {
    target: 'input[id*="netParamsconnParams"][id*="probability"]',
    title: (
      <div>Connectivity Rules Creation</div>
    ),
    content: (
      <div>
        <p>Enter 0.1 in Probability of connection</p>
      </div>
    ),
  },
  {
    target: 'input[id*="netParamsconnParams"][id*="weight"]',
    title: (
      <div>Connectivity Rules Creation</div>
    ),
    content: (
      <div>
        <p>Enter 0.005 in Weight of synaptic connection</p>
      </div>
    ),
  },
  {
    target: 'input[id*="netParamsconnParams"][id*="delay"]',
    title: (
      <div>Connectivity Rules Creation</div>
    ),
    content: (
      <div>
        <p>Enter 5 in Connection delay</p>
      </div>
    ),
  },
  //
  // PRE SYNPTIC CELLS CONDITIONS
  //
  {
    target: '#preCondsConnTab > span',
    title: (
      <div>Connectivity Rules Creation</div>
    ),
    content: (
      <div>
        <p>Click on PRE-SYNAPTIC CELLS CONDITIONS</p>
      </div>
    ),
  },
  {
    target: 'div[id*="netParamsconnParams"][id*="preCondspop"]',
    title: (
      <div>Connectivity Rules Creation</div>
    ),
    content: (
      <div>
        <p>Select E for the Population</p>
      </div>
    )
  },
  //
  // POST SYNPTIC CELLS CONDITIONS
  //
  {
    target: '#postCondsConnTab > span',
    title: (
      <div>Connectivity Rules Creation</div>
    ),
    content: (
      <div>
        <p>Click on POST-SYNAPTIC CELLS CONDITIONS</p>
      </div>
    ),
  },
  {
    target: 'div[id*="netParamsconnParams"][id*="postCondspop"]',
    title: (
      <div>Connectivity Rules Creation</div>
    ),
    content: (
      <div>
        <p>Select E for the Population</p>
      </div>
    )
  }
  ,{
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: (
      <div>Network Creation</div>
    ),
    content: (
      <div>
        <p>Click on "CREATE NETWORK" (or "UPDATE NETWORK")</p>
      </div>
    ),
  }
  ,{
    target: 'img[src*="d2NetPlot.svg"]',
    title: (
      <div>Plot Display</div>
    ),
    content: (
      <div>
        <p>Generate the 2D Net Plot</p>
      </div>
    ),
  }
  ,{
    target: 'div [class*="SwitchPageButton"] .MuiButton-root',
    title: (
      <div>Model Modification</div>
    ),
    content: (
      <div>
        <p>Now we can see our connectivity</p>
        <p>Click "BACK TO EDIT" when you are ready to continue</p>
      </div>
    ),
  },
  {
    target: 'img[src*="stimSourceParams.svg"]',
    title: (
      <div>Stimulation Sources Creation</div>
    ),
    content: (
      <div>
        <p>Open the Stimulation Sources panel</p>
      </div>
    ),
  },
  {
    target: '#newStimulationSourceButton',
    title: (
      <div>Stimulation Sources Creation</div>
    ),
    content: (
      <div>
        <p>Click on + above Source</p>
      </div>
    ),
  },
  //
  // Stimulation input rules
  //
  {
    target: 'div.MuiCardContent-root div.MuiInputBase-formControl > input:not([id])',
    title: (
      <div>Stimulation Sources Creation</div>
    ),
    content: (
      <div>
        <p>Type "IClamp1" in The name of the stimulation source</p>
      </div>
    ),
  },
  {
    target: '#stimSourceSelect',
    title: (
      <div>Stimulation Sources Creation</div>
    ),
    content: (
      <div>
        <p>Set "IClamp" as the Point process used as stimulator</p>
      </div>
    ),
  },
  {
    target: 'input[id^="netParamsstimSourceParams"][id$="del"]',
    title: (
      <div>Stimulation Sources Creation</div>
    ),
    content: (
      <div>
        <p>Set Current clamp delay to 20</p>
      </div>
    ),
  },
  {
    target: 'input[id^="netParamsstimSourceParams"][id$="dur"]',
    title: (
      <div>Stimulation Sources Creation</div>
    ),
    content: (
      <div>
        <p>Set Current clamp duration to 5</p>
      </div>
    ),
  },
  {
    target: 'input[id^="netParamsstimSourceParams"][id$="amp"]',
    title: (
      <div>Stimulation Sources Creation</div>
    ),
    content: (
      <div>
        <p>Set Current clamp amplitude to 0.1 </p>
      </div>
    ),
  },
  //
  // Simulation targets
  //
  {
    target: 'img[src$="stimTargetParams.svg"]',
    title: (
      <div>Stimulation Targets Creation</div>
    ),
    content: (
      <div>
        <p>Open the on Stimulation Targets</p>
      </div>
    ),
  },
  {
    target: '#newStimulationTargetButton',
    title: (
      <div>Stimulation Targets Creation</div>
    ),
    content: (
      <div>
        <p>Click on + above Target</p>
      </div>
    )
  },
  {
    target: 'div.layoutVerticalFitInner div.MuiInputBase-formControl > input:not([id])',
    title: (
      <div>Stimulation Targets Creation</div>
    ),
    content: (
      <div>
        <p>Type “IClamp1-&gt;cell0” in The name of the stimulation target </p>
      </div>
    ),
  },
  {
    target: 'div[id*="netParamsstimTargetParams"][id*="source"]',
    title: (
      <div>Stimulation Targets Creation</div>
    ),
    content: (
      <div>
        <p>Set Stimulation source to IClamp1</p>
      </div>
    ),
  },
  {
    target: 'input[id*="netParamsstimTargetParams"][id*="sec"]',
    title: (
      <div>Stimulation Targets Creation</div>
    ),
    content: (
      <div>
        <p>Type “dend” in Target section</p>
      </div>
    ),
  },
  {
    target: 'input[id*="netParamsstimTargetParams"][id*="loc"]',
    title: (
      <div>Stimulation Targets Creation</div>
    ),
    content: (
      <div>
        <p>Enter 1 in Target location</p>
      </div>
    ),
  },
  //
  // Conditions tab
  //
  {
    target: '#stimTargetCondsTab',
    title: (
      <div>Conditions Setup</div>
    ),
    content: (
      <div>
        <p>Click on CONDITIONS</p>
      </div>
    )
  },
  {
    target: 'input[id*="netParamsstimTargetParams"][id*="condscellList"]',
    title: (
      <div>Conditions Setup</div>
    ),
    content: (
      <div>
        <p>Enter 0 as new Target cell global indices</p>
      </div>
    )
  },
  {
    target: 'button[id*="netParamsstimTargetParams"][id*="condscellList-button"]',
    title: (
      <div>Conditions Setup</div>
    ),
    content: (
      <div>
        <p>Click the "+" to add the new target cell global indice</p>
      </div>
    )
  },
  //
  // Configuration panel
  //
  {
    target: 'img[src*="simConfig.svg"]',
    title: (
      <div>Simulation Configuration</div>
    ),
    content: (
      <div>
        <p>Open the configuration panel</p>
      </div>
    ),
  },
  // Simulation configuration
  {
    target: '#simConfigduration',
    title: (
      <div>Simulation Configuration</div>
    ),
    content: (
      <div>
        <p>Change the Duration to 200</p>
      </div>
    )
  },
  {
    target: '#simConfigdt',
    title: (
      <div>Simulation Configuration</div>
    ),
    content: (
      <div>
        <p>Change the Time Step to 0.1</p>
      </div>
    ),
  },
  {
    target: '#configRecord',
    title: (
      <div>Simulation Configuration</div>
    ),
    content: (
      <div>
        <p>Click on RECORD</p>
      </div>
    ),
  },
  {
    target: '#simConfigrecordCells',
    title: (
      <div>Simulation Configuration</div>
    ),
    content: (
      <div>
        <p>Enter 0 as new Cells to record traces from</p>
      </div>
    )
  },
  {
    target: '#simConfigrecordCells-button',
    title: (
      <div>Simulation Configuration</div>
    ),
    content: (
      <div>
        <p>Click the "+" to add the value</p>
      </div>
    )
  },
  {
    target: '#simConfigrecordTraces',
    title: (
      <div>Simulation Configuration</div>
    ),
    content: (
      <div>
        <p>Type "{"V_dend: {sec: dend, loc: 1.0, var: v}"}"</p>
      </div>
    )
  },
  {
    target: '#simConfigrecordTraces-button',
    title: (
      <div>Simulation Configuration</div>
    ),
    content: (
      <div>
        <p>Click the "+" to add the expression</p>
      </div>
    )
  },
  //
  // Plot Settings
  //
  {
    target: 'img[src$="analysis.svg"]',
    title: (
      <div>Plot Settings</div>
    ),
    content: (
      <div>
        <p>We want to overlay the voltage traces from soma and dend</p>
        <p>Go to Plot Settings</p>
      </div>
    ),
  }
  , {
    target: 'div.MuiAccordionSummary-root div.breadcrumb button.MuiButtonBase-root.MuiFab-root.MuiFab-sizeSmall.MuiFab-primary:not([id])',
    title: (
      <div>Plot Settings</div>
    ),
    content: (
      <div>
        <p>Click the "+" to create a new plot</p>
      </div>
    ),
  }
  , {
    target: 'li[value="iplotTraces"]',
    title: (
      <div>Plot Settings</div>
    ),
    content: (
      <div>
        <p>Select Traces Plot</p>
      </div>
    ),
  }
  , {
    target: 'div.MuiPaper-elevation0 div.MuiBox-root div.MuiFormControl-root input.MuiFilledInput-input:not([id])',
    title: (
      <div>Plot Settings</div>
    ),
    content: (
      <div>
        <p>Click on "Cells to include"</p>
      </div>
    ),
    waitFor: 'click',
    collectionIndex: 1
  },
  {
    target: 'li[value="gids"]',
    title: (
      <div>Plot Settings</div>
    ),
    content: (
      <div>
        <p>Click "gids" then select "cell 0"</p>
      </div>
    ),
  },
  {
    target: 'div.MuiPaper-elevation0 div.MuiBox-root div.MuiFormControl-root input.MuiFilledInput-input:not([id])',
    title: (
      <div>Plot Settings</div>
    ),
    content: (
      <div>
        <p>Click again on "Cells to include" to validate the selection</p>
      </div>
    ),
  },
  {
    target: '#simConfiganalysisiplotTracesoverlay',
    title: (
      <div>Plot Settings</div>
    ),
    content: (
      <div>
        <p>Check the box next to overlay data</p>
      </div>
    )
  },
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: (
      <div>Updating</div>
    ),
    content: (
      <div>
        <p>Click on UPDATE NETWORK</p>
      </div>
    ),
  },
  //
  // run simulation
  //
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: (
      <div>Simulation</div>
    ),
    content: (
      <div>
        <p>Click SIMULATE</p>
        <p>Alternatively, in the menu bar, click Model and then Simulate network</p>
        <p>Explore the analysis plots</p>
      </div>
    ),
  },
  //
  // plots
  //
  {
    target: 'img[src*="rasterPlot"]',
    title: (
      <div>Observe the different plots</div>
    ),
    content: (
      <div>
        <p>Open the Raster plot panel</p>
      </div>
    ),
  },
  {
    target: 'img[src$="tracesPlot.svg"]',
    title: (
      <div>Observe the different plots</div>
    ),
    content: (
      <div>
        <p>Open the Cell traces panel to see the voltages</p>
      </div>
    ),
  },
  {
    target: 'img[src*="spikePlot"]',
    title: (
      <div>Observe the different plots</div>
    ),
    content: (
      <div>
        <p>Open the Spike histogram panel</p>
      </div>
    ),
  },
  {
    target: 'img[src$="connectionPlot.svg"]',
    title: (
      <div>Observe the different plots</div>
    ),
    content: (
      <div>
        <p>Open the Connectivity panel</p>
      </div>
    ),
  },
  //
  // Clear the GUI
  //
  {
    target: '#File',
    title: (
      <div>Clear the kernel</div>
    ),
    content: (
      <div>
        <p>In the menu bar, select "File"</p>
      </div>
    )
  },
  {
    target: '#New',
    title: (
      <div>Clear the kernel</div>
    ),
    content: (
      <div>
        <p>Then click on "New"</p>
        <p>This is necessary to clear the kernel when changing models</p>
      </div>
    )
  },
  {
    target: '#appBarPerformActionButton',
    title: (
      <div>Clear the kernel</div>
    ),
    content: (
      <div>
        <p>Finally, click on "CREATE" to clear the kernel</p>
      </div>
    )
  }
]
export default tutorial_steps ;