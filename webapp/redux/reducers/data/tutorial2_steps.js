import React from 'react';
const tutorial2_steps = [
  {
    target: '#selectCellButton',
    title: (
      <div>Import a detailed cell type (pyramidal neuron)</div>
    ),
    content: (
      <div>
        <p>In this tutorial we will import an existing cell type with a detailed morphology and biophysics.</p>
        <p>Specifically, we will import a  mouse motor cortex layer 5B pyramidal tract (PT) corticospinal neuron.</p>
        <p>Click on the "+" to create a new cell type.</p>
      </div>
    )
  },
  {
    target: '#fromTemplateCellTemplate',
    title: (
      <div>Import a detailed cell type (inhibitory interneuron)</div>
    ),
    content: (
      <div>
        <p>Select "Import cell template from file..."</p>
      </div>
    )
  },
  // Import cell values modification
  {
    target: '#importCellParamsRuleLabel',
    title: (
      <div>Import a detailed cell type (pyramidal neuron)</div>
    ),
    content: (
      <div>
        <p>Change the cell rule label to "PTcell"</p>
      </div>
    ),
    validation: 'PTcell'
  },
  {
    target: '#importCellParamsCellName',
    title: (
      <div>Import a detailed cell type (pyramidal neuron)</div>
    ),
    content: (
      <div>
        <p>Change the template/cell name to "PTcell"</p>
      </div>
    ),
    validation: 'PTcell'
  },
  {
    target: '.fa-folder',
    title: (
      <div>Import a detailed cell type (pyramidal neuron)</div>
    ),
    content: (
      <div>
        <p>Click on the folder icon to select the template:</p>
        <p> NetPyNE-UI &gt; workspace</p>
        <p> &gt; cells &gt; PTcell.hoc</p>
      </div>
    )
  },
  {
    target: '#browserAccept',
    content: (
      <div>
        <p>Select "NetPyNE-UI &gt; workspace &gt; cells &gt; PTcells.hoc"</p>
        <p>and click on "Select"</p>
      </div>
    )
  },
  {
    target: '.fa-folder',
    title: (
      <div>Import a detailed cell type (pyramidal neuron)</div>
    ),
    content: (
      <div>
        <p>Click on the folder icon to select the folder containing the "mod" file:</p>
        <p>"NetPyNE-UI &gt; workspace &gt; mod</p>
      </div>
    ),
    collectionIndex: 1
  },
  {
    target: '#browserAccept',
    content: (
      <div>
        <p>Select "NetPyNE-UI &gt; workspace &gt; mod"</p>
        <p>and click on "Select"</p>
      </div>
    )
  },
  {
    target: '#importCellParamsCompileMod',
    title: (
      <div>Import a detailed cell type (pyramidal neuron)</div>
    ),
    content: (
      <div>
        <p>Activate the compilation of mod files</p>
      </div>
    )
  },
  {
    target: '#appBarPerformActionButton',
    title: (
      <div>Import a detailed cell type (pyramidal neuron)</div>
    ),
    content: (
      <div>
        <p>Click on "Import" to import the cell template.</p>
      </div>
    )
  },
  {
    target: '#PTcell',
    title: (
      <div>Explore the imported cell</div>
    ),
    content: (
      <div>
        <p>Select the PT cell.</p>
      </div>
    )
  },
  {
    target: '#newSectionButton',
    title: (
      <div>Explore the imported cell</div>
    ),
    content: (
      <div>
        <p>Click on "Section" to see all the sections of the cell.</p>
        <p>You will see that it has hundreds of sections, including soma and basal and apicals dendrites.</p>
        <p>If you click on Mechs, you will be able to explore the ion channels in each section.</p>
        <p>You can of course modify any morphology and biophysical properties.</p>
      </div>
    )
  },
  {
    target: '#selectCellButton',
    title: (
      <div>Import a detailed cell type (inhibitory interneuron)</div>
    ),
    content: (
      <div>
        <p>Go back to the Import a detailed cell type (inhibitory interneuron) and import a new one from a template as before.</p>
      </div>
    )
  },
  // New cell import
  {
    target: '#selectCellButton',
    title: (
      <div>Import a detailed cell type (inhibitory interneuron)</div>
    ),
    content: (
      <div>
        <p>Next, we will import a second cell type, in this an inhibitory interneuron.</p>
        <p>Click on the "+" to create a new cell.</p>
      </div>
    )
  },
  {
    target: '#fromTemplateCellTemplate',
    title: (
      <div>Import a detailed cell type (inhibitory interneuron)</div>
    ),
    content: (
      <div>
        <p>Select "Import cell template from file..."</p>
      </div>
    )
  },
  // Template cell parameter modification
  {
    target: '#importCellParamsRuleLabel',
    title: (
      <div>Import a detailed cell type (inhibitory interneuron)</div>
    ),
    content: (
      <div>
        <p>Change the cell rule label to "SRI" (striatal cholinergice interneuron)</p>
      </div>
    ),
    validation: 'SRI'
  },
  {
    target: '#importCellParamsCellName',
    title: (
      <div>Import a detailed cell type (inhibitory interneuron)</div>
    ),
    content: (
      <div>
        <p>Change the template/cell name to "SRI"</p>
      </div>
    ),
    validation: 'SRI'
  },
  {
    target: '.fa-folder',
    title: (
      <div>Import a detailed cell type (inhibitory interneuron)</div>
    ),
    content: (
      <div>
        <p>Click on the folder icon to select the template:</p>
        <p> NetPyNE-UI &gt; workspace</p>
        <p> &gt; cells &gt; SRI.hoc</p>
      </div>
    )
  },
  {
    target: '#browserAccept',
    content: (
      <div>
        <p>Select "NetPyNE-UI &gt; workspace &gt; cells &gt; SRI.hoc"</p>
        <p>and click on "Select"</p>
      </div>
    )
  },
  {
    target: '.fa-folder',
    title: (
      <div>Import a detailed cell type (inhibitory interneuron)</div>
    ),
    content: (
      <div>
        <p>Click on the folder icon to select the folder containing the "mod" file:</p>
        <p>"NetPyNE-UI &gt; workspace &gt; mod</p>
      </div>
    ),
    collectionIndex: 1
  },
  {
    target: '#browserAccept',
    content: (
      <div>
        <p>Select "NetPyNE-UI &gt; workspace &gt; mod"</p>
        <p>and click on "Select"</p>
      </div>
    )
  },
  {
    target: '#importCellParamsCompileMod',
    title: (
      <div>Import a detailed cell type (inhibitory interneuron)</div>
    ),
    content: (
      <div>
        <p>Activate the compilation of mod files</p>
      </div>
    )
  },
  {
    target: '#appBarPerformActionButton',
    title: (
      <div>Import a detailed cell type (inhibitory interneuron)</div>
    ),
    content: (
      <div>
        <p>Click on "Import" to import the cell template.</p>
      </div>
    )
  },
  // New cell population
  {
    target: 'img[src*="popParams"]',
    title: (
      <div>Create two populations</div>
    ),
    content: (
      <div>
        <p>Now that we have defined 2 cell types, we can create the corresponding populations.</p>
        <p>Click on "Populations" to create new cells populations.</p>
      </div>
    )
  }, //newPopulationButton
  {
    target: '#newPopulationButton',
    title: (
      <div>Create two populations</div>
    ),
    content: (
      <div>
        <p>Create a new population for the PTcell</p>
      </div>
    )
  },
  {
    target: 'div.MuiBox-root.scrollbar.scrollchild > div.MuiBox-root > div',
    title: (
      <div>Create two populations</div>
    ),
    content: (
      <p>Change the population name to "E" for excitatory</p>
    ),
    validation: 'input[value="E"]'
  },
  {
    target: 'div[id^="netParamspopParams"][id$="cellType"]',
    title: (
      <div>Create two populations</div>
    ),
    content: (
      <p>Select "PTcell"</p>
    )
  }, //netParamspopParamsPopulation0numCells
  {
    target: 'input[id^="netParamspopParams"][id$="numCells"]',
    title: (
      <div>Create two populations</div>
    ),
    content: (
      <p>Enter 2 as number of cells.</p>,
      <p>Remember, this is just a toy model to illustrate how to import detailed cells.</p>
    ),
    validation: '2'
  },
  {
    target: '#newPopulationButton',
    title: (
      <div>Create two populations</div>
    ),
    content: (
      <div>
        <p>Create a new population for the inhibitory neuron, SRI</p>
      </div>
    )
  },
  {
    target: 'div.MuiBox-root.scrollbar.scrollchild > div.MuiBox-root > div',
    title: (
      <div>Create two populations</div>
    ),
    content: (
      <p>Change the population name to "I" (inhibitory)</p>
    ),
    validation: 'input[value="I"]'
  },
  {
    target: 'div[id^="netParamspopParams"][id$="cellType"]',
    title: (
      <div>Create two populations</div>
    ),
    content: (
      <p>Select the cell type</p>
    ),
    waitFor: 'click',
    grabGlobalClick: true
  },
  {
    target: 'li[data-value^="SRI"]',
    title: (
      <div>Create two populations</div>
    ),
    content: (
      <p>Select "SRI"</p>
    )
  },
  {
    target: 'input[id^="netParamspopParams"][id$="numCells"]',
    title: (
      <div>Create two populations</div>
    ),
    content: (
      <p>Enter 2 as number of cells</p>
    ),
    validation: '2'
  },
  // Network creation
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: (
      <div>Creation the network</div>
    ),
    content: (
      <div>
        <p>Click on the Create network button to generate the small toy network with detailed cells!</p>
      </div>
    )
  },
  {
    target: 'img[src*="experimentControlPanel"]',
    title: (
      <div>Visualize the cells</div>
    ),
    content: (
      <div>
        <p>Enjoy exploring the beautiful morphologies of these 4 detailed neurons.</p>
        <p>You can zoom in and out to see, for example, the detailed apical tuft dendrites.</p>
        <p>You can open the control panel to see the the cell population and identify them in the 3D view.</p>
        <p>...</p>
        <p>The tutorial ends here, but to see the cells in action go to the Examples menu and load Model 2.</p>
        <p>This includes the full toy model, with connectivity between the cells and stimulation.</p>
        <p>Once you simulate the model, you will be able to see the cell voltages and network spikes.</p>
        <p>Continue to tutorial 3 to discover how to create a multiscale cortical network with LFP recording and reaction-diffusion!</p>

      </div>
    )
  }
]
export default tutorial2_steps ;
