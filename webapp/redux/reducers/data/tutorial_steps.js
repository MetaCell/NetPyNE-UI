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
    target: '#selectCellButton',
    content: (
      <div>
        <p>Click on CellType0 and the panel on the right will appear</p>
        <p>Rename the cell type: “pyr” for pyramidal</p>
      </div>
    )
  },
  {
    target: '#selectCellButton',
    content: (
      <div>
        <p>Click on Section to see the sections that make up this imported cell type</p>
      </div>
    )
  },
  {
    target: '#selectCellButton',
    content: (
      <div>
        <p>Explore the sections, their mechanisms, geometry, etc.</p>
      </div>
    )
  },
  {
    target: '#selectCellButton',
    content: (
      <div>
        <p>Click on the Populations tab or its icon in the sidebar</p>
      </div>
    )
  },
  {
    target: '#selectCellButton',
    content: (
      <div>
        <p>Click on the + above Population</p>
      </div>
    )
  },
]
export default tutorial_steps ;