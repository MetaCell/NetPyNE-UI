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
        <p>Click on the Populations icon on the left sidebar</p> 
        <p>You can also find each icon as a tab in the top panel</p>
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
    title: 'Create a cell population',
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
    title: 'Create a cell population',
    content: (
      <p>Change the population name to “E” for excitatory</p>
    ),
    validation: 'input[value="E"]',
  },
  {
    target: 'div[id*="netParamspopParams"][id*="cellType"]',
    title: 'Create a cell population', // NOTE: not possible to see "pyr" in the drop-down menu
    content: (
      <p>Select the cell type we just created ("pyr")</p> 
      // <p>Set the Cell type to the "pyr" cell we imported earlier</p>
    ),
    waitFor: 'click',
    grabGlobalClick: true
  },
  {
    target: 'li[data-value^="pyr"]',
    title: (
      <div>Create a cell population</div>
    ),
    content: (
      <p>Select "pyr"</p>
    )
  },
  {
    target: 'input[id*="numCells"]',
    title: 'Create a cell population',
    content: (
      <p>Set the number of cells to 40 </p>
    ),
    validation: '40',
  },
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: 'Create the Network',
    content: (
      <p>Now we can ask NetPyNE to create (instantiate) and visualize a network based on the specs we provided. Just click on Create Network. </p>
    )
  },
  {
    // NOTE: the tutorial can continue even if user doesn't instantiate network
    target: 'flexlayout__tab_button flexlayout__tab_button_top flexlayout__tab_button--selected',
    title: 'Network Visualization',
    content: (
      <>
        <p>You can see the layout and shape of our 40 pyr cells</p>
        <p>You can rotate, pan, and zoom</p>
        <p>You can change their colors from the control panel (gear icon on the left sidebar) </p>
        <p>Most analysis plots (sidebar) are unavailable before running a simulation</p>
      </>
    )
  },
  {
    target: 'img[src*="d2NetPlot"]',
    title: '2D Network Plot',
    content: (
      <>
        <p>Click on the 2D net plot to show the cell 2D locations</p>
      </>
    ),
  },
  {
    target: 'MuiButtonBase-root MuiButton-root MuiButton-contained',
    title: 'Continue building the model',
    content: (
      <p>Click on Back To Edit</p>
    ),
    collectionIndex: 6
  },
  {
    target: 'img[src*="synMechParams.svg"]',
    title: 'Create a synaptic mechanism',
    content: (
      <p>Click on Synaptic Mechanisms icon on the left sidebar</p>
    ),
  },
  {
    target: '#newSynapseButton',
    title: 'Create a synaptic mechanism',
    content: (
      <p>Click on + above Synapse </p>
    )
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    title: 'Create a synaptic mechanism',
    content: (
      <p>Name the synapse “exc”</p>
    ),
    collectionIndex: 2,
    validation: 'exc'
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    title: 'Create a synaptic mechanism',
    content: (
      <p>Leave the default mechanism type, Exp2Syn</p>
    ),
    collectionIndex: 3
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    title: 'Create a synaptic mechanism',
    content: (
      <p>Enter 0.1 in Time constant for exponential 1 (rise time) </p>
    ),
    collectionIndex: 4,
    validation: '0.1'
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    title: 'Create a synaptic mechanism',
    content: (
      <p>Enter 1.0 (or 1) in Time constant for exponential 2 (fall time)</p>
    ),
    collectionIndex: 5,
    validation: '1'
  },
  {
    target: 'MuiInputBase-input MuiFilledInput-input',
    title: 'Create a synaptic mechanism',
    content: (
      <p>Enter 0 in Reversal potential (mV) to make this an excitatory synapse </p>
    ),
    collectionIndex: 6,
    validation: '0'
  },
  {
    target: 'img[src*="connParams.svg"]',
    title: 'Create a connectivity rule',
    content: (
      <p>Click on Connectivity Rules in tabs or sidebar</p>
    ),
  },
  {
    target: '#newConnectivityRuleButton',
    title: 'Create a connectivity rule',
    content: (
      <p>Click on + above Connectivity Rule </p>
    )
  },
  { // ConnectivityName
    target: '#ConnectivityName',
    title: 'Create a connectivity rule',
    content: (
      <p>Name the rule "E-&gt;E" (without spaces)</p>
    ),
    validation: 'E->E'
  },
  {
    target: 'input[id*="netParamsconnParams"][id*="weight"]',
    title: 'Create a connectivity rule',
    content: (
      <>
        <p>Enter 0.005 in Weight of synaptic connection</p>
      </>
    ),
    validation: '0.005'
  },
  {
    target: 'input[id*="netParamsconnParams"][id*="probability"]',
    title: 'Create a connectivity rule',
    content: (
      <>
        <p>Enter 0.1 in Probability of connection</p>
      </>
    ),
    validation: '0.1'
  },
  {
    target: 'input[id*="netParamsconnParams"][id*="delay"]',
    title: 'Create a connectivity rule',
    content: (
      <>
        <p>Enter 5 in Connection delay (ms)</p>
      </>
    ),
    validation: '5'
  },
  {
    target: 'div[id*="netParamsconnParams"][id*="synMech"]',
    title: 'Create a connectivity rule',
    content: (
      <>
        <p>Select "exc" for Synaptic mechanism</p>
      </>
    ),
  },
  { // netParamsconnParamsConnectivityRule0sec
    target: 'input[id*="netParamsconnParams"][id*="sec"]',
    title: 'Create a connectivity rule',
    content: (
      <>
        <p>Enter "dend" as the postsynaptic neuron section</p>
      </>
    ),
    validation: 'dend'
  },
  {
    target: 'button[id^="netParamsconnParams"][id$="sec-button"]',
    title: 'Create a connectivity rule',
    content: (
      <>
        <p>Click on "+" to add the value</p>
      </>
    ),
  },
  {
    target: 'input[id*="netParamsconnParams"][id*="loc"]',
    title: 'Create a connectivity rule',
    content: (
      <>
        <p>Enter 0.5 as the postsynaptic neuron location</p>
      </>
    ),
    validation: '0.5'
  },
  {
    target: 'button[id^="netParamsconnParams"][id$="loc-button"]',
    title: 'Create a connectivity rule',
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
    title: 'Create a connectivity rule',
    content: (
      <>
        <p>Click on PRE-SYNAPTIC CELLS CONDITIONS tab to specify the subset of cells that will constitute the pre-synpatic population </p>
      </>
    ),
  },
  {
    target: 'div[id*="netParamsconnParams"][id*="preCondspop"]',
    title: 'Create a connectivity rule',
    content: (
      <>
        <p>You can decide which cells to connect based on multiple cell properties such as the cell type, population or location. In this case, select E for the Population</p>
      </>
    )
  },
  //
  // POST SYNPTIC CELLS CONDITIONS
  //
  {
    target: '#postCondsConnTab > span',
    title: 'Create a connectivity rule',
    content: (
      <>
        <p>Click on POST-SYNAPTIC CELLS CONDITIONS tab to specify the subset of cells that will constitute the post-synpatic population</p>
      </>
    ),
  },
  {
    target: 'div[id*="netParamsconnParams"][id*="postCondspop"]',
    title: 'Create a connectivity rule',
    content: (
      <>
        <p>Select E for the Population to complete this simple connectivity rule, connecting E cells to E cells recurrently (with a probability of 0.1) </p>
      </>
    )
  }
  , {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: 'Create the network',
    content: (
      <>
        <p>Click on ""UPDATE NETWORK""</p>
      </>
    ),
  }
  , {
    target: 'img[src*="d2NetPlot.svg"]',
    title: '2D Network Plot',
    content: (
      <>
        <p>Click on the 2D Network Plot, which should now show the connections between neurons</p>
      </>
    ),
  }
  , {
    target: 'div [class*="SwitchPageButton"] .MuiButton-root',
    title: 'Model Modification',
    content: (
      <>
        <p>Connections are shown as yellow lines between the neurons</p>
        <p>The network has connections but no external stimulation yet</p>
        <p>Click "BACK TO EDIT" to continue building the model and add some stimulation</p>

      </>
    ),
  },
  {
    target: 'img[src*="stimSourceParams.svg"]',
    title: 'Create a Stimulation Source',
    content: (
      <>
        <p>To add stimulation we will first create a source of stimulation (e.g. a current clamp) and then target some subset of cells with that source of stimulation.</p>
        <p>Open the Stimulation Sources panel</p>
      </>
    ),
  },
  {
    target: '#newStimulationSourceButton',
    title: 'Create a Stimulation Source',
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
    title: 'Create a Stimulation Source',
    content: (
      <>
        <p>Type "IClamp1" in The name of the stimulation source</p>
      </>
    ),
    validation: 'IClamp1'
  },
  {
    target: '#stimSourceSelect',
    title: 'Create a Stimulation Source',
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
    title: 'Create a Stimulation Source',
    content: (
      <>
        <p>Select "IClamp" as the Point process</p>
      </>
    ),
  },
  {
    target: 'input[id^="netParamsstimSourceParams"][id$="del"]',
    title: 'Create a Stimulation Source',
    content: (
      <>
        <p>Set Current clamp delay to 20</p>
      </>
    ),
    validation: '20'
  },
  {
    target: 'input[id^="netParamsstimSourceParams"][id$="dur"]',
    title: 'Create a Stimulation Source',
    content: (
      <>
        <p>Set Current clamp duration to 5</p>
      </>
    ),
    validation: '5'
  },
  {
    target: 'input[id^="netParamsstimSourceParams"][id$="amp"]',
    title: 'Create a Stimulation Source',
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
    title: 'Create a Stimulation Target',
    content: (
      <>
        <p>Now that we have a source of stimulation, we can select a subset of cells to target with this stimulation.</p>
        <p>Open the on Stimulation Targets</p>
      </>
    ),
  },
  {
    target: '#newStimulationTargetButton',
    title: 'Create a Stimulation Target',
    content: (
      <>
        <p>Click on + above Target</p>
      </>
    )
  },
  {
    target: 'div.layoutVerticalFitInner div.MuiInputBase-formControl > input:not([id])',
    title: 'Create a Stimulation Target',
    content: (
      <>
        <p>Type “IClamp1-&gt;cell0” as the name of the stimulation target (this is just an arbitrary label) </p>
      </>
    ),
    validation: 'IClamp1->cell0'
  },
  {
    target: 'div[id*="netParamsstimTargetParams"][id*="source"]',
    title: 'Create a Stimulation Target',
    content: (
      <>
        <p>Set Stimulation source to IClamp1 (this is the source of stimulation we just created)</p>
      </>
    ),
  },
  {
    target: 'input[id*="netParamsstimTargetParams"][id*="sec"]',
    title: 'Create a Stimulation Target',
    content: (
      <>
        <p>We will place the current injection at the end of the dendrite</p>
        <p>Type “dend” in Target section</p>
      </>
    ),
    validation: 'dend'
  },
  {
    target: 'input[id*="netParamsstimTargetParams"][id*="loc"]',
    title: 'Create a Stimulation Target',
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
    title: 'Create a Stimulation Target',
    content: (
      <>
        <p>We can now specify the conditions of the subset of cells that will receive this stimulation (current injection_</p>
        <p>Click on CONDITIONS</p>
      </>
    )
  },
  {
    target: 'input[id*="netParamsstimTargetParams"][id*="condscellList"]',
    title: 'Create a Stimulation Target',
    content: (
      <>
        <p>In this case we just want to target a single cell (the one with gid 0)</p>
        <p>Enter 0 as new Target cell global indices</p>
      </>
    ),
    validation: '0'
  },
  {
    target: 'button[id*="netParamsstimTargetParams"][id*="condscellList-button"]',
    title: 'Create a Stimulation Target',
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
        <p>To finish off we can set some of the simulation configuration options (e.g. the simulation duration, what to record, etc.)</p>
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
        <p>Change the Duration to 200 ms</p>
      </>
    ),
    validation: '200'
  },
  {
    target: '#simConfigdt',
    title: 'Simulation Configuration',
    content: (
      <>
        <p>Change the Time Step to 0.1 ms</p>
      </>
    ),
    validation: '0.1'
  },
  {
    target: '#configRecord',
    title: 'Simulation Configuration',
    content: (
      <>
        <p>Click on RECORD to specify what cells and variables (e.g. voltage) to record from</p>
      </>
    ),
  },
  {
    target: '#simConfigrecordCells',
    title: 'Simulation Configuration',
    content: (
      <>
        <p>Enter 0 in new Cells to record traces from (this means recording from the cell with global id = 0) </p>
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
        <p>Click on Add new traces to record from cells and type:</p>
        <p> {"V_dend: {sec: dend, loc: 1.0, var: v}"}</p>
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
        <p>Adding this line will make NetPyNE record the voltage from the cell dendrite  </p>
        <p>Note that recording from the soma was there by default </p>
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
        <p>Now we can change some of the plotting/visualization settings, e.g. let's overlay the voltage traces from soma and dend for cell 0</p>
        <p>Go to Plot Settings</p>
      </>
    ),
  }
  , {
    target: 'div.MuiAccordionSummary-root div.breadcrumb button.MuiButtonBase-root.MuiFab-root.MuiFab-sizeSmall.MuiFab-primary:not([id])',
    title: 'Plot Settings',
    content: (
      <>
        <p>Click the "+" to add settings for a new plot type</p>
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
        <p>Check the box next to "overlay data"</p>
      </>
    )
  },
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: 'Update and simulate network',
    content: (
      <>
        <p>Ok so now let's see the result of our changes!</p>
        <p>Click on UPDATE NETWORK</p>
      </>
    ),
  },
  //
  // run simulation
  //
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: 'Update and simulate network',
    content: (
      <>
        <p>Click SIMULATE</p>
        <p>Alternatively, in the menu bar, click Model and then Simulate network</p>
        <p>This will show the updated network where we can plot some of the simulation results</p>
      </>
    ),
  },
  //
  // plots
  //
  {
    target: 'img[src*="rasterPlot"]',
    title: 'Visualize the simulation results',
    content: (
      <>
        <p>Open the Raster plot panel</p>
        <p>You should see cell 0 spiking first due to the current injection stimulus (IClamp)</p>
        <p>Due to the connectivity we added, other cells will start firing next </p>

      </>
    ),
  },
  {
    target: 'img[src$="tracesPlot.svg"]',
    title: 'Visualize the simulation results',
    content: (
      <>
        <p>Open the Cell traces panel to see the voltages</p>
        <p>You should see the voltage at the soma and dendrite of cell 0 (notice we previously customized this particular plot)</p>
      </>
    ),
  },
  {
    target: 'img[src*="spikePlot"]',
    title: 'Visualize the simulation results',
    content: (
      <>
        <p>Open the Spike histogram panel</p>
        <p>This plot can be useful to analyze the network activity such as oscillations </p>
        <p>You can explore moving aroud and reshaping the plot tabs (drag from the tab title)</p>
      </>
    ),
  },
  //
  // Clear the GUI
  //
  {
    target: '#File',
    title: 'Clear the environment to prepare for the next model',
    content: (
      <>
        <p>To ensure there are no issues before trying the next model or tutorial we recommend clearing the environment (the Python Kernel) </p>
        <p>To do this, in the menu bar, select "File"</p>
      </>
    )
  },
  {
    target: '#New',
    title: 'Clear the environment to prepare for the next model',
    content: (
      <>
        <p>Then click on "New"</p>
      </>
    )
  },
  {
    target: '#appBarPerformActionButton',
    title: 'Clear the environment to prepare for the next model',
    content: (
      <>
      <p>Finally, click on "CREATE" to clear the kernel</p>
      <p>Congratulations! You have completed Tutorial 1! Plase check the next tutorial focused on importing morphologically realistic neurons! </p>
      </>
      )
  }
]
export default tutorial_steps;
