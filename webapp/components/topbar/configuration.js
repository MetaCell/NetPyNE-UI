import { bgLight, bgRegular, font, bgDark } from '../../Theme'
import { openTopbarDialog, changePageTransitionMode } from '../../redux/actions/topbar'
import { TOPBAR_CONSTANTS } from '../../constants'
const style = {
  standard: {
    background: bgDark,
    backgroundColor: bgDark,
    borderRadius: 0,
    border: 0,
    boxShadow: '0px 0px',
    color: '#ffffff',
    fontSize: '16px',
    fontFamily: font,
    margin: '0px 0px 0px 0px',
    minWidth: '44px',
    height: '30px',
    textTransform: 'capitalize',
    textAlign: 'left',
    justifyContent: 'start',
    fontWeight: '300',
  },
  lighter: {
    background: bgRegular,
    backgroundColor: bgRegular,
  },
  padding: {
    fontSize: '14px',
    paddingTop: '8px',
    paddingBottom: '8px'
  }
  
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
    backgroundColor: bgDark,
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
    }
  },
  buttons: [
    {
      label: "NetPyNE-UI",
      position: "bottom-start",
      list: [
        {
          label: "About...",
          action: {
            handlerAction: "",
            parameters: []
          }
        },
        {
          label: "Contribute",
          action: {
            handlerAction: "",
            parameters: []
          }
        },
      ]
    },
    {
      label: "File",
      position: "bottom-start",
      icon: "",
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
          label: "Open",
          icon: "",
          action: {
            handlerAction: 'redux',
            parameters: [openTopbarDialog, TOPBAR_CONSTANTS.LOAD]
          }
        },
        {
          label: "Save",
          icon: "",
          action: {
            handlerAction: 'redux',
            parameters: [openTopbarDialog, TOPBAR_CONSTANTS.SAVE]
          }
        },
        {
          label: "Import...",
          icon: "",
          list: [
            {
              label: "From python...",
              icon: "",
              action: {
                handlerAction: "redux",
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.IMPORT_HLS]
              }
            },
            {
              label: "From cell template...",
              icon: "",
              action: {
                handlerAction: "redux",
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.IMPORT_CELL_TEMPLATE]
              }
            }
          ]
        },
        {
          label: "Export...",
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
          label: "Resources...",
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
      label: "Model",
      icon: "",
      position: "bottom-start",
      list: [
        {
          label: TOPBAR_CONSTANTS.CREATE_NETWORK,
          icon: "",
          action: {
            handlerAction: "redux",
            parameters: [changePageTransitionMode, TOPBAR_CONSTANTS.CREATE_NETWORK]
          }
        },
        {
          label: TOPBAR_CONSTANTS.CREATE_AND_SIMULATE_NETWORK,
          icon: "",
          action: {
            handlerAction: "redux",
            parameters: [changePageTransitionMode, TOPBAR_CONSTANTS.CREATE_AND_SIMULATE_NETWORK]
          }
        },
        {
          label: TOPBAR_CONSTANTS.EXPLORE_EXISTING_NETWORK,
          icon: "",
          action: {
            handlerAction: "redux",
            parameters: [changePageTransitionMode, TOPBAR_CONSTANTS.EXPLORE_EXISTING_NETWORK]
          }
        },
      ]
    },
    {
      label: "Help",
      icon: "",
      action: {
        handlerAction: '',
        parameters: []
      }
    },
  ]
}