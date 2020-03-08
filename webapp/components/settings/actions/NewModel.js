import React from 'react';
import ActionDialog from './ActionDialog';

export default class NewModel extends React.Component {
  constructor (props) {
    super(props);
  }

  render () { 
    return (
      <ActionDialog
        command ={"netpyne_geppetto.deleteModel"}
        message = {"CREATING NEW MODEL"}
        style={{ textAlign: "center" }}
        args = {{ tab: 'define', action: 'deleteModel' }}
        buttonLabel={"CREATE"}
        title={"Create new model"}
        {...this.props}
      >
        <h4>The current model will be deleted</h4> 
      </ActionDialog>
    )
  }
}