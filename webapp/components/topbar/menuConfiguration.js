import React from 'react';
import {
  bgRegular, bgDark, font, primaryColor, gutter, radius,
} from '../../theme';

import { openTopbarDialog } from '../../redux/actions/topbar';
import {
  openDialog, loadTutorial,
  createAndSimulateNetwork,
  createNetwork,
  simulateNetwork,
  editModel,
  showNetwork,
  setTheme,
} from '../../redux/actions/general';
import {
  MODEL_STATE,
  TOPBAR_CONSTANTS, THEMES, TUTORIALS_LIST,
} from '../../constants';
import { openLaunchDialog } from '../../redux/actions/experiments';

const checkedIcon = 'fa fa-check secondary';

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

    hr: {},

  },
  lighter: { background: primaryColor },
  padding: {
    fontSize: 16,
    paddingTop: `calc(${gutter} / 2)`,
    paddingBottom: `calc(${gutter} / 2)`,
  },

};

const topLevelMenuItemStyle = {
  standard: { background: 'transparent' },
  hover: {},
};

const firstItemCustom = {
  fontWeight: 'bold',
  paddingLeft: `calc(${gutter} / 2)`,
};

const firstItemStyle = {
  standard: { ...topLevelMenuItemStyle.standard, ...firstItemCustom },
  hover: { ...topLevelMenuItemStyle.hover, ...firstItemCustom },
};

export const getTutorials = () => {
  const { tuts } = window;
  if (!tuts) {
    return [];
  }
  return tuts.sort()
    .map((tutFile) => {
      const tutName = tutFile.split("/").pop().replace('.py', '')
        .replace('gui', '')
        .replace('_', '');
      const tutLabel = TUTORIALS_LIST[tutName] !== undefined ? TUTORIALS_LIST[tutName] : tutName;
      return {
        label: tutLabel,
        icon: '',
        action: {
          handlerAction: 'handleTutorial',
          parameters: [loadTutorial, tutFile],
        },
      };
    });
};

export default {
  global: {
    color: 'white',
    subMenuOpenOnHover: true,
    menuOpenOnClick: true,
    menuPadding: 0,
    fontFamily: font,
    menuFontSize: '14',
    subMenuFontSize: '12',
    background: bgRegular,
    buttonsStyle: {
      standard: style.standard,
      hover: {
        ...style.standard,
        ...style.lighter,
      },
    },
    labelsStyle: {
      standard: { ...style.padding },
      hover: {
        ...style.lighter,
        ...style.padding,
      },
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
      },
    },
  },
  itemOptions: { customArrow: <i className="fa fa-caret-right menu-caret" /> },
  buttons: [
    {
      label: 'NetPyNE',
      icon: '',
      position: 'bottom-start',
      style: firstItemStyle,
      dynamicListInjector: {
        handlerAction: 'menuInjector',
        parameters: ['NetPYNE'],
      },
    },
    {
      label: 'File',
      position: 'bottom-start',
      icon: '',
      style: topLevelMenuItemStyle,
      list: [
        {
          label: 'New',
          icon: '',
          action: {
            handlerAction: 'redux',
            parameters: [openTopbarDialog, TOPBAR_CONSTANTS.NEW_MODEL],
          },
        },
        {
          label: 'Open...',
          icon: '',
          action: {
            handlerAction: 'redux',
            parameters: [openTopbarDialog, TOPBAR_CONSTANTS.LOAD_INDEX_WORKSPACE],
          },
        },
        {
          label: 'Save...',
          icon: '',
          action: {
            handlerAction: 'redux',
            parameters: [openTopbarDialog, TOPBAR_CONSTANTS.SAVE_INDEX_WORKSPACE],
          },
        },
        {
          label: 'Legacy',
          icon: '',
          list: [
            {
              label: 'Open...',
              icon: '',
              action: {
                handlerAction: 'redux',
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.LOAD],
              },
            },
            {
              label: 'Save...',
              icon: '',
              action: {
                handlerAction: 'redux',
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.SAVE],
              },
            },
          ],
        },
        {
          label: 'Import',
          icon: '',
          list: [
            {
              label: 'From python...',
              icon: '',
              action: {
                handlerAction: 'redux',
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.IMPORT_HLS],
              },
            },
            {
              label: 'From NeuroML2 (beta)...',
              icon: '',
              action: {
                handlerAction: 'redux',
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.IMPORT_NEUROML],
              },
            },
            {
              label: 'From LEMS Simulation  (beta)...',
              icon: '',
              action: {
                handlerAction: 'redux',
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.IMPORT_LEMS],
              },
            },
          ],
        },
        {
          label: 'Export',
          icon: '',
          list: [
            {
              label: 'To python...',
              icon: '',
              action: {
                handlerAction: 'redux',
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.EXPORT_HLS],
              },
            },
          ],
        },
        {
          label: 'Workspace',
          icon: '',
          list: [
            {
              label: 'Upload...',
              icon: '',
              action: {
                handlerAction: 'redux',
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.UPLOAD_FILES],
              },
            },
            {
              label: 'Download...',
              icon: '',
              action: {
                handlerAction: 'redux',
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.DOWNLOAD_FILES],
              },
            },
          ],
        },
      ],
    },
    {
      label: 'View',
      icon: '',
      position: 'bottom-start',
      style: topLevelMenuItemStyle,
      dynamicListInjector: {
        handlerAction: 'menuInjector',
        parameters: ['View'],
      },
    },

    {
      label: 'Model',
      icon: '',
      position: 'bottom-start',
      style: topLevelMenuItemStyle,
      dynamicListInjector: {
        handlerAction: 'menuInjector',
        parameters: ['Model'],
      },
    },
    {
      label: 'Examples',
      icon: '',
      position: 'bottom-start',
      style: topLevelMenuItemStyle,
      dynamicListInjector: {
        handlerAction: 'menuInjector',
        parameters: ['Tutorials'],
      },
    },
    {
      label: 'Help',
      icon: '',
      position: 'bottom-start',
      style: topLevelMenuItemStyle,
      list: [
        {
          label: 'Documentation',
          icon: '',
          action: {
            handlerAction: TOPBAR_CONSTANTS.NEW_PAGE,
            parameters: ['http://netpyne.org/'],
          },
        },
        {
          label: 'Tutorials',
          icon: '',
          list: [
            {
              label: 'Open tutorial 1',
              icon: '',
              action: {
                handlerAction: 'triggerTutorials',
                parameters: [0],
              },
            },
            {
              label: 'Open tutorial 2',
              icon: '',
              action: {
                handlerAction: 'triggerTutorials',
                parameters: [1],
              },
            },
            {
              label: 'Open tutorial 3',
              icon: '',
              action: {
                handlerAction: 'triggerTutorials',
                parameters: [2],
              },
            },
          ],
        },
      ],
    },
  ],
};

