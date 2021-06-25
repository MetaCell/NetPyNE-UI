import {
  execPythonMessage,
  evalPythonMessage,
} from '@geppettoengine/geppetto-client/js/communication/geppettoJupyter/GeppettoJupyterUtils';

const Utils = {

  getAvailableKey (model, prefix) {
    if (model == undefined) {
      return prefix;
    }
    // Get New Available ID
    let id = prefix;
    if (model[id + 0] == undefined) {
      return id + 0;
    }
    let i = 0;
    id = prefix + i++;
    while (model[id] != undefined) {
      id = prefix + i++;
    }
    return id;
  },

  getMetadataField (key, field) {
    if (key === undefined) {
      return;
    }
    let currentObject;
    let nextObject = window.metadata;
    key.split('.')
      .forEach((item) => {
        if (item in nextObject) {
          currentObject = nextObject[item];
          if ('children' in currentObject) {
            nextObject = currentObject.children;
          }
        } else {
          currentObject = undefined;
        }
      });
    return (currentObject == undefined) ? currentObject : currentObject[field];
  },

  getHTMLType (key) {
    const type = this.getMetadataField(key, 'type');

    switch (type) {
      case 'int':
        var htmlType = 'number';
        break;
      default:
        var htmlType = 'text';
        break;
    }
    return htmlType;
  },

  isObject (item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  },

  mergeDeep (target, source) {
    const output = { ...target };
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source)
        .forEach((key) => {
          if (this.isObject(source[key])) {
            if (!(key in target)) {
              Object.assign(output, { [key]: source[key] });
            } else {
              output[key] = this.mergeDeep(target[key], source[key]);
            }
          } else {
            Object.assign(output, { [key]: source[key] });
          }
        });
    }
    return output;
  },

  getFieldsFromMetadataTree (tree, callback) {
    function iterate (object, path) {
      if (Array.isArray(object)) {
        object.forEach((a, i) => {
          iterate(a, path.concat(i));
        });
        return;
      }
      if (object !== null && typeof object === 'object') {
        Object.keys(object)
          .forEach((k) => {
            // Don't add the leaf to path
            iterate(object[k], (typeof object[k] === 'object') ? path.concat(k) : path);
          });
        return;
      }

      // Push to array of field id. Remove children and create id string
      modelFieldsIds.push(path.filter((path) => path != 'children')
        .join('.'));
    }

    // Iterate the array extracting the fields Ids
    var modelFieldsIds = [];
    iterate(tree, []);

    // Generate model fields based on ids
    const modelFields = [];
    modelFieldsIds.filter((v, i, a) => a.indexOf(v) === i)
      .map((id) => modelFields.push(callback(id, 0)));
    return modelFields;
  },

  renameKey (path, oldValue, newValue, callback) {
    this.execPythonMessage(`netpyne_geppetto.rename("${path}","${oldValue}","${newValue}")`)
      .then((response) => {
        callback(response, newValue);
      });
  },

  nameValidation (name) {
    // Remove spaces
    if ((/\s/.test(name))) {
      name = name.replace(/\s+/g, '')
        .replace(/^\d+/g, '');
    } else if ((/^[0-9]/.test(name))) { // Remove number at the beginning
      name = name.replace(/\s+/g, '')
        .replace(/^\d+/g, '');
    }
    return name;
  },

  // FIXME: Hack to remove escaped chars (\\ -> \ and \' -> ') manually
  convertToJSON (data) {
    if (typeof data === 'string' || data instanceof String) {
      return JSON.parse(data.replace(/\\\\/g, '\\')
        .replace(/\\'/g, '\''));
    }
    return data;
  },

  getPlainStackTrace (stackTrace) {
    return stackTrace.replace(/\u001b\[.*?m/g, '');
  },

  getErrorResponse (data) {
    const parsedData = this.convertToJSON(data);
    if (parsedData && parsedData.type && parsedData.type === 'ERROR') {
      const error = { details: parsedData.details };
      if (Object.prototype.hasOwnProperty.call(parsedData, 'message')) {
        error.message = parsedData.message;
      } else if (Object.prototype.hasOwnProperty.call(parsedData, 'websocket')) {
        error.message = parsedData.websocket;
      }
      return error;
    }
    return null;
  },

  handleUpdate (updateCondition, newValue, originalValue, context, componentName) {
    if ((updateCondition) && (newValue !== originalValue)) {
      /*
       * if the new value has been changed by the function Utils.nameValidation means that the name convention
       * has not been respected, so we need to open the dialog and inform the user.
       */
      context.setState({
        currentName: newValue,
        errorMessage: 'Error',
        errorDetails: `Leading digits or whitespaces are not allowed in ${componentName} names.`,
      });
      return true;
    } if ((updateCondition) && (newValue === originalValue)) {
      context.setState({ currentName: newValue });
      return true;
    } if (!(updateCondition) && (newValue === originalValue)) {
      context.setState({
        currentName: newValue,
        errorMessage: 'Error',
        errorDetails: `Name collision detected, the name ${newValue
        } is already used in this model, please pick another name.`,
      });
      return false;
    } if (!(updateCondition) && (newValue !== originalValue)) {
      context.setState({
        currentName: newValue,
        errorMessage: 'Error',
        errorDetails: `Leading digits or whitespaces are not allowed in ${componentName} names.`,
      });
      return false;
    }
  },

  formatDate (timestamp) {
    const date = new Date(timestamp);
    return date?.toLocaleDateString();
  },

  execPythonMessage,
  evalPythonMessage,
};

export default Utils;
