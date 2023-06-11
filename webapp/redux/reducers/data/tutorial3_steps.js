import React from 'react';
const tutorial3_steps = [
  // Load Multiscale Network (Tutorial 3)
  {
    target: 'button[id="Examples"]',
    title: (
      <div>Load Multiscale Network (Tutorial 3)</div>
    ),
    content: (
      <div>
        <p>In this final tutorial we will examine a toy model of a cortical network.</p>
        <p>The model includes 3 cortical layers, neurons with reaction-diffusion and calculation of local field potentials (LFPs) .</p>
        <p>We will see how modifying a parameter at the molecular scale affects the cell and network firing and LFP scales.</p>
        <p>...</p>
        <p>Start by opening the "Examples" menu.</p>
      </div>
    )
  },
  {
    target: 'li[label*="3a:"]',
    title: (
      <div>Load Multiscale Network (Tutorial 3)</div>
    ),
    content: (
      <div>
        <p>Select the "Model 3a".</p>
      </div>
    )
  },

  // Explore the network
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)', // NEEDS UPDATING !!!
    title: (
      <div>Explore the network </div>
    ),
    content: (
      <div>
        <p>Click on the populations panel to explore the 6 populations in the network.</p>
        <p>We have excitatory (E) and inhibitory (I) population in layers 2, 4 and 5.</p>
        <p>Select any of the populations and click on "Spatial Distribution"</p>
        <p>Here you will see how the Y-axis range defines the cortical depth of that layer.</p>
      </div>
    )
  },

  // Create and Simulate
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: (
      <div>Create the network </div>
    ),
    content: (
      <div>
        <p>Click on create/update the network to visualize its 3D representation and associate plots.</p>
        <p>You can then use the Control Panel icon to color different populations.</p>
      </div>
    )
  },
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: (
      <div>Simulate the network</div>
    ),
    content: (
      <div>
        <p>Now simulate the network model.</p>
        <p>Please note that the simulation will take some time as these cells include a reaction-diffusion component.</p>
      </div>
    )
  },
  // Opening of the Different Plots
  {
    target: 'div[aria-disabled=false] img[src*="rasterPlot"]',
    title: (
      <div>Visualize the simulation results</div>
    ),
    content: (
      <div>
        <p>We will open different plots to visualize the network activity.</p>
        <p>Note that the network shows some synchronized activity (oscillations) across layers. </p>
        <p>This can be seen in the spike raster plot, spike histogram and LFP.</p>
        <p>We will also visualize the intracellular and extracellular concentration of Calcium.</p>
        <p>Calcium concentration affects the activity of the neurons.</p>

      </div>
    )
  },

  {
    target: 'div[aria-disabled=false] img[src*="spikePlot"]', // NEEDS UPDATING !!!
    title: (
      <div>Visualize the simulation results</div>
    ),
    content: (
      <div>
        <p>Open the Cell Traces Plot.</p>
        <p>Notice the intra- and extracelullar concentration of Calcium.</p>
      </div>
    )
  },
  {
    target: 'div[aria-disabled=false] img[src*="rxdConcentrationPlot"]',
    title: (
      <div>Visualize the simulation results</div>
    ),
    content: (
      <div>
        <p>Open the RxD Concentration Plot.</p>
        <p>In this 2D view, the extracellular regions around cell locations show decreased Calcium concentration.</p>
      </div>
    )
  },
  {
    target: 'div[aria-disabled=false] img[src*="spikePlot"]', // NEEDS UPDATING !!!
    title: (
      <div>Visualize the simulation results</div>
    ),
    content: (
      <div>
        <p>Open the Spike Raster Plot.</p>
        <p>Play around dragging plots in the Flex Layout so you can visualize all at the same time.</p>
      </div>
    )
  },
  {
    target: 'div[aria-disabled=false] img[src*="spikePlot"]',
    title: (
      <div>Visualize the simulation results</div>
    ),
    content: (
      <div>
        <p>Open the Spike Histogram Plot.</p>
      </div>
    )
  },
  {
    target: 'div[aria-disabled=false] img[src*="LFPTimeSeriesPlot"]',
    title: (
      <div>Visualize the simulation results</div>
    ),
    content: (
      <div>
        <p>Open the LFP Time Series Plot.</p>
        <p>Notice the network oscillations in both the spiking and LFP plots.</p>
      </div>
    )
  },

  // Go back to edit
  {
    target: 'div [class*="SwitchPageButton"] .MuiButton-root',
    title: (
      <div>RxD parameter modification</div>
    ),
    content: (
      <div>
        <p>We are now going to modify an RxD molecular scale parameter to see how it affects network activity.</p>
        <p>Pyramidal neurons have the following RxD reaction:
        <p>1) metabotropic glutamatergic receptor (mGLuR) gets activated (not part of model)</p>
        <p>2) cytosol IP3 increases (we will model this change directly)</p>
        <p>3) endoplasmic reticulum (ER) IP3 receptors open</p>
        <p>4) ER calcium released to cytosol</p>
        <p>5) calcium-dependent potassium (kBk/Kca) channels open  </p>
        <p>6) potassium (K) flows inside the cell </p>
        <p>7) hyperpolarizing K current reduces cell firing </p>
        <p>So by increasing the initial concentration of IP3, we should reduce the network activity... </p>
        <p>Let's try that! </p>
        </p>
        <p>Click on Go Back to Edit.</p>
      </div>
    )
  },
  // RxD Configuration Modification
  {
    target: 'div[aria-disabled=false] img[src*="rxd.svg"]',
    title: (
      <div>RxD parameter modification</div>
    ),
    content: (
      <div>
        <p>Select the Reaction-Diffusion panel.</p>
      </div>
    )
  },
  {
    target: 'button.MuiTab-labelIcon:nth-child(2)',
    title: (
      <div>RxD parameter modification</div>
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
      <div>RxD parameter modification</div>
    ),
    content: (
      <div>
        <p>Select the IP3 species.</p>
      </div>
    )
  },
  {
    target: '#netParamsrxdParamsspeciesip3initial',
    title: (
      <div>RxD parameter modification</div>
    ),
    content: (
      <div>
        <p>Increase the IP3 initial concentration from 0 to 0.1 </p>
      </div>
    ),
    waitFor: 'fieldEdition',
    validation: '0.1'
  },
  // Update the model
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: (
      <div>Update the network model</div>
    ),
    content: (
      <div>
        <p>Click on Create or Update the network model.</p>
      </div>
    )
  },
  {
    target: '.MuiGrid-item .MuiButton-root:nth-last-child(2)',
    title: (
      <div>Simulate the network model</div>
    ),
    content: (
      <div>
        <p>And simulate the modified network model.</p>
        <p>As mentioned before, the simulation may take a few minutes due to the RxD component.</p>
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
        <p>Reopen the different plots to see how the modification of IP3 concentration has impacted the network activity.</p>
        <p>Open the Cell Traces, RxD Concentration Plot, Raster Plot, Spike Histogram Plot, LFP Time Series Plot, and </p>
      </div>
    )
  },
  {
    target: 'div[aria-disabled=false] img[src*="spikePlot"]', // NEEDS UPDATING !!!
    title: (
      <div>Visualize the simulation results</div>
    ),
    content: (
      <div>
        <p>Open the Cell Traces Plot.</p>
        <p>Notice the higher intracellular concentration of Calcium and the spiking dies off after 500ms.</p>
      </div>
    )
  },
  {
    target: 'div[aria-disabled=false] img[src*="rxdConcentrationPlot"]',
    title: (
      <div>Visualize the simulation results</div>
    ),
    content: (
      <div>
        <p>Open the RxD Concentration Plot.</p>
      </div>
    )
  },
  {
    target: 'div[aria-disabled=false] img[src*="spikePlot"]', // NEEDS UPDATING !!!
    title: (
      <div>Visualize the simulation results</div>
    ),
    content: (
      <div>
        <p>Open the Spike Raster Plot.</p>
        <p>Notice how the network activity decreases after 500ms.</p>
      </div>
    )
  },
  {
    target: 'div[aria-disabled=false] img[src*="spikePlot"]',
    title: (
      <div>Visualize the simulation results</div>
    ),
    content: (
      <div>
        <p>Open the Spike Histogram Plot.</p>
        <p>Notice how the network activity decreases after 500ms.</p>
      </div>
    )
  },
  {
    target: 'div[aria-disabled=false] img[src*="LFPTimeSeriesPlot"]',
    title: (
      <div>Visualize the simulation results</div>
    ),
    content: (
      <div>
        <p>Open the LFP Time Series Plot.</p>
        <p>Similarly, after 500ms the LFP amplitude decreases, as a result of increasing the IP3 concentration. </p>
        <p>This demonstrates a multiscale interaction between molecular properties and LFP activity in a toy cortical network model.</p>
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