export const getViewMenu = (props) => {
  const networkAction = () => {
    if (props.automaticInstantiation && props.automaticSimulation) {
      return createAndSimulateNetwork;
    }

    if (props.automaticInstantiation) {
      return createNetwork;
    }

    return showNetwork;
  };

  return [
    {
      label: 'Edit',
      icon: props.editMode ? checkedIcon : 'fa',
      action: {
        handlerAction: 'redux',
        parameters: [editModel],
      },

    },
    {
      label: 'Explore',
      icon: !props.editMode ? checkedIcon : 'fa',
      action: {
        handlerAction: 'redux',
        parameters: [networkAction()],
      },
    },
  ];
};

export const getModelMenu = (props) => (
  [
    {
      label: TOPBAR_CONSTANTS.CREATE_NETWORK,
      className: 'topbar-menu-item',
      action: {
        handlerAction: 'redux',
        parameters: [createNetwork],
      },
    },
    {
      label: TOPBAR_CONSTANTS.SIMULATE,
      className: 'topbar-menu-item',
      action: {
        handlerAction: 'redux',
        parameters: props.experimentInDesign
          ? [openLaunchDialog()]
          // TODO: (#263) this logic causes issues by potentially simulating
          //  old instance with modified netParams and simConfig
          // : [props.modelState ? createAndSimulateNetwork : simulateNetwork],
          : [props.modelState === MODEL_STATE.NOT_INSTANTIATED ? createAndSimulateNetwork : simulateNetwork()],
      },
    },
    {
      label: TOPBAR_CONSTANTS.CREATE_AND_SIMULATE_NETWORK,
      action: {
        handlerAction: 'redux',
        parameters: props.experimentInDesign
          ? [openLaunchDialog()]
          : [createAndSimulateNetwork],
      },
    },
  ]
);

export const getNetPyNEMenu = (props) => (
  [
    {
      label: 'About',
      icon: '',
      action: {
        handlerAction: 'redux',
        parameters: [openDialog, {
          title: 'About',
          message: 'This is about tab',
        }],
      },
    },
    {
      label: 'Contribute',
      icon: '',
      action: {
        handlerAction: 'redux',
        parameters: [openDialog, {
          title: 'Contribute',
          message: 'This is Contribute tab',
        }],
      },
    },
    {
      label: 'Plot color preferences',
      icon: '',
      list: [
        {
          label: 'Dark Background (default)',
          icon: props.theme === THEMES.DARK ? checkedIcon : 'fa',
          action: {
            handlerAction: 'redux',
            parameters: [setTheme, THEMES.DARK],
          },
        }, {
          label: 'Black Background',
          icon: props.theme === THEMES.BLACK ? checkedIcon : 'fa',
          action: {
            handlerAction: 'redux',
            parameters: [setTheme, THEMES.BLACK],
          },
        }, {
          label: 'Light Background',
          icon: props.theme === THEMES.LIGHT ? checkedIcon : 'fa',
          action: {
            handlerAction: 'redux',
            parameters: [setTheme, THEMES.LIGHT],
          },
        },
      ],
    },
  ]
);
