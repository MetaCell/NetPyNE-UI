import React from 'react';

import Divider from '@material-ui/core/Divider';
import { bgRegular, bgDark, font, primaryColor, gutter, radius } from '../../theme'

import { openTopbarDialog, changePageTransitionMode } from '../../redux/actions/topbar'
import {
  openDialog, loadTutorial, 
  changeAutomaticInstantiation, 
  changeAutomaticSimulation, 
  createAndSimulateNetwork, 
  createNetwork, 
  simulateNetwork, 
  editModel, 
  showNetwork 
} from '../../redux/actions/general'
import { TOPBAR_CONSTANTS, MODEL_STATE } from '../../constants'

const checkedIcon = "fa fa-check secondary";
const unCheckedIcon = "fa fa-check color-dark";

const style = {
  standard: {
    background: bgRegular,
    borderRadius: 0,
    border: 0,
    boxShadow: '0px 0px',
    color: '#ffffff',
    paddingLeft: `calc(${gutter} * 2)`,
    paddingRight: `calc(${gutter} * 2)`,
    fontSize: 16,
    fontWeight: 400,
    fontFamily: font,
    margin: '0px 0px 0px 0px',
    height: '100%',
    borderLeft: 0,
    borderRight: 0,
    borderBottom: 0,
    textTransform: 'capitalize',
    textAlign: 'left',
    justifyContent: 'start',

    'hr': {}

  },
  lighter: { background: primaryColor },
  padding: {
    fontSize: 16,
    paddingTop: `calc(${gutter} / 2)`,
    paddingBottom: `calc(${gutter} / 2)`
  }

}

const topLevelMenuItemStyle = {
  standard: { background: 'transparent', },
  hover: {},
};

const firstItemCustom = { fontWeight: 'bold', paddingLeft: `calc(${gutter} / 2)` }

const firstItemStyle = { standard: { ...topLevelMenuItemStyle.standard, ...firstItemCustom }, hover: { ...topLevelMenuItemStyle.hover, ...firstItemCustom } }


const tutorialsList = {
  "tut1": "Tut 1: Simple cell network",
  "tut2": "Tut 2: Detailed cell network",
  "tut3": "Tut 3: Multiscale network",
  "tut3_ip3high": "Tut 3: Multiscale network (high IP3)"
}

export const getTutorials = () => {
  const { tuts } = window
  if (!tuts) {
    return []
  }
  return tuts.sort().map(tutFile => {
    let tutName = tutFile.replace(".py", "").replace("gui", '').replace("_", "");
    let tutLabel = tutorialsList[tutName] !== undefined ? tutorialsList[tutName] : tutName;
    return {
      label: tutLabel,
      icon: "",
      action: {
        handlerAction: "redux",
        parameters: [loadTutorial, tutFile]
      }
    }
  })
  
}

