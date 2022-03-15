import React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import HTMLViewer from './HTMLViewer';

const PlotViewer = ({ key, id, method }) => {
  const data = window.plotCache[id];

  if (method.plotMethod.startsWith('iplot')) {
    return (
      <ReactResizeDetector>
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
      </ReactResizeDetector>
    );
  }
  return (
    <ReactResizeDetector>
      <HTMLViewer content={data} id={id} />
    </ReactResizeDetector>
  );
};

export default PlotViewer;
