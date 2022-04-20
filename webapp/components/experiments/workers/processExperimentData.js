const workerCode = () => {
  // eslint-disable-next-line no-undef
  self.onmessage = function (event) {
    // The object that the web page sent is stored in the event.data property.
    const Utils = {
      getMetadataField (key, field = null) {
        if (key === undefined) {
          return null;
        }

        let currentObject;
        let nextObject = event.data.params.metadata;
        let skipped = false;

        // eslint-disable-next-line no-restricted-syntax
        key.split('.').forEach((item) => {
          if (
            currentObject != null
            && currentObject?.container === true
            && !(item in nextObject)
          ) {
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
        });

        if (currentObject) {
          return field ? currentObject[field] : currentObject;
        }

        return null;
      },

      flatten (obj, path = '') {
        if (!(obj instanceof Object)) {
          // eslint-disable-next-line no-new-object
          const newObj = new Object();
          newObj[path.replace(/\.$/g, '')] = obj;
          return newObj;
        }

        return Object.keys(obj).reduce(
          (output, key) => (obj instanceof Array
            ? Object.assign(output, Utils.flatten(obj[key], `${path}[${key}].`))
            : Object.assign(output, Utils.flatten(obj[key], `${path + key}.`))),
          {},
        );
      },
    };

    const REAL_TYPE = {
      INT: 'int',
      FLOAT: 'float',
      BOOL: 'bool',
      STR: 'str',
      FUNC: 'func',
      DICT: 'dict',
      DICT_DICT: 'dict(dict)',
    };
    const SUPPORTED_TYPES = [
      REAL_TYPE.INT,
      REAL_TYPE.FLOAT,
      REAL_TYPE.STR,
      REAL_TYPE.BOOL,
    ];
    const { data } = event.data.params;
    const flattened = Utils.flatten(data);
    const paramKeys = Object.keys(flattened);
    const filteredKeys = paramKeys.filter((key) => {
      // TODO: avoid to fetch field twice!
      const field = Utils.getMetadataField(`netParams.${key}`);
      if (field && SUPPORTED_TYPES.includes(field.type)) {
        return true;
      }
      return false;
    });

    // eslint-disable-next-line no-undef
    postMessage({ resultMessage: 'OK', params: { results: filteredKeys } });
  };
};

let code = workerCode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

const blob = new Blob([code], { type: 'application/javascript' });
const workerScript = window.URL.createObjectURL(blob);

export default workerScript;
