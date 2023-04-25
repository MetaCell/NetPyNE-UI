import React from 'react';
const tutorial2_steps = [
  {
    target: '#selectCellButton',
    title: (
      <div>Cell Creation</div>
    ),
    content: (
      <div>
        <p>We will create first a new cell using a cell template.</p>
        <p>Click on the "+" to create a new cell.</p>
      </div>
    )
  },
  {
    target: '#fromTemplateCellTemplate',
    title: (
      <div>Cell Creation</div>
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
      <div>Cell Creation</div>
    ),
    content: (
      <div>
        <p>Change the cell rule label to "PTcell"</p>
      </div>
    )
  },
  {
    target: '#importCellParamsCellName',
    title: (
      <div>Cell Creation</div>
    ),
    content: (
      <div>
        <p>Change the template/cell name to "PTcell"</p>
      </div>
    )
  },
  {
    target: '.fa-folder',
    title: (
      <div>Cell Creation</div>
    ),
    content: (
      <div>
        <p>Click on the folder icon to select the template:</p>
        <p> NetPyNE-UI &gt; workspace</p>
        <p> &gt; cells &gt; PTcells.hoc</p>
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
      <div>Cell Creation</div>
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
      <div>Cell Creation</div>
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
      <div>Cell Creation</div>
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
      <div>Cell Modifications</div>
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
      <div>Cell Modifications</div>
    ),
    content: (
      <div>
        <p>Click on "Section" to see all the sections of the cell.</p>
      </div>
    )
  },
  {
    target: '#selectCellButton',
    title: (
      <div>Cell Creation</div>
    ),
    content: (
      <div>
        <p>Go back to the cell creation and import a new one from a template as before.</p>
      </div>
    )
  },
  // New cell import
  {
    target: '#selectCellButton',
    title: (
      <div>Cell Creation</div>
    ),
    content: (
      <div>
        <p>We will create first a new cell using a cell template.</p>
        <p>Click on the "+" to create a new cell.</p>
      </div>
    )
  },
  {
    target: '#fromTemplateCellTemplate',
    title: (
      <div>Cell Creation</div>
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
      <div>Cell Creation</div>
    ),
    content: (
      <div>
        <p>Change the cell rule label to "SRI"</p>
      </div>
    )
  },
  {
    target: '#importCellParamsCellName',
    title: (
      <div>Cell Creation</div>
    ),
    content: (
      <div>
        <p>Change the template/cell name to "SRI"</p>
      </div>
    )
  },
  {
    target: '.fa-folder',
    title: (
      <div>Cell Creation</div>
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
      <div>Cell Creation</div>
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
      <div>Cell Creation</div>
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
      <div>Cell Creation</div>
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
      <div>Population Creation</div>
    ),
    content: (
      <div>
        <p>Click on "Populations" to create new cells populations.</p>
      </div>
    )
  }, //newPopulationButton
  {
    target: '#newPopulationButton',
    title: (
      <div>Population Creation</div>
    ),
    content: (
      <div>
        <p>Create a new population for PTcell</p>
      </div>
    )
  },
  {
    target: 'div.MuiBox-root.scrollbar.scrollchild > div.MuiBox-root > div',
    title: (
      <div>Population Creation</div>
    ),
    content: (
      <p>Change the population name to "E"</p>
    )
  },
  {
    target: 'div[id^="netParamspopParams"][id$="cellType"]',
    title: (
      <div>Population Creation</div>
    ),
    content: (
      <p>Select "PTcell"</p>
    )
  }, //netParamspopParamsPopulation0numCells
  {
    target: 'input[id^="netParamspopParams"][id$="numCells"]',
    title: (
      <div>Population Creation</div>
    ),
    content: (
      <p>Enter 2 as number of cells</p>
    )
  },
  {
    target: '#newPopulationButton',
    title: (
      <div>Population Creation</div>
    ),
    content: (
      <div>
        <p>Create a new population for SRI</p>
      </div>
    )
  },
  {
    target: 'div.MuiBox-root.scrollbar.scrollchild > div.MuiBox-root > div',
    title: (
      <div>Population Creation</div>
    ),
    content: (
      <p>Change the population name to "I"</p>
    )
  },
  {
    target: 'div[id^="netParamspopParams"][id$="cellType"]',
    title: (
      <div>Population Creation</div>
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
      <div>Population Creation</div>
    ),
    content: (
      <p>Select "SRI"</p>
    )
  },
  {
    target: 'input[id^="netParamspopParams"][id$="numCells"]',
    title: (
      <div>Population Creation</div>
    ),
    content: (
      <p>Enter 2 as number of cells</p>
    )
  },
  // Network creation
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: (
      <div>Creation</div>
    ),
    content: (
      <div>
        <p>Create now the network!</p>
      </div>
    )
  },
  {
    target: 'img[src*="experimentControlPanel"]',
    title: (
      <div>Visualization</div>
    ),
    content: (
      <div>
        <p>You can open the control panel to see the the cell population and identify them in the 3D view.</p>
      </div>
    )
  }
]
export default tutorial2_steps ;
