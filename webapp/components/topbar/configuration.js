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
      icon: "",
      list: [
        {
          label: "New",
          icon: "",
          action: {
            handlerAction: "redux",
            parameters: [openTopbarDialog, TOPBAR_CONSTANTS.NEW_MODEL]
          }
        },
        {
          label: "Open...",
          icon: "",
          list: [
            {
              label: "JSON",
              action: {
                handlerAction: 'redux',
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.LOAD]
              }
            },
            {
              label: "Python",
              action: {
                handlerAction: 'redux',
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.IMPORT_HLS]
              }
            },
            {
              label: "Cell template",
              action: {
                handlerAction: 'redux',
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.IMPORT_HLS]
              }
            }
          ]
        },
        {
          label: "Save...",
          icon: "",
          list: [
            {
              label: "JSON",
              action: {
                handlerAction: 'redux',
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.SAVE]
              }
            },
            {
              label: "Python",
              action: {
                handlerAction: 'redux',
                parameters: [openTopbarDialog, TOPBAR_CONSTANTS.EXPORT_HLS]
              },
            },
          ]
        },
        {
          label: "Upload...",
          icon: "",
          action: {
            handlerAction: 'redux',
            parameters: [openTopbarDialog, TOPBAR_CONSTANTS.UPLOAD_FILES]
          }
        },

        {
          label: "Download...",
          icon: "",
          action: {
            handlerAction: 'redux',
            parameters: [openTopbarDialog, TOPBAR_CONSTANTS.DOWNLOAD_FILES]
          }
            
        },
      ]
    },
    {
      label: "Simulation",
      position: "bottom-start",
      icon: "",
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
    }
  ]
}