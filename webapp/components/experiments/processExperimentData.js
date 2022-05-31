import Utils from '../../Utils';

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



function flatten(obj, path = '') {
  if (!(obj instanceof Object)) {
    // eslint-disable-next-line no-new-object
    const newObj = new Object();
    newObj[path.replace(/\.$/g, '')] = obj;
    return newObj;
  }

  return Object.keys(obj).reduce(
    (output, key) => (obj instanceof Array
      ? Object.assign(output, flatten(obj[key], `${path}[${key}].`))
      : Object.assign(output, flatten(obj[key], `${path + key}.`))),
    {},
  );
}




export function getFlattenedParamKeys(params) {

  const flattened = flatten(params);
  const paramKeys = Object.keys(flattened);
  const filteredKeys = paramKeys.filter((key) => {
    // TODO: avoid to fetch field twice!
    const field = Utils.getMetadataField(`${key}`);
    if (field && SUPPORTED_TYPES.includes(field.type)) {
      return true;
    }
    return false;
  });
  return filteredKeys
}

