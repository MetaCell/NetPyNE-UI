import Utils from '../../Utils';
import { getPythonTypeString } from './utils';

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
  REAL_TYPE.FUNC
];






/**
 * 
 * @param {*} params Netpyne parameters 
 * @returns map of flatten parameter name to the field spec from Netpyne metadata or inferred from the value
 */
export function getFlattenedParams(params) {

  const flattened = Utils.flatten(params);
  function getFieldSpec(fieldKey) {
    const metadataField = Utils.getMetadataField(fieldKey);
    if(metadataField) {
      return metadataField;
    }
    return {
      type: getPythonTypeString(flattened[fieldKey]),
      label: fieldKey.split(".").pop()
    }
  }

  const res = {};

  for(const key in flattened) {
    const field = getFieldSpec(key);
    if(field && SUPPORTED_TYPES.includes(field.type)) {
      res[key] = field
    }
  }
 
  return res;
}

