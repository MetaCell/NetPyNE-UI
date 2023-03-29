import React from 'react';
const tutorial3_steps = [
  {
    target: 'button[id="Template models"]',
    content: (
      <div>
        <p>Open the tutorial menu.</p>
      </div>
    )
  },
  {
    target: 'li[label*="Model 3a:"]',
    content: (
      <div>
        <p>Select the tutorial 3a.</p>
      </div>
    )
  },
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    content: (
      <div>
        <p>Create/update the network to visualize its 3D representation and associate plots.</p>
      </div>
    )
  },
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    content: (
      <div>
        <p>Simulate the network model.</p>
        <p>Please note that the simulation takes time and depends on the resources of the host machine.</p>
      </div>
    )
  },
  {
    target: 'div[aria-disabled=false] img[src*="rasterPlot"]',
    content: (
      <div>
        <p>Open the Raster Plot, the LFP Time Series Plot, the RxD Concentration Plot and the Spike History Plot.</p>
      </div>
    )
  },
  {
    target: 'div[aria-disabled=false] img[src*="LFPTimeSeriesPlot"]',
    content: (
      <div>
        <p>LFP Time Series Plot.</p>
      </div>
    )
  },
  {
    target: 'div[aria-disabled=false] img[src*="rxdConcentrationPlot"]',
    content: (
      <div>
        <p>RxD Concentration Plot.</p>
      </div>
    )
  },
  {
    target: 'div[aria-disabled=false] img[src*="spikePlot"]',
    content: (
      <div>
        <p>Spike History Plot.</p>
      </div>
    )
  },
  {
    target: 'div [class*="SwitchPageButton"] .MuiButton-root',
    content: (
      <div>
        <p>Go back to the network edition.</p>
      </div>
    )
  },
  {
    target: 'div[aria-disabled=false] img[src*="rxd"]',
    content: (
      <div>
        <p>Select the RxD Configuration.</p>
      </div>
    )
  },
  {
    target: 'button.MuiTab-labelIcon:nth-child(2)',
    content: (
      <div>
        <p>Click on "Species".</p>
      </div>
    )
  },
  {
    target: '#ip3',
    content: (
      <div>
        <p>Select IP3 to increate the initial concentration.</p>
      </div>
    )
  },
  {
    target: '#netParamsrxdParamsspeciesip3initial',
    content: (
      <div>
        <p>Increase the initial concentration to 0.1.</p>
      </div>
    )
  },
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    content: (
      <div>
        <p>Update the network model.</p>
      </div>
    )
  },
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    content: (
      <div>
        <p>And simulate the modified network model.</p>
        <p>Please note that the simulation takes time and depends on the resources of the host machine.</p>
      </div>
    )
  },
  {
    target: 'div[aria-disabled=false] img[src*="rasterPlot"]',
    content: (
      <div>
        <p>Reopen the Raster Plot, the LFP Time Series Plot, the RxD Concentration Plot and the Spike History Plot to see how the plots are impatected by the modification.</p>
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