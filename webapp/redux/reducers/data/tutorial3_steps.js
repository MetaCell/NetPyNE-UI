import React from 'react';
const tutorial3_steps = [
  // Tutorial template selection
  {
    target: 'button[id="Examples"]',
    title: (
      <div>Tutorial Template Selection</div>
    ),
    content: (
      <div>
        <p>Open the "Examples" menu.</p>
      </div>
    )
  },
  {
    target: 'li[label*="3a:"]',
    title: (
      <div>Tutorial Template Selection</div>
    ),
    content: (
      <div>
        <p>Select the "Model 3a".</p>
      </div>
    )
  },
  // Create and Simulate
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: (
      <div>Creation</div>
    ),
    content: (
      <div>
        <p>Create/update the network to visualize its 3D representation and associate plots.</p>
      </div>
    )
  },
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: (
      <div>Simulation</div>
    ),
    content: (
      <div>
        <p>Simulate the network model.</p>
        <p>Please note that the simulation takes time and depends on the resources of the host machine.</p>
      </div>
    )
  },
  // Opening of the Different Plots
  {
    target: 'div[aria-disabled=false] img[src*="rasterPlot"]',
    title: (
      <div>Opening of the Different Plots</div>
    ),
    content: (
      <div>
        <p>Open the Raster Plot, the LFP Time Series Plot, the RxD Concentration Plot and the Spike History Plot.</p>
      </div>
    )
  },
  {
    target: 'div[aria-disabled=false] img[src*="LFPTimeSeriesPlot"]',
    title: (
      <div>Opening of the Different Plots</div>
    ),
    content: (
      <div>
        <p>LFP Time Series Plot.</p>
      </div>
    )
  },
  {
    target: 'div[aria-disabled=false] img[src*="rxdConcentrationPlot"]',
    title: (
      <div>Opening of the Different Plots</div>
    ),
    content: (
      <div>
        <p>RxD Concentration Plot.</p>
      </div>
    )
  },
  {
    target: 'div[aria-disabled=false] img[src*="spikePlot"]',
    title: (
      <div>Opening of the Different Plots</div>
    ),
    content: (
      <div>
        <p>Spike History Plot.</p>
      </div>
    )
  },
  // Go back to edit
  {
    target: 'div [class*="SwitchPageButton"] .MuiButton-root',
    title: (
      <div>Model and Parameter Modifications</div>
    ),
    content: (
      <div>
        <p>Go back to the network edition.</p>
      </div>
    )
  },
  // RxD Configuration Modification
  {
    target: 'div[aria-disabled=false] img[src*="rxd.svg"]',
    title: (
      <div>RxD Configuration Modification</div>
    ),
    content: (
      <div>
        <p>Select the RxD Configuration.</p>
      </div>
    )
  },
  {
    target: 'button.MuiTab-labelIcon:nth-child(2)',
    title: (
      <div>RxD Configuration Modification</div>
    ),
    content: (
      <div>
        <p>Click on "Species".</p>
      </div>
    )
  },
  {
    target: '#ip3',
    title: (
      <div>RxD Configuration Modification</div>
    ),
    content: (
      <div>
        <p>Select IP3 to increate the initial concentration.</p>
      </div>
    )
  },
  {
    target: '#netParamsrxdParamsspeciesip3initial',
    title: (
      <div>RxD Configuration Modification</div>
    ),
    content: (
      <div>
        <p>Increase the initial concentration to 0.1.</p>
      </div>
    ),
    waitFor: 'fieldEdition'
  },
  // Update the model
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: (
      <div>Updating</div>
    ),
    content: (
      <div>
        <p>Update the network model.</p>
      </div>
    )
  },
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: (
      <div>Simulation</div>
    ),
    content: (
      <div>
        <p>And simulate the modified network model.</p>
        <p>Please note that the simulation takes time and depends on the resources of the host machine.</p>
      </div>
    )
  },
  // ReOpen the plots
  // {
  //   target: 'div[aria-disabled=false] img[src*="rasterPlot"]',
  //   title: (
  //     <div>Plots Display</div>
  //   ),
  //   content: (
  //     <div>
  //       <p>Reopen the Raster Plot, the LFP Time Series Plot, the RxD Concentration Plot and the Spike History Plot to see how the plots are impatected by the modification.</p>
  //     </div>
  //   )
  // },
  {
    target: 'img[src*="rasterPlot"]',
    title: (
      <div>Plots Display</div>
    ),
    content: (
      <div>
        <p>Reopen the different plots to see how they are impatected by the modification.</p>
        <p>Open the Raster Plot, the LFP Time Series Plot, the RxD Concentration Plot and the Spike History Plot.</p>
      </div>
    )
  },
  {
    target: 'img[src*="LFPTimeSeriesPlot"]',
    title: (
      <div>Plots Display</div>
    ),
    content: (
      <div>
        <p>LFP Time Series Plot.</p>
      </div>
    )
  },
  {
    target: 'img[src*="rxdConcentrationPlot"]',
    title: (
      <div>Plots Display</div>
    ),
    content: (
      <div>
        <p>RxD Concentration Plot.</p>
      </div>
    )
  },
  {
    target: 'img[src*="spikePlot"]',
    title: (
      <div>Plots Display</div>
    ),
    content: (
      <div>
        <p>Spike History Plot.</p>
      </div>
    )
  },
]
export default tutorial3_steps ;


// .MuiGrid-item .MuiButton-root:nth-last-child(2)  => CREATE_NETWORK/SIMULATE
// div [class*='SwitchPageButton'] .MuiButton-root  => BACK TO EDIT

// .flexlayout__layout .flexlayout__tab_button_top:nth-child(2) ??

// li[label*='Tut 3a:'

// div[aria-disabled=false] img[src*='rasterPlot']  => raster plot
// div[aria-disabled=false] img[src*='rxd']