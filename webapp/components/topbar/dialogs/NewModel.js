import React from 'react';

import { ActionDialog } from 'netpyne/components'
export default class NewModel extends React.Component {
  constructor (props) {
    super(props);
  }

  render () { 
    return (
      <ActionDialog
        message = {"Creating new model..."}
        style={{ textAlign: "center" }}
        args = {{ tab: 'define', action: 'deleteModel' }}
        buttonLabel={"CREATE"}
        title={"Create new model"}
        {...this.props}
      >
        <h4 style={{ color: 'white' }}>The current model will be deleted</h4> 
      </ActionDialog>
    )
  }
}