import React from 'react';

import { ActionDialog } from 'netpyne/components';

export default class OverwriteModel extends React.Component {
  render () {
    return (
      <ActionDialog
        message="Overwrite model..."
        style={{ textAlign: 'center' }}
        args={{
          tab: 'define',
          action: 'deleteModel',
        }}
        buttonLabel="SAVE"
        title="Save new model"
        {...this.props}
      >
        <h4 style={{ color: 'white' }}>The current model will be overwritten</h4>
      </ActionDialog>
    );
  }
}
