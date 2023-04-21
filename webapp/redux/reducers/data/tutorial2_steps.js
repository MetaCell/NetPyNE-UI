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
    target: '#importCellParamsFileName',
    title: (
      <div>Cell Creation</div>
    ),
    content: (
      <div>
        <p>Click on the folder icon to select the template:</p>
        <p> NetPyNE tutorials &gt; netpyne_workspace-master</p>
        <p> &gt; cells &gt; PTcells.hoc</p>
      </div>
    )
  },
  // {
  //   target: '#TreeContainerCutting_component',
  //   content: (
  //     <div>
  //       <p>Select "NetPyNE tutorials &gt; netpyne_workspace-master &gt; cells &gt; PTcells.hoc".</p>
  //     </div>
  //   )
  // },
  {
    target: '#importCellParamsModFolder',
    title: (
      <div>Cell Creation</div>
    ),
    content: (
      <div>
        <p>Click on the folder icon to select the folder containing the "mod" file:</p>
        <p>"NetPyNE-UI &gt; workspace &gt; mod</p>
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
  // {
  //   target: '#TreeContainerCutting_component',
  //   content: (
  //     <div>
  //       <p>Select "NetPyNE tutorials &gt; netpyne_workspace-master &gt; mod".</p>
  //     </div>
  //   )
  // },
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
  {
    target: '#importCellParamsFileName',
    title: (
      <div>Cell Creation</div>
    ),
    content: (
      <div>
        <p>Click on the folder icon to select the template.</p>
      </div>
    )
  },
  {
    target: '#TreeContainerCutting_component',
    title: (
      <div>Cell Creation</div>
    ),
    content: (
      <div>
        <p>Select "NetPyNE tutorials &gt; netpyne_workspace-master &gt; cells &gt; SRI.hoc".</p>
      </div>
    )
  },
  {
    target: '#importCellParamsModFolder',
    title: (
      <div>Cell Creation</div>
    ),
    content: (
      <div>
        <p>Click on the folder icon to select the folder containing the "mod" file.</p>
      </div>
    )
  },
  {
    target: '#TreeContainerCutting_component',
    title: (
      <div>Cell Creation</div>
    ),
    content: (
      <div>
        <p>Select, as for the last created cell:</p>
        <p>"NetPyNE tutorials &gt; netpyne_workspace-master &gt; mod".</p>
      </div>
    )
  },
  {
    target: 'img[src*="popParams"]',
    title: (
      <div>Population Update</div>
    ),
    content: (
      <div>
        <p>Click on "Populations" to change cells populations.</p>
      </div>
    )
  },
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
