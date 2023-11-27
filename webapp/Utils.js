import * as Sentry from '@sentry/react';

import {
  execPythonMessage,
  evalPythonMessage,
} from './components/general/GeppettoJupyterUtils';

const Utils = {

  getAvailableKey (model, prefix) {
    if (model === undefined) {
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

  captureSentryException (e) {
    if (process.env.NODE_ENV == 'production')
      Sentry.captureException(e);
    console.error(e);
  },

  /**
   * Retrieves the metadata object for the passed `key`.
   *
   * A specific attributes can be selected by passing `field`.
   *
   * The algorithm will iteratively test the key for each nesting in metadata.
   *
   * Example key: `netParams.popParams.E.numCells`.
   * Since 'E' is not explicitly modeled in `netpyne.metadata`
   * this algorithm implements additional logic to skip certain levels.
   *
   * @param {*} key key of metadata path.
   * @param {*} field specific object attribute.
   * @returns metadata object or specific attribute.
   */
  getMetadataField (key, field = null) {
    if (key === undefined) {
      return null;
    }

    let currentObject;
    let nextObject = window.metadata;
    let skipped = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const item of key.split('.')) {
      if (currentObject != null && currentObject?.container === true && !(item in nextObject)) {
        if (skipped) {
          return null;
        }

        // skip the list element, e.g. "E"!
        // console.debug(`Skip ${item} at ${nextObject.label}`);
        skipped = true;
      } else {
        skipped = false;

        if (item in nextObject) {
          currentObject = nextObject[item];
          if ('children' in currentObject) {
            nextObject = currentObject.children;
          }
        } else {
          currentObject = null;
        }
      }
    }

    if (currentObject) {
      return field ? currentObject[field] : currentObject;
    }

    return null;
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
    oldValue = oldValue.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    newValue = newValue.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
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
      if (Object.prototype.hasOwnProperty.call(parsedData, 'additional_info')) {
        error.additionalInfo = parsedData.additional_info ;
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
    return date?.toLocaleString();
  },

  execPythonMessage,
  evalPythonMessage,

  flatten (obj, path = '') {
    if (!(obj instanceof Object)) return { [path.replace(/\.$/g, '')]: obj };

    return Object.keys(obj)
      .reduce((output, key) => (obj instanceof Array
        ? { ...output, ...Utils.flatten(obj[key], `${path.slice(0, -1)}[${key}].`) }
        : { ...output, ...Utils.flatten(obj[key], `${path + key}.`) }), {});
  },
};

export default Utils;