export default {
  global: {
    color: "white",
    subMenuOpenOnHover: true,
    menuOpenOnClick: true,
    menuPadding: 0,
    fontFamily: font,
    menuFontSize: "14",
    subMenuFontSize: "12",
    background: bgRegular,
    buttonsStyle: {
      standard: style.standard,
      hover: {
        ...style.standard,
        ...style.lighter
      }
    },
    labelsStyle: {
      standard: { ...style.padding, },
      hover: {
        ...style.lighter,
        ...style.padding
      }
    },
    drawersStyle: {
      standard: {
        top: 10,
        backgroundColor: bgDark,
        borderRadius: 0,
        color: '#ffffff',
        fontSize: 14,
        fontFamily: font,
        minWidth: 110,
        borderLeft: 0,
        borderRight: 0,
        borderBottom: 0,
        borderBottomLeftRadius: radius,
        borderBottomRightRadius: radius,
      }
    },
  },
  itemOptions: { customArrow: <i className="fa fa-caret-right menu-caret" /> },
  buttons: [
    {
      label: "NetPyNE",
      position: "bottom-start",
      icon: "",
      list: [
        {
          label: "About",
          icon: "",
          action: {
            handlerAction: "redux",
            parameters: [openDialog, { title: "About", message: "This is about tab" }]
          }
        },
        {
          label: "Contribute",
          icon: "",
          action: {
            handlerAction: "redux",
            parameters: [openDialog, { title: "Contribute", message: "This is Contribute tab" }]
          }
        },
      ],
      style: firstItemStyle
    },
    {
      label: "File",
      position: "bottom-start",
      icon: "",
      style: topLevelMenuItemStyle,
      list: [
        {
          label: "New",
          icon: "",
          list: [
            {
              label: "Blank",
              icon: "",
              action: {
                handlerAction: "redux",
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.NEW_MODEL]
              }
            }
          ]
        },
        {
          label: "Open...",
          icon: "",
          action: {
            handlerAction: 'redux',
            parameters: [openTopbarDialog, TOPBAR_CONSTANTS.LOAD]
          }
        },
        {
          label: "Save...",
          icon: "",
          action: {
            handlerAction: 'redux',
            parameters: [openTopbarDialog, TOPBAR_CONSTANTS.SAVE]
          }
        },
        {
          label: "Import",
          icon: "",
          list: [
            {
              label: "From python...",
              icon: "",
              action: {
                handlerAction: "redux",
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.IMPORT_HLS]
              }
            }
          ]
        },
        {
          label: "Export",
          icon: "",
          list: [
            {
              label: "To python...",
              icon: "",
              action: {
                handlerAction: 'redux',
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.EXPORT_HLS]
              }
            },
          ]
        },
        {
          label: "Workspace",
          icon: "",
          list: [
            {
              label: "Upload...",
              icon: "",
              action: {
                handlerAction: "redux",
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.UPLOAD_FILES]
              }
            },
            {
              label: "Download...",
              icon: "",
              action: {
                handlerAction: "redux",
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.DOWNLOAD_FILES]
              }
            }
          ]
        },
      ]
    },
    {
      label: "View",
      icon: "",
      position: "bottom-start",
      style: topLevelMenuItemStyle,
      dynamicListInjector: {
        handlerAction: "menuInjector",
        parameters: ["View"]
      }
    },
    
    {
      label: "Model",
      icon: "",
      position: "bottom-start",
      style: topLevelMenuItemStyle,
      dynamicListInjector: {
        handlerAction: "menuInjector",
        parameters: ["Model"]
      }
    },
    {
      label: "Tutorials",
      icon: "",
      position: "bottom-start",
      style: topLevelMenuItemStyle,
      dynamicListInjector: {
        handlerAction: "menuInjector",
        parameters: ["Tutorials"]
      }
    },
    {
      label: "Help",
      icon: "",
      position: "bottom-start",
      style: topLevelMenuItemStyle,
      list: [
        {
          label: "Documentation",
          icon: "",
          action: {
            handlerAction: TOPBAR_CONSTANTS.NEW_PAGE,
            parameters: ["http://netpyne.org/"]
          }
        }
      ]
    },
  ]
}

export const getViewMenu = props => {
  const instantiate = props.automaticInstantiation || props.modelState == MODEL_STATE.NOT_INSTANTIATED;
  const networkAction = () => {
    if (instantiate && props.automaticSimulation) {
      return createAndSimulateNetwork;
    } else if (instantiate) {
      return createNetwork;
    } else {
      return showNetwork;
    }
  }
  
  return [
    {
      label: "Edit",
      icon: props.editMode ? checkedIcon : 'fa',
      action: {
        handlerAction: "redux",
        parameters: [editModel]
      }
      
    },
    {
      label: "Explore",
      icon: !props.editMode ? checkedIcon : 'fa',
      action: {
        handlerAction: "redux",
        parameters: [networkAction()]
      }
    },
  ];
}

export const getModelMenu = props => (
  [
    {
      label: TOPBAR_CONSTANTS.CREATE_NETWORK,
      className: "topbar-menu-item",
      action: {
        handlerAction: "redux",
        parameters: [createNetwork]
      }
    },
    {
      label: TOPBAR_CONSTANTS.SIMULATE,
      action: {
        handlerAction: "redux",
        parameters: [props.modelState == MODEL_STATE.NOT_INSTANTIATED ? createAndSimulateNetwork : simulateNetwork]
      }
    },
    {
      label: "Explore view options",
      list: [
        {
          label: "Automatic instantiation",
          icon: props.automaticInstantiation ? checkedIcon : 'fa',
          action: {
            handlerAction: "redux",
            parameters: [changeAutomaticInstantiation, true]
          }
        },
        {
          label: "Manual instantiation",
          icon: !props.automaticInstantiation ? checkedIcon : 'fa',
          action: {
            handlerAction: "redux",
            parameters: [changeAutomaticInstantiation, false]
          }
        },
        <Divider />,
        {
          label: "Automatic simulation",
          icon: props.automaticSimulation ? checkedIcon : 'fa',
          action: {
            handlerAction: "redux",
            parameters: [changeAutomaticSimulation, true]
          }
        },
        {
          label: "Manual simulation",
          icon: !props.automaticSimulation ? checkedIcon : 'fa',
          action: {
            handlerAction: "redux",
            parameters: [changeAutomaticSimulation, false]
          }
        },
      ]
    },
    
  ]
)
