import * as React from 'react';

import Icon from '@material-ui/core/Icon'

export default class TabsetIconFactory {

  factory(widgetConfig) {
    return this.createIcon(widgetConfig.icon)
  }

  createIcon(iconName) {
    return <Icon className={iconName}/>
  }
}
