import React from 'react';
import HTMLViewer from './HTMLViewer';

const PlotViewer = ({ key, id, method }) => {
  const data = window.plotCache[id];

  if (method.plotMethod.startsWith('iplot')) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          textAlign: 'center',
        }}
      >
        <iframe
          title="plot"
          name="dipole"
          srcDoc={data}
          style={{
            border: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    );
  }
  return <HTMLViewer content={data} id={id} />;
};

export default PlotViewer;
